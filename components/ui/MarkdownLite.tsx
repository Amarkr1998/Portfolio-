// Minimal, dependency-free renderer for the markdown an LLM answer
// realistically uses: **bold**, `code`, http(s) links, "- " / "1. " lists,
// "### " headings and paragraph breaks. Builds React elements directly —
// never touches dangerouslySetInnerHTML, so there's no HTML-injection surface.

import type { ReactNode } from "react";

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s)]+)/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text
    .split(INLINE)
    .filter(Boolean)
    .map((part, i) => {
      const key = `${keyPrefix}-${i}`;
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return (
          <strong key={key} className="font-semibold text-fg">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return (
          <code key={key} className="rounded bg-bg-alt px-1 py-0.5 font-mono text-[0.85em] text-fg">
            {part.slice(1, -1)}
          </code>
        );
      }
      const md = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/.exec(part);
      const href = md ? md[2] : /^https?:\/\//.test(part) ? part.replace(/[.,;:]+$/, "") : null;
      if (href) {
        return (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="link-u link-u-static break-all text-accent">
            {md ? md[1] : href.replace(/^https?:\/\/(www\.)?/, "")}
          </a>
        );
      }
      return <span key={key}>{part}</span>;
    });
}

const BULLET = /^[-•*]\s+/;
const NUMBERED = /^\d+[.)]\s+/;

export default function MarkdownLite({ text }: { text: string }) {
  // Group consecutive lines into blocks: list runs, headings, paragraphs.
  const lines = text.replace(/\r/g, "").split("\n");
  const blocks: { type: "ul" | "ol" | "h" | "p"; lines: string[] }[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      blocks.push({ type: "p", lines: [] });
      continue;
    }
    // An indented line under a list item continues that item (e.g. a
    // description or link beneath a bolded project name).
    const prev = blocks[blocks.length - 1];
    if (/^\s+/.test(raw) && prev && (prev.type === "ul" || prev.type === "ol") && prev.lines.length > 0 && !BULLET.test(line) && !NUMBERED.test(line)) {
      prev.lines[prev.lines.length - 1] += `\n${line}`;
      continue;
    }
    const type = BULLET.test(line) ? "ul" : NUMBERED.test(line) ? "ol" : /^#{1,4}\s+/.test(line) ? "h" : "p";
    const last = blocks[blocks.length - 1];
    if (last && last.type === type && type !== "h" && last.lines.length > 0) last.lines.push(line);
    else blocks.push({ type, lines: [line] });
  }

  return (
    <div className="space-y-2 break-words">
      {blocks
        .filter((b) => b.lines.length > 0)
        .map((block, bi) => {
          if (block.type === "h") {
            return (
              <p key={bi} className="pt-1 font-semibold text-fg">
                {renderInline(block.lines[0].replace(/^#{1,4}\s+/, ""), `${bi}`)}
              </p>
            );
          }
          if (block.type === "ul" || block.type === "ol") {
            const ordered = block.type === "ol";
            const List = ordered ? "ol" : "ul";
            return (
              <List key={bi} className="space-y-1">
                {block.lines.map((line, i) => (
                  <li key={i} className="flex gap-2">
                    {ordered ? (
                      <span className="min-w-4 shrink-0 font-mono text-xs leading-[1.6rem] text-fg-2">{i + 1}.</span>
                    ) : (
                      <span aria-hidden="true" className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-accent" />
                    )}
                    <span>
                      {line
                        .replace(ordered ? NUMBERED : BULLET, "")
                        .split("\n")
                        .map((part, pi) => (
                          <span key={pi} className={pi > 0 ? "mt-0.5 block text-fg-2" : undefined}>
                            {renderInline(part, `${bi}-${i}-${pi}`)}
                          </span>
                        ))}
                    </span>
                  </li>
                ))}
              </List>
            );
          }
          return (
            <p key={bi}>
              {block.lines.map((line, i) => (
                <span key={i}>
                  {renderInline(line, `${bi}-${i}`)}
                  {i < block.lines.length - 1 && <br />}
                </span>
              ))}
            </p>
          );
        })}
    </div>
  );
}
