import type { Locale } from "@/lib/locale";
import { mk } from "@/lib/mockups";

const PROP_RATIOS = [0.78, 0.42, 0.28] as const;

export function SceneProperty({
  locale,
  size,
}: {
  locale: Locale;
  size: "full" | "compact";
}) {
  const tags = [1, 2, 3].map((n) => mk("property", `tag${n}`, locale));
  const summary = mk("property", "summary", locale);

  return (
    <div
      className={`mk-scene [font-size:13px] [line-height:1.55] mk-scene-property${size === "full" ? " is-split" : ""}`}
    >
      {size === "full" ? (
        <div className="mk-prop-feed grid [gap:var(--sp-2)]">
          {tags.map((tag, idx) => (
            <div key={idx} className="mk-panel mk-msg-row [background:var(--n1)] [border:1px_solid_var(--dark-line-soft)] flex items-center [gap:var(--sp-2)] [padding:var(--sp-3)]">
              <span className="mk-avatar-dot [width:10px] [height:10px] [border-radius:var(--q50)] [background:var(--cyan)] shrink-0" aria-hidden="true" />
              <div className="mk-msg-lines [flex:1] grid [gap:var(--sp-1)]">
                <span className="mk-skel mk-w-92 block [border-radius:var(--r-chip)] [width:92%]" />
                <span className="mk-skel mk-w-64 block [border-radius:var(--r-chip)] [width:64%]" />
              </div>
              {tag ? (
                <span className="mk-fee-tag [padding:2px_var(--sp-2)] [border-radius:var(--r-chip)] [background:var(--cyan-12)] [border:1px_solid_var(--cyan-40)] [color:var(--ice)] [font-size:13px] whitespace-nowrap">{tag}</span>
              ) : (
                <span className="mk-skel mk-w-28 block [border-radius:var(--r-chip)] [width:28%]" />
              )}
            </div>
          ))}
        </div>
      ) : null}

      <div className="mk-paper mk-prop-summary [background:var(--p2)] [color:var(--ink)] [border-radius:var(--r-control)] [padding:var(--sp-4)] flex flex-col justify-between [gap:var(--sp-3)]">
        <div className="mk-prop-head grid [gap:var(--sp-2)]">
          <span className="mk-prop-label [font-size:14px] [font-weight:500] [color:var(--ink)]">
            {summary ?? <span className="mk-skel mk-w-40 block [border-radius:var(--r-chip)] [width:40%]" />}
          </span>
          <span className="mk-skel mk-w-40 mk-h-10 block [border-radius:var(--r-chip)] [width:40%]" />
        </div>
        <div className="mk-prop-rows grid [gap:var(--sp-3)]">
          {tags.map((tag, idx) => (
            <div key={idx} className="mk-bar-row grid [grid-template-columns:76px_minmax(0,1fr)] items-center [gap:var(--sp-3)] [font-size:13px] [color:var(--ink)]">
              <span className="mk-bar-name">
                {tag ?? <span className="mk-skel mk-w-40 block [border-radius:var(--r-chip)] [width:40%]" />}
              </span>
              <span className="mk-bar-track block [height:8px] [border-radius:var(--r-chip)] [background:var(--p3)] overflow-hidden" aria-hidden="true">
                <span
                  className="mk-bar-fill block h-full [border-radius:var(--r-chip)] [background:var(--brand)]"
                  style={{ width: `${Math.round(PROP_RATIOS[idx] * 100)}%` }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
