"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, FileDown, Mail } from "lucide-react";
import { useUIState } from "@/components/providers/UIStateProvider";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import {
  profile,
  hero,
  experience,
  projects,
  techStack,
  aiTechnologies,
  socials,
} from "@/data/portfolio";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

const CORE_SKILL_CATEGORIES = ["Backend", "Generative AI", "DevOps & Cloud", "Architecture"];

export default function RecruiterView() {
  const { recruiterViewOpen, setRecruiterViewOpen } = useUIState();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useFocusTrap(panelRef, recruiterViewOpen);

  useEffect(() => {
    if (recruiterViewOpen) requestAnimationFrame(() => closeButtonRef.current?.focus());
  }, [recruiterViewOpen]);

  useEffect(() => {
    if (!recruiterViewOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setRecruiterViewOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [recruiterViewOpen, setRecruiterViewOpen]);

  const coreSkills = techStack.filter((c) => CORE_SKILL_CATEGORIES.includes(c.category));

  return (
    <AnimatePresence>
      {recruiterViewOpen && (
        <motion.div
          className="fixed inset-0 z-[180] flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setRecruiterViewOpen(false);
          }}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setRecruiterViewOpen(false)}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Recruiter summary of Amar Kumar"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto glass-strong rounded-t-2xl sm:rounded-2xl p-6 sm:p-9"
          >
            <button
              ref={closeButtonRef}
              onClick={() => setRecruiterViewOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[var(--fill-subtle-strong)] text-muted hover:text-foreground transition-colors"
              aria-label="Close recruiter summary"
              data-cursor="interactive"
            >
              <X size={18} />
            </button>

            <p className="mono-label mb-2">RECRUITER SUMMARY</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-1">{profile.name}</h2>
            <p className="text-accent-2 text-sm font-medium mb-2">{profile.positioning}</p>
            <p className="mono-label text-success mb-6">{hero.status}</p>

            <div className="mb-7">
              <p className="mono-label mb-2">CORE SKILLS</p>
              <div className="flex flex-wrap gap-1.5">
                {coreSkills.flatMap((c) => c.items).map((item) => (
                  <span
                    key={item}
                    className="text-[0.7rem] px-2.5 py-1 rounded-md bg-[var(--fill-subtle)] border border-border text-foreground/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-7">
              <p className="mono-label mb-2">EXPERIENCE</p>
              {experience.map((job) => (
                <div key={job.company} className="flex items-baseline justify-between gap-3">
                  <div>
                    <span className="text-sm text-foreground font-medium">{job.role}</span>
                    <span className="text-sm text-muted"> — {job.company}</span>
                  </div>
                  <span className="mono-label shrink-0">{job.period}</span>
                </div>
              ))}
            </div>

            <div className="mb-7">
              <p className="mono-label mb-3">TOP PROJECTS</p>
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.slug} className="border-l-2 border-accent/30 pl-3">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{p.title}</p>
                      <span
                        className={`text-[0.6rem] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          p.type === "professional"
                            ? "bg-accent/10 text-accent"
                            : "bg-[var(--fill-subtle)] text-muted"
                        }`}
                      >
                        {p.type === "professional" ? "Professional" : "Personal"}
                      </span>
                    </div>
                    <p className="text-xs text-muted">{p.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="mono-label mb-2">AI CAPABILITIES</p>
              <div className="flex flex-wrap gap-1.5">
                {aiTechnologies.map((t) => (
                  <span
                    key={t}
                    className="text-[0.7rem] px-2.5 py-1 rounded-md border border-accent-2/25 text-accent-2"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={socials.resumeFile}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
                data-cursor="interactive"
              >
                <FileDown size={15} /> Resume
              </a>
              <a
                href={socials.email}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border-strong text-sm text-foreground hover:bg-[var(--fill-subtle)] transition-colors"
                data-cursor="interactive"
              >
                <Mail size={15} /> Email
              </a>
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border-strong text-sm text-foreground hover:bg-[var(--fill-subtle)] transition-colors"
                data-cursor="interactive"
              >
                <LinkedinIcon size={15} /> LinkedIn
              </a>
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border-strong text-sm text-foreground hover:bg-[var(--fill-subtle)] transition-colors"
                data-cursor="interactive"
              >
                <GithubIcon size={15} /> GitHub
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
