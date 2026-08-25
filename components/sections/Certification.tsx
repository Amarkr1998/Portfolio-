"use client";

import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { certification } from "@/data/portfolio";

export default function Certification() {
  return (
    <section id="certification" className="relative py-20 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <p className="section-heading mb-4">CERTIFICATION</p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="card-border-anim glass rounded-2xl p-6 sm:p-8 flex items-start gap-5"
        >
          <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 border border-accent/25">
            <BadgeCheck size={22} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1">
              {certification.name}
            </h3>
            <p className="mono-label">{certification.issuer}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
