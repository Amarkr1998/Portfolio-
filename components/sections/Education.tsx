"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { education } from "@/data/portfolio";

export default function Education() {
  return (
    <section id="education" className="relative py-20 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <p className="section-heading mb-4">EDUCATION</p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="card rounded-2xl p-6 sm:p-8 flex items-start gap-5"
        >
          <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-accent-2/10 border border-accent-2/25">
            <GraduationCap size={22} className="text-accent-2" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1">
              {education.institution}
            </h3>
            <p className="text-sm text-muted mb-3">{education.degree}</p>
            <div className="flex flex-wrap gap-4">
              <span className="mono-label">{education.period}</span>
              <span className="mono-label text-success">CGPA {education.cgpa}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
