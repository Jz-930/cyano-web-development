"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Locale } from "@/lib/locale";
import { caseMetaBySlug } from "@/lib/mockups";
import { mkInout } from "@/lib/mockups-extra";
import { ProvenanceLines } from "./ProvenanceLines";
import { ScaledSceneMockup } from "./scenes";

export function SolutionHeroStage({
  solutionSlug,
  caseSlug,
  locale,
  statsSlot,
}: {
  solutionSlug: string;
  caseSlug: string;
  locale: Locale;
  statsSlot: ReactNode;
}) {
  const [lineState, setLineState] = useState<"draw" | "flow" | "rest">("rest");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLineState("rest");
      return;
    }
    setLineState("draw");
    const t1 = window.setTimeout(() => setLineState("flow"), 700);
    const t2 = window.setTimeout(() => setLineState("rest"), 2200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  const meta = caseMetaBySlug(caseSlug, locale);
  const sources = ([1, 2, 3] as const).map((idx) =>
    mkInout(solutionSlug, idx, locale),
  );

  return (
    <div className="sol-hero-stage flex flex-col [gap:var(--sp-4)] w-full" data-surface="dark">
      <div className="sol-inout-diagram relative grid [grid-template-columns:minmax(112px,136px)_auto_minmax(0,350px)] [@media(max-width:1024px)]:[grid-template-columns:minmax(0,1fr)] [gap:var(--sp-4)] items-center [justify-content:end] [@media(max-width:1024px)]:[justify-items:stretch]">
        <ProvenanceLines
          viewBox="0 0 600 280"
          paths={[
            "M132 54 C 166 54, 172 140, 200 140",
            "M132 140 L 200 140",
            "M132 226 C 166 226, 172 140, 200 140",
            "M284 140 L 320 140",
          ]}
          surface="dark"
          state={lineState}
          className="sol-inout-lines"
        />

        <div className="sol-inout-sources relative [z-index:1] flex flex-col [@media(max-width:1024px)]:flex-row [gap:var(--sp-2)] [@media(max-width:1024px)]:flex-wrap" aria-hidden="true">
          {sources.map((src, idx) => (
            <div key={idx} className="mk-panel sol-src-card [background:var(--n1)] [border:1px_solid_var(--dark-line-soft)] flex flex-col [gap:var(--sp-1)] [padding:var(--sp-2)_var(--sp-3)] [border-radius:var(--r-control)] [@media(max-width:1024px)]:[flex:1_1_140px]">
              <span className="label">{`0${idx + 1}`}</span>
              {src ? (
                <span className="sol-src-text [font-size:13px] [line-height:1.35] [color:var(--ice)]">{src}</span>
              ) : (
                <span className="mk-skel is-mid block [border-radius:var(--r-chip)]" />
              )}
            </div>
          ))}
        </div>

        <div className="sol-inout-core relative [z-index:1] flex justify-center" aria-hidden="true">
          <div className="mk-core [width:22px] [height:22px] inline-flex items-center [gap:var(--sp-2)] [padding:var(--sp-2)_var(--sp-3)] whitespace-nowrap">
            <span className="mk-core-dot [width:7px] [height:7px] [border-radius:var(--r-chip)] [background:var(--cyan)]" />
            <span className="label">Cyano Core</span>
          </div>
        </div>

        <div className="sol-inout-output relative [z-index:1] w-full [max-width:350px] [@media(max-width:1024px)]:[max-width:100%]">
          <ScaledSceneMockup
            scene={meta.mockup}
            locale={locale}
            size="compact"
          />
        </div>
      </div>

      {statsSlot}
    </div>
  );
}
