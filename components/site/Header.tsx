"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Command, Menu, X, UserRound } from "lucide-react";
import { navSections, profile, socials } from "@/data/portfolio";
import { useUIState } from "@/components/providers/UIStateProvider";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Logo from "@/components/site/Logo";

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const els = navSections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        let best: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        setActive(best);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.01, 0.25, 0.5] }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { setCommandPaletteOpen } = useUIState();
  const reducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const active = useActiveSection(isHome);

  // Trap on the whole header so the close button stays in the tab cycle.
  useFocusTrap(headerRef, menuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on route change (adjusting state during render rather
  // than in an effect).
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onResize = () => mq.matches && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onResize);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => menuRef.current?.querySelector<HTMLElement>("a,button")?.focus());
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onResize);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  const t = reducedMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <header
      ref={headerRef}
      className="site-header fixed inset-x-0 top-0 z-50 data-[menu=true]:z-[100]"
      data-scrolled={scrolled ? "true" : "false"}
      data-menu={menuOpen ? "true" : "false"}
    >
      <nav aria-label="Primary" className="container-x flex h-[var(--header-h)] items-center gap-4">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5 rounded-md" aria-label={`${profile.name} — home`}>
          <Logo size={36} />
          <span className="font-display text-[0.95rem] font-semibold tracking-tight text-fg">{profile.name}</span>
        </Link>

        <ul className="ml-auto hidden items-center gap-1 lg:flex">
          {navSections.map((s) => {
            const current = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`/#${s.id}`}
                  aria-current={current ? "location" : undefined}
                  className={`relative rounded-md px-3 py-2 text-sm transition-colors duration-200 hover:text-fg ${
                    current ? "text-fg" : "text-fg-2"
                  }`}
                >
                  {s.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 -bottom-px h-px bg-accent transition-transform duration-300 ease-out origin-left ${
                      current ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-1 lg:ml-3">
          <Link
            href="/recruiter"
            className="btn btn-ghost btn-sm hidden md:inline-flex"
            aria-current={pathname === "/recruiter" ? "page" : undefined}
          >
            <UserRound size={15} aria-hidden="true" />
            Recruiter view
          </Link>
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="icon-btn hidden lg:inline-flex"
            aria-label="Open command palette (Ctrl or Command + K)"
            title="Command palette (⌘K / Ctrl K)"
          >
            <Command size={16} aria-hidden="true" />
          </button>
          <ThemeToggle />
          <a
            href={socials.resumeFile}
            target="_blank"
            rel="noopener"
            className="btn btn-primary btn-sm ml-1 hidden sm:inline-flex"
          >
            Resume
            <ArrowUpRight size={14} className="icon-nudge-ne" aria-hidden="true" />
          </a>
          <button
            type="button"
            className="icon-btn lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={t}
            className="fixed inset-x-0 bottom-0 top-[var(--header-h)] overflow-y-auto border-t border-line bg-bg lg:hidden"
          >
            <div className="container-x flex min-h-full flex-col py-6">
              <ul className="flex flex-col">
                {navSections.map((s, i) => (
                  <li key={s.id} className="border-b border-line">
                    <a
                      href={`/#${s.id}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex min-h-14 items-center justify-between py-3 font-display text-xl font-medium text-fg"
                    >
                      {s.label}
                      <span className="annot">0{i + 1}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link href="/recruiter" onClick={() => setMenuOpen(false)} className="btn btn-secondary w-full">
                  <UserRound size={16} aria-hidden="true" />
                  Recruiter view
                </Link>
                <a href={socials.resumeFile} target="_blank" rel="noopener" className="btn btn-primary w-full">
                  View resume
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </div>
              <div className="mt-auto flex items-center justify-between pt-8">
                <span className="annot">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
