import { Check, FileText, FolderKanban, SlidersHorizontal } from "lucide-react";
import type { Locale } from "@/lib/locale";
import { mk } from "@/lib/mockups";

export type SceneCommonProps = {
  locale: Locale;
  size: "full" | "compact";
  step?: number;
  focusCite?: number | null;
  onCite?: (n: number | null) => void;
  showRail?: boolean;
  interactiveCites?: boolean;
};

const SOURCE_ICONS = [FileText, FolderKanban, SlidersHorizontal] as const;

export function SceneProposal({
  locale,
  size,
  step = 6,
  focusCite = null,
  onCite,
  showRail = true,
  interactiveCites = false,
}: SceneCommonProps) {
  const docTitle = mk("proposal", "docTitle", locale);
  const checksLabel = mk("proposal", "checks", locale);
  const paragraphs = (size === "compact" ? [1, 2] : [1, 2, 3]).map((n) => ({
    n,
    h: mk("proposal", `h${n}`, locale),
    s: mk("proposal", `s${n}`, locale),
  }));
  const sources = [1, 2, 3].map((n) => ({
    n,
    label: mk("proposal", `src${n}`, locale),
    Icon: SOURCE_ICONS[n - 1],
  }));

  const withRail = size === "full" && showRail;

  return (
    <div className={`mk-scene mk-scene-proposal${withRail ? " has-rail" : ""}`}>
      {withRail ? (
        <aside className="mk-panel mk-rail">
          {sources.map(({ n, label, Icon }) => (
            <div
              key={n}
              className="mk-rail-item"
              data-active={focusCite === n ? "true" : undefined}
            >
              <Icon size={14} aria-hidden="true" />
              <span className="mk-rail-name">
                {label ?? <span className="mk-skel mk-w-72" />}
              </span>
              <span className="mk-cite" data-active={focusCite === n ? "true" : undefined}>
                {n}
              </span>
            </div>
          ))}
        </aside>
      ) : null}

      <div className="mk-paper mk-doc">
        <div className="mk-doc-head">
          {docTitle ? (
            <strong className="mk-doc-title">{docTitle}</strong>
          ) : (
            <span className="mk-skel mk-w-40 mk-h-12" />
          )}
        </div>

        <div className="mk-doc-sections">
          {paragraphs.map(({ n, h, s }) => {
            const isActiveCite = focusCite === n;
            return (
              <div
                key={n}
                className={`mk-doc-sec mk-s${n}`}
                data-visible={step >= 3 ? "true" : "false"}
              >
                {h ? (
                  <div className="mk-sec-h">{h}</div>
                ) : (
                  <span className="mk-skel mk-w-40 mk-h-10" />
                )}
                {s ? (
                  <p className="mk-sec-p">
                    <span className={isActiveCite ? "mk-hl" : undefined}>{s}</span>
                    {interactiveCites ? (
                      <button
                        type="button"
                        className="mk-cite"
                        data-active={isActiveCite ? "true" : undefined}
                        data-motion="transform"
                        onPointerEnter={() => onCite?.(n)}
                        onPointerLeave={() => onCite?.(null)}
                        onFocus={() => onCite?.(n)}
                        onBlur={() => onCite?.(null)}
                      >
                        {n}
                      </button>
                    ) : (
                      <span
                        className="mk-cite"
                        data-active={isActiveCite ? "true" : undefined}
                      >
                        {n}
                      </span>
                    )}
                  </p>
                ) : (
                  <div className="mk-skel-group">
                    <span className="mk-skel mk-w-92" />
                    <span className="mk-skel mk-w-64" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mk-checks" data-done={step >= 4 ? "true" : "false"}>
          <span className="mk-checks-label">
            <span className="mk-checks-tick" aria-hidden="true">
              <Check size={10} aria-hidden="true" />
            </span>
            {checksLabel ?? <span className="mk-skel mk-w-40" />}
          </span>
          <span className="mk-checks-dots" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5, 6].map((k) => (
              <i
                key={k}
                className="mk-check-dot"
                style={{ "--k": k } as React.CSSProperties}
              />
            ))}
          </span>
          <span className="mk-checks-ratio">7/7</span>
        </div>
      </div>
    </div>
  );
}
