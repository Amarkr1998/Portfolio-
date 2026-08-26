"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, [data-cursor="interactive"]';
// Buttons, nav links and project cards opt into pulling the cursor toward
// their center — a separate, narrower set from INTERACTIVE_SELECTOR so
// small incidental links (social icons, etc.) still get the hover ring
// without the stronger magnetic feel.
const MAGNET_SELECTOR = '[data-magnet="true"]';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    if (reducedMotion || isTouch) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const labelEl = labelRef.current;
    if (!dot || !ring || !labelEl) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    // Two independently-smoothed positions, each easing toward the same
    // target at a different rate: the dot tracks tightly, the ring trails
    // looser behind it. That gap is what reads as "inertia" — neither one
    // snaps straight to the pointer.
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;
    // Cached once on hover-enter rather than read every animation frame —
    // getBoundingClientRect() forces a synchronous layout pass, and doing
    // that at 60fps while a WebGL scene is also rendering is expensive
    // enough to visibly hurt frame time. A magnet target's position won't
    // change mid-hover in practice, so a cached rect is safe.
    let magnetCenter: { x: number; y: number } | null = null;
    // Mirrors the `label` React state but readable synchronously inside the
    // rAF loop (a closure over `label` would be stale) — skips the label's
    // transform write on the (common) frames where it isn't shown at all.
    let hasLabel = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest<HTMLElement>(INTERACTIVE_SELECTOR);
      if (interactive) {
        ring.style.width = "56px";
        ring.style.height = "56px";
        ring.style.borderColor = "rgba(139, 92, 246, 0.8)";
        ring.style.opacity = "1";
        const cursorLabel = interactive.getAttribute("data-cursor-label");
        hasLabel = Boolean(cursorLabel);
        setLabel(cursorLabel);
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
        ring.style.width = "32px";
        ring.style.height = "32px";
        ring.style.borderColor = "rgba(139, 92, 246, 0.45)";
        ring.style.opacity = "0.65";
        hasLabel = false;
        setLabel(null);
      }
      if (target.closest(MAGNET_SELECTOR)) {
        magnetCenter = null;
      }
    };

    const animate = () => {
      // Default target is the raw pointer; hovering a magnetic element
      // blends it toward that element's center instead — a gentle pull,
      // not a hard snap, so it still feels attached to the real cursor.
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

      dotX += (targetX - dotX) * 0.35;
      dotY += (targetY - dotY) * 0.35;
      ringX += (targetX - ringX) * 0.14;
      ringY += (targetY - ringY) * 0.14;

      dot.style.transform = `translate3d(${dotX - 3}px, ${dotY - 3}px, 0)`;
      ring.style.transform = `translate3d(${ringX - 16}px, ${ringY - 16}px, 0)`;
      if (hasLabel) {
        labelEl.style.transform = `translate3d(${ringX + 26}px, ${ringY + 18}px, 0)`;
      }

      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
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
      <div
        ref={labelRef}
        className="cursor-label"
        style={{ opacity: label ? 1 : 0 }}
        aria-hidden="true"
      >
        {label}
      </div>
    </>
  );
}
