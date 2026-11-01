// Conceptual previews. These are abstract compositions, explicitly labelled
// as such — never client screenshots, never real data or figures.

function PreviewFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-bg-alt shadow-[var(--shadow-md)]">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
        </div>
        <span className="annot truncate text-[0.6875rem]">{title}</span>
      </div>
      {children}
      <p className="annot border-t border-line px-4 py-2 text-[0.6875rem]">
        Conceptual preview · not a client screenshot · no real data
      </p>
    </div>
  );
}

const sk = "rounded-sm bg-[color-mix(in_srgb,var(--fg-2)_18%,transparent)]";

export function EsicPreview() {
  const filters = ["Date range", "FY", "RC", "State", "Hospital", "Top-N"];
  const kpis = ["Admissions", "Claims", "Settlements", "Deductions"];
  const kpiTones = ["var(--accent)", "var(--accent)", "var(--accent)", "var(--accent-2)"];
  const bars = [38, 56, 44, 72, 60, 84, 52, 66, 48, 76];

  return (
    <PreviewFrame title="Healthcare dashboard · concept">
      <div className="space-y-4 p-4 sm:p-5" aria-hidden="true">
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f, i) => (
            <span
              key={f}
              className={`rounded-sm border px-2 py-1 font-mono text-[0.6875rem] tracking-wide ${
                i === 1 ? "border-[var(--line-accent)] text-accent" : "border-line text-fg-2"
              }`}
            >
              {f}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {kpis.map((k, i) => (
            <div key={k} className="rounded-md border border-line bg-surface p-2.5" style={{ boxShadow: `inset 0 2px 0 ${kpiTones[i]}` }}>
              <p className="truncate text-[0.6875rem] text-fg-2">{k}</p>
              <div
                className="mt-2 h-3.5 rounded-sm"
                style={{ width: `${52 + i * 9}%`, background: `color-mix(in srgb, ${kpiTones[i]} 30%, transparent)` }}
              />
            </div>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-[1.5fr_1fr]">
          <div className="rounded-md border border-line bg-surface p-3">
            <p className="text-[0.6875rem] text-fg-2">Claims by period</p>
            <div className="mt-3 flex h-24 items-end gap-1.5">
              {bars.map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-t-[2px]"
                  style={{
                    height: `${h}%`,
                    background:
                      i === 5
                        ? "var(--accent)"
                        : "color-mix(in srgb, var(--accent) 28%, transparent)",
                  }}
                />
              ))}
            </div>
          </div>
          <div className="rounded-md border border-line bg-surface p-3">
            <p className="text-[0.6875rem] text-fg-2">Top-N hospitals</p>
            <ol className="mt-3 space-y-2">
              {[88, 72, 60, 46].map((w, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-3 font-mono text-[0.625rem] text-fg-3">{i + 1}</span>
                  <span className={`h-2 ${sk}`} style={{ width: `${w}%` }} />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}

export function CredPreview() {
  const stages = [
    { name: "Provider onboarding", who: "Provider", tone: "var(--fg-2)" },
    { name: "Document processing", who: "Spring AI · Azure OpenAI", tone: "var(--accent-2)" },
    { name: "Primary Source Verification", who: "External services", tone: "var(--accent)" },
    { name: "Human-in-the-Loop review", who: "Reviewer decision", tone: "var(--teal)" },
  ];

  return (
    <PreviewFrame title="Credentialing workflow · concept">
      <ol className="relative space-y-2.5 p-4 sm:p-5" aria-hidden="true">
        <span className="absolute bottom-9 left-[1.85rem] top-9 w-px bg-line-strong sm:left-[2.1rem]" />
        {stages.map((s, i) => (
          <li key={s.name} className="relative flex items-center gap-3 rounded-md border border-line bg-surface p-2.5">
            <span
              className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-bg-alt font-mono text-[0.625rem]"
              style={{ borderColor: s.tone, color: s.tone }}
            >
              {i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.8125rem] font-medium text-fg">{s.name}</span>
              <span className="block truncate text-[0.6875rem] text-fg-2">{s.who}</span>
            </span>
            <span className="hidden h-2 w-14 rounded-sm sm:block" style={{ background: `color-mix(in srgb, ${s.tone} 30%, transparent)` }} />
          </li>
        ))}
      </ol>
    </PreviewFrame>
  );
}
