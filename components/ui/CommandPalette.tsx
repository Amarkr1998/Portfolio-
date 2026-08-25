"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  Briefcase,
  FolderGit2,
  Network,
  Bot,
  Wrench,
  FileDown,
  MessageCircleQuestion,
  Mail,
  Search,
} from "lucide-react";
import { useUIState } from "@/components/providers/UIStateProvider";
import { socials } from "@/data/portfolio";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

type Command = {
  id: string;
  label: string;
  group: string;
  icon: React.ElementType;
  action: () => void;
};

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, setAiChatOpen } = useUIState();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = useMemo(
    () => [
      { id: "home", label: "Go Home", group: "Navigate", icon: Home, action: () => scrollTo("hero") },
      { id: "experience", label: "View Experience", group: "Navigate", icon: Briefcase, action: () => scrollTo("experience") },
      { id: "projects", label: "View Projects", group: "Navigate", icon: FolderGit2, action: () => scrollTo("projects") },
      { id: "architecture", label: "View Architecture", group: "Navigate", icon: Network, action: () => scrollTo("architecture") },
      { id: "ai-engineering", label: "View AI Engineering", group: "Navigate", icon: Bot, action: () => scrollTo("ai-engineering") },
      { id: "skills", label: "View Skills", group: "Navigate", icon: Wrench, action: () => scrollTo("tech-stack") },
      { id: "github", label: "Open GitHub", group: "Links", icon: GithubIcon, action: () => window.open(socials.github, "_blank") },
      { id: "linkedin", label: "Open LinkedIn", group: "Links", icon: LinkedinIcon, action: () => window.open(socials.linkedin, "_blank") },
      { id: "resume", label: "Download Resume", group: "Links", icon: FileDown, action: () => window.open(socials.resumeFile, "_blank") },
      { id: "ask-ai", label: "Ask Amar AI", group: "Actions", icon: MessageCircleQuestion, action: () => setAiChatOpen(true) },
      { id: "contact", label: "Contact Amar", group: "Actions", icon: Mail, action: () => scrollTo("contact") },
    ],
    [setAiChatOpen]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
  }, [commands, query]);

  // Reset the active selection and search query whenever the palette opens
  // or the query changes — adjusted during render (not in an effect) per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevQuery, setPrevQuery] = useState(query);
  const [prevOpen, setPrevOpen] = useState(commandPaletteOpen);
  if (query !== prevQuery || commandPaletteOpen !== prevOpen) {
    setPrevQuery(query);
    setPrevOpen(commandPaletteOpen);
    setActiveIndex(0);
    if (commandPaletteOpen && !prevOpen) setQuery("");
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === "k";
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      } else if (e.key === "Escape" && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (commandPaletteOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [commandPaletteOpen]);

  const runCommand = (cmd: Command) => {
    cmd.action();
    setCommandPaletteOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[activeIndex];
      if (cmd) runCommand(cmd);
    }
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[14vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setCommandPaletteOpen(false)}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="relative w-full max-w-xl glass-strong rounded-xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search size={16} className="text-muted-2 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a command or search..."
                className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-2"
                aria-label="Command search"
              />
              <kbd className="mono-label border border-border rounded px-1.5 py-0.5 text-[10px]">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="px-4 py-6 text-sm text-muted text-center">No matching commands.</p>
              )}
              {filtered.map((cmd, i) => {
                const Icon = cmd.icon;
                const active = i === activeIndex;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => runCommand(cmd)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                      active ? "bg-white/[0.06] text-foreground" : "text-muted"
                    }`}
                  >
                    <Icon size={15} className={active ? "text-accent" : "text-muted-2"} />
                    <span>{cmd.label}</span>
                    <span className="ml-auto mono-label text-[10px]">{cmd.group}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
