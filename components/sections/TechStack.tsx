"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { techStack, projects } from "@/data/portfolio";

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function projectsUsing(item: string): string[] {
  const key = normalize(item);
  return projects
    .filter((p) => p.technology.some((t) => {
      const tKey = normalize(t);
      return tKey.includes(key) || key.includes(tKey);
    }))
    .map((p) => p.title);
}

export default function TechStack() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [hovered, setHovered] = useState<string | null>(null);
  const categories = ["All", ...techStack.map((c) => c.category)];

  const visibleGroups =
    activeCategory === "All" ? techStack : techStack.filter((c) => c.category === activeCategory);

  const usageMap = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const cat of techStack) {
      for (const item of cat.items) map.set(item, projectsUsing(item));
    }
    return map;
  }, []);

  return (
    <section id="tech-stack" className="relative py-28 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <p className="section-heading mb-4">TECH STACK</p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2">
          An ecosystem, not a percentage bar.
        </h2>
        <p className="text-sm text-muted mb-10">Hover a technology to see which projects use it.</p>

        <LayoutGroup>
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="relative px-3.5 py-1.5 rounded-full text-xs mono-label transition-colors duration-200"
                style={{ color: activeCategory === cat ? "var(--background)" : "var(--muted)" }}
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
              <div key={group.category} className="card rounded-xl p-5">
                <p className="mono-label text-accent mb-3">{group.category}</p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => {
                    const usedIn = usageMap.get(item) ?? [];
                    const hasUsage = usedIn.length > 0;
                    return (
                      <div key={item} className="relative">
                        <button
                          type="button"
                          onMouseEnter={() => hasUsage && setHovered(item)}
                          onMouseLeave={() => setHovered((h) => (h === item ? null : h))}
                          onFocus={() => hasUsage && setHovered(item)}
                          onBlur={() => setHovered((h) => (h === item ? null : h))}
                          className={`text-xs px-2.5 py-1 rounded-md bg-[var(--fill-subtle)] border text-foreground/80 transition-colors duration-200 ${
                            hasUsage ? "border-border hover:border-accent/40 cursor-default" : "border-border"
                          }`}
                        >
                          {item}
                        </button>
                        <AnimatePresence>
                          {hovered === item && hasUsage && (
                            <motion.div
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 4 }}
                              transition={{ duration: 0.15 }}
                              role="tooltip"
                              className="absolute z-20 left-0 top-full mt-1.5 whitespace-nowrap glass-strong rounded-md px-2.5 py-1.5 text-[0.68rem] text-muted-2"
                            >
                              Used in: <span className="text-foreground">{usedIn.join(", ")}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
