import { ArrowRight } from "lucide-react";

export type TimeChipProps = {
  before: string | null | undefined;
  after: string | null | undefined;
  className?: string;
};

export function TimeChip({ before, after, className }: TimeChipProps) {
  if (!before || !after) return null;
  const cleanBefore = before.replaceAll("**", "").trim();
  const cleanAfter = after.replaceAll("**", "").trim();
  const cls = ["time-chip", className].filter(Boolean).join(" ");
  return (
    <span className={cls}>
      <span className="time-before">{cleanBefore}</span>
      <ArrowRight size={14} aria-hidden="true" />
      <strong className="time-after">{cleanAfter}</strong>
    </span>
  );
}
