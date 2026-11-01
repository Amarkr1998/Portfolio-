"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  evidenceDetails,
  evidenceLabels,
  githubProfile,
  projectTitle,
  repoUrl,
  skillGroups,
  skillRepos,
  type Evidence,
} from "@/data/portfolio";
import { TONES, WORK_TONE, toneVar } from "@/lib/tones";
import s from "./stackmap.module.css";

// ---------------------------------------------------------------------------
// Layout — deterministic, computed once at module load so server and client
// render identical SVG.
//
// Ring: every skill with professional evidence, plus the whole AI group.
// Hubs: the three professional bodies of work, plus one "GitHub projects"
// hub for independent work. Solid lines = professional use; dashed lines
// (shown on hover) = independent use, per data/portfolio.ts `skillRepos`.
// ---------------------------------------------------------------------------

const CX = 450;
const CY = 360;
const R = 236; // technology ring
const HUB_R = 120; // hubs

type HubId = Evidence | "github";

// Category and hub colours come from the site-wide standard (lib/tones.ts):
// skill group ids are the tone names, in colour-wheel order around the ring.
const GROUP_TONE: Record<string, string> = Object.fromEntries(TONES.map((t) => [t, toneVar(t)]));

const ARC_TITLE: Record<string, string> = {
  backend: "Backend",
  frontend: "Frontend",
  data: "Data",
  security: "Security",
  ai: "AI",
  cloud: "Delivery",
  testing: "Testing",
};

const SHORT: Record<string, string> = {
  "Human-in-the-Loop workflows": "HITL review",
  "Azure Container Apps": "Container Apps",
  "Azure Blob Storage": "Blob Storage",
};

const HUB_LABEL: Record<HubId, string> = { ...evidenceLabels, github: "GitHub projects" };
const HUB_TONE: Record<HubId, string> = {
  esic: toneVar(WORK_TONE.esic),
  migun: toneVar(WORK_TONE.migun),
  credassist: toneVar(WORK_TONE.credassist),
  github: toneVar(WORK_TONE.github),
};

// Rounded so server (Node) and browser trig agree to the digit — otherwise
// hydration sees mismatched attributes.
const r2 = (n: number) => Math.round(n * 100) / 100;
const rad = (deg: number) => (deg * Math.PI) / 180;

const HUB_ANGLE: Record<HubId, number> = { esic: -18, migun: 82, credassist: 172, github: 258 };
const HUBS = (Object.keys(HUB_ANGLE) as HubId[]).map((id) => ({
  id,
  x: r2(CX + HUB_R * Math.cos(rad(HUB_ANGLE[id]))),
  y: r2(CY + HUB_R * Math.sin(rad(HUB_ANGLE[id]))),
}));

type TechNode = {
  id: string;
  name: string;
  label: string;
  groupTitle: string;
  tone: string;
  evidence: Evidence[];
  repos: string[];
  resumeOnly: boolean;
  angle: number;
  x: number;
  y: number;
  lx: number;
  ly: number;
  anchor: "start" | "end";
  rotate: number | null; // radial labels near the top and bottom
};

// Rough label width at the SVG font size, for fitting the viewBox.
const textW = (t: string) => t.length * 8.4;

const groups = skillGroups
  .map((g) => ({ ...g, skills: g.skills.filter((sk) => sk.evidence?.length || g.id === "ai") }))
  .filter((g) => g.skills.length);

const SLOT_COUNT = groups.reduce((n, g) => n + g.skills.length, 0) + groups.length; // one gap per group
const slotAngle = (slot: number) => -90 + (slot * 360) / SLOT_COUNT;

