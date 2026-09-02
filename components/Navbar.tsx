"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Command, Menu, X, UserRound, LayoutGrid, FileDown } from "lucide-react";
import { navSections, socials } from "@/data/portfolio";
import { useUIState } from "@/components/providers/UIStateProvider";
import ThemeToggle from "@/components/ui/ThemeToggle";

// Primary desktop nav stays short and scannable — Education is still on the
// page and reachable from the fuller footer/mobile lists.
const PRIMARY_NAV_IDS = new Set(["about", "experience", "projects", "architecture", "ai-engineering", "tech-stack", "certification", "contact"]);
const primaryNavSections = navSections.filter((s) => PRIMARY_NAV_IDS.has(s.id));

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  const { recruiterViewOpen, setRecruiterViewOpen, setCommandPaletteOpen } = useUIState();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "glass-strong" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
        <button
          onClick={() => (recruiterViewOpen ? window.scrollTo({ top: 0 }) : scrollTo("hero"))}
          className="shrink-0 transition-transform duration-200 hover:scale-105"
          aria-label="Amar Kumar — back to top"
        >
          <Image src="/logo.png" alt="Amar Kumar" width={36} height={36} priority className="rounded-full" />
        </button>

        {!recruiterViewOpen && (
          <div className="hidden lg:flex items-center gap-1">
            {primaryNavSections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="px-3 py-2 text-xs text-muted hover:text-foreground transition-colors duration-200 rounded-md hover:bg-[var(--fill-subtle)]"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setRecruiterViewOpen(!recruiterViewOpen)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs text-muted hover:text-foreground hover:border-border-strong transition-colors duration-200"
            aria-pressed={recruiterViewOpen}
            aria-label={recruiterViewOpen ? "Switch to Portfolio View" : "Switch to Recruiter View"}
          >
            {recruiterViewOpen ? <LayoutGrid size={12} /> : <UserRound size={12} />}
            {recruiterViewOpen ? "Portfolio View" : "Recruiter View"}
          </button>
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border text-xs text-muted hover:text-foreground hover:border-border-strong transition-colors duration-200"
            aria-label="Open command palette"
          >
            <Command size={12} />
            <span className="mono-label">K</span>
          </button>
          <a
            href={socials.resumeFile}
            download="Amar_Kumar_Resume.pdf"
            className="hidden sm:inline-flex items-center px-4 py-1.5 rounded-md text-white text-xs font-medium transition-all duration-200 hover:opacity-90 hover:shadow-[0_0_20px_-4px_var(--accent)]"
            style={{ background: "linear-gradient(120deg, var(--accent), var(--accent-2))" }}
          >
            Resume
          </a>
          <button
            className="lg:hidden text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden bg-background border-t border-border px-5 py-4 flex flex-col gap-1">
          {!recruiterViewOpen &&
            navSections.slice(1).map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  scrollTo(s.id);
                  setMobileOpen(false);
                }}
                className="text-left px-2 py-3 text-base text-muted hover:text-foreground"
              >
                {s.label}
              </button>
            ))}
          <button
            onClick={() => {
              setRecruiterViewOpen(!recruiterViewOpen);
              setMobileOpen(false);
            }}
            className="text-left px-2 py-3 text-base text-muted hover:text-foreground border-t border-border mt-1 pt-4"
          >
            {recruiterViewOpen ? "Portfolio View" : "Recruiter View"}
          </button>
          <a
            href={socials.resumeFile}
            download="Amar_Kumar_Resume.pdf"
            onClick={() => setMobileOpen(false)}
            className="mt-3 flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg text-white text-sm font-medium"
            style={{ background: "linear-gradient(120deg, var(--accent), var(--accent-2))" }}
          >
            <FileDown size={16} />
            Download Resume
          </a>
        </div>
      )}
    </motion.header>
  );
}
