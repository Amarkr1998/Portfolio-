import { ArrowUpRight } from "lucide-react";
import { githubProfile, independentProjects, repoUrl } from "@/data/portfolio";
import { GithubIcon } from "@/components/ui/icons";
import SectionHeader from "@/components/home/SectionHeader";
import TechChip from "@/components/ui/TechChip";

const featured = independentProjects.filter((p) => p.featured);
const more = independentProjects.filter((p) => !p.featured);

export default function IndependentProjects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="section pt-0">
      <div className="container-x">
        <SectionHeader num="03" label="Independent projects" title="Built on my own time, in public" id="projects-heading">
          <p>
            Self-directed projects on GitHub, separate from client and employer work. Each summary is condensed from
            the repository&rsquo;s README.
          </p>
          <a
            href={githubProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="link-u link-u-static mt-4 inline-flex items-center gap-2 text-sm font-medium"
          >
            <GithubIcon size={15} /> All repositories on GitHub
            <ArrowUpRight size={14} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </SectionHeader>

        {/* Featured: editorial rows, the whole row is the link. */}
        <ol className="border-t border-line">
          {featured.map((p, i) => (
            <li
              key={p.repo}
              className="reveal group relative isolate border-b border-line"
            >
              {/* Accent rail on the left edge, drawn in on hover. */}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 top-0 w-0.5 origin-top scale-y-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-y-100"
              />
              <div className="grid gap-4 py-8 md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,0.85fr)] md:gap-8 md:pl-4 lg:py-10">
                <span className="annot pt-1.5 font-semibold text-accent">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="annot">{p.domain}</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
                    <a
                      href={repoUrl(p.repo)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="outline-none after:absolute after:inset-0 after:rounded-[var(--radius-md)] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-[var(--accent)]"
                    >
                      {p.title}
                      <span className="sr-only"> on GitHub (opens in a new tab)</span>
                    </a>
                  </h3>
                  <p className="mt-3 max-w-[62ch] text-fg-2">{p.summary}</p>
                  {p.note && <p className="mt-2 text-sm text-fg-2 italic">{p.note}</p>}
                </div>
                <div className="flex flex-col justify-between gap-5">
                  <ul className="flex flex-wrap gap-1.5 md:justify-end" aria-label={`${p.title} technologies`}>
                    {p.stack.map((t) => (
                      <TechChip key={t} name={t} />
                    ))}
                  </ul>
                  <span
                    aria-hidden="true"
                    className="inline-flex items-center gap-2 self-start text-sm font-medium text-fg-2 transition-colors duration-200 group-hover:text-accent md:self-end"
                  >
                    <GithubIcon size={15} />
                    View repository
                    <ArrowUpRight size={15} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
              {/* Hover wash */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--accent)_7%,transparent),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </li>
          ))}
        </ol>

        <h3 className="annot mb-5 mt-14 text-fg">More on GitHub</h3>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {more.map((p) => (
            <li key={p.repo} className="reveal">
              <a
                href={repoUrl(p.repo)}
                target="_blank"
                rel="noopener noreferrer"
                className="panel card-lift group flex h-full flex-col p-5"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="annot">{p.domain}</span>
                  <ArrowUpRight
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 text-fg-3 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </span>
                <span className="mt-3 font-display text-lg font-semibold tracking-tight text-fg">{p.title}</span>
                <span className="mt-2 flex-1 text-sm text-fg-2">{p.summary}</span>
                {p.note && <span className="mt-2 text-xs text-fg-2 italic">{p.note}</span>}
                <span className="mt-4 flex flex-wrap gap-1.5">
                  {p.stack.slice(0, 4).map((t) => (
                    <TechChip key={t} name={t} as="span" className="!px-2 !py-0.5 !text-xs" />
                  ))}
                </span>
                <span className="sr-only">View {p.title} on GitHub (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
