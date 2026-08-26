"use client";

import { Command } from "lucide-react";
import { navSections, profile, socials } from "@/data/portfolio";
import { useUIState } from "@/components/providers/UIStateProvider";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Footer() {
  const { setCommandPaletteOpen } = useUIState();

  return (
    <footer className="relative border-t border-border px-5 sm:px-8 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div>
          <p className="mono-label text-foreground/90 tracking-[0.2em] mb-2">
            {profile.name.toUpperCase()}
          </p>
          <p className="text-xs text-muted-2 max-w-xs">{profile.identity}</p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2">
          {navSections.slice(1).map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="text-xs text-muted hover:text-foreground transition-colors"
              data-cursor="interactive"
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted-2 hover:text-foreground transition-colors"
            data-cursor="interactive"
            data-cursor-label="OPEN"
          >
            <GithubIcon size={16} />
          </a>
          <a
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted-2 hover:text-foreground transition-colors"
            data-cursor="interactive"
            data-cursor-label="OPEN"
          >
            <LinkedinIcon size={16} />
          </a>
          <a
            href={socials.resumeFile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted hover:text-foreground transition-colors"
            data-cursor="interactive"
          >
            Resume
          </a>
          <a
            href={socials.email}
            className="text-xs text-muted hover:text-foreground transition-colors"
            data-cursor="interactive"
          >
            Contact
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 sm:pr-48">
        <p className="text-[0.68rem] text-muted-2">
          © {new Date().getFullYear()} {profile.name}. Built with Next.js.
        </p>
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden sm:flex items-center gap-1.5 text-[0.68rem] text-muted-2 hover:text-foreground transition-colors"
          data-cursor="interactive"
        >
          <Command size={11} />
          <span className="mono-label">K to open command palette</span>
        </button>
      </div>
    </footer>
  );
}
