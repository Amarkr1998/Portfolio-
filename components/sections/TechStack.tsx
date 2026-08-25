"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { techStack } from "@/data/portfolio";

export default function TechStack() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const categories = ["All", ...techStack.map((c) => c.category)];

  const visibleGroups =
    activeCategory === "All" ? techStack : techStack.filter((c) => c.category === activeCategory);

  return (
    <section id="tech-stack" className="relative py-28 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <p className="section-heading mb-4">TECH STACK</p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-10">
          An ecosystem, not a percentage bar.
        </h2>

        <LayoutGroup>
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-cursor="interactive"
                className="relative px-3.5 py-1.5 rounded-full text-xs mono-label transition-colors"
                style={{ color: activeCategory === cat ? "#08090c" : "var(--muted)" }}
              >
                {activeCategory === cat && (
                  <motion.span
                    layoutId="tech-filter-pill"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {visibleGroups.map((group) => (
              <div key={group.category} className="glass rounded-xl p-5">
                <p className="mono-label text-accent mb-3">{group.category}</p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-2.5 py-1 rounded-md bg-white/[0.04] border border-border text-foreground/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
