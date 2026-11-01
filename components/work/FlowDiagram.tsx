import type { CSSProperties } from "react";
import type { CaseStudy } from "@/data/portfolio";
import { techTone, toneVar } from "@/lib/tones";

// A sequence diagram of the layers a case study describes — explicitly
// marked conceptual, and never more detailed than the written evidence.
// Each node takes its technology's category colour (lib/tones.ts).
export default function FlowDiagram({ flow, fig }: { flow: CaseStudy["flow"]; fig: string }) {
  return (
    <figure className="reg-marks m-0 rounded-[var(--radius-lg)] border border-line bg-bg-alt p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="annot">Fig. {fig}</span>
        <span className="annot tone-text rounded-sm border border-line px-2 py-0.5">Conceptual</span>
      </div>

      <ol className="relative mt-6 grid gap-2.5">
        {flow.nodes.map((n, i) => (
          <li
            key={n.label}
            style={{ "--node": toneVar(techTone(n.label)) } as CSSProperties}
            className="relative grid grid-cols-[2rem_minmax(0,1fr)] items-stretch gap-3 sm:grid-cols-[2.5rem_minmax(0,1fr)]"
          >
            <div className="relative flex flex-col items-center" aria-hidden="true">
              <span className="z-10 mt-3 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--node)] bg-bg-alt font-mono text-[0.625rem] text-[var(--node)]">
                {i + 1}
              </span>
              {i < flow.nodes.length - 1 && <span className="absolute bottom-[-0.7rem] top-9 w-px bg-line-strong" />}
            </div>
            <div className="flex flex-col gap-0.5 rounded-[var(--radius-md)] border border-line bg-surface px-4 py-3 shadow-[inset_2px_0_0_var(--node)] sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <span className="font-medium text-fg">{n.label}</span>
              {n.detail && <span className="text-sm text-fg-2 sm:text-right">{n.detail}</span>}
            </div>
          </li>
        ))}
      </ol>

      <figcaption className="mt-6 border-t border-line pt-4 text-sm text-fg-2">
        <span className="font-medium text-fg">{flow.caption}.</span> {flow.note}
      </figcaption>
    </figure>
  );
}
