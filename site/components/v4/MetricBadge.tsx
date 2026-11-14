import type { ReactNode } from "react";

export type MetricBadgeProps = {
  value: ReactNode;
  label: string;
  className?: string;
};

export function MetricBadge({ value, label, className }: MetricBadgeProps) {
  const cls = ["glass-badge", "metric-badge", className].filter(Boolean).join(" ");
  return (
    <div className={cls} data-surface="dark">
      <strong className="figure glow-number">{value}</strong>
      <span>{label}</span>
    </div>
  );
}
