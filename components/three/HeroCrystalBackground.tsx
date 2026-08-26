"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

// WebGL only makes sense client-side, and the scene is not needed for first
// paint or SEO — deferred out of the initial bundle.
const CrystalScene = dynamic(() => import("@/components/three/CrystalScene"), {
  ssr: false,
  loading: () => null,
});

// Desktop-only, motion-respecting: on touch devices and under
// prefers-reduced-motion, the Hero's CSS gradient glow is the only
// background — no WebGL canvas is mounted at all.
export default function HeroCrystalBackground() {
  const reducedMotion = useReducedMotion();
  const isTouch = useIsTouchDevice();

  if (reducedMotion || isTouch) return null;

  return (
    <div
      className="absolute inset-0"
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, transparent 38%, black 62%, black 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, transparent 38%, black 62%, black 100%)",
      }}
      aria-hidden="true"
    >
      {/* Dusk sky wash behind the WebGL scene — a procedural gradient, not a
          photo, kept in the site's violet/blue palette with a soft warm
          glow low on the horizon (matching the scene's rim light). */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 78% 78%, rgba(251,146,60,0.16) 0%, transparent 55%), " +
            "linear-gradient(180deg, #0a0918 0%, #12123a 40%, #1a1650 68%, #120f2e 100%)",
        }}
      />
      <CrystalScene />
    </div>
  );
}
