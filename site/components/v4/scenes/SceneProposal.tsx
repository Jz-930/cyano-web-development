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
    <div className={`mk-scene [font-size:13px] [line-height:1.55] mk-scene-proposal${withRail ? " has-rail" : ""}`}>
      {withRail ? (
        <aside className="mk-panel mk-rail [background:var(--n1)] [border:1px_solid_var(--dark-line-soft)] flex flex-col [gap:var(--sp-2)] [padding:var(--sp-3)]">
          {sources.map(({ n, label, Icon }) => (
            <div
              key={n}
              className="mk-rail-item flex items-center [gap:var(--sp-2)] [padding:var(--sp-2)] [border-radius:var(--r-control)] [font-size:13px]"
              data-active={focusCite === n ? "true" : undefined}
            >
              <Icon size={14} aria-hidden="true" />
              <span className="mk-rail-name [flex:1] min-w-0 [white-space:nowrap]">
                {label ?? <span className="mk-skel mk-w-72 block [border-radius:var(--r-chip)] [width:72%]" />}
              </span>
              <span className="mk-cite inline-flex items-center justify-center [margin-left:var(--sp-1)] [padding:1px_6px] [min-width:20px] [min-height:20px] [border-radius:var(--r-control)] [font:500_12px/1.3_var(--mono)]" data-active={focusCite === n ? "true" : undefined}>
                {n}
              </span>
            </div>
          ))}
        </aside>
      ) : null}

      <div className="mk-paper mk-doc [background:var(--p2)] [color:var(--ink)] [border-radius:var(--r-control)] flex flex-col justify-between">
        <div className="mk-doc-head">
          {docTitle ? (
            <strong className="mk-doc-title [font-size:16px] [font-weight:500] [color:var(--ink)]">{docTitle}</strong>
          ) : (
            <span className="mk-skel mk-w-40 mk-h-12 block [border-radius:var(--r-chip)] [width:40%]" />
          )}
        </div>

        <div className="mk-doc-sections grid">
          {paragraphs.map(({ n, h, s }) => {
            const isActiveCite = focusCite === n;
            return (
              <div
                key={n}
                className={`mk-doc-sec mk-s${n}`}
                data-visible={step >= 3 ? "true" : "false"}
              >
                {h ? (
                  <div className="mk-sec-h [font-size:13px] [font-weight:500] [color:var(--ink)] [margin-bottom:2px]">{h}</div>
                ) : (
                  <span className="mk-skel mk-w-40 mk-h-10 block [border-radius:var(--r-chip)] [width:40%]" />
                )}
                {s ? (
                  <p className="mk-sec-p m-0 [font-size:13px] [line-height:1.65]">
                    <span className={isActiveCite ? "mk-hl" : undefined}>{s}</span>
                    {interactiveCites ? (
                      <button
                        type="button"
                        className="mk-cite inline-flex items-center justify-center [margin-left:var(--sp-1)] [padding:1px_6px] [min-width:20px] [min-height:20px] [border-radius:var(--r-control)] [font:500_12px/1.3_var(--mono)]"
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
                        className="mk-cite inline-flex items-center justify-center [margin-left:var(--sp-1)] [padding:1px_6px] [min-width:20px] [min-height:20px] [border-radius:var(--r-control)] [font:500_12px/1.3_var(--mono)]"
                        data-active={isActiveCite ? "true" : undefined}
                      >
                        {n}
                      </span>
                    )}
                  </p>
                ) : (
                  <div className="mk-skel-group grid [gap:var(--sp-2)]">
                    <span className="mk-skel mk-w-92 block [border-radius:var(--r-chip)] [width:92%]" />
                    <span className="mk-skel mk-w-64 block [border-radius:var(--r-chip)] [width:64%]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mk-checks flex items-center justify-between [gap:var(--sp-3)] [padding-top:var(--sp-3)] [border-top:1px_solid_var(--line)] [font-size:13px] [color:var(--ink)]" data-done={step >= 4 ? "true" : "false"}>
          <span className="mk-checks-label inline-flex items-center [gap:var(--sp-2)]">
            <span className="mk-checks-tick [color:var(--link)] [font-weight:500]" aria-hidden="true">
              <Check size={10} aria-hidden="true" />
            </span>
            {checksLabel ?? <span className="mk-skel mk-w-40 block [border-radius:var(--r-chip)] [width:40%]" />}
          </span>
          <span className="mk-checks-dots inline-flex items-center [gap:var(--sp-1)]" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5, 6].map((k) => (
              <i
                key={k}
                className="mk-check-dot [width:6px] [height:6px] [border-radius:var(--q50)]"
                style={{ "--k": k } as React.CSSProperties}
              />
            ))}
          </span>
          <span className="mk-checks-ratio [font:500_13px/1_var(--mono)] [color:var(--link)] [transition:opacity_var(--qtb)]">7/7</span>
        </div>
      </div>
    </div>
  );
}
