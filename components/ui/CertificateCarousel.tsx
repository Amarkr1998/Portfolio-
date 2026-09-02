"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, BadgeCheck, ExternalLink } from "lucide-react";
import type { CertificationEntry } from "@/data/portfolio";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Fixed box every card shares (before its per-offset scale is applied) —
// the outer stack never resizes as the active certificate changes, which is
// what keeps the section's layout from jumping during transitions.
const CARD_WIDTH = "w-[210px] sm:w-[280px] lg:w-[340px]";
const CARD_ASPECT = "aspect-[1600/1190]";
// How far a neighbor sits from center, as a percentage of a card's own
// width — percentage translateX is relative to the untransformed box, so
// this stays correct at every breakpoint without any JS measurement.
const OFFSET_X_PERCENT = 80;
const SWIPE_DISTANCE_THRESHOLD = 60;
const SWIPE_VELOCITY_THRESHOLD = 350;
// Matches the easing used for entrance/reveal motion elsewhere on the site
// (Navbar, ProjectDetails, RecruiterView) — a controlled glide rather than
// a springy bounce, for a more premium feel.
const EASE = [0.16, 1, 0.3, 1] as const;

// Shortest signed distance from `index` to `active` around a circular array
// — e.g. for length 4, index 0 relative to active 3 is +1, not -3.
function circularOffset(index: number, active: number, length: number): number {
  let diff = index - active;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  return diff;
}

function CardFace({ cert }: { cert: CertificationEntry }) {
  if (cert.image) {
    return (
      // object-contain (not cover) — certificates have wildly different
      // native aspect ratios (Udemy's are ~4:3, Microsoft's is ~2:1), and
      // the card box's ratio is fixed for layout stability, so cropping to
      // fill it would cut real content off different certificates by
      // different amounts. Showing the whole image letterboxed is correct
      // for every ratio instead of correct for only one.
      <div className="relative h-full w-full bg-[var(--surface)]">
        <Image
          src={cert.image}
          alt={`${cert.name} certificate issued by ${cert.issuer}`}
          fill
          sizes="(min-width: 1024px) 340px, (min-width: 640px) 280px, 210px"
          className="object-contain"
          draggable={false}
          priority={false}
        />
      </div>
    );
  }
  // No badge image supplied yet — a deliberate, honest fallback tile
  // (real data, just no photo) rather than a placeholder graphic.
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[var(--fill-subtle)] px-4 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 border border-accent/25">
        <BadgeCheck size={20} className="text-accent" />
      </span>
      <p className="text-xs font-medium text-foreground/80 leading-snug line-clamp-3">{cert.name}</p>
    </div>
  );
}

