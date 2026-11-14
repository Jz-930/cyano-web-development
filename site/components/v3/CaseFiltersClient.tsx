"use client";

import { useEffect, useState, type ReactNode } from "react";
import { type Locale, t } from "@/lib/locale";
import type { CaseStudy } from "@/lib/content-v4";
import { useChipIndicator } from "@/components/v4/useChipIndicator";

export function CaseFilters({
  locale,
  caseItems,
  cards,
}: {
  locale: Locale;
  caseItems: Pick<CaseStudy, "slug" | "industry">[];
  cards: ReactNode[];
}) {
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("industry");
    if (p) setFilter(p);
  }, []);
  const all = caseItems;
  const groupRef = useChipIndicator(filter);

  const select = (v: string) => {
    setFilter(v);
    const url = new URL(window.location.href);
    if (v === "all") url.searchParams.delete("industry");
    else url.searchParams.set("industry", v);
    window.history.replaceState(null, "", url);
  };

  const visible =
    filter === "all" ? all : all.filter((c) => c.slug === filter);

  return (
    <>
      <div
        ref={groupRef}
        className="chip-group filter-row"
        role="group"
        aria-label={t(locale, "按行业筛选案例", "Filter cases by industry")}
      >
        <span className="chip-indicator" aria-hidden="true" />
        <button
          type="button"
          className="chip"
          onClick={() => select("all")}
          aria-pressed={filter === "all"}
        >
          <span>
            {t(locale, "全部案例", "All cases")} <small>06</small>
          </span>
        </button>
        {all.map((c) => (
          <button
            key={c.slug}
            type="button"
            className="chip"
            aria-pressed={filter === c.slug}
            onClick={() => select(c.slug)}
          >
            <span>{c.industry}</span>
          </button>
        ))}
      </div>
      <div className="case-grid">
        {visible.map((c) => (
          <div key={c.slug}>
            {cards[all.findIndex((item) => item.slug === c.slug)]}
          </div>
        ))}
      </div>
      {visible.length === 0 && (
        <div className="empty-state">
          <p>
            {t(locale, "没有符合筛选的案例。", "No cases match this filter.")}
          </p>
          <button
            type="button"
            className="button"
            onClick={() => select("all")}
          >
            {t(locale, "查看全部案例", "View all cases")}
          </button>
        </div>
      )}
    </>
  );
}
