"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function FlowDiagram({
  steps,
  accent = "var(--accent)",
}: {
  steps: readonly string[];
  accent?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative">
      <div
        className="absolute left-[15px] sm:left-[19px] top-3 bottom-3 w-px"
        style={{ background: `linear-gradient(to bottom, ${accent}55, transparent)` }}
      />
      {!reducedMotion && (
        <motion.div
          className="absolute left-[13px] sm:left-[17px] w-1.5 h-1.5 rounded-full"
          style={{ background: accent, boxShadow: `0 0 8px 2px ${accent}` }}
          animate={{ top: ["2%", "98%"] }}
          transition={{ duration: steps.length * 0.9, repeat: Infinity, ease: "linear" }}
        />
      )}

      <div className="flex flex-col gap-3">
        {steps.map((step, i) => (
          <motion.div
            key={step + i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="relative flex items-center gap-4 pl-0"
          >
            <span
              className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full glass-strong shrink-0 mono-label"
              style={{ color: accent, fontSize: "0.65rem" }}
            >
              {i + 1}
            </span>
            <span className="text-sm font-mono text-foreground/85 tracking-wide">{step}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
