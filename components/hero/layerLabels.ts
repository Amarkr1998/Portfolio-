// What each layer of the hero scene means, in Amar's verified stack
// (data/portfolio.ts). Shared by the 3D labels and the mobile key, and kept
// out of heroScene so it doesn't pull Three.js into the initial bundle.
export const LAYER_LABELS = [
  { id: "interface", name: "Interface", tech: "React.js dashboards" },
  { id: "apis", name: "APIs", tech: "REST APIs" },
  { id: "services", name: "Services", tech: "Java · Spring Boot" },
  { id: "data", name: "Data", tech: "SQL · MySQL · PostgreSQL" },
  { id: "ai", name: "AI", tech: "Spring AI · Azure OpenAI" },
] as const;
