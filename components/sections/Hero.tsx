"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Box, Cloud, FileDown, Mail, Mouse, Sparkles } from "lucide-react";
import { getGsap } from "@/lib/gsap";
import { hero, profile, socials } from "@/data/portfolio";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import HeroCrystalBackground from "@/components/three/HeroCrystalBackground";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const HERO_TAG_ICONS: Record<string, typeof Sparkles> = {
  AI: Sparkles,
  Microservices: Box,
  Cloud: Cloud,
};

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
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            {hero.heroTags.map((tag, i) => {
              const Icon = HERO_TAG_ICONS[tag];
              return (
                <span key={tag} className="flex items-center gap-4">
                  {i > 0 && <span className="h-3.5 w-px bg-border-strong" aria-hidden="true" />}
                  <span className="flex items-center gap-1.5 text-sm text-muted">
                    {Icon && <Icon size={14} className="text-accent-2" />}
                    {tag}
                  </span>
                </span>
              );
            })}
          </div>
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
            <motion.button
              onClick={() => scrollTo("projects")}
              whileTap={{ scale: 0.96 }}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-medium glow-accent transition-transform duration-200 hover:scale-[1.03]"
              style={{ background: "linear-gradient(120deg, var(--accent), var(--accent-2))" }}
            >
              {hero.ctaPrimary}
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
            </motion.button>
          </div>

          <div className={`hero-cta ${reducedMotion ? "" : "opacity-0 translate-y-3"}`}>
            <motion.a
              href={socials.resumeFile}
              download="Amar_Kumar_Resume.pdf"
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border-strong text-sm text-foreground transition-all duration-200 hover:bg-[var(--fill-subtle)] hover:border-accent/40 hover:scale-[1.03]"
            >
              <FileDown size={15} />
              {hero.ctaSecondary}
            </motion.a>
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
            className="text-muted-2 transition-all duration-200 hover:text-foreground hover:scale-110 inline-block"
          >
            <GithubIcon size={18} />
          </a>
          <a
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Amar Kumar on LinkedIn"
            className="text-muted-2 transition-all duration-200 hover:text-foreground hover:scale-110 inline-block"
          >
            <LinkedinIcon size={18} />
          </a>
          <a
            href={socials.email}
            aria-label="Email Amar Kumar"
            className="text-muted-2 transition-all duration-200 hover:text-foreground hover:scale-110 inline-block"
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
        <motion.div
          animate={reducedMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Mouse size={20} className="text-muted-2" strokeWidth={1.5} />
        </motion.div>
        <span className="text-xs text-muted-2">Scroll Down</span>
      </div>
    </section>
  );
}
