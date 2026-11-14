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
      className={`mk-scene mk-scene-property${size === "full" ? " is-split" : ""}`}
    >
      {size === "full" ? (
        <div className="mk-prop-feed">
          {tags.map((tag, idx) => (
            <div key={idx} className="mk-panel mk-msg-row">
              <span className="mk-avatar-dot" aria-hidden="true" />
              <div className="mk-msg-lines">
                <span className="mk-skel mk-w-92" />
                <span className="mk-skel mk-w-64" />
              </div>
              {tag ? (
                <span className="mk-fee-tag">{tag}</span>
              ) : (
                <span className="mk-skel mk-w-28" />
              )}
            </div>
          ))}
        </div>
      ) : null}

      <div className="mk-paper mk-prop-summary">
        <div className="mk-prop-head">
          <span className="mk-prop-label">
            {summary ?? <span className="mk-skel mk-w-40" />}
          </span>
          <span className="mk-skel mk-w-40 mk-h-10" />
        </div>
        <div className="mk-prop-rows">
          {tags.map((tag, idx) => (
            <div key={idx} className="mk-bar-row">
              <span className="mk-bar-name">
                {tag ?? <span className="mk-skel mk-w-40" />}
              </span>
              <span className="mk-bar-track" aria-hidden="true">
                <span
                  className="mk-bar-fill"
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
