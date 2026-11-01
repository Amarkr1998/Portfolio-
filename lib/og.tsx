import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

const C = {
  bg: "#080D19",
  fg: "#F2F6FC",
  fg2: "#A9B8CE",
  accent: "#5B9CFF",
  line: "rgba(169,184,206,0.16)",
};

// Amar's AK emblem, embedded at build time.
const LOGO_SRC = `data:image/png;base64,${readFileSync(join(process.cwd(), "public/logo.png")).toString("base64")}`;

// Social preview: large type, high contrast, readable as a small thumbnail.
export function renderOgImage({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 48,
          padding: "60px 72px",
          background: `radial-gradient(circle at 82% 45%, rgba(91,156,255,0.22), transparent 42%), radial-gradient(circle at 8% 100%, rgba(167,139,250,0.16), transparent 40%), ${C.bg}`,
          color: C.fg,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", maxWidth: 740 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 20, letterSpacing: 4, color: C.accent, textTransform: "uppercase" }}>{eyebrow}</span>
            <span style={{ marginTop: 14, fontSize: 30, fontWeight: 600 }}>Amar Kumar</span>
            <span style={{ fontSize: 22, color: C.fg2 }}>Java Full Stack Developer · New Delhi</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5 }}>{title}</span>
            <span style={{ fontSize: 26, color: C.fg2, lineHeight: 1.35 }}>{subtitle}</span>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {["Java", "Spring Boot", "React.js", "SQL", "Spring AI"].map((t) => (
              <span key={t} style={{ fontSize: 19, color: C.fg2, border: `1px solid ${C.line}`, borderRadius: 8, padding: "6px 12px" }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
        <img src={LOGO_SRC} width={300} height={300} alt="" style={{ flexShrink: 0 }} />
      </div>
    ),
    OG_SIZE
  );
}
