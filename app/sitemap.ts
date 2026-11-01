import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...caseStudies.map((c) => ({
      url: `${SITE_URL}/work/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/recruiter`, changeFrequency: "monthly", priority: 0.6 },
  ];
}
