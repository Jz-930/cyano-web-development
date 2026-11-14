"use client";
import { useState, useEffect, useRef, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ArrowRight, ChevronDown, Menu, X, Plus, Minus, ChevronLeft, ChevronRight, Check, LoaderCircle, Send, Globe, ShieldCheck, Search, Database } from "lucide-react";
import { type Locale, t, href } from "@/lib/locale";
import type { CaseStudy, solutions } from "@/lib/content-v4";
import { Logo, solutionIcons } from "./client-shared";
type LocalCopy = Record<string,Record<string,string>>;
export function CaseFilters({ locale, caseItems,cards }: { locale: Locale; caseItems: Pick<CaseStudy,"slug"|"industry">[];cards: ReactNode[] }) {
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("industry");
    if (p) setFilter(p);
  }, []);
  const all = caseItems;
  const select = (v: string) => {
    setFilter(v);
    const url = new URL(window.location.href);
    v === "all"
      ? url.searchParams.delete("industry")
      : url.searchParams.set("industry", v);
    window.history.replaceState(null, "", url);
  };
  const visible = filter === "all" ? all : all.filter((c) => c.slug === filter);
  return (
    <>
      <div
        className="filter-row"
        aria-label={t(locale, "按行业筛选案例", "Filter cases by industry")}
      >
        <button onClick={() => select("all")} aria-pressed={filter === "all"}>
          {t(locale, "全部案例", "All cases")} <small>06</small>
        </button>
        {all.map((c) => (
          <button
            key={c.slug}
            aria-pressed={filter === c.slug}
            onClick={() => select(c.slug)}
          >
            {c.industry}
          </button>
        ))}
      </div>
      <div className="case-grid">
        {visible.map((c) => (
          <div key={c.slug}>{cards[all.findIndex(item=>item.slug===c.slug)]}</div>
        ))}
      </div>
      {visible.length === 0 && (
        <div className="empty-state">
          <p>
            {t(locale, "没有符合筛选的案例。", "No cases match this filter.")}
          </p>
          <button className="button" onClick={() => select("all")}>
            {t(locale, "查看全部案例", "View all cases")}
          </button>
        </div>
      )}
    </>
  );
}
