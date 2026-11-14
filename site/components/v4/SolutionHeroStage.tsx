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
    <div className="sol-hero-stage" data-surface="dark">
      <div className="sol-inout-diagram">
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

        <div className="sol-inout-sources" aria-hidden="true">
          {sources.map((src, idx) => (
            <div key={idx} className="mk-panel sol-src-card">
              <span className="label">{`0${idx + 1}`}</span>
              {src ? (
                <span className="sol-src-text">{src}</span>
              ) : (
                <span className="mk-skel is-mid" />
              )}
            </div>
          ))}
        </div>

        <div className="sol-inout-core" aria-hidden="true">
          <div className="mk-core">
            <span className="mk-core-dot" />
            <span className="label">Cyano Core</span>
          </div>
        </div>

        <div className="sol-inout-output">
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