const TECHS: TechNode[] = [];
const ARCS: { id: string; title: string; tone: string; from: number; to: number }[] = [];
{
  let slot = 0;
  for (const g of groups) {
    const start = slot;
    for (const sk of g.skills) {
      const angle = slotAngle(slot);
      const a = rad(angle);
      const cos = Math.cos(a);
      const evidence = sk.evidence ?? [];
      const repos = skillRepos[sk.name] ?? [];
      TECHS.push({
        id: sk.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: sk.name,
        label: SHORT[sk.name] ?? sk.name,
        groupTitle: g.title,
        tone: GROUP_TONE[g.id] ?? "var(--accent)",
        evidence,
        repos,
        resumeOnly: evidence.length === 0 && repos.length === 0,
        angle,
        x: r2(CX + R * cos),
        y: r2(CY + R * Math.sin(a)),
        lx: r2(CX + (R + 17) * cos),
        ly: r2(CY + (R + 17) * Math.sin(a)),
        anchor: cos >= 0 ? "start" : "end",
        // Near the poles neighbouring horizontal labels would collide, so
        // those run outward along the radius instead.
        rotate: Math.abs(Math.sin(a)) > 0.8 ? r2(cos >= 0 ? angle : angle + 180) : null,
      });
      slot++;
    }
    ARCS.push({ id: g.id, title: ARC_TITLE[g.id] ?? g.title, tone: GROUP_TONE[g.id], from: slotAngle(start) - 4, to: slotAngle(slot - 1) + 4 });
    slot++; // gap
  }
}

const hubsOf = (t: TechNode): HubId[] => [...t.evidence, ...(t.repos.length ? (["github"] as const) : [])];
const techsOf = (h: HubId) => TECHS.filter((t) => hubsOf(t).includes(h));

// viewBox fitted to the outermost label so the map fills its frame.
const VIEW = (() => {
  let minX = CX - R;
  let maxX = CX + R;
  let minY = CY - R;
  let maxY = CY + R;
  for (const t of TECHS) {
    const a = rad(t.angle);
    const w = textW(t.label);
    const ex = t.rotate === null ? t.lx + (t.anchor === "start" ? w : -w) : CX + (R + 17 + w) * Math.cos(a);
    const ey = t.rotate === null ? t.ly : CY + (R + 17 + w) * Math.sin(a);
    minX = Math.min(minX, ex - 10);
    maxX = Math.max(maxX, ex + 10);
    minY = Math.min(minY, ey - 14);
    maxY = Math.max(maxY, ey + 14);
  }
  const pad = 14;
  return [Math.floor(minX - pad), Math.floor(minY - pad), Math.ceil(maxX - minX + pad * 2), Math.ceil(maxY - minY + pad * 2)].join(" ");
})();

const EDGES = TECHS.flatMap((t) =>
  hubsOf(t).map((h) => {
    const hub = HUBS.find((x) => x.id === h)!;
    // Curve bends toward the centre: control point is the midpoint pulled in.
    const cx = CX + ((hub.x + t.x) / 2 - CX) * 0.55;
    const cy = CY + ((hub.y + t.y) / 2 - CY) * 0.55;
    return {
      id: `${t.id}~${h}`,
      indie: h === "github",
      tone: t.tone,
      color: t.tone,
      d: `M${hub.x.toFixed(1)} ${hub.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${t.x.toFixed(1)} ${t.y.toFixed(1)}`,
    };
  })
);

// Dial ticks: one major tick per node slot, a minor tick between.
const TICKS = Array.from({ length: SLOT_COUNT * 2 }, (_, i) => {
  const a = rad(-90 + (i * 180) / SLOT_COUNT);
  const major = i % 2 === 0;
  const r1 = R - 7;
  const r2v = R - (major ? 1 : 4);
  return {
    major,
    x1: r2(CX + r1 * Math.cos(a)),
    y1: r2(CY + r1 * Math.sin(a)),
    x2: r2(CX + r2v * Math.cos(a)),
    y2: r2(CY + r2v * Math.sin(a)),
  };
});

function arcPath(r: number, fromDeg: number, toDeg: number, readable = false) {
  const p = (deg: number) => `${(CX + r * Math.cos(rad(deg))).toFixed(1)} ${(CY + r * Math.sin(rad(deg))).toFixed(1)}`;
  const large = toDeg - fromDeg > 180 ? 1 : 0;
  // Text on the lower half would run upside down along a clockwise arc, so
  // label paths there are drawn counter-clockwise.
  if (readable && Math.sin(rad((fromDeg + toDeg) / 2)) > 0.15) return `M${p(toDeg)} A${r} ${r} 0 ${large} 0 ${p(fromDeg)}`;
  return `M${p(fromDeg)} A${r} ${r} 0 ${large} 1 ${p(toDeg)}`;
}

