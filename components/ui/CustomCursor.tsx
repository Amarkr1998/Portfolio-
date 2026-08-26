"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, [data-cursor="interactive"]';
// Buttons, nav links and project cards opt into pulling the ring toward
// their center — a separate, narrower set from INTERACTIVE_SELECTOR so
// small incidental links (social icons, etc.) still get the hover ring
// without the stronger magnetic feel.
const MAGNET_SELECTOR = '[data-magnet="true"]';

const RING_SIZE = 32; // px, fixed — never resized via width/height (that
// would force layout). Hover growth is done purely with transform: scale(),
// which is compositor-only.
const RING_HOVER_SCALE = 1.5;
// Exponential-smoothing time constants, in ms. Using elapsed real time
// (rather than a fixed per-frame multiplier) keeps the follow delay correct
// even if the actual frame rate drifts from 60fps.
const RING_FOLLOW_TAU_MS = 50; // ~40-60ms of ring lag behind the pointer
const RING_SCALE_TAU_MS = 120; // smooth grow/shrink on hover enter/exit

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    if (reducedMotion || isTouch) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let ringScale = 1;
    let targetScale = 1;
    // Cached once on hover-enter rather than read every animation frame —
    // getBoundingClientRect() forces a synchronous layout pass, and doing
    // that at 60fps while a WebGL scene is also rendering is expensive
    // enough to visibly hurt frame time. A magnet target's position won't
    // change mid-hover in practice, so a cached rect is safe.
    let magnetCenter: { x: number; y: number } | null = null;
    let lastTime = performance.now();
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // The dot is written directly from the raw event, not through the
      // rAF loop below — near-zero lag, always glued to the real pointer.
      // Only the ring goes through smoothing/magnet logic.
      dot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        targetScale = RING_HOVER_SCALE;
        ring.style.borderColor = "rgba(139, 92, 246, 0.85)";
        ring.style.opacity = "1";
      }
      const magnet = target.closest<HTMLElement>(MAGNET_SELECTOR);
      if (magnet) {
        const rect = magnet.getBoundingClientRect();
        magnetCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      }
    };
    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        targetScale = 1;
        ring.style.borderColor = "rgba(139, 92, 246, 0.45)";
        ring.style.opacity = "0.65";
      }
      if (target.closest(MAGNET_SELECTOR)) {
        magnetCenter = null;
      }
    };

    const animate = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      // Frame-rate-independent exponential smoothing: k = 1 - e^(-dt/tau).
      const followK = 1 - Math.exp(-dt / RING_FOLLOW_TAU_MS);
      const scaleK = 1 - Math.exp(-dt / RING_SCALE_TAU_MS);

      // Default target is the raw pointer; hovering a magnetic element
      // blends it toward that element's center instead — a gentle pull,
      // not a hard snap, so it still feels attached to the real cursor.
      // This blend only ever affects the ring's target, never the dot,
      // which always sits exactly on the real pointer position.
      let targetX = mouseX;
      let targetY = mouseY;
      if (magnetCenter) {
        const dx = magnetCenter.x - mouseX;
        const dy = magnetCenter.y - mouseY;
        const dist = Math.hypot(dx, dy) || 1;
        // Distance-capped pull: strong when the pointer is already near the
        // element's center (small buttons, nav links), tapering off toward
        // the edges of large targets like a project card so it never yanks
        // the cursor a long way from where the hand actually is.
        const pull = Math.min(1, 36 / dist) * 0.6;
        targetX = mouseX + dx * pull;
        targetY = mouseY + dy * pull;
      }

      ringX += (targetX - ringX) * followK;
      ringY += (targetY - ringY) * followK;
      ringScale += (targetScale - ringScale) * scaleK;

      // translate3d for position, scale() for hover growth — both folded
      // into one transform write per frame, both compositor-only (no
      // layout, no paint), so this never triggers reflow.
      ring.style.transform = `translate3d(${ringX - RING_SIZE / 2}px, ${ringY - RING_SIZE / 2}px, 0) scale(${ringScale})`;

      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    raf = requestAnimationFrame(animate);
    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [reducedMotion, isTouch]);

  if (reducedMotion || isTouch) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
