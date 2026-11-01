import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { caseStudies, type CaseStudy } from "@/data/portfolio";
import SectionHeader from "@/components/home/SectionHeader";
import Tilt from "@/components/ui/Tilt";
import { CredPreview, EsicPreview } from "@/components/work/Previews";
import TechChip from "@/components/ui/TechChip";

function Meta({ study }: { study: CaseStudy }) {
  return (
    <p className="annot flex flex-wrap gap-x-3 gap-y-1">
      <span>{study.employer}</span>
      {study.client && <span className="text-accent">Client · {study.client}</span>}
      <span>{study.period}</span>
    </p>
  );
}

function Summary({ study, headingId, featured }: { study: CaseStudy; headingId: string; featured?: boolean }) {
  return (
    <div className="flex flex-col">
      <Meta study={study} />
      <h3 id={headingId} className={`mt-4 ${featured ? "display-md" : "font-display text-2xl font-semibold tracking-tight"}`}>
        {study.title}
      </h3>
      <p className="mt-1.5 text-fg-2">{study.kind}</p>

      <dl className="mt-7 space-y-5">
        <div>
          <dt className="annot text-fg">Problem</dt>
          <dd className="mt-1.5 text-fg-2">{study.overview.problem}</dd>
        </div>
        <div>
          <dt className="annot text-fg">My contribution</dt>
          <dd className="mt-1.5 text-fg-2">{study.overview.contribution}</dd>
        </div>
      </dl>

      <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Core technologies">
        {study.stack.slice(0, 6).map((t) => (
          <TechChip key={t} name={t} />
        ))}
        {study.stack.length > 6 && <li className="chip border-dashed">+{study.stack.length - 6} more</li>}
      </ul>

      <div className="mt-8">
        <Link href={`/work/${study.slug}`} className="btn btn-secondary">
          Explore Case Study
          <ArrowRight size={16} className="icon-nudge-x" aria-hidden="true" />
          <span className="sr-only">: {study.title}</span>
        </Link>
      </div>
    </div>
  );
}

export default function SelectedWork() {
  const [esic, cred] = caseStudies;

  return (
    <section id="work" aria-labelledby="work-heading" className="section">
      <div className="container-x">
        <SectionHeader num="02" label="Selected work" title="Professional case studies" id="work-heading">
          <p>
            Client and employer work in healthcare. Each study separates what I built from the wider system
            around it, and previews are conceptual — no client screenshots or data.
          </p>
        </SectionHeader>

        <div className="space-y-8 lg:space-y-10">
          <article
            aria-labelledby="study-esic"
            className="panel card-lift reveal grid gap-10 p-6 sm:p-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 lg:p-12"
          >
            <Summary study={esic} headingId="study-esic" featured />
            <Tilt className="self-center">
              <EsicPreview />
            </Tilt>
          </article>

          <article
            aria-labelledby="study-cred"
            className="panel card-lift reveal grid gap-10 p-6 sm:p-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-12 lg:p-10"
          >
            <Tilt className="order-last self-center lg:order-first">
              <CredPreview />
            </Tilt>
            <Summary study={cred} headingId="study-cred" />
          </article>
        </div>
      </div>
    </section>
  );
}
