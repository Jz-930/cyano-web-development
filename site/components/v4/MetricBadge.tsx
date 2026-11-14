import type { ReactNode } from "react";

export type MetricBadgeProps = {
  value: ReactNode;
  label: string;
  className?: string;
  glass?: boolean;
  glow?: boolean;
};

export function MetricBadge({
  value,
  label,
  className,
  glass = true,
  glow = true,
}: MetricBadgeProps) {
  const cls = [
    glass ? "glass-badge" : "metric-badge-solid",
    "metric-badge",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls} data-surface="dark">
      <strong className={glow ? "figure glow-number" : "figure"}>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
