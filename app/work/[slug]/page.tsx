import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { caseStudies, getCaseStudy, socials } from "@/data/portfolio";
import FlowDiagram from "@/components/work/FlowDiagram";
import { CredPreview, EsicPreview } from "@/components/work/Previews";
import { EmailLink } from "@/components/ui/ContactActions";
import TechChip from "@/components/ui/TechChip";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const description = `${study.kind} — ${study.overview.contribution}`;
  return {
    title: `${study.title} case study`,
    description,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: { type: "article", url: `/work/${study.slug}`, title: `${study.title} — case study by Amar Kumar`, description },
    twitter: { card: "summary_large_image", title: `${study.title} — case study`, description },
  };
}

const SECTIONS = [
  { id: "context", label: "Context" },
  { id: "role", label: "My role" },
  { id: "problem", label: "Problem" },
  { id: "workflows", label: "Implemented workflows" },
  { id: "contribution", label: "Technical contribution" },
  { id: "architecture", label: "Architecture & data flow" },
  { id: "constraints", label: "Constraints" },
  { id: "outcomes", label: "Verified outcomes" },
] as const;

function Block({ id, n, title, children }: { id: string; n: number; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="reveal border-t border-line py-10 first:border-t-0 first:pt-0 sm:py-12">
      <p className="annot tone-text font-semibold">{String(n).padStart(2, "0")}</p>
      <h2 id={`${id}-h`} className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-fg-2">
          <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-[var(--tone)]" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const idx = caseStudies.findIndex((c) => c.slug === study.slug);
  const next = caseStudies[(idx + 1) % caseStudies.length];

  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      <article aria-labelledby="study-title" style={{ ["--tone" as string]: "var(--accent)" }}>
        <header className="relative isolate overflow-hidden border-b border-line pb-14 pt-[calc(var(--header-h)+2.5rem)] sm:pb-16 lg:pt-[calc(var(--header-h)+3.5rem)]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="hairline-grid absolute inset-0 [mask-image:radial-gradient(60%_70%_at_80%_20%,#000,transparent_75%)]" />
            <div className="absolute -top-48 right-[-8%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,var(--glow-1),transparent)]" />
          </div>

          <div className="container-x">
            <nav aria-label="Breadcrumb">
              <Link href="/#work" className="link-u inline-flex items-center gap-2 text-sm text-fg-2 hover:text-fg">
                <ArrowLeft size={15} aria-hidden="true" />
                Selected work
              </Link>
            </nav>

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
              <div className="hero-in">
                <p className="annot tone-text">Case study · Professional work</p>
                <h1 id="study-title" className="display-xl mt-4 max-w-[18ch]">
                  {study.title}
                </h1>
                <p className="lede mt-5">{study.kind}. {study.overview.problem}</p>
              </div>

              <dl className="hero-in grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 text-sm lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0" style={{ "--i": 2 } as React.CSSProperties}>
                <div>
                  <dt className="annot">Employer</dt>
                  <dd className="mt-1 text-fg">{study.employer}</dd>
                </div>
                {study.client && (
                  <div>
                    <dt className="annot">Client</dt>
                    <dd className="mt-1 text-fg">{study.client}</dd>
                  </div>
                )}
                <div>
                  <dt className="annot">Role</dt>
                  <dd className="mt-1 text-fg">{study.role}</dd>
                </div>
                <div>
                  <dt className="annot">Period</dt>
                  <dd className="mt-1 text-fg">{study.period}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="annot">Technologies on this project</dt>
                  <dd className="mt-2">
                    <ul className="flex flex-wrap gap-1.5">
                      {study.stack.map((t) => (
                        <TechChip key={t} name={t} />
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </header>

        <div className="container-x grid gap-10 py-14 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16 lg:py-20">
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-[calc(var(--header-h)+2rem)]">
              <p className="annot mb-3">On this page</p>
              <ol className="space-y-1 border-l border-line">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-fg-2 transition-colors duration-200 hover:border-[var(--tone)] hover:text-fg">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="min-w-0 max-w-[48rem]">
            <Block id="context" n={1} title="Context">
              <div className="space-y-4 text-fg-2">
                {study.context.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <div className="mt-8">{study.slug === "esic-esis" ? <EsicPreview /> : <CredPreview />}</div>
            </Block>

            <Block id="role" n={2} title="My role">
              <div className="space-y-4 text-fg-2">
                {study.myRole.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Block>

            <Block id="problem" n={3} title="Problem">
              <Bullets items={study.problem} />
            </Block>

            <Block id="workflows" n={4} title="Implemented workflows">
              <ol className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-2">
                {study.workflows.map((w, i) => (
                  <li key={w.title} className="bg-surface p-5">
                    <span className="annot tone-text font-semibold">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-2 font-sans text-base font-semibold text-fg">{w.title}</h3>
                    <p className="mt-1 text-sm text-fg-2">{w.body}</p>
                  </li>
                ))}
              </ol>
            </Block>

            <Block id="contribution" n={5} title="Technical contribution">
              <dl className="divide-y divide-line border-y border-line">
                {study.contribution.map((c) => (
                  <div key={c.area} className="grid gap-2 py-5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6">
                    <dt className="font-medium text-fg">{c.area}</dt>
                    <dd className="space-y-2 text-fg-2">
                      {c.points.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </Block>

            <Block id="architecture" n={6} title="Architecture & data flow">
              <p className="mb-6 text-fg-2">
                A simplified view of how the pieces described above relate. It shows sequence, not infrastructure.
              </p>
              <FlowDiagram flow={study.flow} fig={idx === 0 ? "02" : "03"} />
            </Block>

            <Block id="constraints" n={7} title="Constraints">
              <Bullets items={study.constraints} />
            </Block>

            <Block id="outcomes" n={8} title="Verified outcomes">
              <p className="mb-5 text-fg-2">
                No performance or business metrics are published for this work, so this lists delivered capabilities
                rather than numbers.
              </p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {study.outcomes.map((o) => (
                  <li key={o} className="rounded-[var(--radius-md)] border border-line bg-surface p-4 text-fg">
                    <span aria-hidden="true" className="mb-2 block h-1 w-6 rounded-full bg-[var(--tone)]" />
                    {o}
                  </li>
                ))}
              </ul>
            </Block>
          </div>
        </div>

        <footer className="border-t border-line bg-bg-alt">
          <div className="container-x grid gap-6 py-12 md:grid-cols-2 md:items-center">
            <Link href={`/work/${next.slug}`} className="panel card-lift group block p-6">
              <span className="annot">Next case study</span>
              <span className="mt-2 flex items-center justify-between gap-4 font-display text-xl font-semibold text-fg">
                {next.title}
                <ArrowRight size={18} aria-hidden="true" className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
              <span className="mt-1 block text-sm text-fg-2">{next.kind}</span>
            </Link>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <EmailLink className="btn btn-primary">
                <Mail size={16} aria-hidden="true" />
                Discuss this work
              </EmailLink>
              <a href={socials.resumeFile} target="_blank" rel="noopener" className="btn btn-secondary">
                View Resume
              </a>
            </div>
          </div>
        </footer>
      </article>
    </main>
  );
}
