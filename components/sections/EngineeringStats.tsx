"use client";

import { motion } from "framer-motion";
import { engineeringStats } from "@/data/portfolio";
import TechConstellation from "@/components/sections/TechConstellation";

export default function EngineeringStats() {
  return (
    <section id="engineering-identity" className="relative py-28 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-heading mb-4">ENGINEERING SNAPSHOT</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-10">
              A profile built on verified, shipped work.
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {engineeringStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="card rounded-xl p-5 card-border-anim"
                >
                  <p className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mono-label mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <p className="mono-label text-center mb-6">TECH CONSTELLATION</p>
            <TechConstellation />
          </div>
        </div>
      </div>
    </section>
  );
}
