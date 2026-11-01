import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { experience } from "@/data/portfolio";
import SectionHeader from "@/components/home/SectionHeader";
import TechChip from "@/components/ui/TechChip";

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="section bg-bg-alt">
      <div className="container-x">
        <SectionHeader num="04" label="Experience" title="Two roles in healthcare software" id="experience-heading">
          <p>
            Enterprise Java, reporting APIs and AI-assisted workflows, built for healthcare operations since May
            2024.
          </p>
        </SectionHeader>

        <ol className="timeline relative">
          {experience.map((job) => (
            <li
              key={job.id}
              aria-labelledby={`job-${job.id}`}
              className="reveal relative grid gap-6 border-t border-line pb-14 pt-8 last:pb-0 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[17rem_minmax(0,1fr)]"
            >
              {/* Sticky meta column: dates stay beside the role while reading. */}
              <div className="md:sticky md:top-[calc(var(--header-h)+2rem)] md:self-start">
                <p className="font-display text-3xl text-fg font-semibold tracking-tight tabular-nums">{job.start}</p>
                <p className="annot mt-2">{job.period}</p>
                <p className="mt-1 text-sm text-fg-2">{job.location}</p>
              </div>

              <div className="min-w-0">
                <h3 id={`job-${job.id}`} className="font-display text-2xl font-semibold tracking-tight">
                  {job.company}
                </h3>
                <p className="mt-1 text-lg text-fg">{job.role}</p>
                {job.context && <p className="annot mt-2 text-accent">{job.context}</p>}
                <p className="mt-4 max-w-[62ch] text-fg-2">{job.summary}</p>

                <div className="mt-7 space-y-8">
                  {job.groups.map((group, gi) => {
                                        return (
                      <div
                        key={gi}
                        className={group.label ? "border-l-2 border-line-strong pl-5" : ""}
                      >
                        {group.label && <h4 className="font-sans text-base font-semibold text-fg">{group.label}</h4>}
                        <ul className={`${group.label ? "mt-3" : ""} space-y-2.5`}>
                          {group.points.map((p) => (
                            <li key={p} className="flex max-w-[70ch] gap-3 text-fg-2">
                              <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                        {group.caseStudy && (
                          <Link href={`/work/${group.caseStudy}`} className="link-u link-u-static mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
                            Read the case study
                            <span className="sr-only">: {group.label ?? job.context}</span>
                            <ArrowRight size={14} aria-hidden="true" />
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>

                <ul className="mt-8 flex flex-wrap gap-1.5" aria-label={`Technologies at ${job.company}`}>
                  {job.stack.map((t) => (
                    <TechChip key={t} name={t} />
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
