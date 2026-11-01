import { ArrowUpRight, Award, GraduationCap } from "lucide-react";
import { about, certification, education } from "@/data/portfolio";


export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="section bg-bg-alt">
      <div className="container-x">
        <p className="section-label reveal">
          <span className="num">06</span>
          <span>About</span>
        </p>

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-20">
          <div className="reveal">
            <h2 id="about-heading" className="display-md max-w-[30ch] !font-medium !leading-snug">
              {about.lead}
            </h2>
            <div className="mt-8 space-y-5 text-fg-2 prose-measure">
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>

          <ol className="reveal self-end">
            {about.focus.map((f, i) => (
              <li key={f.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-2 border-t border-line py-5">
                <span className="annot pt-1 font-semibold text-accent">0{i + 1}</span>
                <div>
                  <h3 className="font-sans text-base font-semibold text-fg">{f.title}</h3>
                  <p className="mt-1 text-sm text-fg-2">{f.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:mt-20">
          <article aria-labelledby="edu-heading" className="panel reveal flex gap-5 p-6 sm:p-7">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-line bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-accent">
              <GraduationCap size={20} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="annot">Education</p>
              <h3 id="edu-heading" className="mt-2 font-sans text-lg font-semibold text-fg">
                {education.degree}
              </h3>
              <p className="text-fg-2">{education.institution}</p>
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-fg-2">
                <span>{education.period}</span>
                <span>
                  CGPA <span className="font-semibold text-fg">{education.cgpa}</span>
                </span>
              </p>
            </div>
          </article>

          <article aria-labelledby="cert-heading" className="panel reveal flex gap-5 p-6 sm:p-7">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-line bg-[color-mix(in_srgb,var(--accent-2)_10%,transparent)] text-accent-2">
              <Award size={20} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="annot">Certification</p>
              <h3 id="cert-heading" className="mt-2 font-sans text-lg font-semibold text-fg">
                {certification.name}
              </h3>
              <p className="text-fg-2">
                {certification.issuer} · {certification.issued}
              </p>
              <a
                href={certification.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-u link-u-static mt-3 inline-flex items-center gap-1 text-sm font-medium"
              >
                Verify on Microsoft Learn
                <ArrowUpRight size={14} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
