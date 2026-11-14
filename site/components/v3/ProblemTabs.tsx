"use client";

import { type Locale, t } from "@/lib/locale";
import { useTabs } from "@/components/v4/useTabs";

export function ProblemTabs({
  locale,
  items,
}: {
  locale: Locale;
  items: { title: string; issue: string; answer: string }[];
}) {
  const { tabProps, panelProps, tablistRef, panelsRef } = useTabs(
    items.length,
    0,
  );

  return (
    <div className="problem-explorer" data-reveal="">
      <div
        ref={tablistRef}
        className="problem-tabs tablist-h"
        role="tablist"
        aria-label={t(locale, "实施中需要处理的问题", "Implementation")}
      >
        <span className="tab-indicator" aria-hidden="true" />
        {items.map((item, i) => (
          <button
            key={item.title}
            type="button"
            {...tabProps(i)}
            id={`problem-tab-${i}`}
            aria-controls={`problem-panel-${i}`}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {item.title}
          </button>
        ))}
      </div>
      <div ref={panelsRef} className="tab-panels">
        {items.map((item, i) => (
          <div
            key={item.title}
            {...panelProps(i)}
            id={`problem-panel-${i}`}
            className="problem-panel"
            aria-labelledby={`problem-tab-${i}`}
          >
            <h3>{item.title}</h3>
            <div className="problem-comparison">
              <div className="problem-before">
                <span>{t(locale, "目前的问题", "The problem")}</span>
                <p>{item.issue}</p>
              </div>
              <div className="problem-after">
                <span>Cyano Core</span>
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <noscript>
        <div className="problem-nojs">
          {items.slice(1).map((item) => (
            <section key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.issue}</p>
              <p>{item.answer}</p>
            </section>
          ))}
        </div>
      </noscript>
    </div>
  );
}
