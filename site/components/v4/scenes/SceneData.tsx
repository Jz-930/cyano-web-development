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
      <span key={idx} className="mk-sql-kw">
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
    <div className="mk-scene mk-scene-data">
      <div className="mk-panel mk-search-bar">
        <Search size={16} aria-hidden="true" />
        {question ? <span>{question}</span> : <span className="mk-skel mk-w-64" />}
      </div>

      {size === "full" ? (
        <div className="mk-data-mid">
          <span className="mk-core mk-core-inline" aria-hidden="true" />
          <pre className="mk-panel mk-sql">
            <code>{renderHighlightedSql(sql)}</code>
          </pre>
        </div>
      ) : null}

      <div className="mk-paper mk-bar-table">
        {visibleBars.map((row) => (
          <div key={row.name} className="mk-bar-row">
            <span className="mk-bar-name">{row.name}</span>
            <span className="mk-bar-track" aria-hidden="true">
              <span
                className="mk-bar-fill"
                style={{ width: `${Math.round(row.ratio * 100)}%` }}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
