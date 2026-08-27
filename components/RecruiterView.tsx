"use client";

import { useEffect, useRef, useState } from "react";
import { FileDown, Mail, MapPin, Briefcase, ArrowUpRight } from "lucide-react";
import {
  profile,
  experience,
  projects,
  techStack,
  certification,
  education,
  contact,
  socials,
  roleKeywordMatches,
  type Project,
} from "@/data/portfolio";
import ArchitectureFlow from "@/components/ui/ArchitectureFlow";
import ProjectDetails from "@/components/ProjectDetails";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

const CORE_KEYWORDS = [
  "Java 17/21",
  "Spring Boot",
  "React",
  "Microservices",
  "AI/LLM",
  "Azure",
  "Docker",
  "PostgreSQL",
  "Kafka/RabbitMQ",
];

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "accent" }) {
  return (
    <span
      className={
        tone === "accent"
          ? "text-[0.7rem] px-2.5 py-1 rounded-md text-accent-2 border border-accent-2/25"
          : "text-[0.7rem] px-2.5 py-1 rounded-md bg-[var(--fill-subtle)] border border-border text-foreground/75"
      }
    >
      {children}
    </span>
  );
}

function Section({
  label,
  title,
  children,
}: {
  label: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-10 border-b border-border last:border-b-0">
      <p className="mono-label text-accent mb-2">{label}</p>
      {title && <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">{title}</h2>}
      {children}
    </section>
  );
}

function ProjectCard({
  project,
  onOpen,
  capabilitiesLabel = "CAPABILITIES",
}: {
  project: Project;
  onOpen: (p: Project) => void;
  capabilitiesLabel?: string;
}) {
  return (
    <div className="card rounded-xl p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
        <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
        {project.date && <span className="mono-label">{project.date}</span>}
      </div>
      <p className="text-accent-2 text-sm mb-3">{project.subtitle}</p>
      <p className="text-sm text-muted leading-relaxed mb-4">{project.positioning}</p>

      <div className="mb-3">
        <p className="mono-label mb-1.5">TECHNOLOGY</p>
        <div className="flex flex-wrap gap-1.5">
          {project.technology.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="mono-label mb-1.5">{capabilitiesLabel}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.capabilities.map((c) => (
            <Badge key={c} tone="accent">
              {c}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() => onOpen(project)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent transition-colors"
        >
          View case study <ArrowUpRight size={14} />
        </button>
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            <GithubIcon size={14} /> View Code
          </a>
        )}
      </div>
    </div>
  );
}

export default function RecruiterView() {
  const [selected, setSelected] = useState<Project | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const job = experience[0];
  const credassist360 = projects.find((p) => p.slug === job.initiativeSlug) ?? null;
  const fittrack = projects.find((p) => p.slug === "fittrack") ?? null;
  const intellimail = projects.find((p) => p.slug === "intellimail") ?? null;

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const ctaLinks = [
    { label: "Download Resume", href: socials.resumeFile, icon: FileDown, primary: true, download: true },
    { label: "LinkedIn", href: socials.linkedin, icon: LinkedinIcon, primary: false, download: false },
    { label: "GitHub", href: socials.github, icon: GithubIcon, primary: false, download: false },
    { label: "Contact", href: "#recruiter-contact", icon: Mail, primary: false, download: false },
  ];

  return (
    <div className="min-h-screen px-5 sm:px-8 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto">
        {/* Identity header — everything a recruiter needs in the first glance */}
        <header className="mb-8">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground outline-none mb-1.5"
          >
            {profile.name}
          </h1>
          <p className="text-base sm:text-lg text-accent-2 font-medium mb-2">{profile.identity} | AI Engineer</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted mb-4">
            <span className="inline-flex items-center gap-1.5">
              <Briefcase size={13} /> {profile.experienceYears} years experience
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} /> {profile.location}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-6">
            {CORE_KEYWORDS.map((k) => (
              <Badge key={k}>{k}</Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-2.5">
            {ctaLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                download={link.download ? "Amar_Kumar_Resume.pdf" : undefined}
                target={!link.download && link.href.startsWith("http") ? "_blank" : undefined}
                rel={!link.download && link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  link.primary
                    ? "bg-foreground text-background hover:opacity-90"
                    : "border border-border-strong text-foreground hover:bg-[var(--fill-subtle)]"
                }`}
                data-cursor="interactive"
              >
                <link.icon size={14} />
                {link.label}
              </a>
            ))}
          </div>
        </header>

        <Section label="PROFESSIONAL SUMMARY">
          <p className="text-sm text-muted leading-relaxed">{profile.summary}</p>
        </Section>

        <Section label="EXPERIENCE" title={`${job.role} — ${job.company}`}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4">
            <span className="mono-label">{job.period}</span>
            <span className="mono-label">{job.location}</span>
          </div>
          <p className="text-base font-medium text-foreground mb-1.5">{job.headline}</p>
          <p className="text-sm text-muted leading-relaxed mb-6">{job.summary}</p>

          <div className="mb-6 pb-6 border-b border-border">
            <p className="text-sm font-semibold text-accent mb-1.5">{job.platform.label}</p>
            <p className="text-sm text-muted leading-relaxed mb-4">{job.platform.positioning}</p>
            <ul className="space-y-1.5 mb-4">
              {job.platform.responsibilities.map((r, i) => (
                <li key={i} className="text-sm text-muted leading-relaxed flex gap-2.5">
                  <span className="text-accent mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1.5">
              {job.platform.technology.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </div>

          {credassist360 && (
            <div>
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <p className="text-sm font-semibold text-accent-2">{credassist360.title} — AI Initiative</p>
                <button
                  onClick={() => setSelected(credassist360)}
                  className="inline-flex items-center gap-1 text-xs text-muted hover:text-accent-2 transition-colors shrink-0"
                  data-cursor="interactive"
                >
                  Full case study <ArrowUpRight size={12} />
                </button>
              </div>
              <p className="text-xs text-muted-2 mb-3">{credassist360.subtitle}</p>
              <p className="text-sm text-muted leading-relaxed mb-4">
                Developed an AI-powered healthcare provider credentialing platform focused on provider onboarding,
                document processing and Primary Source Verification.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {credassist360.technology.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {credassist360.capabilities.map((c) => (
                  <Badge key={c} tone="accent">
                    {c}
                  </Badge>
                ))}
              </div>
              <ArchitectureFlow steps={credassist360.architecture} />
            </div>
          )}
        </Section>

        <Section label="CORE SKILLS">
          <div className="space-y-4">
            {techStack.map((cat) => (
              <div key={cat.category} className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-4">
                <p className="mono-label w-full sm:w-40 shrink-0">{cat.category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section label="MATCH MY PROFILE" title="Role fit at a glance">
          <div className="grid sm:grid-cols-2 gap-4">
            {roleKeywordMatches.map((m) => (
              <div key={m.role} className="card rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-2.5">{m.role}</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.keywords.map((k) => (
                    <Badge key={k} tone="accent">
                      {k}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {fittrack && (
          <Section label="PERSONAL PROJECT" title={fittrack.title}>
            <ProjectCard project={fittrack} onOpen={setSelected} />
          </Section>
        )}

        {intellimail && (
          <Section label="PERSONAL PROJECT" title={intellimail.title}>
            <ProjectCard project={intellimail} onOpen={setSelected} />
          </Section>
        )}

        <Section label="EDUCATION">
          <p className="text-base font-medium text-foreground">{education.institution}</p>
          <p className="text-sm text-muted mb-1">{education.degree}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="mono-label">{education.period}</span>
            <span className="mono-label">CGPA {education.cgpa}</span>
          </div>
        </Section>

        <Section label="CERTIFICATION">
          <p className="text-base font-medium text-foreground">{certification.name}</p>
          <p className="text-sm text-muted">{certification.issuer}</p>
        </Section>

        <section id="recruiter-contact" className="pt-10">
          <p className="mono-label text-accent mb-2">CONTACT</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-1.5">{contact.headline}</h2>
          <p className="text-sm text-muted mb-6">{contact.subheadline}</p>
          <div className="flex flex-wrap gap-2.5">
            <a
              href={socials.email}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
              data-cursor="interactive"
            >
              <Mail size={14} /> Email Me
            </a>
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border-strong text-sm text-foreground hover:bg-[var(--fill-subtle)] transition-colors"
              data-cursor="interactive"
            >
              <LinkedinIcon size={14} /> LinkedIn
            </a>
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border-strong text-sm text-foreground hover:bg-[var(--fill-subtle)] transition-colors"
              data-cursor="interactive"
            >
              <GithubIcon size={14} /> GitHub
            </a>
          </div>
        </section>
      </div>

      <ProjectDetails project={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
