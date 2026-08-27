"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { experience, projects, type Project } from "@/data/portfolio";
import ArchitectureFlow from "@/components/ui/ArchitectureFlow";
import ProjectDetails from "@/components/ProjectDetails";

export default function ExperienceTimeline() {
  // Local to this section — a second, independent instance of the same
  // ProjectDetails modal the Projects section uses, opened from the
  // CredAssist360 initiative card below instead of duplicating its detail.
  const [selectedInitiative, setSelectedInitiative] = useState<Project | null>(null);

  return (
    <section id="experience" className="relative py-28 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <p className="section-heading mb-4">EXPERIENCE</p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
          Where the work happened.
        </h2>
        <p className="text-sm text-accent-2 font-medium mb-1">Java Full Stack Engineer | AI Engineer</p>
        <p className="text-sm text-muted mb-14 max-w-xl">
          Building scalable healthcare applications, secure APIs, microservices and AI-powered workflows.
        </p>

        <div className="relative pl-8 sm:pl-10">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute left-0 top-1 bottom-1 w-px bg-gradient-to-b from-accent via-border to-transparent"
          />

          {experience.map((job, idx) => {
            const initiative = projects.find((p) => p.slug === job.initiativeSlug) ?? null;

            return (
              <div key={idx} className="relative mb-12 last:mb-0">
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="absolute -left-8 sm:-left-10 top-1.5 w-3 h-3 rounded-full bg-accent glow-accent"
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                  className="card rounded-xl p-6 sm:p-8"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <h3 className="text-xl font-semibold text-foreground">{job.role}</h3>
                    <span className="mono-label">{job.period}</span>
                  </div>
                  <p className="text-accent-2 text-sm mb-1">{job.company}</p>
                  <p className="mono-label mb-6">{job.location}</p>

                  <p className="text-base sm:text-lg font-medium text-foreground mb-2 leading-snug">
                    {job.headline}
                  </p>
                  <p className="text-sm text-muted leading-relaxed mb-8">{job.summary}</p>

                  {/* Primary product engineering work */}
                  <div className="mb-8 pb-8 border-b border-border">
                    <p className="mono-label text-accent mb-2.5">{job.platform.label}</p>
                    <p className="text-sm text-muted leading-relaxed mb-5">{job.platform.positioning}</p>

                    <ul className="space-y-2.5 mb-6">
                      {job.platform.responsibilities.map((r, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-60px" }}
                          transition={{ duration: 0.4, delay: i * 0.04 }}
                          className="text-sm text-muted leading-relaxed flex gap-2.5"
                        >
                          <span className="text-accent mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
                          {r}
                        </motion.li>
                      ))}
                    </ul>

                    <div className="mb-6">
                      <p className="mono-label mb-2.5">TECHNOLOGIES</p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.platform.technology.map((t) => (
                          <span
                            key={t}
                            className="text-[0.68rem] px-2 py-0.5 rounded-md bg-[var(--fill-subtle)] border border-border text-foreground/70"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mono-label mb-2.5">WORKFLOW</p>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.5 }}
                      >
                        <ArchitectureFlow steps={job.platform.architecture} />
                      </motion.div>
                    </div>
                  </div>

                  {/* CredAssist360 — a distinct AI initiative under the same role */}
                  {initiative && (
                    <motion.button
                      onClick={() => setSelectedInitiative(initiative)}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.5 }}
                      className="group w-full text-left rounded-xl border border-accent-2/25 bg-[var(--fill-subtle)] p-5 sm:p-6 transition-all duration-200 hover:border-accent-2/50 hover:-translate-y-0.5"
                      aria-label={`View ${initiative.title} case study`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <p className="mono-label text-accent-2">AI INITIATIVE</p>
                        <ArrowUpRight
                          size={15}
                          className="text-muted-2 group-hover:text-accent-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                        />
                      </div>
                      <h4 className="text-lg font-semibold text-foreground mb-1">{initiative.title}</h4>
                      <p className="text-xs text-accent-2 mb-3">{initiative.subtitle}</p>
                      <p className="text-sm text-muted leading-relaxed mb-5">
                        Developed an AI-powered healthcare provider credentialing platform focused on provider
                        onboarding, document processing and Primary Source Verification.
                      </p>

                      <div className="mb-4">
                        <p className="mono-label mb-2">TECHNOLOGY</p>
                        <div className="flex flex-wrap gap-1.5">
                          {initiative.technology.map((t) => (
                            <span
                              key={t}
                              className="text-[0.68rem] px-2 py-0.5 rounded-md bg-[var(--fill-subtle-strong)] border border-border text-foreground/70"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-5">
                        <p className="mono-label mb-2">CAPABILITIES</p>
                        <div className="flex flex-wrap gap-1.5">
                          {initiative.capabilities.map((c) => (
                            <span
                              key={c}
                              className="text-[0.68rem] px-2 py-0.5 rounded-md text-accent-2 border border-accent-2/25"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <ArchitectureFlow steps={initiative.architecture} />
                    </motion.button>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <ProjectDetails project={selectedInitiative} onClose={() => setSelectedInitiative(null)} />
    </section>
  );
}
