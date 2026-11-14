import { Check, FileText } from "lucide-react";
import type { Locale } from "@/lib/locale";
import { mk } from "@/lib/mockups";

export function SceneSales({
  locale,
  size,
}: {
  locale: Locale;
  size: "full" | "compact";
}) {
  const q = mk("sales", "q", locale);
  const rows = [1, 2, 3].map((n) => mk("sales", `row${n}`, locale));
  const drawer = mk("sales", "drawer", locale);
  const src1 = mk("sales", "src1", locale);
  const src2 = mk("sales", "src2", locale);
  const similar = mk("sales", "similar", locale);

  return (
    <div
      className={`mk-scene mk-scene-sales${size === "full" ? " has-drawer" : ""}`}
    >
      <div className="mk-sales-chat">
        <div className="mk-panel mk-chat-q">
          {q ? <p>{q}</p> : <span className="mk-skel mk-w-80" />}
        </div>

        <div className="mk-paper mk-chat-a">
          <div className="mk-skel-group">
            <span className="mk-skel mk-w-92" />
            <span className="mk-skel mk-w-64" />
          </div>
          <ul className="mk-checklist">
            {rows.map((r, idx) => (
              <li key={idx}>
                <Check size={14} aria-hidden="true" />
                {r ? <span>{r}</span> : <span className="mk-skel mk-w-64" />}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {size === "full" ? (
        <aside className="mk-panel mk-sales-drawer">
          <div className="label mk-drawer-title">
            {drawer ?? <span className="mk-skel mk-w-40" />}
          </div>
          <div className="mk-drawer-sources">
            {[src1, src2].map((s, idx) => (
              <div key={idx} className="mk-drawer-src">
                <FileText size={13} aria-hidden="true" />
                {s ? <span>{s}</span> : <span className="mk-skel mk-w-64" />}
              </div>
            ))}
          </div>
          <div className="mk-similar-card">
            <div className="mk-similar-swatch" aria-hidden="true" />
            <span className="mk-similar-name">
              {similar ?? <span className="mk-skel mk-w-64" />}
            </span>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
