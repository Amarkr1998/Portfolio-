"use client";

import { useRef, useState } from "react";
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
  const ref = useRef<HTMLDivElement>(null);
  const [glow, setGlow] = useState({ x: 50, y: 50, visible: false });

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      visible: true,
    });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      onMouseMove={handleMove}
      onMouseLeave={() => setGlow((g) => ({ ...g, visible: false }))}
      onClick={() => onOpen(project)}
      className="card-border-anim group relative cursor-pointer overflow-hidden rounded-2xl glass p-6 sm:p-8"
      data-cursor="interactive"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(320px circle at ${glow.x}% ${glow.y}%, rgba(110,231,255,0.12), transparent 70%)`,
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground">{project.title}</h3>
            {project.date && <p className="mono-label mt-1">{project.date}</p>}
          </div>
          <ArrowUpRight
            size={20}
            className="text-muted-2 transition-all duration-300 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </div>

        <p className="text-sm text-muted leading-relaxed mb-6 max-w-md">{project.subtitle}</p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.technology.slice(0, 5).map((t) => (
            <span
              key={t}
              className="text-[0.68rem] px-2 py-0.5 rounded-md bg-white/[0.04] border border-border text-foreground/70"
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
