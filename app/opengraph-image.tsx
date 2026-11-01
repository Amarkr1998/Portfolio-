import { OG_SIZE, renderOgImage } from "@/lib/og";
import { hero } from "@/data/portfolio";

export const alt = "Amar Kumar — Java Full Stack Developer. Engineering enterprise applications with clarity and purpose.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: "Portfolio",
    title: hero.headline,
    subtitle: "Enterprise healthcare applications with Java, Spring Boot, React.js and SQL — and practical AI integrations.",
  });
}