// Rim: the ring drawn as short segments whose colour blends between the
// neighbouring categories' hues — a continuous colour wheel.
const RIM = (() => {
  const mids = ARCS.map((a) => ({ angle: (a.from + a.to) / 2, tone: a.tone }));
  const N = 144;
  return Array.from({ length: N }, (_, i) => {
    const from = -90 + (i * 360) / N;
    const to = from + 360 / N + 0.4; // slight overlap hides seams
    const mid = (from + to) / 2;
    // previous and next category midpoints around the circle
    let prev = mids[mids.length - 1];
    let next = mids[0];
    for (let k = 0; k < mids.length; k++) {
      const a = mids[k];
      const b = mids[(k + 1) % mids.length];
      const bAngle = k + 1 === mids.length ? b.angle + 360 : b.angle;
      const m = mid < mids[0].angle ? mid + 360 : mid;
      if (m >= a.angle && m <= bAngle) {
        prev = a;
        next = b;
        break;
      }
    }
    const span = (next.angle - prev.angle + 360) % 360 || 360;
    const pos = Math.round(((((mid - prev.angle) % 360) + 360) % 360 / span) * 100);
    return { from, to, color: `color-mix(in oklch, ${next.tone} ${Math.min(100, pos)}%, ${prev.tone})` };
  });
})();

// ---------------------------------------------------------------------------

type Active = { kind: "tech"; id: string } | { kind: "hub"; id: HubId } | null;

function onActivateKey(e: KeyboardEvent, fn: () => void) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn();
  }
}

