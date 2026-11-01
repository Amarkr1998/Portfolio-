// Tracks whatever Vercel currently considers the production URL — the
// project's .vercel.app address by default, or a custom domain once one is
// attached — instead of hardcoding a domain that isn't owned yet. The
// fallback is the project's existing Vercel deployment.
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://portfolio-ten-omega-40sz2fb2ue.vercel.app";

export const SITE_TITLE = "Amar Kumar — Java Full Stack Developer";
export const SITE_DESCRIPTION =
  "Java Full Stack Developer in New Delhi building enterprise healthcare applications with Java, Spring Boot, React.js, SQL and REST APIs, and integrating AI with Spring AI and Azure OpenAI.";
