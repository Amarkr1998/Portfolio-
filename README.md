# Amar Kumar — Portfolio

A premium, animated portfolio for **Amar Kumar**, Java Full Stack Developer & AI Engineer.
Built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, GSAP and Lenis,
with a server-side "Ask Amar AI" assistant backed by Azure AI.

All professional content lives in [`data/portfolio.ts`](data/portfolio.ts) and is sourced
directly from Amar's resume — nothing fabricated. Update that file to change any content
on the site.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** — component/UI animation
- **GSAP** + **ScrollTrigger** — hero timeline & scroll storytelling
- **Lenis** — smooth scrolling
- **Lucide React** — icons

## Project structure

```
app/                 routes, layout, metadata, API route for the AI assistant
components/
  sections/           one component per page section
  providers/           Lenis, global UI state, ssr:false client-widget bundle
  ui/                   CommandPalette, CustomCursor, Magnetic, FlowDiagram, MarkdownLite
  ProjectCard.tsx / ProjectDetails.tsx
  AIAssistant.tsx       chat widget UI
  RecruiterView.tsx     fast recruiter-facing summary (Ctrl/Cmd+K → "Recruiter View")
  Footer.tsx
data/portfolio.ts     single source of truth for all resume-derived content
lib/
  azure-ai.ts           server-side Azure AI client (never imported client-side)
  portfolio-context.ts  builds the AI assistant's grounded context + system prompt
  rate-limit.ts         best-effort in-memory rate limiting for /api/ai/chat
hooks/                 useReducedMotion, useIsTouchDevice, useFocusTrap
```

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your Azure AI deployment details:

```bash
cp .env.example .env.local
```

```env
AZURE_AI_ENDPOINT=https://<your-resource>.openai.azure.com
AZURE_AI_API_KEY=<your-api-key>
AZURE_AI_DEPLOYMENT=<your-deployment-name>
AZURE_AI_API_VERSION=2024-06-01
```

`.env.local` is gitignored and never committed. The AI assistant is called exclusively
from the server (`app/api/ai/chat/route.ts`) — the API key is never sent to the browser.
If these variables are absent, the chat widget still renders but returns a clear
"not configured" message instead of erroring.

### 3. Run locally

```bash
npm run dev
```

Visit [http://localhost:3005](http://localhost:3005) (the dev/start scripts pin this port).

### 4. Build

```bash
npm run build
npm run start
```

### 5. Deploy to Vercel

1. Push this repository to GitHub.
2. Import it in [Vercel](https://vercel.com/new).
3. Add the same environment variables from `.env.local` under
   **Project Settings → Environment Variables**.
4. Deploy. No separate backend is required — the AI assistant runs as a Next.js
   server route on Vercel.

## Notes

- All animations respect `prefers-reduced-motion`.
- The custom cursor (with contextual VIEW/ASK/OPEN labels) and command palette
  (`⌘K` / `Ctrl+K`) are desktop-only.
- The AI assistant answers strictly from `data/portfolio.ts` — if something isn't in
  the data, it responds with "I don't have that information in Amar's portfolio."
  It streams responses, renders basic markdown, and is rate-limited and
  timeout-bounded server-side (`lib/rate-limit.ts`, `lib/azure-ai.ts`).
- "Recruiter View" (Navbar, mobile menu, or the command palette) gives a
  one-minute condensed summary of the profile for time-pressed recruiters.
