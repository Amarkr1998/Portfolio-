"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { GithubIcon } from "@/components/ui/icons";
import ArchitectureFlow from "@/components/ui/ArchitectureFlow";

const DETAIL_FIELDS: { key: keyof Project["detail"]; label: string }[] = [
  { key: "ai", label: "AI" },
  { key: "security", label: "Security" },
  { key: "database", label: "Database" },
  { key: "messaging", label: "Messaging" },
  { key: "deployment", label: "Deployment" },
];

export default function ProjectDetails({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, project !== null);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} details`}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto glass-strong rounded-t-2xl sm:rounded-2xl p-6 sm:p-10"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[var(--fill-subtle-strong)] text-muted hover:text-foreground transition-colors"
              aria-label="Close project details"
              data-cursor="interactive"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <p className="mono-label text-accent">{project.date ?? "PROJECT"}</p>
              <span
                className={`text-[0.62rem] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                  project.type === "professional"
                    ? "bg-accent/10 text-accent"
                    : "bg-[var(--fill-subtle)] text-muted"
                }`}
              >
                {project.type === "professional" ? "Professional" : "Personal Project"}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">{project.title}</h3>
            <p className="text-muted mb-1">{project.subtitle}</p>
            <p className="text-xs text-muted-2 mb-1">{project.context}</p>
            {project.status && (
              <p className="text-xs text-accent-2 font-medium mb-1">{project.status}</p>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors mb-8 mt-1"
                data-cursor="interactive"
              >
                <GithubIcon size={13} /> View Code
              </a>
            )}
            {!project.repoUrl && <div className="mb-8" />}

            <div className="grid sm:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="mono-label mb-2">PROBLEM</p>
                <p className="text-sm text-muted leading-relaxed">{project.detail.problem}</p>
              </div>
              <div>
                <p className="mono-label mb-2">SOLUTION</p>
                <p className="text-sm text-muted leading-relaxed">{project.detail.solution}</p>
              </div>
            </div>

            <div className="mb-8">
              <p className="mono-label mb-3">ARCHITECTURE</p>
              <ArchitectureFlow steps={project.architecture} />
            </div>

            <div className="mb-8">
              <p className="mono-label mb-3">TECHNOLOGY</p>
              <div className="flex flex-wrap gap-2">
                {project.technology.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-md bg-[var(--fill-subtle)] border border-border text-foreground/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="mono-label mb-3">CAPABILITIES</p>
              <div className="flex flex-wrap gap-2">
                {project.capabilities.map((c) => (
                  <span key={c} className="text-xs px-2.5 py-1 rounded-md text-accent-2 border border-accent-2/25">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {DETAIL_FIELDS.map(({ key, label }) => {
                const value = project.detail[key];
                if (!value || typeof value !== "string") return null;
                return (
                  <div key={key}>
                    <p className="mono-label mb-1.5">{label}</p>
                    <p className="text-sm text-muted leading-relaxed">{value}</p>
                  </div>
                );
              })}
            </div>

            {project.detail.engineeringDecisions && (
              <div>
                <p className="mono-label mb-3">ENGINEERING DECISIONS</p>
                <ul className="space-y-2">
                  {project.detail.engineeringDecisions.map((d, i) => (
                    <li key={i} className="text-sm text-muted leading-relaxed flex gap-2.5">
                      <span className="text-accent mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
