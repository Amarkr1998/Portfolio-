"use client";

import { motion } from "framer-motion";
import { engineeringProcess } from "@/data/portfolio";

export default function EngineeringProcess() {
  return (
    <section className="relative py-28 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <p className="section-heading mb-4">PROCESS</p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-14">How I Build</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {engineeringProcess.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="relative glass rounded-xl p-4 sm:p-5 text-center"
            >
              <p className="mono-label text-accent mb-2">{step.step}</p>
              <p className="text-xs sm:text-sm font-medium text-foreground/85">{step.label}</p>
              {i < engineeringProcess.length - 1 && (
                <span className="hidden lg:block absolute top-1/2 -right-2.5 -translate-y-1/2 text-muted-2 text-xs">
                  →
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
