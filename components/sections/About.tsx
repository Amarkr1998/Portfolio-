"use client";

import { motion } from "framer-motion";
import { profile, aboutHighlights } from "@/data/portfolio";

export default function About() {
  return (
    <section id="about" className="relative py-28 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <p className="section-heading mb-4">ABOUT</p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl font-semibold tracking-tight mb-8 max-w-2xl"
        >
          I build systems, not just features.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted text-base sm:text-lg leading-relaxed max-w-2xl mb-12"
        >
          {profile.summary}
        </motion.p>

        <div className="flex flex-wrap gap-2.5">
          {aboutHighlights.map((h, i) => (
            <motion.span
              key={h}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -2, borderColor: "var(--accent)", color: "var(--accent)" }}
              transition={{ duration: 0.35, delay: i * 0.03 }}
              className="mono-label px-3 py-1.5 rounded-full border border-border text-foreground/80 cursor-default"
            >
              {h}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
