import {
  profile,
  hero,
  experience,
  projects,
  techStack,
  certifications,
  education,
  aiTechnologies,
  engineeringImpact,
  socials,
} from "@/data/portfolio";

// Builds a compact, structured text block of verified facts for the AI
// assistant's system prompt. This is the ONLY information the assistant
// is allowed to draw on — nothing outside this context.
export function buildPortfolioContext(): string {
  const lines: string[] = [];

  lines.push(`PROFILE`);
  lines.push(`Name: ${profile.name}`);
  lines.push(`Location: ${profile.location}`);
  lines.push(`Identity: ${profile.identity}`);
  lines.push(`Experience: ${profile.experienceYears} years`);
  lines.push(`Current role: ${profile.currentRole} at ${profile.currentCompany} (${profile.employmentPeriod})`);
  lines.push(`Positioning: ${profile.positioning}`);
  lines.push(`Summary: ${profile.summary}`);
  lines.push(`Availability: ${hero.status}`);
  lines.push("");

  lines.push(`EXPERIENCE`);
  for (const job of experience) {
    lines.push(`${job.role} — ${job.company} (${job.period}, ${job.location})`);
    lines.push(job.headline);
    lines.push(job.summary);
    lines.push(`${job.platform.label}: ${job.platform.positioning}`);
    for (const r of job.platform.responsibilities) lines.push(`- ${r}`);
    lines.push(`(The CredAssist360 AI initiative under this role is detailed in the PROJECTS section below.)`);
  }
  lines.push("");

  lines.push(`PROJECTS`);
  for (const p of projects) {
    lines.push(`## ${p.title}${p.date ? ` (${p.date})` : ""} — ${p.subtitle}`);
    lines.push(`Type: ${p.type === "professional" ? "Professional (built as part of Amar's role)" : "Personal project (self-directed, for learning and skill development)"}`);
    lines.push(`Context: ${p.context}`);
    if (p.status) lines.push(`Status: ${p.status}`);
    if (p.repoUrl) lines.push(`Repository: ${p.repoUrl}`);
    lines.push(`Positioning: ${p.positioning}`);
    lines.push(`Technology: ${p.technology.join(", ")}`);
    lines.push(`Capabilities: ${p.capabilities.join(", ")}`);
    lines.push(`Architecture flow: ${p.architecture.join(" -> ")}`);
    lines.push(`Problem: ${p.detail.problem}`);
    lines.push(`Solution: ${p.detail.solution}`);
    if (p.detail.ai) lines.push(`AI: ${p.detail.ai}`);
    if (p.detail.security) lines.push(`Security: ${p.detail.security}`);
    if (p.detail.database) lines.push(`Database: ${p.detail.database}`);
    if (p.detail.messaging) lines.push(`Messaging: ${p.detail.messaging}`);
    if (p.detail.deployment) lines.push(`Deployment: ${p.detail.deployment}`);
    if (p.detail.engineeringDecisions?.length) {
      lines.push(`Engineering decisions: ${p.detail.engineeringDecisions.join(" | ")}`);
    }
    lines.push("");
  }

  lines.push(`TECH STACK`);
  for (const cat of techStack) {
    lines.push(`${cat.category}: ${cat.items.join(", ")}`);
  }
  lines.push("");

  lines.push(`AI TECHNOLOGIES`);
  lines.push(aiTechnologies.join(", "));
  lines.push("");

  lines.push(`ENGINEERING STRENGTHS`);
  for (const pillar of engineeringImpact) {
    lines.push(`${pillar.title}: ${pillar.description} (${pillar.tags.join(", ")})`);
  }
  lines.push("");

  lines.push(`CERTIFICATIONS`);
  for (const cert of certifications) {
    lines.push(`${cert.name} — ${cert.issuer} (issued ${cert.issued})`);
  }
  lines.push("");

  lines.push(`EDUCATION`);
  lines.push(`${education.institution}, ${education.degree}, ${education.period}, CGPA ${education.cgpa}`);
  lines.push("");

  lines.push(`CONTACT / SOCIALS`);
  lines.push(`GitHub: ${socials.github}`);
  lines.push(`LinkedIn: ${socials.linkedin}`);
  lines.push(`Phone: ${socials.phoneDisplay}`);

  return lines.join("\n");
}

export const AI_SYSTEM_PROMPT = `You are "Ask Amar AI", an assistant embedded in Amar Kumar's portfolio website.

Rules:
1. Answer ONLY using the VERIFIED PORTFOLIO CONTEXT provided below. Do not use outside knowledge about Amar.
2. Never invent companies, metrics, dates, technologies, or achievements that are not in the context.
3. If the answer is not present in the context, respond exactly with: "I don't have that information in Amar's portfolio."
4. Speak about Amar in the third person, in a concise, confident, technical tone.
5. Keep answers focused — a few sentences or a short list, not an essay.
6. You may summarize or connect facts already present in the context, but do not extrapolate beyond them.
7. Each project has a Type: "Professional" (built as part of Amar's job at Migun India) or "Personal project"
   (self-directed, for learning). Only CredAssist360 is professional — FitTrack, IntelliMail and FoodLoop are
   personal projects. Never imply a personal project was a work deliverable, and always make this distinction
   clear when asked about work experience, employer deliverables, or "what Amar built at his job."
8. If a project has a Status field (e.g. still in active development), mention that status when discussing it
   so it isn't presented as a finished, shipped product.

VERIFIED PORTFOLIO CONTEXT:
`;
