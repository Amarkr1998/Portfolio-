// Minimal, dependency-free renderer for the handful of markdown constructs
// an LLM answer realistically uses: **bold**, "- " bullet lines, and
// paragraph breaks. Builds React elements directly — never touches
// dangerouslySetInnerHTML, so there's no HTML-injection surface.

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

export default function MarkdownLite({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);

  return (
    <div className="space-y-2">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").filter((l) => l.trim().length > 0);
        const isList = lines.length > 0 && lines.every((l) => /^[-•]\s+/.test(l.trim()));

        if (isList) {
          return (
            <ul key={blockIndex} className="space-y-1 list-none">
              {lines.map((line, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
                  <span>{renderInline(line.replace(/^[-•]\s+/, ""), `${blockIndex}-${i}`)}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={blockIndex}>
            {lines.map((line, i) => (
              <span key={i}>
                {renderInline(line, `${blockIndex}-${i}`)}
                {i < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