function RepoLinks({ repos }: { repos: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {repos.map((r) => (
        <li key={r}>
          <a
            href={repoUrl(r)}
            target="_blank"
            rel="noopener noreferrer"
            className="chip transition-colors duration-200 hover:border-[var(--line-accent)] hover:text-fg"
          >
            {projectTitle(r)}
            <ArrowUpRight size={12} aria-hidden="true" />
            <span className="sr-only">(GitHub, opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function StackMap() {
  const [hovered, setHovered] = useState<Active>(null);
  const [pinned, setPinned] = useState<Active>(null);
  const [inView, setInView] = useState(false);
  const figRef = useRef<HTMLDivElement>(null);
  const active = hovered ?? pinned;

  // Draw the lines in once, the first time the map scrolls into view.
  useEffect(() => {
    const el = figRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const { techOn, hubOn, edgeOn } = useMemo(() => {
    const techOn = new Set<string>();
    const hubOn = new Set<HubId>();
    const edgeOn = new Set<string>();
    if (active?.kind === "tech") {
      const t = TECHS.find((x) => x.id === active.id)!;
      techOn.add(t.id);
      hubsOf(t).forEach((h) => {
        hubOn.add(h);
        edgeOn.add(`${t.id}~${h}`);
      });
    } else if (active?.kind === "hub") {
      hubOn.add(active.id);
      techsOf(active.id).forEach((t) => {
        techOn.add(t.id);
        edgeOn.add(`${t.id}~${active.id}`);
      });
    }
    return { techOn, hubOn, edgeOn };
  }, [active]);

  const hasActive = active !== null;
  const same = (a: Active, b: Active) => a?.kind === b?.kind && a?.id === b?.id;
  const togglePin = (a: Active) => setPinned((p) => (same(p, a) ? null : a));

  const activeTech = active?.kind === "tech" ? TECHS.find((t) => t.id === active.id) : undefined;
  const activeHub = active?.kind === "hub" ? active.id : undefined;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
      <div ref={figRef} className={`${s.frame} reg-marks ${inView ? s.inView : ""} ${hasActive ? s.hasActive : ""}`}>
        <span className={`${s.corner} left-4 top-3`}>Fig. 01 · Stack map</span>
        <span className={`${s.corner} right-4 top-3 hidden items-center gap-3 sm:flex`}>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="h-0.5 w-4 rounded-full bg-fg-2" /> Professional
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="w-4 border-t-2 border-dashed border-fg-2" /> GitHub
          </span>
        </span>

        <svg
          viewBox={VIEW}
          className="block h-auto w-full"
          role="group"
          aria-label="Stack map: technologies connected to the professional work and independent GitHub projects they were used in. Use Tab to move between nodes."
          onPointerLeave={() => setHovered(null)}
        >
          <defs>
            <radialGradient id="sm-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style={{ stopColor: "var(--accent)", stopOpacity: 0.26 }} />
              <stop offset="55%" style={{ stopColor: "var(--accent-2)", stopOpacity: 0.08 }} />
              <stop offset="100%" style={{ stopColor: "var(--accent-2)", stopOpacity: 0 }} />
            </radialGradient>
            <linearGradient id="sm-orbit" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" style={{ stopColor: "var(--accent)" }} />
              <stop offset="35%" style={{ stopColor: "var(--c-data)" }} />
              <stop offset="65%" style={{ stopColor: "var(--c-ai)" }} />
              <stop offset="100%" style={{ stopColor: "var(--c-cloud)" }} />
            </linearGradient>
            <filter id="sm-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="sm-logo-clip">
              <circle cx={CX} cy={CY} r={40} />
            </clipPath>
          </defs>

          {/* Instrument face: core light, guide rings, dial ticks */}
          <circle cx={CX} cy={CY} r={R - 8} fill="url(#sm-core)" />
          <circle cx={CX} cy={CY} r={R} className={s.ring} />
          {RIM.map((seg, i) => (
            <path key={i} d={arcPath(R, seg.from, seg.to)} className={s.rim} style={{ stroke: seg.color }} />
          ))}
          <circle cx={CX} cy={CY} r={R * 0.78} className={s.guide} />
          <circle cx={CX} cy={CY} r={HUB_R} className={s.ring} strokeDasharray="2 6" />
          <circle cx={CX} cy={CY} r={HUB_R * 0.62} className={s.guide} />
          {TICKS.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} className={t.major ? s.tickMajor : s.tick} />
          ))}

          {/* Category arcs */}
          {ARCS.map((a) => (
            <g key={a.id}>
              <path d={arcPath(R - 20, a.from, a.to)} className={s.arcGlow} style={{ stroke: a.tone }} />
              <path d={arcPath(R - 20, a.from, a.to)} className={s.arc} style={{ stroke: a.tone }} />
              <path id={`sm-arc-${a.id}`} d={arcPath(R - 32, a.from - 10, a.to + 10, true)} fill="none" />
              <text className={s.arcLabel} dy="-2">
                <textPath href={`#sm-arc-${a.id}`} startOffset="50%" textAnchor="middle">
                  {a.title}
                </textPath>
              </text>
            </g>
          ))}

          {/* Core → hubs */}
          {HUBS.map((h) => (
            <line key={h.id} x1={CX} y1={CY} x2={h.x} y2={h.y} className={`${s.spoke} ${hubOn.has(h.id) ? s.on : ""}`} />
          ))}

          {/* Edges: base line + flowing highlight. GitHub edges only show when active. */}
          {EDGES.map((e, i) => (
            <g
              key={e.id}
              className={`${e.indie ? s.indieEdge : s.edge} ${edgeOn.has(e.id) ? s.on : ""}`}
              style={{ ["--edge" as string]: e.color, ["--i" as string]: i }}
            >
              {e.indie ? (
                <path d={e.d} className={s.indieBase} />
              ) : (
                <path d={e.d} pathLength={1} className={s.edgeBase} />
              )}
              <path d={e.d} className={s.edgeFlow} />
            </g>
          ))}

          {/* Core: Amar's emblem */}
          <circle cx={CX} cy={CY} r={62} className={s.orbit} stroke="url(#sm-orbit)" />
          <circle cx={CX} cy={CY} r={48} className={s.coreRing} stroke="url(#sm-orbit)" />
          <image href="/logo.png" x={CX - 40} y={CY - 40} width={80} height={80} clipPath="url(#sm-logo-clip)" />

          {/* Hubs */}
          {HUBS.map((h) => {
            const count = techsOf(h.id).length;
            const label = HUB_LABEL[h.id];
            return (
              <g
                key={h.id}
                role="button"
                tabIndex={0}
                aria-pressed={same(pinned, { kind: "hub", id: h.id })}
                aria-label={`${label}: ${count} technologies. Press to pin.`}
                className={`${s.hub} ${h.id === "github" ? s.hubIndie : ""} ${hubOn.has(h.id) ? s.on : ""} ${activeHub === h.id ? s.active : ""}`}
                style={{ ["--tone" as string]: HUB_TONE[h.id] }}
                onPointerEnter={() => setHovered({ kind: "hub", id: h.id })}
                onFocus={() => setHovered({ kind: "hub", id: h.id })}
                onBlur={() => setHovered(null)}
                onClick={() => togglePin({ kind: "hub", id: h.id })}
                onKeyDown={(e) => onActivateKey(e, () => togglePin({ kind: "hub", id: h.id }))}
              >
                <circle cx={h.x} cy={h.y} r={34} className={s.hubHalo} />
                <circle cx={h.x} cy={h.y} r={24} className={s.hubDisc} />
                <text x={h.x} y={h.y + 6} className={s.hubCount}>
                  {count}
                </text>
                <text x={h.x} y={h.y + 44} className={s.hubLabel}>
                  {label}
                </text>
              </g>
            );
          })}

          {/* Technology nodes */}
          {TECHS.map((t) => {
            const where = t.resumeOnly
              ? "on the resume skills list, no project shown yet"
              : [
                  t.evidence.length ? `professional: ${t.evidence.map((e) => evidenceLabels[e]).join(", ")}` : "",
                  t.repos.length ? `${t.repos.length} GitHub projects` : "",
                ]
                  .filter(Boolean)
                  .join("; ");
            return (
              <g
                key={t.id}
                role="button"
                tabIndex={0}
                aria-pressed={same(pinned, { kind: "tech", id: t.id })}
                aria-label={`${t.name}, ${where}. Press to pin.`}
                className={`${s.tech} ${t.resumeOnly ? s.resumeOnly : ""} ${techOn.has(t.id) ? s.on : ""} ${activeTech?.id === t.id ? s.active : ""}`}
                style={{ ["--tone" as string]: t.tone }}
                onPointerEnter={() => setHovered({ kind: "tech", id: t.id })}
                onFocus={() => setHovered({ kind: "tech", id: t.id })}
                onBlur={() => setHovered(null)}
                onClick={() => togglePin({ kind: "tech", id: t.id })}
                onKeyDown={(e) => onActivateKey(e, () => togglePin({ kind: "tech", id: t.id }))}
              >
                {/* Generous invisible hit area */}
                <circle cx={t.x} cy={t.y} r={20} fill="transparent" />
                <circle cx={t.x} cy={t.y} r={16} className={s.techHalo} />
                <circle cx={t.x} cy={t.y} r={6.5} className={s.techDot} />
                <text
                  x={t.lx}
                  y={t.ly}
                  dy="0.35em"
                  textAnchor={t.anchor}
                  transform={t.rotate === null ? undefined : `rotate(${t.rotate} ${t.lx} ${t.ly})`}
                  className={s.techLabel}
                >
                  {t.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail panel */}
      <div
        className={`panel ${s.panel} relative overflow-hidden p-6 sm:p-7`}
        aria-live="polite"
        style={{ ["--tone" as string]: activeTech?.tone ?? (activeHub ? HUB_TONE[activeHub] : "var(--accent)") }}
      >
        {/* Accent bar + corner light take the active colour. */}
        <div aria-hidden="true" className={s.panelBar} />
        <div aria-hidden="true" className={s.panelGlow} />
        {activeTech ? (
          <div key={activeTech.id} className={s.panelIn}>
            <p className="annot" style={{ color: activeTech.tone }}>
              {activeTech.groupTitle}
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">{activeTech.name}</h3>

            {activeTech.resumeOnly ? (
              <p className="mt-3 text-sm text-fg-2">
                Listed on my resume&rsquo;s skills. No project on this site shows it yet, so there are no lines to
                trace.
              </p>
            ) : (
              <>
                {activeTech.evidence.length > 0 && (
                  <>
                    <p className="annot mt-5">Professional work</p>
                    <ul className="mt-2.5 space-y-2">
                      {activeTech.evidence.map((e) => (
                        <li key={e}>
                          <Link
                            href={evidenceDetails[e].href}
                            className="group flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-line bg-bg-alt px-4 py-2.5 transition-colors duration-200 hover:border-[var(--line-accent)]"
                          >
                            <span>
                              <span className="block font-medium text-fg">{evidenceDetails[e].title}</span>
                              <span className="block text-xs text-fg-2">{evidenceDetails[e].context}</span>
                            </span>
                            <ArrowRight size={15} aria-hidden="true" className="shrink-0 text-fg-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {activeTech.repos.length > 0 && (
                  <>
                    <p className="annot mb-2.5 mt-5">Independent projects · GitHub</p>
                    <RepoLinks repos={activeTech.repos} />
                  </>
                )}
              </>
            )}
          </div>
        ) : activeHub === "github" ? (
          <div key="github" className={s.panelIn}>
            <p className="annot text-[var(--tone)]">Independent work</p>
            <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">GitHub projects</h3>
            <p className="mt-1 text-sm text-fg-2">Self-directed, public repositories — not client or employer work.</p>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {techsOf("github").map((t) => (
                <li key={t.id} className="chip">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-[2px]" style={{ background: t.tone }} />
                  {t.name}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
              <a href="#projects" className="link-u link-u-static inline-flex items-center gap-1.5">
                See the projects <ArrowRight size={14} aria-hidden="true" />
              </a>
              <a href={githubProfile} target="_blank" rel="noopener noreferrer" className="link-u link-u-static inline-flex items-center gap-1.5">
                GitHub profile <ArrowUpRight size={14} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        ) : activeHub ? (
          <div key={activeHub} className={s.panelIn}>
            <p className="annot text-[var(--tone)]">Professional work</p>
            <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">{evidenceDetails[activeHub].title}</h3>
            <p className="mt-1 text-sm text-fg-2">{evidenceDetails[activeHub].context}</p>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {techsOf(activeHub).map((t) => (
                <li key={t.id} className="chip">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-[2px]" style={{ background: t.tone }} />
                  {t.name}
                </li>
              ))}
            </ul>
            <Link href={evidenceDetails[activeHub].href} className="link-u link-u-static mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
              {activeHub === "migun" ? "See the role" : "Read the case study"}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className={s.panelIn}>
            <p className="annot text-accent">Interactive</p>
            <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">Where each technology was used</h3>
            <p className="mt-2 text-sm text-fg-2">
              Hover or focus a technology to trace it to professional work (solid lines) and GitHub projects (dashed),
              or a hub to light up its whole stack. Click to pin a selection.
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-line pt-5">
              {HUBS.map((h) => (
                <div key={h.id}>
                  <dt className="text-xs text-fg-2">{HUB_LABEL[h.id]}</dt>
                  <dd className="mt-0.5 font-display text-2xl font-semibold text-fg">{techsOf(h.id).length}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-xs text-fg-2">mapped technologies per hub</p>
          </div>
        )}
        {pinned && (
          <button type="button" onClick={() => setPinned(null)} className="btn btn-ghost btn-sm relative mt-5 !px-2">
            Clear selection
          </button>
        )}
      </div>

      {/* Touch-friendly selector: SVG labels get small on narrow screens. */}
      <div className="lg:hidden">
        <p className="annot mb-3">Tap to trace</p>
        <ul className="flex flex-wrap gap-1.5">
          {HUBS.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                aria-pressed={same(pinned, { kind: "hub", id: h.id })}
                onClick={() => togglePin({ kind: "hub", id: h.id })}
                className={`chip min-h-9 font-medium ${same(pinned, { kind: "hub", id: h.id }) ? "!border-[var(--line-accent)] text-fg" : ""}`}
              >
                {HUB_LABEL[h.id]}
              </button>
            </li>
          ))}
          {TECHS.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                aria-pressed={same(pinned, { kind: "tech", id: t.id })}
                onClick={() => togglePin({ kind: "tech", id: t.id })}
                className={`chip min-h-9 ${t.resumeOnly ? "border-dashed" : ""} ${same(pinned, { kind: "tech", id: t.id }) ? "!border-[var(--line-accent)] text-fg" : ""}`}
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-[2px]" style={{ background: t.tone }} />
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
