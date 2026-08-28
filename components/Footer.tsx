"use client";

import { Command } from "lucide-react";
import { navSections, profile, socials } from "@/data/portfolio";
import { useUIState } from "@/components/providers/UIStateProvider";
import { useEmailHref } from "@/hooks/useEmailHref";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Footer() {
  const { setCommandPaletteOpen, recruiterViewOpen } = useUIState();
  const emailHref = useEmailHref();

  return (
    <footer className="relative border-t border-border px-5 sm:px-8 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div>
          <p className="mono-label text-foreground/90 tracking-[0.2em] mb-2">
            {profile.name.toUpperCase()}
          </p>
          <p className="text-xs text-muted-2 max-w-xs">{profile.identity}</p>
        </div>

        {/* In-page section anchors only exist in the cinematic portfolio —
            Recruiter View is a single flat page, so these would be dead
            links there. */}
        {!recruiterViewOpen && (
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2">
            {navSections.slice(1).map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="text-xs text-muted hover:text-foreground transition-colors duration-200"
              >
                {s.label}
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4">
          <a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted-2 transition-all duration-200 hover:text-foreground hover:scale-110 inline-block"
          >
            <GithubIcon size={16} />
          </a>
          <a
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted-2 transition-all duration-200 hover:text-foreground hover:scale-110 inline-block"
          >
            <LinkedinIcon size={16} />
          </a>
          <a
            href={socials.resumeFile}
            download="Amar_Kumar_Resume.pdf"
            className="text-xs text-muted hover:text-foreground transition-colors duration-200"
          >
            Resume
          </a>
          <a
            {...emailHref}
            className="text-xs text-muted hover:text-foreground transition-colors duration-200"
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
          className="hidden sm:flex items-center gap-1.5 text-[0.68rem] text-muted-2 hover:text-foreground transition-colors duration-200"
        >
          <Command size={11} />
          <span className="mono-label">K to open command palette</span>
        </button>
      </div>
    </footer>
  );
}
