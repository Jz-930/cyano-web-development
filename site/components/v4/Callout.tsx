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
      className="callout absolute [left:var(--x)] [top:var(--y)] [z-index:var(--z-stage)]"
      style={{ "--x": `${x}%`, "--y": `${y}%` } as CSSProperties}
      data-n={n}
      data-side={side}
      data-active={active ? "true" : undefined}
      onPointerEnter={onHover ? () => onHover(n) : undefined}
      onPointerLeave={onHover ? () => onHover(null) : undefined}
    >
      <span className="callout-dot grid [place-items:center] [width:22px] [height:22px] [border-radius:var(--r-chip)] [font:500_12px_/_1_var(--mono)] [color:var(--n1)] [transition:transform_var(--qtf),background-color_var(--qtf),box-shadow_var(--qtf)]">{n}</span>
      {showLabel && label ? (
        <>
          <span className="callout-line absolute [width:var(--sp-2)] [height:1px] [background:var(--cyan-40)]" aria-hidden="true" />
          <span className="callout-label absolute whitespace-nowrap [font:400_14px_/_1.35_var(--sans)] [color:var(--light)] [padding:var(--sp-1)_var(--sp-2)] [border-radius:var(--r-control)] [background:var(--n0-88)] [border:1px_solid_var(--dark-line)]">{label}</span>
        </>
      ) : null}
    </span>
  );
}
