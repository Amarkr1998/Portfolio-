export default function ArchitectureFlow({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-[var(--fill-subtle)] p-4">
      {steps.map((step, i) => (
        <span key={step} className="flex items-center gap-2">
          <span className="text-[0.68rem] font-mono text-foreground/80 px-2 py-1 rounded bg-[var(--surface)] border border-border">
            {step}
          </span>
          {i < steps.length - 1 && <span className="text-muted-2 text-xs">→</span>}
        </span>
      ))}
    </div>
  );
}
