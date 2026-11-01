"use client";

import { useState, type CSSProperties } from "react";
import { evidenceLabels, projectTitle, skillGroups, skillRepos, tools, type Evidence } from "@/data/portfolio";
import { toneVar, type Tone } from "@/lib/tones";

const FILTERS: (Evidence | "all")[] = ["all", "esic", "migun", "credassist"];

export default function ExpertiseExplorer() {
  const [filter, setFilter] = useState<Evidence | "all">("all");

  const matches = (evidence?: Evidence[]) => filter === "all" || Boolean(evidence?.includes(filter));
  const count = skillGroups.reduce((n, g) => n + g.skills.filter((s) => filter !== "all" && matches(s.evidence)).length, 0);

  return (
    <div>
      <div className="reveal flex flex-col gap-4 border-y border-line py-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Highlight skills by project" className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => {
            const pressed = filter === f;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={pressed}
                onClick={() => setFilter(f)}
                className={`btn btn-sm border ${
                  pressed
                    ? "border-[var(--line-accent)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-fg"
                    : "border-line text-fg-2 hover:border-line-strong hover:text-fg"
                }`}
              >
                {f === "all" ? "All skills" : evidenceLabels[f]}
              </button>
            );
          })}
        </div>
        <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-fg-2">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="inline-flex gap-0.5">
              {(["backend", "data", "ai"] as Tone[]).map((t) => (
                <span key={t} className="chip-dot" style={{ "--tone": toneVar(t) } as CSSProperties} />
              ))}
            </span>
            Used in professional work · colour = category
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="h-2 w-2 rounded-[2px] border border-fg-3" /> Resume skills list
          </span>
        </p>
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {filter === "all" ? "Showing all skills." : `Highlighting ${count} skills used in ${evidenceLabels[filter]}.`}
      </p>

      <dl className="divide-y divide-line">
        {skillGroups.map((group) => (
          <div
            key={group.id}
            style={{ "--tone": toneVar(group.id as Tone) } as CSSProperties}
            className="reveal grid gap-4 py-7 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[18rem_minmax(0,1fr)]"
          >
            <dt className="flex items-center gap-3 font-display text-lg font-semibold tracking-tight text-fg">
              <span aria-hidden="true" className="h-4 w-0.5 rounded-full bg-line-strong" />
              {group.title}
            </dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {group.skills.map((s) => {
                  const evidenced = Boolean(s.evidence?.length);
                  const dim = filter !== "all" && !matches(s.evidence);
                  return (
                    <li
                      key={s.name}
                      // Dimming uses the fg-3 token (still AA on these surfaces), not opacity.
                      className={`rounded-[var(--radius-sm)] border px-2.5 py-1.5 transition-[color,border-color,background-color] duration-200 ${
                        evidenced && !dim ? "border-line-strong bg-surface" : "border-dashed border-line"
                      } ${dim ? "text-fg-3" : "text-fg"} ${filter !== "all" && !dim ? "!border-[var(--line-accent)]" : ""}`}
                    >
                      <span className="flex items-center gap-2 text-sm">
                        <span
                          aria-hidden="true"
                          className={`h-1.5 w-1.5 shrink-0 rounded-[2px] ${evidenced ? "bg-[var(--tone)]" : "border border-fg-3"}`}
                        />
                        {s.name}
                      </span>
                      {evidenced && (
                        <span className={`mt-0.5 block pl-3.5 font-mono text-[0.6875rem] tracking-wide ${dim ? "text-fg-3" : "text-fg-2"}`}>
                          <span className="sr-only">Used in: </span>
                          {s.evidence!.map((e) => evidenceLabels[e]).join(" · ")}
                        </span>
                      )}
                      {!evidenced && skillRepos[s.name] && (
                        <span className={`mt-0.5 block pl-3.5 font-mono text-[0.6875rem] tracking-wide ${dim ? "text-fg-3" : "text-fg-2"}`}>
                          <span className="sr-only">Independent projects: </span>
                          GitHub · {skillRepos[s.name].slice(0, 2).map(projectTitle).join(", ")}
                          {skillRepos[s.name].length > 2 ? ` +${skillRepos[s.name].length - 2}` : ""}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </dd>
          </div>
        ))}
        <div className="reveal grid gap-4 py-7 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <dt className="font-display text-lg font-semibold tracking-tight text-fg">Everyday tools</dt>
          <dd className="text-fg-2">{tools.join(" · ")}</dd>
        </div>
      </dl>
    </div>
  );
}
