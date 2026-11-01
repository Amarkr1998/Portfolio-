// The site's colour standard.
//
//   Neutrals (--bg, --surface, --fg, --line…) carry the interface.
//   Brand (--accent blue, --accent-2 violet) marks actions, links, focus and
//   a few key moments (hero phrase, active states).
//   Category hues (--c-*) appear only where colour is data — technology chip
//   dots, the stack map and the hero illustration:
//     backend blue · frontend sky · data teal · security & messaging amber
//     ai violet · cloud & delivery rose · testing slate
//
// Hues are CSS variables defined per theme in app/globals.css: muted, even in
// brightness, and each >= 4.5:1 as text on the site's surfaces.

import type { Evidence } from "@/data/portfolio";

export type Tone = "backend" | "frontend" | "data" | "security" | "ai" | "cloud" | "testing";

export const TONES: Tone[] = ["backend", "frontend", "data", "security", "ai", "cloud", "testing"];

export const toneVar = (t: Tone) => `var(--c-${t})`;

// Bodies of work on the stack map. GitHub is neutral slate: independent work
// is shown dashed and quiet, professional work in colour.
export const WORK_TONE: Record<Evidence | "github", Tone> = {
  esic: "backend",
  migun: "data",
  credassist: "ai",
  github: "testing",
};

// Keyword rules, checked in order (more specific first). Matching is on the
// lower-cased technology name.
const RULES: [Tone, string[]][] = [
  ["ai", ["spring ai", "openai", "rag", "agent", "langgraph", "llm", "autogen", "ollama", "human-in-the-loop", "hitl", "xgboost", "lightgbm", "shap", "mlflow", "ai"]],
  ["security", ["spring security", "oauth", "jwt", "keycloak", "rbac", "kafka", "rabbitmq"]],
  ["testing", ["junit", "mockito", "testcontainers", "integration testing", "testing"]],
  ["cloud", ["docker", "kubernetes", "helm", "terraform", "github actions", "container apps", "blob storage", "azure monitor", "cloudwatch", "ci/cd", "aws", "azure"]],
  ["data", ["sql", "mysql", "postgres", "pgvector", "postgis", "redis", "neo4j", "flyway"]],
  ["frontend", ["react", "javascript", "typescript", "next.js", "html", "css", "chrome extension", "electron", "streamlit", "vite"]],
  ["backend", ["java", "spring", "hibernate", "rest", "maven", "python", "fastapi", "microservices", "gateway", "discovery", "event-driven", "distributed"]],
];

// Keywords must start at a word boundary, so "rag" doesn't match "Storage".
const MATCHERS: [Tone, RegExp[]][] = RULES.map(([tone, keys]) => [
  tone,
  keys.map((k) => new RegExp(`(^|[^a-z0-9])${k.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}${k === "ai" ? "($|[^a-z])" : ""}`)),
]);

export function techTone(name: string): Tone {
  const n = name.toLowerCase();
  for (const [tone, res] of MATCHERS) {
    if (res.some((re) => re.test(n))) return tone;
  }
  return "backend";
}
