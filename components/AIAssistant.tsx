"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X, Copy, RotateCcw, Trash2, Check, Sparkles } from "lucide-react";
import { useUIState } from "@/components/providers/UIStateProvider";
import { suggestedQuestions } from "@/data/portfolio";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import MarkdownLite from "@/components/ui/MarkdownLite";
import { MAX_HISTORY, MAX_MESSAGE_LENGTH, MAX_ASSISTANT_MESSAGE_LENGTH } from "@/lib/ai-constants";

type Role = "user" | "assistant";
type Message = { id: string; role: Role; content: string; error?: boolean };

function uid() {
  return Math.random().toString(36).slice(2);
}

// Defense in depth: the server enforces these same per-role caps and is the
// real guard, but clamping here too means a single unusually long reply can
// never get the whole conversation stuck rejecting every later message.
function clampForServer(role: Role, content: string): string {
  const limit = role === "user" ? MAX_MESSAGE_LENGTH : MAX_ASSISTANT_MESSAGE_LENGTH;
  return content.length > limit ? content.slice(0, limit) : content;
}

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Ask me about Amar's experience, projects or technical skills — I only answer from his verified portfolio.",
};

export default function AIAssistant() {
  const { aiChatOpen, setAiChatOpen } = useUIState();
  const isTouch = useIsTouchDevice();
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useFocusTrap(panelRef, aiChatOpen);

  useEffect(() => {
    if (aiChatOpen) requestAnimationFrame(() => inputRef.current?.focus());
  }, [aiChatOpen]);

  useEffect(() => {
    if (!aiChatOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAiChatOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aiChatOpen, setAiChatOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // The exact payload last sent to the server, kept outside React state so
  // a retry can resend it verbatim — reconstructing it from `messages`
  // instead (as the previous version did) reads a stale closure, since
  // `send()` called synchronously after a `setMessages` filter still sees
  // the pre-filter array. That mismatch was compounding on every retry:
  // each attempt re-appended a duplicate user turn, so the history grew
  // past the server's cap and every subsequent retry failed the same way.
  const lastPayloadRef = useRef<{ role: Role; content: string }[]>([]);

  async function runRequest(payload: { role: Role; content: string }[], assistantId: string) {
    lastPayloadRef.current = payload;
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "The AI assistant is temporarily unavailable.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m))
        );
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: message, error: true } : m))
      );
    } finally {
      setLoading(false);
    }
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: uid(), role: "user", content: trimmed };
    // Cap at MAX_HISTORY (matching the server's limit) so a long-running
    // conversation never gets rejected for exceeding it — older turns age
    // out first.
    const history = [...messages.filter((m) => m.id !== "welcome"), userMsg].slice(-MAX_HISTORY);
    const assistantId = uid();

    setMessages((prev) => [...prev, userMsg, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");

    await runRequest(
      history.map(({ role, content }) => ({ role, content: clampForServer(role, content) })),
      assistantId
    );
  }

  function retryLast() {
    if (loading || lastPayloadRef.current.length === 0) return;
    const assistantId = uid();
    setMessages((prev) => [
      ...prev.filter((m) => !(m.role === "assistant" && m.error)),
      { id: assistantId, role: "assistant", content: "" },
    ]);
    runRequest(lastPayloadRef.current, assistantId);
  }

  function clearChat() {
    setMessages([WELCOME]);
    lastPayloadRef.current = [];
  }

  function copy(msg: Message) {
    navigator.clipboard.writeText(msg.content).then(() => {
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }

  return (
    <>
      <motion.button
        onClick={() => setAiChatOpen(!aiChatOpen)}
        whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-[90] flex items-center gap-3 pl-4 pr-5 py-3 rounded-full glass-strong glow-accent text-foreground"
        aria-haspopup="dialog"
        aria-expanded={aiChatOpen}
        aria-label="Open Ask Amar AI"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/15">
          <Sparkles size={15} className="text-accent" />
        </span>
        <span className="text-left leading-tight">
          <span className="block text-sm font-medium">Ask Amar</span>
          <span className="block text-[0.68rem] text-muted-2">AI Assistant</span>
        </span>
        <span className="relative flex h-2 w-2 ml-1">
          <span className="status-dot absolute inline-flex h-full w-full rounded-full bg-success" />
        </span>
      </motion.button>

      <AnimatePresence>
        {aiChatOpen && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Ask Amar AI chat"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={
              // Driven by real touch-capability, not the sm: CSS breakpoint —
              // some phones report a wide enough CSS viewport to pass that
              // breakpoint, which used to shrink the panel into a small
              // floating card instead of a full-width bottom sheet.
              isTouch
                ? "fixed z-[95] inset-x-0 bottom-0 w-full h-[85vh] max-h-[85vh] glass-strong rounded-t-2xl flex flex-col overflow-hidden"
                : "fixed z-[95] bottom-24 right-6 w-[420px] h-[600px] max-h-[85vh] glass-strong rounded-2xl flex flex-col overflow-hidden"
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") setAiChatOpen(false);
            }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 border border-accent/25">
                  <Bot size={15} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Ask Amar AI</p>
                  <p className="text-[0.68rem] text-muted-2">Verified portfolio data only</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="p-2 rounded-md text-muted hover:text-foreground hover:bg-[var(--fill-subtle-strong)] transition-colors duration-200"
                  aria-label="Clear conversation"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  onClick={() => setAiChatOpen(false)}
                  className="p-2 rounded-md text-muted hover:text-foreground hover:bg-[var(--fill-subtle-strong)] transition-colors duration-200"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              aria-label="Conversation"
              className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4"
            >
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`group relative max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-foreground text-background"
                        : m.error
                          ? "bg-red-500/10 border border-red-500/30 text-red-300"
                          : "bg-[var(--fill-subtle)] border border-border text-foreground/90"
                    }`}
                  >
                    {m.content ? (
                      m.role === "assistant" && !m.error ? (
                        <MarkdownLite text={m.content} />
                      ) : (
                        m.content
                      )
                    ) : loading && m.role === "assistant" ? (
                      <span className="inline-flex gap-1" aria-label="Thinking">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-2 animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-2 animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-2 animate-bounce" />
                      </span>
                    ) : null}

                    {m.role === "assistant" && m.content && !m.error && (
                      <button
                        onClick={() => copy(m)}
                        className="absolute -bottom-2 -right-2 p-1.5 rounded-full glass-strong opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity text-muted hover:text-foreground"
                        aria-label="Copy response"
                      >
                        {copiedId === m.id ? <Check size={11} className="text-success" /> : <Copy size={11} />}
                      </button>
                    )}

                    {m.error && (
                      <button
                        onClick={retryLast}
                        className="mt-2 flex items-center gap-1.5 text-xs text-red-300 hover:text-red-200 font-medium"
                      >
                        <RotateCcw size={11} /> Retry
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {messages.length === 1 && (
                <div className="flex flex-col gap-2 mt-2">
                  <p className="mono-label">TRY ASKING</p>
                  {suggestedQuestions.slice(0, 5).map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-left text-xs px-3 py-2 rounded-lg border border-border text-muted hover:text-foreground hover:border-border-strong transition-colors duration-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 p-3 border-t border-border"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Amar's experience..."
                className="flex-1 bg-[var(--fill-subtle)] border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-2 outline-none focus:border-accent/50"
                aria-label="Ask a question"
                maxLength={MAX_MESSAGE_LENGTH}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2.5 rounded-lg bg-accent text-white transition-all duration-200 hover:opacity-90 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
