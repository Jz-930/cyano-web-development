import { Fragment, type ReactNode } from "react";

/**
 * Renders inline `**bold**` markers from approved copy-new strings as `<strong>`.
 */
export function renderBold(text: string, strongClass?: string): ReactNode {
  if (!text.includes("**")) return text;
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, idx) =>
    idx % 2 === 1 ? (
      <strong key={idx} className={strongClass}>
        {part}
      </strong>
    ) : part ? (
      <Fragment key={idx}>{part}</Fragment>
    ) : null,
  );
}

/**
 * Renders `≠` statements (`06` §3.1) wrapping `≠` in `<b>≠</b>` while also supporting `**bold**`.
 */
export function renderNotEqual(text: string): ReactNode {
  const renderEq = (segment: string, keyPrefix: string): ReactNode => {
    if (!segment.includes("≠")) return segment;
    const chunks = segment.split("≠");
    return chunks.map((chunk, i) => (
      <Fragment key={`${keyPrefix}-${i}`}>
        {chunk}
        {i < chunks.length - 1 ? <b>≠</b> : null}
      </Fragment>
    ));
  };

  if (!text.includes("**")) {
    return renderEq(text, "eq");
  }
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, idx) =>
    idx % 2 === 1 ? (
      <strong key={idx}>{renderEq(part, `b-${idx}`)}</strong>
    ) : part ? (
      <Fragment key={idx}>{renderEq(part, `t-${idx}`)}</Fragment>
    ) : null,
  );
}
