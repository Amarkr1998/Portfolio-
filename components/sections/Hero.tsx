"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, FileDown, Mail } from "lucide-react";
import { getGsap } from "@/lib/gsap";
import { hero, profile, socials } from "@/data/portfolio";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Magnetic from "@/components/ui/Magnetic";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import HeroCrystalBackground from "@/components/three/HeroCrystalBackground";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!nameRef.current) return;
    const chars = profile.name.split("");
    nameRef.current.innerHTML = chars
      .map((c) =>
        c === " "
          ? `<span class="inline-block">&nbsp;</span>`
          : `<span class="inline-block opacity-0 translate-y-6">${c}</span>`
      )
      .join("");

    if (reducedMotion) {
      nameRef.current.querySelectorAll("span").forEach((s) => {
        (s as HTMLElement).style.opacity = "1";
        (s as HTMLElement).style.transform = "none";
      });
      return;
    }

    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".hero-grid", { opacity: 1, duration: 1 })
        .to(".hero-status", { opacity: 1, y: 0, duration: 0.5 }, "-=0.4")
        .to(
          nameRef.current!.querySelectorAll("span"),
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.035 },
          "-=0.2"
        )
        .to(".hero-title", { opacity: 1, y: 0, duration: 0.7 }, "-=0.3")
        .fromTo(
          ".hero-title-sweep",
          { backgroundPosition: "200% 0%" },
          { backgroundPosition: "0% 0%", duration: 1.1, ease: "power2.inOut" },
          "-=0.5"
        )
        .to(".hero-sub", { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
        .to(".hero-cta", { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, "-=0.4")
        .to(".hero-scroll-indicator", { opacity: 1, duration: 0.6 }, "-=0.2");
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      ref={rootRef}
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden px-5 sm:px-8"
    >
      <div className="hero-grid absolute inset-0 bg-grid opacity-0 pointer-events-none" />
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.22) 0%, rgba(56,189,248,0.12) 40%, transparent 70%)",
        }}
      />
      <HeroCrystalBackground />

      <div className="relative max-w-7xl mx-auto w-full">
        <div
          className={`hero-status flex items-center gap-2 mb-8 ${reducedMotion ? "" : "opacity-0 -translate-y-2"}`}
        >
          <span className="relative flex h-2 w-2">
            <span className="status-dot absolute inline-flex h-full w-full rounded-full bg-success" />
          </span>
          <span className="mono-label text-success">{hero.status}</span>
        </div>

        <h1
          ref={nameRef}
          className="text-[13vw] sm:text-[9vw] lg:text-[7.2rem] leading-[0.95] font-semibold tracking-tight text-foreground"
        >
          {profile.name}
        </h1>

        <div className={`hero-title mt-4 sm:mt-6 ${reducedMotion ? "" : "opacity-0 translate-y-4"}`}>
          <p className="hero-title-sweep text-gradient text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight bg-[length:200%_100%]">
            {hero.headline}
          </p>
          <p className="mono-label mt-3 text-accent-2">{hero.secondaryIdentity}</p>
        </div>

        <p
          className={`hero-sub mt-6 max-w-xl text-base sm:text-lg text-muted ${
            reducedMotion ? "" : "opacity-0 translate-y-3"
          }`}
        >
          {hero.statement}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <div className={`hero-cta ${reducedMotion ? "" : "opacity-0 translate-y-3"}`}>
            <Magnetic>
              <motion.button
                onClick={() => scrollTo("projects")}
                whileTap={{ scale: 0.96 }}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-foreground text-background text-sm font-medium glow-accent"
                data-cursor="interactive"
                data-cursor-label="VIEW"
              >
                {hero.ctaPrimary}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Magnetic>
          </div>

          <div className={`hero-cta ${reducedMotion ? "" : "opacity-0 translate-y-3"}`}>
            <Magnetic>
              <motion.a
                href={socials.resumeFile}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border-strong text-sm text-foreground hover:bg-[var(--fill-subtle)] transition-colors"
                data-cursor="interactive"
                data-cursor-label="OPEN"
              >
                <FileDown size={15} />
                {hero.ctaSecondary}
              </motion.a>
            </Magnetic>
          </div>
        </div>

        <div
          className={`hero-cta mt-8 flex items-center gap-4 ${reducedMotion ? "" : "opacity-0 translate-y-3"}`}
        >
          <a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Amar Kumar on GitHub"
            className="text-muted-2 hover:text-foreground transition-colors"
            data-cursor="interactive"
            data-cursor-label="OPEN"
          >
            <GithubIcon size={18} />
          </a>
          <a
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Amar Kumar on LinkedIn"
            className="text-muted-2 hover:text-foreground transition-colors"
            data-cursor="interactive"
            data-cursor-label="OPEN"
          >
            <LinkedinIcon size={18} />
          </a>
          <a
            href={socials.email}
            aria-label="Email Amar Kumar"
            className="text-muted-2 hover:text-foreground transition-colors"
            data-cursor="interactive"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>

      <div
        className={`hero-scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 ${
          reducedMotion ? "" : "opacity-0"
        }`}
      >
        <span className="mono-label">SCROLL</span>
        <motion.div
          animate={reducedMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={14} className="text-muted-2" />
        </motion.div>
      </div>
    </section>
  );
}
