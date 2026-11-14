import type { ReactNode } from "react";
import { Check } from "lucide-react";

export type MockupWindowProps = {
  system: string;
  status?: string | null;
  statusTone?: "default" | "ok" | "review";
  size?: "full" | "compact";
  caption?: string | null;
  className?: string;
  children: ReactNode;
};

export function MockupWindow({
  system,
  status,
  statusTone = "default",
  size = "full",
  caption,
  className,
  children,
}: MockupWindowProps) {
  return (
    <figure
      className={`mk-window${className ? ` ${className}` : ""}`}
      data-size={size}
      data-surface="dark"
      aria-hidden="false"
    >
      {caption ? <figcaption className="sr-only">{caption}</figcaption> : null}
      <header className="mk-bar flex justify-between items-center [height:40px] [padding:0_var(--sp-3)] [border-bottom:1px_solid_var(--dark-line-soft)]">
        <span className="label mk-system [font-size:12px]">{system}</span>
        {status ? (
          <span
            className="mk-status [font:500_12px/1_var(--mono)] [padding:var(--sp-1)_var(--sp-2)] [border-radius:var(--r-chip)] [transition:color_var(--qtb),border-color_var(--qtb),background-color_var(--qtb)]"
            data-tone={statusTone !== "default" ? statusTone : undefined}
          >
            {statusTone === "review" ? (
              <Check size={10} aria-hidden="true" style={{ marginRight: 2, verticalAlign: "-1px" }} />
            ) : null}
            {status}
          </span>
        ) : null}
      </header>
      <div className="mk-body">{children}</div>
    </figure>
  );
}
