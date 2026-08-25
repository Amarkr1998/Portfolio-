"use client";

import { motion } from "framer-motion";
import { experience } from "@/data/portfolio";

export default function ExperienceTimeline() {
  return (
    <section id="experience" className="relative py-28 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <p className="section-heading mb-4">EXPERIENCE</p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-14">
          Where the work happened.
        </h2>

        <div className="relative pl-8 sm:pl-10">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute left-0 top-1 bottom-1 w-px bg-gradient-to-b from-accent via-border to-transparent"
          />

          {experience.map((job, idx) => (
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
                className="glass rounded-xl p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                  <h3 className="text-xl font-semibold text-foreground">{job.role}</h3>
                  <span className="mono-label">{job.period}</span>
                </div>
                <p className="text-accent-2 text-sm mb-1">{job.company}</p>
                <p className="mono-label mb-6">{job.location}</p>

                <ul className="space-y-2.5">
                  {job.responsibilities.map((r, i) => (
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
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
