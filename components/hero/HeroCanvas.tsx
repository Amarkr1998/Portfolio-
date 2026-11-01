"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { HeroScene, LayerId } from "./heroScene";
import { LAYER_LABELS } from "./layerLabels";

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

// Fewer cores / little memory / small touch screens: no bloom, lower DPR.
function isLowPower() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 8;
  const mem = nav.deviceMemory ?? 8;
  const smallTouch = window.matchMedia("(pointer: coarse)").matches && window.innerWidth < 768;
  return cores <= 4 || mem <= 4 || smallTouch;
}

/**
 * Mounts the WebGL hero scene after the page is idle. Until it renders its
 * first frame (or if WebGL is unavailable / fails), the CSS sculpture beneath
 * stays visible — `onReady(false)` keeps it.
 */
export default function HeroCanvas({
  highlight,
  onHover,
  onReady,
}: {
  highlight: LayerId | null;
  onHover: (id: LayerId | null) => void;
  onReady: (ok: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HeroScene | null>(null);
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const onHoverRef = useRef(onHover);
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onHoverRef.current = onHover;
    onReadyRef.current = onReady;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!supportsWebGL()) {
      onReadyRef.current(false);
      return;
    }

    let cancelled = false;
    const idle = (cb: () => void) =>
      "requestIdleCallback" in window ? window.requestIdleCallback(cb, { timeout: 1200 }) : setTimeout(cb, 400);
    const idleId = idle(async () => {
      try {
        const { createHeroScene } = await import("./heroScene");
        if (cancelled) return;
        sceneRef.current = createHeroScene(canvas, {
          reducedMotion,
          lowPower: isLowPower(),
          onHover: (id) => onHoverRef.current(id),
          onProject: (pts) => {
            for (const [id, p] of Object.entries(pts)) {
              const el = labelRefs.current[id];
              if (!el) continue;
              el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
              el.style.opacity = String(Math.max(0, Math.min(1, (p.o - 0.85) / 0.15)));
            }
          },
          onFirstFrame: () => {
            if (cancelled) return;
            setVisible(true);
            onReadyRef.current(true);
          },
        });
      } catch {
        if (!cancelled) onReadyRef.current(false);
      }
    });

    const onLost = (e: Event) => {
      e.preventDefault();
      setVisible(false);
      onReadyRef.current(false);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelled = true;
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idleId as number);
      else clearTimeout(idleId as unknown as number);
      canvas.removeEventListener("webglcontextlost", onLost);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    sceneRef.current?.setHighlight(highlight);
  }, [highlight]);

  // Pause when offscreen or the tab is hidden.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let onScreen = true;
    const apply = () => sceneRef.current?.setActive(onScreen && document.visibilityState === "visible");
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      apply();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", apply);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", apply);
    };
  }, []);

  // Pointer parallax across the whole hero, fine pointers only.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const zone = canvas.closest<HTMLElement>("[data-hero]") ?? canvas;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / r.width));
      const y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / r.height));
      sceneRef.current?.setPointer(x, y);
    };
    const onLeave = () => sceneRef.current?.setPointer(0, 0);
    zone.addEventListener("pointermove", onMove, { passive: true });
    zone.addEventListener("pointerleave", onLeave);
    return () => {
      zone.removeEventListener("pointermove", onMove);
      zone.removeEventListener("pointerleave", onLeave);
    };
  }, [reducedMotion]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 z-[1] h-full w-full transition-opacity duration-700 ease-out"
        style={{ opacity: visible ? 1 : 0 }}
      />
      {/* Layer labels: HTML (crisp, translatable), tracking the 3D anchors. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2]" style={{ visibility: visible ? "visible" : "hidden" }}>
        {LAYER_LABELS.map((l) => {
          const on = highlight === l.id;
          return (
            <div
              key={l.id}
              ref={(el) => {
                labelRefs.current[l.id] = el;
              }}
              className="absolute left-0 top-0 will-change-transform"
              style={{ opacity: 0 }}
            >
              <div
                className={`pointer-events-auto -translate-y-1/2 cursor-default pl-2.5 transition-transform duration-200 ${
                  ""
                } ${on ? "scale-105" : ""}`}
                onPointerEnter={() => onHoverRef.current(l.id)}
                onPointerLeave={() => onHoverRef.current(null)}
              >
                <span className="flex items-center gap-1.5 font-mono text-[max(9px,2.15cqi)] font-semibold uppercase tracking-[0.12em] text-[#f2f6fc]">
                  <span className="h-px w-2.5 bg-[#a9b8ce]/70" />
                  {l.name}
                </span>
                <span className="hidden max-w-[max(96px,26cqi)] pl-4 @[420px]:block text-[max(9.5px,2.3cqi)] leading-tight text-[#a9b8ce]">{l.tech}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
