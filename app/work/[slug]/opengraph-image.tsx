import { OG_SIZE, renderOgImage } from "@/lib/og";
import { caseStudies, getCaseStudy } from "@/data/portfolio";

export const alt = "Case study by Amar Kumar";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug) ?? caseStudies[0];
  return renderOgImage({
    eyebrow: "Case study",
    title: study.title,
    subtitle: `${study.kind}. ${study.employer}${study.client ? ` · Client ${study.client}` : ""}.`,
  });
}
