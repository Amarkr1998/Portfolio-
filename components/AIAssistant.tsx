"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowUp, Check, Copy, RotateCcw, Sparkles, Square, Trash2, X } from "lucide-react";
import { useUIState } from "@/components/providers/UIStateProvider";
import { socials, suggestedQuestions } from "@/data/portfolio";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import MarkdownLite from "@/components/ui/MarkdownLite";
import { EmailLink } from "@/components/ui/ContactActions";
import { MAX_HISTORY, MAX_MESSAGE_LENGTH, MAX_ASSISTANT_MESSAGE_LENGTH, STREAM_SIGNAL } from "@/lib/ai-constants";

type Role = "user" | "assistant";
type Message = { id: string; role: Role; content: string; error?: boolean; note?: string };
type Availability = "unknown" | "available" | "unconfigured";

// Client-side safety nets on top of the server's own deadlines: no visible
// text within FIRST_TEXT_TIMEOUT_MS, or no completion within TOTAL_TIMEOUT_MS,
// ends the request with a clear error and Retry — never an endless spinner.
const FIRST_TEXT_TIMEOUT_MS = 40_000;
const TOTAL_TIMEOUT_MS = 65_000;


const SIGNAL_TEXT: Record<string, string> = {
  "E:timeout": "The assistant took too long to answer. Please try again.",
  "E:empty": "No answer came back that time. Please try again.",
  "E:filtered": "That question couldn’t be answered. Try rephrasing it.",
  "N:length": "Answer shortened — ask a narrower question for more detail.",
  "N:timeout": "Answer stopped early.",
};

function uid() {
  return Math.random().toString(36).slice(2);
}

// The server enforces the same per-role caps; clamping here means one long
// reply can't get the conversation stuck.
function clampForServer(role: Role, content: string): string {
  const limit = role === "user" ? MAX_MESSAGE_LENGTH : MAX_ASSISTANT_MESSAGE_LENGTH;
  return content.length > limit ? content.slice(0, limit) : content;
}

function splitSignal(text: string): { content: string; signal: string | null } {
  const i = text.indexOf(STREAM_SIGNAL);
  return i === -1 ? { content: text, signal: null } : { content: text.slice(0, i), signal: text.slice(i + 1).trim() };
}

