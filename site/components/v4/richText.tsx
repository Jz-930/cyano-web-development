import type { ReactNode } from "react";

function renderNeqSegment(seg: string, keyPrefix: string): ReactNode {
  if (!seg.includes("≠")) return seg;
  const parts = seg.split("≠");
  const out: ReactNode[] = [];
  parts.forEach((p, idx) => {
    if (p) out.push(p);
    if (idx < parts.length - 1) {
      out.push(<b key={`${keyPrefix}-neq-${idx}`}>≠</b>);
    }
  });
  return out;
}

/**
 * Renders inline `**bold**` segments from approved copy entries as `<strong>`
 * and highlights `≠` as `<b>≠</b>` without altering any wording or punctuation.
 */
export function renderBold(input: string | null | undefined): ReactNode {
  if (!input) return null;
  if (!input.includes("**")) return renderNeqSegment(input, "r");
  const parts = input.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i}>{renderNeqSegment(part.slice(2, -2), `b${i}`)}</strong>
      );
    }
    return part ? renderNeqSegment(part, `t${i}`) : null;
  });
}
