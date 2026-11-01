"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import dynamic from "next/dynamic";
import { LAYER_LABELS } from "./layerLabels";
import s from "./sculpture.module.css";

// WebGL scene, loaded client-side after the page is idle (see HeroCanvas).
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

type LayerId = "data" | "services" | "apis" | "interface" | "ai";

const LAYERS: { id: LayerId; label: string; tag: string; tint: string }[] = [
  { id: "interface", label: "Interface", tag: "04 · INTERFACE", tint: "var(--accent)" },
  { id: "apis", label: "APIs", tag: "03 · APIS", tint: "color-mix(in oklch, var(--accent) 70%, var(--accent-2))" },
  { id: "services", label: "Services", tag: "02 · SERVICES", tint: "color-mix(in oklch, var(--accent) 35%, var(--accent-2))" },
  { id: "data", label: "Data", tag: "01 · DATA", tint: "var(--teal)" },
  { id: "ai", label: "AI integration", tag: "AI", tint: "var(--accent-2)" },
];

const STACK: { id: Exclude<LayerId, "ai">; i: number }[] = [
  { id: "data", i: 0 },
  { id: "services", i: 1 },
  { id: "apis", i: 2 },
  { id: "interface", i: 3 },
];

function Motif({ id }: { id: LayerId }) {
  switch (id) {
    case "interface":
      return (
        <div className={s.motif}>
          <span className={s.bar} style={{ left: 0, right: 0, top: 0, height: "11%" }} />
          <span className={s.blk} style={{ left: 0, top: "20%", width: "30%", bottom: 0 }} />
          <span className={s.blk} style={{ left: "36%", top: "20%", right: 0, height: "36%" }} />
          <span className={s.blk} style={{ left: "36%", top: "63%", right: "34%", bottom: 0 }} />
          <span className={s.blk} style={{ left: "70%", top: "63%", right: 0, bottom: 0 }} />
        </div>
      );
    case "apis":
      return (
        <div className={s.motif}>
          {[8, 28, 48, 68, 88].map((x) => (
            <span key={x} className={s.port} style={{ left: `calc(${x}% - 1.6cqi)`, top: "12%" }} />
          ))}
          {[8, 28, 48, 68, 88].map((x) => (
            <span key={`l${x}`} className={s.bar} style={{ left: `${x}%`, width: 1, top: "26%", height: "40%", borderRadius: 0 }} />
          ))}
          <span className={s.bar} style={{ left: "8%", right: "12%", top: "66%", height: 1, borderRadius: 0 }} />
        </div>
      );
    case "services":
      return (
        <div className={s.motif}>
          <span className={s.blk} style={{ left: 0, top: 0, width: "46%", height: "44%" }} />
          <span className={s.blk} style={{ right: 0, top: 0, width: "46%", height: "44%" }} />
          <span className={s.blk} style={{ left: 0, bottom: 0, width: "46%", height: "44%" }} />
          <span className={s.blk} style={{ right: 0, bottom: 0, width: "46%", height: "44%" }} />
        </div>
      );
    case "data":
      return (
        <div className={s.motif}>
          {[0, 18, 36, 54, 72, 90].map((y) => (
            <span key={y} className={s.row} style={{ top: `${y}%` }} />
          ))}
          <span className={s.bar} style={{ left: "30%", width: 1, top: 0, bottom: "10%", borderRadius: 0 }} />
        </div>
      );
    case "ai":
      return (
        <div className={s.motif} style={{ inset: "16% 16% 30% 16%" }}>
          <span className={s.ring} style={{ inset: 0 }} />
          <span className={s.ring} style={{ inset: "26%" }} />
          <span className={s.port} style={{ left: "calc(50% - 1.6cqi)", top: "calc(50% - 1.6cqi)" }} />
        </div>
      );
  }
}

function Slab({ id, tint, tag, i, highlighted, className }: { id: LayerId; tint: string; tag: string; i: number; highlighted: boolean; className: string }) {
  return (
    <div
      className={`${className} ${highlighted ? s.highlighted : ""}`}
      style={{ "--i": i, "--tint": tint } as CSSProperties}
    >
      <div className={s.edgeY} />
      <div className={s.edgeX} />
      <div className={s.top}>
        <Motif id={id} />
        <span className={s.tag}>{tag}</span>
      </div>
    </div>
  );
}