export default function CertificateCarousel({ certifications }: { certifications: CertificationEntry[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const length = certifications.length;
  const canNavigate = length > 1;
  const active = certifications[activeIndex];
  const liveRegionRef = useRef<HTMLParagraphElement>(null);

  const goTo = useCallback(
    (delta: number) => {
      if (!canNavigate) return;
      setActiveIndex((i) => (i + delta + length) % length);
    },
    [canNavigate, length]
  );

  useEffect(() => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = `Showing certificate ${activeIndex + 1} of ${length}: ${active.name}`;
    }
  }, [activeIndex, active, length]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(1);
    }
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (!canNavigate) return;
    if (info.offset.x < -SWIPE_DISTANCE_THRESHOLD || info.velocity.x < -SWIPE_VELOCITY_THRESHOLD) {
      goTo(1);
    } else if (info.offset.x > SWIPE_DISTANCE_THRESHOLD || info.velocity.x > SWIPE_VELOCITY_THRESHOLD) {
      goTo(-1);
    }
  };

  const transition = reducedMotion ? { duration: 0 } : { duration: 0.6, ease: EASE };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Certifications"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-2xl"
    >
      <p ref={liveRegionRef} aria-live="polite" className="sr-only" />

      <div className="relative flex items-center justify-center gap-4 sm:gap-8 py-4">
        {/* Ambient glow — purely decorative, seats the stack in a soft cyan
            wash so the active card's own glow reads as emanating from
            something rather than floating in flat black. */}
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
          <div className="h-[70%] w-[55%] rounded-full bg-accent-2/[0.08] blur-[70px]" />
        </div>

        {canNavigate && (
          <button
            type="button"
            onClick={() => goTo(-1)}
            aria-label="Previous certificate"
            data-cursor="interactive"
            className="group shrink-0 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[var(--surface-glass)] backdrop-blur-md backdrop-saturate-150 border border-border-strong text-muted transition-all duration-300 hover:text-accent-2 hover:border-accent-2/50 hover:shadow-[0_0_24px_-6px_rgba(56,189,248,0.5)] active:scale-95"
          >
            <ChevronLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
          </button>
        )}

        <motion.div
          drag={canNavigate ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={onDragEnd}
          className={`relative ${CARD_ASPECT} overflow-hidden ${
            canNavigate ? "w-[210px] sm:w-[540px] lg:w-[700px]" : CARD_WIDTH
          } touch-pan-y`}
        >
          {certifications.map((cert, i) => {
            const offset = circularOffset(i, activeIndex, length);
            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 1;

            return (
              <motion.div
                key={cert.credentialId}
                animate={{
                  x: `${offset * OFFSET_X_PERCENT}%`,
                  scale: isActive ? 1 : 0.78,
                  opacity: isVisible ? (isActive ? 1 : 0.45) : 0,
                  filter: isActive ? "blur(0px) brightness(1)" : "blur(3px) brightness(0.7)",
                }}
                transition={transition}
                style={{ zIndex: isActive ? 30 : 10 - Math.abs(offset) }}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${CARD_WIDTH} ${CARD_ASPECT} rounded-2xl overflow-hidden card transition-shadow duration-500 ${
                  isActive
                    ? "ring-1 ring-accent-2/60 shadow-[0_0_0_1px_rgba(56,189,248,0.22),0_20px_44px_-16px_rgba(0,0,0,0.65),0_0_56px_-8px_rgba(56,189,248,0.5)]"
                    : "shadow-[0_12px_28px_-14px_rgba(0,0,0,0.6)]"
                } ${!isActive && isVisible ? "cursor-pointer" : ""}`}
                onClick={() => {
                  if (!isActive && isVisible) goTo(offset);
                }}
                aria-hidden={!isVisible}
              >
                <CardFace cert={cert} />
              </motion.div>
            );
          })}
        </motion.div>

        {canNavigate && (
          <button
            type="button"
            onClick={() => goTo(1)}
            aria-label="Next certificate"
            data-cursor="interactive"
            className="group shrink-0 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[var(--surface-glass)] backdrop-blur-md backdrop-saturate-150 border border-border-strong text-muted transition-all duration-300 hover:text-accent-2 hover:border-accent-2/50 hover:shadow-[0_0_24px_-6px_rgba(56,189,248,0.5)] active:scale-95"
          >
            <ChevronRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.credentialId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="mt-8 text-center"
        >
          {active.url ? (
            <a
              href={active.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-2/10 border border-accent-2/25 mono-label text-accent-2 transition-colors duration-200 hover:bg-accent-2/15 hover:border-accent-2/40"
              data-cursor="interactive"
            >
              {active.issuer}
              <ExternalLink size={10} />
            </a>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent-2/10 border border-accent-2/25 mono-label text-accent-2">
              {active.issuer}
            </span>
          )}
          <p className="mt-2.5 text-lg sm:text-xl font-semibold text-foreground leading-snug max-w-md mx-auto">
            {active.name}
          </p>
          <p className="mt-1.5 text-xs text-muted-2">Issued {active.issued}</p>
        </motion.div>
      </AnimatePresence>

      {canNavigate && (
        <div className="mt-7 flex items-center justify-center gap-1.5">
          {certifications.map((cert, i) => (
            <button
              key={cert.credentialId}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to certificate ${i + 1}: ${cert.name}`}
              aria-current={i === activeIndex}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-6 bg-accent-2 shadow-[0_0_10px_-1px_rgba(56,189,248,0.7)]"
                  : "w-1.5 bg-[var(--fill-subtle-strong)] hover:bg-muted"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
