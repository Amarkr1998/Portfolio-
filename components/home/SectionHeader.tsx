import type { ReactNode } from "react";

export default function SectionHeader({
  num,
  label,
  title,
  id,
  children,
}: {
  num: string;
  label: string;
  title: ReactNode;
  id: string;
  children?: ReactNode;
}) {
  return (
    <header className="reveal mb-12 grid gap-6 lg:mb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
      <div>
        <p className="section-label">
          <span className="num">{num}</span>
          <span>{label}</span>
        </p>
        <h2 id={id} className="display-lg mt-5 max-w-[20ch]">
          {title}
        </h2>
      </div>
      {children && <div className="max-w-[52ch] text-fg-2 lg:justify-self-end">{children}</div>}
    </header>
  );
}
