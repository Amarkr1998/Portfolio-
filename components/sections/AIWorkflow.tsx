"use client";

import { motion } from "framer-motion";
import { aiWorkflow, aiTechnologies, projects } from "@/data/portfolio";
import FlowDiagram from "@/components/ui/FlowDiagram";

const aiProjects = projects.filter((p) => p.detail.ai);

export default function AIWorkflow() {
  return (
    <section id="ai-engineering" className="relative py-28 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <p className="section-heading mb-4">APPLIED AI</p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-14 max-w-2xl">
          Engineering with AI
        </h2>

        <div className="grid lg:grid-cols-2 gap-14 items-start mb-16">
          <div className="card rounded-2xl p-6 sm:p-8">
            <FlowDiagram steps={aiWorkflow} accent="var(--accent-2)" />
          </div>

          <div>
            <p className="mono-label mb-4">AI TECHNOLOGIES</p>
            <div className="flex flex-wrap gap-2.5 mb-10">
              {aiTechnologies.map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className="text-xs px-3 py-1.5 rounded-full border border-accent-2/30 text-accent-2"
                >
                  {t}
                </motion.span>
              ))}
            </div>

            <p className="mono-label mb-4">DEMONSTRATED IN</p>
            <div className="flex flex-col gap-3">
              {aiProjects.map((p) => (
                <a
                  key={p.slug}
                  href="#projects"
                  className="group flex items-center justify-between rounded-lg border border-border px-4 py-3 transition-all duration-200 hover:border-accent-2/50 hover:-translate-y-0.5"
                >
                  <span>
                    <span className="text-sm text-foreground block">{p.title}</span>
                    <span className="text-xs text-muted-2">{p.detail.ai}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
