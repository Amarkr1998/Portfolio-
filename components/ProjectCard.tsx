"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/portfolio";

export default function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
}) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
      onClick={() => onOpen(project)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(project);
        }
      }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl card p-6 sm:p-8 transition-colors duration-200 hover:border-accent/35"
      aria-label={`View ${project.title} case study`}
    >
      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span
              className={`inline-block text-[0.62rem] font-mono uppercase tracking-wider px-2 py-0.5 rounded mb-2 ${
                project.type === "professional"
                  ? "bg-accent/10 text-accent"
                  : "bg-[var(--fill-subtle)] text-muted"
              }`}
            >
              {project.type === "professional" ? "Professional" : "Personal Project"}
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground">{project.title}</h3>
            {project.date && <p className="mono-label mt-1">{project.date}</p>}
          </div>
          <ArrowUpRight
            size={20}
            className="text-muted-2 transition-all duration-300 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </div>

        <p className="text-sm text-muted leading-relaxed mb-1 max-w-md">{project.subtitle}</p>
        {project.status && <p className="text-[0.68rem] text-accent-2 mb-1">{project.status}</p>}
        <p className="text-xs text-muted-2 leading-relaxed mt-3 max-w-md line-clamp-2">
          {project.detail.problem}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-6 mt-5">
          {project.technology.slice(0, 5).map((t) => (
            <span
              key={t}
              className="text-[0.68rem] px-2 py-0.5 rounded-md bg-[var(--fill-subtle)] border border-border text-foreground/70"
            >
              {t}
            </span>
          ))}
          {project.technology.length > 5 && (
            <span className="text-[0.68rem] px-2 py-0.5 text-muted-2">+{project.technology.length - 5}</span>
          )}
        </div>

        <div className="opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-500 overflow-hidden">
          <p className="mono-label mb-2 text-accent">ARCHITECTURE</p>
          <p className="text-[0.72rem] text-muted-2 leading-relaxed font-mono">
            {project.architecture.join("  →  ")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
