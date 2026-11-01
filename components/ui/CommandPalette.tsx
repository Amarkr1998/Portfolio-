"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  FolderGit2,
  Wrench,
  User,
  Mail,
  FileText,
  FileDown,
  MessageCircleQuestion,
  UserRound,
  SunMoon,
  Copy,
  Search,
  BookOpen,
} from "lucide-react";
import { useUIState } from "@/components/providers/UIStateProvider";
import { caseStudies, socials } from "@/data/portfolio";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useTheme } from "@/hooks/useTheme";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Command = {
  id: string;
  label: string;
  group: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  action: () => void;
};

// window.open() on a PDF only previews it — a real anchor with `download`
// is what makes the browser save the file.
function downloadResume() {
  const link = document.createElement("a");
  link.href = socials.resumeFile;
  link.download = "Amar_Kumar_Resume.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export default function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, setAiChatOpen } = useUIState();
  const router = useRouter();
  const pathname = usePathname();
  const { toggleTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [notice, setNotice] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, commandPaletteOpen);

  const commands: Command[] = useMemo(() => {
    const goToSection = (id: string) => {
      if (pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
        history.replaceState(null, "", `#${id}`);
      } else {
        router.push(`/#${id}`);
      }
    };
    return [
      { id: "stack", label: "Tech stack map", group: "Navigate", icon: Wrench, action: () => goToSection("stack") },
      { id: "work", label: "Selected work", group: "Navigate", icon: FolderGit2, action: () => goToSection("work") },
      { id: "projects", label: "Independent projects", group: "Navigate", icon: FolderGit2, action: () => goToSection("projects") },
      { id: "experience", label: "Experience", group: "Navigate", icon: Briefcase, action: () => goToSection("experience") },
      { id: "expertise", label: "Expertise", group: "Navigate", icon: Wrench, action: () => goToSection("expertise") },
      { id: "about", label: "About", group: "Navigate", icon: User, action: () => goToSection("about") },
      { id: "contact", label: "Contact", group: "Navigate", icon: Mail, action: () => goToSection("contact") },
      ...caseStudies.map((c) => ({
        id: `cs-${c.slug}`,
        label: `${c.title} case study`,
        group: "Case studies",
        icon: BookOpen,
        action: () => router.push(`/work/${c.slug}`),
      })),
      { id: "recruiter", label: "Recruiter view", group: "Actions", icon: UserRound, action: () => router.push("/recruiter") },
      { id: "ask-ai", label: "Ask Amar AI", group: "Actions", icon: MessageCircleQuestion, action: () => setAiChatOpen(true) },
      { id: "resume", label: "View resume", group: "Actions", icon: FileText, action: () => window.open(socials.resumeFile, "_blank", "noopener") },
      { id: "resume-dl", label: "Download resume", group: "Actions", icon: FileDown, action: downloadResume },
      {
        id: "copy-email",
        label: "Copy email address",
        group: "Actions",
        icon: Copy,
        action: () => {
          navigator.clipboard.writeText(socials.emailAddress).then(
            () => setNotice("Email address copied."),
            () => setNotice(`Copy failed. The address is ${socials.emailAddress}.`)
          );
        },
      },
      { id: "theme", label: "Toggle theme", group: "Actions", icon: SunMoon, action: toggleTheme },
      { id: "linkedin", label: "Open LinkedIn", group: "Links", icon: LinkedinIcon, action: () => window.open(socials.linkedin, "_blank", "noopener,noreferrer") },
      { id: "github", label: "Open GitHub", group: "Links", icon: GithubIcon, action: () => window.open(socials.github, "_blank", "noopener,noreferrer") },
    ];
  }, [pathname, reducedMotion, router, setAiChatOpen, toggleTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
  }, [commands, query]);

  // Reset selection/query when the palette opens or the query changes —
  // adjusted during render rather than in an effect.
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
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
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
    if (commandPaletteOpen) requestAnimationFrame(() => inputRef.current?.focus());
  }, [commandPaletteOpen]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 2500);
    return () => clearTimeout(t);
  }, [notice]);

  const runCommand = (cmd: Command) => {
    setCommandPaletteOpen(false);
    // Run after the dialog closes so focus restoration doesn't fight
    // scrolling or navigation.
    requestAnimationFrame(cmd.action);
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

  useEffect(() => {
    document.getElementById(`command-${filtered[activeIndex]?.id}`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, filtered]);

  return (
    <>
      <p role="status" aria-live="polite" className="sr-only">
        {notice}
      </p>
      <AnimatePresence>
        {commandPaletteOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[14vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.15 }}
          >
            <div
              className="absolute inset-0 bg-[rgb(4_8_16/0.6)]"
              onClick={() => setCommandPaletteOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              className="relative w-full max-w-xl overflow-hidden rounded-[var(--radius-lg)] border border-line-strong bg-surface shadow-[var(--shadow-lg)]"
              initial={{ opacity: 0, y: reducedMotion ? 0 : -10, scale: reducedMotion ? 1 : 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -6, scale: reducedMotion ? 1 : 0.985 }}
              transition={{ duration: reducedMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 border-b border-line px-4 py-3">
                <Search size={16} className="shrink-0 text-fg-2" aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Jump to a section, case study or action…"
                  className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-3"
                  aria-label="Search commands"
                  role="combobox"
                  aria-expanded="true"
                  aria-autocomplete="list"
                  aria-controls="command-palette-list"
                  aria-activedescendant={filtered[activeIndex] ? `command-${filtered[activeIndex].id}` : undefined}
                />
                <kbd className="annot rounded border border-line px-1.5 py-0.5 text-[0.625rem]">Esc</kbd>
              </div>
              <div id="command-palette-list" role="listbox" aria-label="Commands" className="max-h-80 overflow-y-auto py-2">
                {filtered.length === 0 && <p className="px-4 py-6 text-center text-sm text-fg-2">No matching commands.</p>}
                {filtered.map((cmd, i) => {
                  const Icon = cmd.icon;
                  const active = i === activeIndex;
                  return (
                    <button
                      type="button"
                      key={cmd.id}
                      id={`command-${cmd.id}`}
                      role="option"
                      aria-selected={active}
                      tabIndex={-1}
                      onClick={() => runCommand(cmd)}
                      onMouseMove={() => setActiveIndex(i)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-150 ${
                        active ? "bg-surface-2 text-fg [[data-theme=light]_&]:bg-bg-alt" : "text-fg-2"
                      }`}
                    >
                      <Icon size={15} className={active ? "text-accent" : "text-fg-3"} />
                      <span>{cmd.label}</span>
                      <span className="annot ml-auto text-[0.625rem]">{cmd.group}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
