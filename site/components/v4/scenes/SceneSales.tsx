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
  const answer = mk("sales", "a", locale);

  return (
    <div
      className={`mk-scene [font-size:13px] [line-height:1.55] mk-scene-sales${size === "full" ? " has-drawer" : ""}`}
    >
      <div className="mk-sales-chat flex flex-col [gap:var(--sp-3)]">
        <div className="mk-panel mk-chat-q [background:var(--n1)] [border:1px_solid_var(--dark-line-soft)] [padding:var(--sp-3)_var(--sp-4)] [color:var(--light)]">
          {q ? <p>{q}</p> : <span className="mk-skel mk-w-80 block [border-radius:var(--r-chip)] [width:80%]" />}
        </div>

        <div className="mk-paper mk-chat-a [background:var(--p2)] [color:var(--ink)] [border-radius:var(--r-control)] [padding:var(--sp-4)] grid [gap:var(--sp-3)] [flex:1]">
          {answer ? (
            <p className="mk-answer m-0 [font-size:13px] [line-height:1.65] [color:var(--ink)]">{answer}</p>
          ) : null}
          <ul className="mk-checklist list-none m-0 p-0 grid [gap:var(--sp-2)]">
            {rows.map((r, idx) => (
              <li key={idx}>
                <Check size={14} aria-hidden="true" />
                {r ? <span>{r}</span> : <span className="mk-skel mk-w-64 block [border-radius:var(--r-chip)] [width:64%]" />}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {size === "full" ? (
        <aside className="mk-panel mk-sales-drawer [background:var(--n1)] [border:1px_solid_var(--dark-line-soft)] [padding:var(--sp-3)] flex flex-col [gap:var(--sp-3)]">
          <div className="label mk-drawer-title">
            {drawer ?? <span className="mk-skel mk-w-40 block [border-radius:var(--r-chip)] [width:40%]" />}
          </div>
          <div className="mk-drawer-sources grid [gap:var(--sp-2)]">
            {[src1, src2].map((s, idx) => (
              <div key={idx} className="mk-drawer-src flex items-center [gap:var(--sp-2)] [font-size:13px] [color:var(--on-dark)]">
                <FileText size={13} aria-hidden="true" />
                {s ? <span>{s}</span> : <span className="mk-skel mk-w-64 block [border-radius:var(--r-chip)] [width:64%]" />}
              </div>
            ))}
          </div>
          <div className="mk-similar-card [margin-top:auto] [padding:var(--sp-2)] [border-radius:var(--r-control)] [background:var(--n2)] [border:1px_solid_var(--dark-line-soft)] grid [gap:var(--sp-2)]">
            <div className="mk-similar-swatch [height:44px] [border-radius:var(--r-control)] [background:linear-gradient(135deg,var(--deep),var(--cyan-22))]" aria-hidden="true" />
            <span className="mk-similar-name [font-size:13px] [color:var(--light)]">
              {similar ?? <span className="mk-skel mk-w-64 block [border-radius:var(--r-chip)] [width:64%]" />}
            </span>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
