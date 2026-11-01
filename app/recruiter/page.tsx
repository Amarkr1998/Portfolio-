import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText, Mail, MapPin, Phone } from "lucide-react";
import {
  caseStudies,
  certification,
  education,
  evidenceLabels,
  experience,
  independentProjects,
  profile,
  repoUrl,
  skillGroups,
  socials,
} from "@/data/portfolio";
import { EmailLink } from "@/components/ui/ContactActions";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import TechChip from "@/components/ui/TechChip";
import { techTone, toneVar } from "@/lib/tones";

export const metadata: Metadata = {
  title: "Recruiter view",
  description: `One-page summary of ${profile.name}: ${profile.title}, ${profile.experienceYears} years, current role, core technologies, featured projects, education and certification.`,
  alternates: { canonical: "/recruiter" },
};

const coreTech = skillGroups.flatMap((g) => g.skills.filter((s) => s.evidence?.length));

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-t border-line py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
      <dt className="annot pt-0.5">{label}</dt>
      <dd className="text-fg">{children}</dd>
    </div>
  );
}

export default function RecruiterPage() {
  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      <div className="container-x max-w-[64rem] pb-20 pt-[calc(var(--header-h)+2.5rem)] lg:pt-[calc(var(--header-h)+3.5rem)]">
        <header className="border-b border-line pb-8">
          <p className="annot text-accent">Recruiter view · one-page summary</p>
          <span aria-hidden="true" className="brand-rule mt-3 block w-24" />
          <h1 className="display-lg mt-4">{profile.name}</h1>
          <p className="mt-2 text-lg text-fg">
            {profile.title} <span className="text-fg-2">· {profile.focus}</span>
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-fg-2">
            <MapPin size={14} aria-hidden="true" /> {profile.location}
          </p>
          <p className="mt-5 max-w-[68ch] text-fg-2">{profile.summary}</p>

          <div className="no-print mt-7 flex flex-wrap gap-2.5">
            <a href={socials.resumeFile} target="_blank" rel="noopener" className="btn btn-primary">
              <FileText size={16} aria-hidden="true" /> Resume (PDF)
            </a>
            <EmailLink className="btn btn-secondary">
              <Mail size={16} aria-hidden="true" /> Email
            </EmailLink>
            <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              <LinkedinIcon size={15} /> LinkedIn
            </a>
            <a href={socials.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              <GithubIcon size={15} /> GitHub
            </a>
          </div>
        </header>

        <section aria-labelledby="facts-h" className="mt-10">
          <h2 id="facts-h" className="sr-only">
            Key facts
          </h2>
          <dl>
            <Row label="Experience">{profile.experienceYears} years</Row>
            <Row label="Current role">
              {profile.current.role}, {profile.current.company}
              <span className="block text-sm text-fg-2">
                Client {profile.current.client} · Projects {profile.current.projects} · since {profile.current.since}
              </span>
            </Row>
            <Row label="Education">
              {education.degree}, {education.institution}
              <span className="block text-sm text-fg-2">
                {education.period} · CGPA {education.cgpa}
              </span>
            </Row>
            <Row label="Certification">
              <a href={certification.url} target="_blank" rel="noopener noreferrer" className="link-u link-u-static">
                {certification.name}
              </a>
              <span className="block text-sm text-fg-2">
                {certification.issuer} · {certification.issued}
              </span>
            </Row>
            <Row label="Contact">
              <span className="flex flex-wrap gap-x-5 gap-y-1">
                <span className="font-mono text-sm">{socials.emailAddress}</span>
                <a href={socials.phoneHref} className="link-u inline-flex items-center gap-1.5 text-sm">
                  <Phone size={13} aria-hidden="true" /> {socials.phoneDisplay}
                </a>
              </span>
            </Row>
          </dl>
        </section>

        <section aria-labelledby="exp-h" className="mt-14">
          <h2 id="exp-h" className="font-display text-xl font-semibold">
            Experience
          </h2>
          <ol className="mt-5 space-y-6">
            {experience.map((job) => (
              <li key={job.id} className="panel p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-sans text-base font-semibold text-fg">
                    {job.role} · {job.company}
                  </h3>
                  <p className="annot">{job.period}</p>
                </div>
                {job.context && <p className="mt-1 text-sm text-accent">{job.context}</p>}
                <p className="mt-3 text-fg-2">{job.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`Technologies at ${job.company}`}>
                  {job.stack.map((t) => (
                    <TechChip key={t} name={t} />
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="proj-h" className="mt-14">
          <h2 id="proj-h" className="font-display text-xl font-semibold">
            Featured projects
          </h2>
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {caseStudies.map((c) => (
              <li key={c.slug} className="panel card-lift flex flex-col p-5 sm:p-6">
                <p className="annot">
                  {c.employer}
                  {c.client ? ` · Client ${c.client}` : ""}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm text-fg-2">{c.overview.contribution}</p>
                <Link href={`/work/${c.slug}`} className="link-u link-u-static mt-4 inline-flex items-center gap-1.5 self-start text-sm font-medium">
                  Case study<span className="sr-only">: {c.title}</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="indep-h" className="mt-14">
          <h2 id="indep-h" className="font-display text-xl font-semibold">
            Independent projects
          </h2>
          <p className="mt-1 text-sm text-fg-2">Self-directed, public on GitHub — not client or employer work.</p>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {independentProjects.map((p) => (
              <li key={p.repo} style={{ ["--tone" as string]: toneVar(p.tone) }}>
                <a
                  href={repoUrl(p.repo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-4"
                >
                  <span className="inline-flex items-center gap-2 font-medium text-fg group-hover:text-accent">
                    <span aria-hidden="true" className="chip-dot" style={{ background: "var(--tone)" }} />
                    {p.title}
                  </span>
                  <span className="text-sm text-fg-2">{p.stack.slice(0, 4).join(" · ")}</span>
                  <span className="hidden text-fg-3 sm:inline" aria-hidden="true">
                    <ArrowUpRight size={14} />
                  </span>
                  <span className="sr-only">(GitHub, opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="tech-h" className="mt-14">
          <h2 id="tech-h" className="font-display text-xl font-semibold">
            Core technologies
          </h2>
          <p className="mt-1 text-sm text-fg-2">Skills with professional evidence, and where they were used.</p>
          <ul className="mt-5 grid gap-x-6 sm:grid-cols-2">
            {coreTech.map((s) => (
              <li key={s.name} className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
                <span className="inline-flex items-center gap-2 text-fg">
                  <span aria-hidden="true" className="chip-dot" style={{ background: toneVar(techTone(s.name)) }} />
                  {s.name}
                </span>
                <span className="text-right font-mono text-xs text-fg-2">
                  {s.evidence!.map((e) => evidenceLabels[e]).join(" · ")}
                </span>
              </li>
            ))}
          </ul>
          <Link href="/#expertise" className="link-u link-u-static mt-5 inline-flex items-center gap-1.5 text-sm">
            Full skills inventory <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
}
