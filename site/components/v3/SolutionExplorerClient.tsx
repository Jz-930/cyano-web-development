"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EngineeringDiagram } from "./EngineeringDiagram";
import { type Locale, href, t } from "@/lib/locale";
import type { solutions } from "@/lib/content-v4";
import { useTabs } from "@/components/v4/useTabs";

export function SolutionExplorer({
  locale,
  solutionItems,
}: {
  locale: Locale;
  solutionItems: ReturnType<typeof solutions>;
}) {
  const items = solutionItems;
  const { selected, tabProps, panelProps, tablistRef, panelsRef } = useTabs(
    items.length,
    0,
  );

  return (
    <div className="solution-explorer" data-reveal="">
      <div
        ref={tablistRef}
        className="solution-list"
        role="tablist"
        aria-label={t(locale, "解决方案", "Solutions")}
      >
        <span className="tab-indicator" aria-hidden="true" />
        {items.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            {...tabProps(i)}
            aria-controls={"solution-panel-" + i}
            id={"solution-tab-" + i}
            className={selected === i ? "selected" : ""}
          >
            <span className="solution-number">0{i + 1}</span>
            <span>{s.name}</span>
            <ArrowUpRight size={25} />
          </button>
        ))}
      </div>
      <div ref={panelsRef} className="tab-panels">
        {items.map((s, i) => (
          <div
            key={s.slug}
            {...panelProps(i)}
            className={`solution-panel solution-panel-${i}`}
            id={"solution-panel-" + i}
            aria-labelledby={"solution-tab-" + i}
          >
            <div className="solution-panel-art">
              <EngineeringDiagram variant={i} />
            </div>
            <div className="solution-panel-copy">
              <h3>{s.promise}</h3>
              <p>{s.intro}</p>
              <div className="outputs">{s.outputs}</div>
              <Link
                className="text-link"
                href={href(locale, "/services/" + s.slug)}
              >
                {t(locale, "探索解决方案", "Explore solution")}
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
