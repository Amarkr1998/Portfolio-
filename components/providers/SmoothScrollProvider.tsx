"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { getGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const { gsap, ScrollTrigger } = getGsap();

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      // Lenis otherwise hijacks every wheel event for its own smooth-scroll
      // physics, even over elements with their own internal overflow-y
      // scroll (modals, dropdown lists) — starving them of the event
      // entirely and making them un-scrollable by wheel. Anything marked
      // data-lenis-prevent gets left to native scroll behavior instead.
      prevent: (node) => node instanceof HTMLElement && node.closest("[data-lenis-prevent]") !== null,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
