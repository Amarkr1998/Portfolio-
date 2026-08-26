"use client";

import { motion } from "framer-motion";
import { engineeringImpact } from "@/data/portfolio";

export default function EngineeringImpact() {
  return (
    <section id="impact" className="relative py-28 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <p className="section-heading mb-4">ENGINEERING IMPACT</p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-14 max-w-2xl">
          What that experience actually enables.
        </h2>

        <div className="grid sm:grid-cols-2 gap-5">
          {engineeringImpact.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-border-anim card rounded-2xl p-6 sm:p-7"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">{pillar.title}</h3>
              <p className="text-sm text-muted leading-relaxed mb-4">{pillar.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {pillar.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[0.68rem] px-2 py-0.5 rounded-md bg-[var(--fill-subtle)] border border-border text-foreground/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
