"use client";

import { motion } from "framer-motion";
import { systemArchitecture, architectureTech } from "@/data/portfolio";
import FlowDiagram from "@/components/ui/FlowDiagram";

export default function ArchitectureGraph() {
  return (
    <section id="architecture" className="relative py-28 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <p className="section-heading mb-4">SYSTEM DESIGN</p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4 max-w-2xl">
          How I Engineer Systems
        </h2>
        <p className="text-muted max-w-xl mb-14 text-sm sm:text-base leading-relaxed">
          A generalized view of the request path across projects — not every technology belongs
          to every project; see individual project details for what was actually used.
        </p>

        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <div className="glass rounded-2xl p-6 sm:p-8">
            <FlowDiagram steps={systemArchitecture} />
          </div>

          <div>
            <p className="mono-label mb-4">TECHNOLOGIES IN ROTATION</p>
            <div className="flex flex-wrap gap-2.5">
              {architectureTech.map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className="text-xs px-3 py-1.5 rounded-full border border-border text-foreground/75 hover:border-accent/50 hover:text-accent transition-colors"
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