// Conduit base points (percent of the slab), staggered pulse delays.
const CONDUITS = [
  { x: 18, y: 82, d: "0s", c: "var(--teal)" },
  { x: 60, y: 90, d: "1.1s", c: "var(--accent)" },
  { x: 86, y: 34, d: "2.2s", c: "var(--accent)" },
  { x: 40, y: 22, d: "3.1s", c: "var(--accent-2)" },
];

/**
 * Conceptual sculpture of application layers, server-rendered as CSS 3D —
 * the same markup is the no-JS and reduced-motion composition. CSS adds a
 * one-time assembly and a rare conduit pulse; the client adds gentle pointer
 * response on fine-pointer devices and pauses the pulse when offscreen.
 */
export default function Sculpture() {
  const reducedMotion = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const assemblyRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  // Layer hovered inside the WebGL scene; mirrored onto the legend.
  const [sceneHover, setSceneHover] = useState<LayerId | null>(null);
  const [webgl, setWebgl] = useState(false);
  const active = sceneHover;

  // Pause continuous motion when the hero is offscreen.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pointer response: eased toward the pointer with rAF, only while moving.
  useEffect(() => {
    const frame = frameRef.current;
    const assembly = assemblyRef.current;
    if (!frame || !assembly || reducedMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const zone = frame.closest<HTMLElement>("[data-hero]") ?? frame;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let raf = 0;

    const step = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      assembly.style.setProperty("--px", cx.toFixed(4));
      assembly.style.setProperty("--py", cy.toFixed(4));
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(step) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };
    const onMove = (e: PointerEvent) => {
      const r = frame.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 0.9)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 0.9)));
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };

    zone.addEventListener("pointermove", onMove, { passive: true });
    zone.addEventListener("pointerleave", onLeave);
    return () => {
      zone.removeEventListener("pointermove", onMove);
      zone.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  // Entrance + pulse are CSS-only (and skipped under reduced motion by a
  // media query), so they don't wait for hydration or flash after it.
  const stateClass = `${s.animated} ${visible && !webgl ? "" : s.paused} ${webgl ? s.webgl : ""}`;

  return (
    <figure className={s.figure} aria-labelledby="sculpture-caption">
      <div ref={frameRef} className={`${s.frame} reg-marks ${stateClass}`} aria-hidden="true">
        <span className={`${s.coord} ${s.tl}`}>How I build</span>
        <span className={`${s.coord} ${s.tr}`}>Conceptual</span>
        <span className={`${s.coord} ${s.bl}`}>
          {active ? `Layer · ${LAYERS.find((l) => l.id === active)?.label}` : "Application layers"}
        </span>
        <span className={`${s.coord} ${s.br}`}>Iso · 1:1</span>
        <HeroCanvas highlight={active} onHover={setSceneHover} onReady={setWebgl} />
        <div className={s.stage}>
          <div ref={assemblyRef} className={s.assembly}>
            <div className={s.floor} />
            <div className={s.shadow} />
            {CONDUITS.map((c) => (
              <span
                key={c.x}
                className={s.conduit}
                style={{ left: `${c.x}%`, bottom: `${100 - c.y}%`, "--d": c.d, "--c": c.c } as CSSProperties}
              />
            ))}
            {STACK.map(({ id, i }) => {
              const layer = LAYERS.find((l) => l.id === id)!;
              return (
                <Slab key={id} id={id} i={i} tint={layer.tint} tag={layer.tag} highlighted={active === id} className={s.slab} />
              );
            })}
            <div className={s.bridge} />
            <Slab id="ai" i={1.5} tint="var(--accent-2)" tag="AI" highlighted={active === "ai"} className={s.aiModule} />
          </div>
        </div>
      </div>
      <figcaption id="sculpture-caption">
        <span className="sr-only">
          Conceptual illustration, not a specific client system: application layers stacked as interface, APIs,
          services and data, with an AI integration module connected to the services layer.
        </span>
        {/* Small frames show only layer names in 3D; the technologies are listed here. */}
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm sm:hidden">
          {LAYER_LABELS.map((l) => (
            <div key={l.id} className="contents">
              <dt className="font-mono text-xs uppercase tracking-wider text-fg">{l.name}</dt>
              <dd className="text-fg-2">{l.tech}</dd>
            </div>
          ))}
        </dl>
        <p className={s.caption}>
          Requests flow from the interface down to the data; AI assists the services layer.{" "}
          <span className="text-fg-3">Conceptual, not a specific client system.</span>
        </p>
      </figcaption>
    </figure>
  );
}
