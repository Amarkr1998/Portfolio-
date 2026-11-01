# Amar Kumar — Portfolio

Portfolio for **Amar Kumar**, Java Full Stack Developer (Enterprise Applications & AI
Integrations). Built with Next.js 16 (App Router), TypeScript and Tailwind CSS v4, with an
optional server-side "Ask Amar AI" assistant backed by Azure OpenAI.

All professional content lives in [`data/portfolio.ts`](data/portfolio.ts) and is taken from
the resume in [`public/resume/Amar_Kumar_Resume.pdf`](public/resume/Amar_Kumar_Resume.pdf).
No metrics, testimonials, repositories or availability claims are invented. To change content,
edit that one file — the pages, Recruiter View, structured data and the AI assistant's grounding
all read from it.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Hero, selected work, experience, expertise, about (education + certification), contact |
| `/work/esic-esis`, `/work/credassist360` | Case studies, statically generated from `caseStudies` |
| `/recruiter` | One-page Recruiter View (linked in the header, mobile menu, footer and command palette) |
| `/api/ai/chat` | `GET` → `{ configured }`; `POST` → streamed assistant answer |
| `/opengraph-image`, `/work/[slug]/opengraph-image`, `/icon`, `/apple-icon` | Generated social images and icons (AK monogram) |
| `/sitemap.xml`, `/robots.txt` | Generated from `lib/site.ts` |

## Stack and what each piece is for

- **Next.js 16 / React 19 / TypeScript** — Server Components by default; client components only
  for the header, theme toggle, hero pointer response, expertise filter, copy-email, command
  palette and AI panel.
- **Tailwind CSS v4** — design tokens live in [`app/globals.css`](app/globals.css) (colour for
  both themes, type, spacing, radii, shadows, motion).
- **Framer Motion** — dialog and menu transitions only.
- **CSS** — hover/focus states, the one-time hero entrance, and section reveals via scroll-driven
  animations (progressive enhancement: content is fully visible where unsupported).
- **Three.js** — the hero's WebGL scene (`components/hero/heroScene.ts`): lit glass layers,
  bloom, data packets and an AI core. Loaded with a dynamic import after the page is idle, so it
  is never in the initial bundle. It pauses offscreen and in hidden tabs, caps device pixel
  ratio, drops bloom on low-power devices, renders one still frame under reduced motion, and
  falls back to the CSS 3D sculpture (also the no-JS composition) if WebGL is unavailable.
- **Fonts** — Sora (headings), Geist (body), Geist Mono (labels) via `next/font`, self-hosted at
  build time.
- **lucide-react** — icons.

GSAP, Lenis and React Three Fiber were removed in the redesign: nothing needed them, and
Lenis's wheel hijacking conflicted with native scrolling. Three.js is used directly (no R3F).

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — only needed for Ask Amar AI
npm run dev                  # http://localhost:3005
```

```bash
npm run build && npm run start
npm run lint
npx tsc --noEmit
```

### Ask Amar AI (optional)

```env
AZURE_AI_ENDPOINT=https://<your-resource>.openai.azure.com
AZURE_AI_API_KEY=<your-api-key>
AZURE_AI_DEPLOYMENT=<your-deployment-name>
AZURE_AI_API_VERSION=2024-06-01
```

- Credentials and provider calls stay on the server ([`lib/azure-ai.ts`](lib/azure-ai.ts)).
- Without these variables the site works normally; the chat panel states that the assistant
  isn't configured and offers email instead.
- The route validates request shape, roles, per-role message length, history length and body
  size (64 KB), and enforces connect, read and overall timeouts. Closing the panel or pressing
  Stop cancels the request.
- Answers are grounded by a system prompt built from `data/portfolio.ts`
  ([`lib/portfolio-context.ts`](lib/portfolio-context.ts)). Prompting reduces but cannot
  guarantee off-context answers, so the UI labels responses as AI-generated.
- Logs contain only an error code — never visitor messages or upstream response bodies.
- **Rate limiting** ([`lib/rate-limit.ts`](lib/rate-limit.ts)) is in-memory and per instance. On
  Vercel, serverless instances don't share memory, so it limits bursts from one client to one
  instance rather than enforcing a global quota. For a hard limit, use a shared store (e.g.
  Upstash Redis or Vercel KV) or Vercel's firewall rate limiting.

## Deployment

Deploys to Vercel as-is. Add the Azure variables under **Project Settings → Environment
Variables** if you want the assistant. Canonical URLs, Open Graph URLs and the sitemap use
`VERCEL_PROJECT_PRODUCTION_URL` (set automatically by Vercel), falling back to the existing
deployment URL in [`lib/site.ts`](lib/site.ts). Update that fallback if you attach a custom domain
outside Vercel.

## Colour standard

Product-style restraint: neutrals carry the interface, one brand accent marks what matters, and
category colour appears only where colour *is* information.

| Layer | Tokens | Used for |
| --- | --- | --- |
| Neutrals | `--bg`, `--surface`, `--fg`, `--fg-2`, `--line` | Surfaces, text, borders, section numbering rules |
| Brand | `--accent` (blue), `--accent-2` (violet), `--teal` (sparingly) | Buttons, links, focus, active states, the hero phrase and illustration |
| Category (data) | `--c-*` in [`lib/tones.ts`](lib/tones.ts) | Technology chip dots, the stack map — never decoration |
| Status | `--danger` | Error states (AI assistant) |

- Technology names render with `<TechChip name="…" />`; `techTone()` picks the category dot.
- Category hues are muted and similar in brightness; each is at least 4.5:1 as text on the site's
  surfaces in both themes.

## Accessibility and motion

- Skip link, landmarks, one `h1` per page, visible focus states, labelled icon controls, 44px
  touch targets, sticky-header anchor offsets.
- Mobile menu, command palette and AI panel trap focus, close on Escape and restore focus.
- Theme follows the system preference until the visitor chooses; the choice persists and is
  applied before first paint.
- `prefers-reduced-motion`: no reveals, hero assembly, pulse, tilt or smooth scrolling; every
  feature and all content remain.
- Token colour pairs used for text and controls meet WCAG AA (4.5:1) in both themes.
