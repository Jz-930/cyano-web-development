"use client";

import {
  startTransition,
  useEffect,
  useRef,
  useState,
  ViewTransition,
  type CSSProperties,
  type ReactNode,
} from "react";
import { t, type Locale } from "@/lib/locale";

export type FilterableCaseCard = {
  slug: string;
  industry: string;
  node: ReactNode;
};

export function CaseFilters({
  locale,
  cards,
  industries,
}: {
  locale: Locale;
  cards: FilterableCaseCard[];
  industries: string[];
}) {
  const [selected, setSelected] = useState<string>("");
  const [ready, setReady] = useState(false);
  const [indStyle, setIndStyle] = useState<CSSProperties>({});
  const groupRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const allOptions = ["", ...industries];
  const activeIdx = Math.max(0, allOptions.indexOf(selected));

  useEffect(() => {
    const update = () => {
      const btn = btnRefs.current[activeIdx];
      if (!btn) return;
      setIndStyle({
        "--ix": `${btn.offsetLeft}px`,
        "--iy": `${btn.offsetTop}px`,
        "--iw": `${btn.offsetWidth}px`,
        "--ih": `${btn.offsetHeight}px`,
      } as CSSProperties);
    };
    update();
    const raf = requestAnimationFrame(() => {
      update();
      setReady(true);
    });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
    };
  }, [activeIdx, locale]);

  const visible = cards.filter(
    (c) => !selected || c.industry === selected,
  );

  const selectIndustry = (next: string) => {
    startTransition(() => {
      setSelected(next);
    });
  };

  return (
    <div className="cases-filter-block flex flex-col [gap:var(--sp-7)]">
      <div
        ref={groupRef}
        className="chip-group cases-chips relative flex flex-wrap [gap:8px] [margin-bottom:var(--sp-1)]"
        data-ready={ready ? "true" : undefined}
        style={indStyle}
        role="group"
        aria-label={t(locale, "按行业筛选案例", "Filter cases by industry")}
      >
        <span className="chip-indicator absolute [left:0] [top:0] [height:var(--ih,36px)] [border-radius:var(--r-chip)] [background:var(--ink)] [z-index:0] pointer-events-none [width:var(--iw,0px)]" aria-hidden="true" />
        <button
          ref={(el) => {
            btnRefs.current[0] = el;
          }}
          type="button"
          className="chip"
          aria-pressed={!selected}
          onClick={() => selectIndustry("")}
        >
          <span>{t(locale, "全部案例", "All")}</span>
        </button>
        {industries.map((ind, idx) => (
          <button
            key={ind}
            ref={(el) => {
              btnRefs.current[idx + 1] = el;
            }}
            type="button"
            className="chip"
            aria-pressed={selected === ind}
            onClick={() => selectIndustry(ind)}
          >
            <span>{ind}</span>
          </button>
        ))}
      </div>

      <div className="cases-grid grid [grid-template-columns:repeat(2,minmax(0,1fr))] [@media(max-width:960px)]:[grid-template-columns:minmax(0,1fr)] [gap:var(--sp-6)]">
        {visible.map((card) => (
          <ViewTransition
            key={card.slug}
            name={`card-${card.slug}`}
            default="none"
          >
            {card.node}
          </ViewTransition>
        ))}
      </div>
    </div>
  );
}
