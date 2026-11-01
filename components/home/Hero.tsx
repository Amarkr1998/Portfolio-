import type { CSSProperties } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { hero, profile, socials } from "@/data/portfolio";
import { EmailLink } from "@/components/ui/ContactActions";
import Sculpture from "@/components/hero/Sculpture";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

export default function Hero() {
  return (
    <section
      data-hero
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden pb-16 pt-[calc(var(--header-h)+2.5rem)] sm:pb-20 lg:pb-24 lg:pt-[calc(var(--header-h)+4rem)]"
    >
      {/* Atmosphere: masked hairline grid + one restrained focal light. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="hairline-grid absolute inset-0 [mask-image:radial-gradient(70%_60%_at_70%_35%,#000_20%,transparent_75%)]" />
        <div className="absolute -top-40 right-[-10%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,var(--glow-1),transparent)]" />
        <div className="absolute bottom-[-12rem] left-[-12rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,var(--glow-2),transparent)]" />
      </div>

      <div className="container-x grid items-center gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-16">
        <div>
          <p className="annot hero-in flex flex-wrap items-center gap-x-2" style={i(0)}>
            {hero.eyebrow.split(" • ").map((part, idx) => (
              <span key={part} className="inline-flex items-center gap-2">
                {idx > 0 && <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-accent" />}
                {part}
              </span>
            ))}
          </p>

          <h1 id="hero-heading" className="mt-6">
            <span className="hero-in block font-display text-lg font-medium tracking-tight text-fg-2 sm:text-xl" style={i(1)}>
              {profile.name}
            </span>
            <span className="hero-in display-xl mt-3 block max-w-[21ch]" style={i(2)}>
              {(() => {
                // Key phrase after "with" carries the spectrum gradient.
                const at = hero.headline.lastIndexOf(" with ");
                if (at === -1) return hero.headline;
                return (
                  <>
                    {hero.headline.slice(0, at + 6)}
                    <span className="text-brand">{hero.headline.slice(at + 6)}</span>
                  </>
                );
              })()}
            </span>
          </h1>

          <p className="lede hero-in mt-6" style={i(3)}>
            {hero.supporting}
          </p>

          <div className="hero-in mt-9 flex flex-wrap items-center gap-3" style={i(4)}>
            <a href="#work" className="btn btn-primary">
              Explore My Work
              <ArrowDown size={16} className="icon-nudge-y" aria-hidden="true" />
            </a>
            <a href={socials.resumeFile} target="_blank" rel="noopener" className="btn btn-secondary">
              View Resume
              <ArrowUpRight size={16} className="icon-nudge-ne" aria-hidden="true" />
              <span className="sr-only">(PDF, opens in a new tab)</span>
            </a>
            <EmailLink className="link-u ml-1 text-sm text-fg-2 hover:text-fg">
              or email me
            </EmailLink>
          </div>

          <p className="hero-in relative mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 pt-5 text-sm text-fg-2" style={i(5)}>
            <span aria-hidden="true" className="brand-rule absolute inset-x-0 top-0" />
            {hero.context.map((part, idx) => (
              <span key={part} className="inline-flex items-center gap-3">
                {idx > 0 && <span aria-hidden="true" className="text-fg-3">•</span>}
                {part}
              </span>
            ))}
          </p>
        </div>

        <div className="hero-in mx-auto w-full max-w-[26rem] sm:max-w-[30rem] lg:max-w-none" style={i(3)}>
          <Sculpture />
        </div>
      </div>
    </section>
  );
}
