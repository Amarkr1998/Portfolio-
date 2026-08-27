"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { constellationNodes, constellationEdges } from "@/data/portfolio";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const CATEGORY_COLOR: Record<string, string> = {
  language: "#ffb37c",
  backend: "#8b5cf6",
  frontend: "#38bdf8",
  ai: "#f472b6",
  cloud: "#5eead4",
  data: "#facc15",
  messaging: "#a78bfa",
  security: "#fb7185",
  architecture: "#94a3b8",
};

const RADIUS = 40;

export default function TechConstellation() {
  const [active, setActive] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    const n = constellationNodes.length;
    constellationNodes.forEach((node, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const x = 50 + RADIUS * Math.cos(angle);
      const y = 50 + RADIUS * Math.sin(angle) * 0.82;
      map.set(node.id, { x, y });
    });
    return map;
  }, []);

  const activeNode = constellationNodes.find((n) => n.id === active);
  const connectedIds = new Set<string>();
  if (active) {
    constellationEdges.forEach(([a, b]) => {
      if (a === active) connectedIds.add(b);
      if (b === active) connectedIds.add(a);
    });
  }

  return (
    <div className="relative w-full aspect-square max-w-2xl mx-auto">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
        {constellationEdges.map(([a, b], i) => {
          const pa = positions.get(a);
          const pb = positions.get(b);
          if (!pa || !pb) return null;
          const highlighted = active !== null && (a === active || b === active);
          return (
            <motion.line
              key={`${a}-${b}`}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              stroke={highlighted ? "rgba(139,92,246,0.7)" : "rgba(255,255,255,0.12)"}
              strokeWidth={highlighted ? 0.5 : 0.25}
              initial={reducedMotion ? undefined : { pathLength: 0, opacity: 0 }}
              whileInView={reducedMotion ? undefined : { pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.04, ease: "easeInOut" }}
            />
          );
        })}
        <circle cx={50} cy={50} r={9} fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.45)" strokeWidth={0.3} />
      </svg>

      <div className="absolute inset-0">
        <div
          className="absolute flex items-center justify-center rounded-full glass-strong glow-accent"
          style={{ left: "50%", top: "50%", width: "13%", aspectRatio: "1/1", transform: "translate(-50%,-50%)" }}
        >
          <span className="mono-label text-accent text-[0.65rem] sm:text-xs">AMAR</span>
        </div>

        {constellationNodes.map((node, i) => {
          const pos = positions.get(node.id)!;
          const isActive = active === node.id;
          const isDimmed = active !== null && !isActive && !connectedIds.has(node.id);
          const color = CATEGORY_COLOR[node.category];

          return (
            <motion.button
              key={node.id}
              onMouseEnter={() => setActive(node.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(node.id)}
              onBlur={() => setActive(null)}
              className="absolute flex items-center justify-center rounded-full border transition-[width,height] duration-200"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: isActive ? "15%" : "10.5%",
                aspectRatio: "1/1",
                transform: "translate(-50%,-50%)",
                background: "var(--surface)",
                borderColor: isActive ? color : "rgba(255,255,255,0.14)",
                boxShadow: isActive
                  ? `0 4px 20px -4px ${color}88`
                  : "0 1px 2px rgba(0,0,0,0.3)",
                opacity: isDimmed ? 0.35 : 1,
              }}
              initial={reducedMotion ? undefined : { opacity: 0, scale: 0.6 }}
              whileInView={reducedMotion ? undefined : { opacity: isDimmed ? 0.35 : 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              aria-label={`${node.label}: ${node.description}`}
            >
              <span
                className="text-[0.55rem] sm:text-[0.68rem] font-mono text-center leading-tight px-1"
                style={{ color: isActive ? color : "var(--muted)" }}
              >
                {node.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="pointer-events-none absolute left-1/2 -bottom-2 -translate-x-1/2 w-full max-w-sm text-center">
        {activeNode ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-lg px-4 py-3 mx-auto inline-block"
          >
            <p className="mono-label text-accent mb-1">{activeNode.label}</p>
            <p className="text-xs text-muted max-w-xs">{activeNode.description}</p>
          </motion.div>
        ) : (
          <p className="mono-label text-muted-2">HOVER A NODE</p>
        )}
      </div>
    </div>
  );
}
