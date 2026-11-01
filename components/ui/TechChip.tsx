import type { CSSProperties } from "react";
import { techTone, toneVar } from "@/lib/tones";

// The one chip used for technologies site-wide: its dot carries the
// technology's category colour (see lib/tones.ts).
export default function TechChip({ name, className = "", as: Tag = "li" }: { name: string; className?: string; as?: "li" | "span" }) {
  return (
    <Tag className={`chip chip-tone ${className}`} style={{ "--tone": toneVar(techTone(name)) } as CSSProperties}>
      <span aria-hidden="true" className="chip-dot" />
      {name}
    </Tag>
  );
}
