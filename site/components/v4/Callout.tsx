import type { CSSProperties } from "react";

export type CalloutProps = {
  n: number;
  x: number;
  y: number;
  label?: string;
  showLabel?: boolean;
  active?: boolean;
  onHover?: (n: number | null) => void;
};

export function Callout({
  n,
  x,
  y,
  label,
  showLabel = false,
  active = false,
  onHover,
}: CalloutProps) {
  const side = x > 64 ? "left" : "right";
  return (
    <span
      className="callout"
      style={{ "--x": `${x}%`, "--y": `${y}%` } as CSSProperties}
      data-n={n}
      data-side={side}
      data-active={active ? "true" : undefined}
      onPointerEnter={onHover ? () => onHover(n) : undefined}
      onPointerLeave={onHover ? () => onHover(null) : undefined}
    >
      <span className="callout-dot">{n}</span>
      {showLabel && label ? (
        <>
          <span className="callout-line" aria-hidden="true" />
          <span className="callout-label">{label}</span>
        </>
      ) : null}
    </span>
  );
}
