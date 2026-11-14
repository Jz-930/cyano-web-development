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
      <header className="mk-bar">
        <span className="label mk-system">{system}</span>
        {status ? (
          <span
            className="mk-status"
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
