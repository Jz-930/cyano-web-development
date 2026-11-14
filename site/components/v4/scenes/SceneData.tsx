import { Search } from "lucide-react";
import type { Locale } from "@/lib/locale";
import { dataDemoFirstGroup, mk } from "@/lib/mockups";

const SQL_KEYWORDS =
  /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|AS|SUM|AND|IN|BETWEEN|DESC|LIMIT)\b/g;

function renderHighlightedSql(sql: string) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  for (const match of sql.matchAll(SQL_KEYWORDS)) {
    const idx = match.index ?? 0;
    if (idx > lastIndex) {
      parts.push(sql.slice(lastIndex, idx));
    }
    parts.push(
      <span key={idx} className="mk-sql-kw [color:var(--ice)]">
        {match[0]}
      </span>,
    );
    lastIndex = idx + match[0].length;
  }
  if (lastIndex < sql.length) {
    parts.push(sql.slice(lastIndex));
  }
  return parts;
}

export function SceneData({
  locale,
  size,
}: {
  locale: Locale;
  size: "full" | "compact";
}) {
  const question = mk("data", "question", locale);
  const { sql, bars } = dataDemoFirstGroup(locale);
  const visibleBars = size === "compact" ? bars.slice(0, 4) : bars;

  return (
    <div className="mk-scene mk-scene-data [font-size:13px] [line-height:1.55] flex flex-col [gap:var(--sp-3)]">
      <div className="mk-panel mk-search-bar [background:var(--n1)] [border:1px_solid_var(--dark-line-soft)] flex items-center [gap:var(--sp-2)] [min-height:44px] [padding:0_var(--sp-3)] [color:var(--light)] [font-size:13px]">
        <Search size={16} aria-hidden="true" />
        {question ? <span>{question}</span> : <span className="mk-skel mk-w-64 block [border-radius:var(--r-chip)] [width:64%]" />}
      </div>

      {size === "full" ? (
        <div className="mk-data-mid flex items-center [gap:var(--sp-3)]">
          <span className="mk-core mk-core-inline [width:22px] [height:22px] inline-flex items-center [gap:var(--sp-2)] [padding:var(--sp-2)_var(--sp-3)] whitespace-nowrap shrink-0" aria-hidden="true" />
          <pre className="mk-panel mk-sql [background:var(--n1)] [border:1px_solid_var(--dark-line-soft)] m-0 [padding:var(--sp-3)] [flex:1] overflow-hidden [white-space:pre-wrap] [word-break:break-word] [font:500_13px/1.55_var(--mono)] [color:var(--on-dark)]">
            <code>{renderHighlightedSql(sql)}</code>
          </pre>
        </div>
      ) : null}

      <div className="mk-paper mk-bar-table [background:var(--p2)] [color:var(--ink)] [border-radius:var(--r-control)] grid [gap:var(--sp-2)] [flex:1]">
        {visibleBars.map((row) => (
          <div key={row.name} className="mk-bar-row grid [grid-template-columns:76px_minmax(0,1fr)] items-center [gap:var(--sp-3)] [font-size:13px] [color:var(--ink)]">
            <span className="mk-bar-name">{row.name}</span>
            <span className="mk-bar-track block [height:8px] [border-radius:var(--r-chip)] [background:var(--p3)] overflow-hidden" aria-hidden="true">
              <span
                className="mk-bar-fill block h-full [border-radius:var(--r-chip)] [background:var(--brand)]"
                style={{ width: `${Math.round(row.ratio * 100)}%` }}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