export default function AIAssistant() {
  const { aiChatOpen, setAiChatOpen } = useUIState();
  const reducedMotion = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [hint, setHint] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Availability>("unknown");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  // The exact payload last sent, kept outside state so Retry resends it
  // verbatim instead of rebuilding it from a stale closure.
  const lastPayloadRef = useRef<{ role: Role; content: string }[]>([]);

  useFocusTrap(panelRef, aiChatOpen);

  // Check availability once, the first time the panel opens.
  useEffect(() => {
    if (!aiChatOpen || availability !== "unknown") return;
    const controller = new AbortController();
    fetch("/api/ai/chat", { signal: controller.signal, cache: "no-store" })
      .then((r) => r.json())
      .then((d: { configured?: boolean }) => setAvailability(d.configured ? "available" : "unconfigured"))
      // A failed check shouldn't block trying; the POST reports real errors.
      .catch((err) => err?.name !== "AbortError" && setAvailability("available"));
    return () => controller.abort();
  }, [aiChatOpen, availability]);

  useEffect(() => {
    if (!aiChatOpen) return;
    requestAnimationFrame(() => inputRef.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAiChatOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aiChatOpen, setAiChatOpen]);

  // Abort only on unmount. Closing the panel keeps an answer streaming, so it's
  // there when the panel reopens.
  useEffect(() => () => abortRef.current?.abort(), []);

  // Elapsed-seconds counter while waiting.
  useEffect(() => {
    if (!loading) return;
    const start = Date.now();
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 500);
    return () => {
      clearInterval(t);
      setElapsed(0);
    };
  }, [loading]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reducedMotion ? "auto" : "smooth" });
  }, [messages, loading, reducedMotion]);

  // Auto-size the composer up to its max height.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 144)}px`;
  }, [input]);

  useEffect(() => {
    if (!hint) return;
    const t = setTimeout(() => setHint(""), 3500);
    return () => clearTimeout(t);
  }, [hint]);

  const update = (id: string, patch: Partial<Message>) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  async function runRequest(payload: { role: Role; content: string }[], assistantId: string) {
    lastPayloadRef.current = payload;
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;
    let reason: "first" | "total" | null = null;
    const firstTimer = setTimeout(() => {
      reason = "first";
      controller.abort();
    }, FIRST_TEXT_TIMEOUT_MS);
    const totalTimer = setTimeout(() => {
      reason = "total";
      controller.abort();
    }, TOTAL_TIMEOUT_MS);
    let raw = "";

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
        signal: controller.signal,
        cache: "no-store",
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 503) setAvailability("unconfigured");
        throw new Error(data.error || "The assistant is temporarily unavailable. Please try again.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        raw += decoder.decode(value, { stream: true });
        const { content } = splitSignal(raw);
        if (content.trim()) clearTimeout(firstTimer);
        update(assistantId, { content });
      }

      const { content, signal } = splitSignal(raw);
      if (signal?.startsWith("E:") || !content.trim()) {
        update(assistantId, { content: SIGNAL_TEXT[signal ?? "E:empty"] ?? SIGNAL_TEXT["E:empty"], error: true });
      } else if (signal) {
        update(assistantId, { content, note: SIGNAL_TEXT[signal] });
      }
    } catch (err) {
      const { content } = splitSignal(raw);
      if ((err as Error).name === "AbortError") {
        if (reason) {
          update(assistantId, content.trim()
            ? { content, note: "Answer stopped early — it took too long." }
            : { content: "The assistant took too long to answer. Please try again.", error: true });
        } else {
          update(assistantId, content.trim() ? { content, note: "Stopped." } : { content: "Stopped.", error: true });
        }
        return;
      }
      const message =
        err instanceof TypeError
          ? "Couldn’t reach the assistant. Check your connection and try again."
          : err instanceof Error
            ? err.message
            : "Something went wrong.";
      update(assistantId, { content: message, error: true });
    } finally {
      clearTimeout(firstTimer);
      clearTimeout(totalTimer);
      if (abortRef.current === controller) abortRef.current = null;
      setLoading(false);
    }
  }

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (loading) {
      // Never drop input silently: keep it in the box and say why.
      setHint("Still answering — wait a moment or press Stop.");
      return;
    }

    const userMsg: Message = { id: uid(), role: "user", content: trimmed.slice(0, MAX_MESSAGE_LENGTH) };
    // Only successful turns are sent as history, capped to the server's limit.
    const history = [...messages.filter((m) => !m.error), userMsg].slice(-MAX_HISTORY);
    const assistantId = uid();

    setMessages((prev) => [...prev, userMsg, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setHint("");
    void runRequest(history.map(({ role, content }) => ({ role, content: clampForServer(role, content) })), assistantId);
  }

  function retryLast() {
    if (loading || lastPayloadRef.current.length === 0) return;
    const assistantId = uid();
    setMessages((prev) => [...prev.filter((m) => !(m.role === "assistant" && m.error)), { id: assistantId, role: "assistant", content: "" }]);
    void runRequest(lastPayloadRef.current, assistantId);
  }

  function clearChat() {
    abortRef.current?.abort();
    setMessages([]);
    lastPayloadRef.current = [];
    inputRef.current?.focus();
  }

  function copy(msg: Message) {
    navigator.clipboard.writeText(msg.content).then(() => {
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }

  function onPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const pasted = e.clipboardData.getData("text");
    const el = e.currentTarget;
    const nextLength = input.length - (el.selectionEnd - el.selectionStart) + pasted.length;
    if (nextLength > MAX_MESSAGE_LENGTH) {
      setHint(`Trimmed to ${MAX_MESSAGE_LENGTH.toLocaleString()} characters — the first part will be sent.`);
    }
  }

  const unconfigured = availability === "unconfigured";
  const nearLimit = input.length > MAX_MESSAGE_LENGTH * 0.8;
  const t = reducedMotion ? { duration: 0 } : { duration: 0.24, ease: [0.16, 1, 0.3, 1] as const };
  const status = unconfigured
    ? { label: "Not configured", tone: "var(--fg-3)" }
    : loading
      ? { label: "Answering…", tone: "var(--accent)" }
      : { label: "Online · grounded in this portfolio", tone: "var(--teal)" };

  return (
    <>
      {/* Launcher: brand-gradient ring around an icon chip; icon-only on phones. */}
      <button
        type="button"
        onClick={() => setAiChatOpen(!aiChatOpen)}
        className="no-print group fixed bottom-4 right-4 z-[90] rounded-full p-px shadow-[var(--shadow-md)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 sm:bottom-6 sm:right-6"
        style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
        aria-haspopup="dialog"
        aria-expanded={aiChatOpen}
        aria-controls="ask-amar-panel"
      >
        <span className="flex h-11 w-11 items-center justify-center gap-2 rounded-full bg-surface text-sm font-medium text-fg sm:w-auto sm:pl-3.5 sm:pr-4">
          <Sparkles size={16} className="text-accent-2 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">{aiChatOpen ? "Close assistant" : "Ask Amar AI"}</span>
        </span>
      </button>

      <AnimatePresence>
        {aiChatOpen && (
          <motion.div
            id="ask-amar-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ask-amar-title"
            aria-describedby="ask-amar-desc"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 16, scale: reducedMotion ? 1 : 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : 12, scale: reducedMotion ? 1 : 0.985 }}
            transition={t}
            className="fixed inset-x-0 bottom-0 z-[95] flex h-[min(44rem,calc(100dvh-4rem))] origin-bottom-right flex-col overflow-hidden rounded-t-[var(--radius-lg)] border border-line-strong bg-surface shadow-[var(--shadow-lg)] sm:inset-x-auto sm:bottom-20 sm:right-6 sm:h-[min(40rem,calc(100dvh-7rem))] sm:w-[27rem] sm:rounded-[var(--radius-lg)]"
          >
            <div aria-hidden="true" className="h-0.5 bg-[linear-gradient(90deg,var(--accent),var(--accent-2))]" />

            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="relative shrink-0">
                  <Image src="/logo.png" alt="" width={38} height={38} className="rounded-full" />
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface"
                    style={{ background: status.tone }}
                  />
                </span>
                <div className="min-w-0">
                  <h2 id="ask-amar-title" className="flex items-center gap-1.5 font-display text-base font-semibold leading-tight">
                    Ask Amar AI
                    <Sparkles size={13} className="text-accent-2" aria-hidden="true" />
                  </h2>
                  <p className="truncate text-xs text-fg-2" aria-live="polite">
                    {status.label}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center">
                {messages.length > 0 && (
                  <button type="button" onClick={clearChat} className="icon-btn h-9 w-9" aria-label="Clear conversation" title="Clear conversation">
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                )}
                <button type="button" onClick={() => setAiChatOpen(false)} className="icon-btn h-9 w-9" aria-label="Close Ask Amar AI">
                  <X size={17} aria-hidden="true" />
                </button>
              </div>
            </div>
            <p id="ask-amar-desc" className="sr-only">
              Answers are AI-generated from this portfolio&rsquo;s content and can be imperfect.
            </p>

            {/* Conversation */}
            <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
              aria-busy={loading}
              className="flex flex-1 flex-col gap-4 overflow-y-auto overscroll-contain bg-bg-alt/40 px-4 py-5"
            >
              {unconfigured ? (
                <div className="rounded-[var(--radius-md)] border border-line bg-surface p-4 text-sm text-fg-2">
                  <p className="font-medium text-fg">The assistant isn&rsquo;t configured on this deployment.</p>
                  <p className="mt-1.5">Everything it would answer from is on this page — or ask Amar directly.</p>
                  <EmailLink className="link-u link-u-static mt-3 inline-block font-medium">{socials.emailAddress}</EmailLink>
                </div>
              ) : messages.length === 0 ? (
                <div>
                  <div className="rounded-[var(--radius-md)] border border-line bg-surface p-4">
                    <p className="font-display text-[0.95rem] font-semibold text-fg">Hi — ask me about Amar&rsquo;s work.</p>
                    <p className="mt-1 text-sm text-fg-2">
                      Experience, projects, skills, or paste a job description to compare. Answers come only from this
                      portfolio; if something isn&rsquo;t here, I&rsquo;ll say so.
                    </p>
                  </div>
                  <p className="annot mt-5">Try asking</p>
                  <ul className="mt-2.5 grid gap-2">
                    {suggestedQuestions.map((q) => (
                      <li key={q}>
                        <button
                          type="button"
                          onClick={() => send(q)}
                          className="group flex w-full items-center gap-3 rounded-[var(--radius-md)] border border-line bg-surface px-3.5 py-2.5 text-left text-sm text-fg-2 transition-[border-color,color,transform] duration-200 hover:-translate-y-px hover:border-[var(--line-accent)] hover:text-fg"
                        >
                          <span aria-hidden="true" className="chip-dot" />
                          <span className="flex-1">{q}</span>
                          <ArrowUp size={14} aria-hidden="true" className="rotate-45 text-fg-3 transition-colors group-hover:text-accent" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {messages.map((m) => {
                const thinking = m.role === "assistant" && !m.content && !m.error;
                return (
                  <div key={m.id} className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    {m.role === "assistant" && (
                      <Image src="/logo.png" alt="" width={26} height={26} className="mt-0.5 h-[26px] w-[26px] shrink-0 rounded-full" />
                    )}
                    <div
                      className={`relative max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "rounded-br-md bg-accent text-on-accent"
                          : m.error
                            ? "rounded-tl-md border border-[color-mix(in_srgb,var(--danger)_45%,transparent)] bg-[color-mix(in_srgb,var(--danger)_8%,var(--surface))] text-fg"
                            : "rounded-tl-md border border-line bg-surface text-fg"
                      }`}
                    >
                      <span className="sr-only">{m.role === "user" ? "You: " : "Assistant: "}</span>
                      {thinking ? (
                        <span className="flex items-center gap-2 py-0.5 text-fg-2">
                          <span className="inline-flex gap-1" aria-hidden="true">
                            {["var(--accent)", "var(--accent-2)", "var(--teal)"].map((c, i) => (
                              <span key={c} className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ background: c, animationDelay: `${i * 140}ms` }} />
                            ))}
                          </span>
                          <span className="text-xs">{elapsed >= 2 ? `Thinking… ${elapsed}s` : "Thinking…"}</span>
                        </span>
                      ) : m.error ? (
                        <span className="flex gap-2">
                          <AlertCircle size={15} className="mt-0.5 shrink-0 text-[var(--danger)]" aria-hidden="true" />
                          <span>{m.content}</span>
                        </span>
                      ) : m.role === "assistant" ? (
                        <MarkdownLite text={m.content} />
                      ) : (
                        <span className="whitespace-pre-wrap break-words">{m.content}</span>
                      )}

                      {m.note && <p className="mt-2 border-t border-line pt-1.5 text-xs text-fg-2">{m.note}</p>}

                      {m.role === "assistant" && m.content && !m.error && !(loading && m === messages[messages.length - 1]) && (
                        <button
                          type="button"
                          onClick={() => copy(m)}
                          className="mt-2 inline-flex items-center gap-1 text-xs text-fg-2 transition-colors hover:text-fg"
                          aria-label="Copy answer"
                        >
                          {copiedId === m.id ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
                          {copiedId === m.id ? "Copied" : "Copy"}
                        </button>
                      )}
                      {m.error && !unconfigured && (
                        <button
                          type="button"
                          onClick={retryLast}
                          disabled={loading}
                          className="mt-2.5 inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 text-xs font-medium text-fg transition-colors hover:border-[var(--danger)] disabled:opacity-50"
                        >
                          <RotateCcw size={12} aria-hidden="true" /> Retry
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-line bg-surface p-3"
            >
              <div className="flex items-end gap-2 rounded-xl border border-line bg-bg-alt p-1.5 pl-3 transition-colors focus-within:border-[var(--line-accent)]">
                <label htmlFor="ask-amar-input" className="sr-only">
                  Your question
                </label>
                <textarea
                  id="ask-amar-input"
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onPaste={onPaste}
                  onKeyDown={(e) => {
                    // keyCode 229 = IME / virtual keyboard composition; don't send mid-compose.
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder={unconfigured ? "Assistant unavailable" : "Ask about Amar’s work, or paste a job description…"}
                  className="max-h-36 min-h-9 flex-1 resize-none bg-transparent py-2 text-base leading-snug text-fg outline-none placeholder:text-fg-3 sm:text-sm"
                  maxLength={MAX_MESSAGE_LENGTH}
                  disabled={unconfigured}
                  enterKeyHint="send"
                  aria-describedby="ask-amar-help"
                />
                {loading ? (
                  <button
                    type="button"
                    onClick={() => abortRef.current?.abort()}
                    className="btn btn-secondary btn-sm h-9 w-9 shrink-0 !rounded-lg !px-0"
                    aria-label="Stop answer"
                    title="Stop"
                  >
                    <Square size={12} fill="currentColor" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim() || unconfigured}
                    className="btn btn-primary btn-sm h-9 w-9 shrink-0 !rounded-lg !px-0"
                    aria-label="Send question"
                    title="Send"
                  >
                    <ArrowUp size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
              <p id="ask-amar-help" className="mt-1.5 flex min-h-4 justify-between gap-3 px-1 text-[0.6875rem] text-fg-2">
                <span role="status" aria-live="polite" className={hint ? "text-accent" : ""}>
                  {hint || "AI-generated from this portfolio · may be imperfect"}
                </span>
                <span className={nearLimit ? "text-accent" : ""}>
                  {input.length > 0 ? `${input.length.toLocaleString()}/${MAX_MESSAGE_LENGTH.toLocaleString()}` : "Enter ↵ to send"}
                </span>
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
