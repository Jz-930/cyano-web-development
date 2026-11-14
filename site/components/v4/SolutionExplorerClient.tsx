"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { href, t, type Locale } from "@/lib/locale";
import { mk, type SceneId } from "@/lib/mockups";
import { useTabs } from "./useTabs";
import { TimeChip } from "./TimeChip";
import { ProvenanceLines } from "./ProvenanceLines";
import { ScaledSceneMockup } from "./scenes";

export type SolutionTabItem = {
  slug: string;
  name: string;
  promise: string;
  intro: string;
  outputs: string;
  scene: SceneId;
  dept: string | null;
  before: string | null;
  after: string | null;
};

function pathsForInputCount(count: number): string[] {
  const coreY = 110;
  const inEndX = 25;
  const outStartX = 47;
  const winX = 70;
  const inPaths =
    count >= 3
      ? [
          `M2 44 C 15 44, 15 ${coreY}, ${inEndX} ${coreY}`,
          `M2 ${coreY} L ${inEndX} ${coreY}`,
          `M2 176 C 15 176, 15 ${coreY}, ${inEndX} ${coreY}`,
        ]
      : count === 2
        ? [
            `M2 74 C 15 74, 15 ${coreY}, ${inEndX} ${coreY}`,
            `M2 146 C 15 146, 15 ${coreY}, ${inEndX} ${coreY}`,
          ]
        : [`M2 ${coreY} L ${inEndX} ${coreY}`];
  return [...inPaths, `M${outStartX} ${coreY} L ${winX} ${coreY}`];
}

export function SolutionExplorerClient({
  locale,
  items,
}: {
  locale: Locale;
  items: SolutionTabItem[];
}) {
  const { selected, tabProps, panelProps, tablistRef, panelsRef } = useTabs(
    items.length,
    0,
  );

  const [shownIndex, setShownIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const [provState, setProvState] = useState<"hidden" | "draw" | "flow" | "rest">(
    "rest",
  );
  const [coreGlow, setCoreGlow] = useState(false);
  const [runTick, setRunTick] = useState(0);
  const prevSelectedRef = useRef(0);

  useEffect(() => {
    if (prevSelectedRef.current === selected) return;
    prevSelectedRef.current = selected;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShownIndex(selected);
      setPhase("idle");
      setProvState("rest");
      setCoreGlow(false);
      return;
    }

    setPhase("out");
    setProvState("hidden");
    setCoreGlow(false);

    const tSwap = window.setTimeout(() => {
      setShownIndex(selected);
      setPhase("in");
    }, 60);
    const tDraw = window.setTimeout(() => {
      setProvState("draw");
    }, 120);
    const tFlow = window.setTimeout(() => {
      setProvState("flow");
      setCoreGlow(true);
      setRunTick((n) => n + 1);
    }, 420);
    const tRest = window.setTimeout(() => {
      setPhase("idle");
      setProvState("rest");
      setCoreGlow(false);
    }, 1050);

    return () => {
      window.clearTimeout(tSwap);
      window.clearTimeout(tDraw);
      window.clearTimeout(tFlow);
      window.clearTimeout(tRest);
    };
  }, [selected]);

  const activeItem = items[shownIndex] ?? items[0];
  const inputs = ([1, 2, 3] as const)
    .map((n) => mk(activeItem.scene, `input${n}`, locale))
    .filter((v): v is string => Boolean(v));
  const stagePaths = pathsForInputCount(inputs.length);

  return (
    <div className="solution-explorer" data-reveal="">
      <div
        ref={tablistRef}
        className="solution-tabs"
        role="tablist"
        aria-label={t(locale, "解决方案", "Solutions")}
      >
        <span className="tab-indicator" aria-hidden="true" />
        {items.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            {...tabProps(i)}
            id={`solution-tab-${i}`}
            aria-controls={`solution-panel-${i}`}
          >
            <span className="label">{String(i + 1).padStart(2, "0")}</span>
            <span className="name">{s.name}</span>
            {s.dept || (s.before && s.after) ? (
              <span className="meta">
                {s.dept ? <span className="tag">{s.dept}</span> : null}
                <TimeChip before={s.before} after={s.after} />
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="solution-right">
        <div className="solution-stage">
          <span className="dot-grid solution-stage-dots" aria-hidden="true" />
          {runTick > 0 ? (
            <span
              key={runTick}
              className="solution-runner"
              aria-hidden="true"
            />
          ) : null}

          <div className="solution-stage-inner">
            <div
              className="solution-inputs"
              data-phase={phase}
              data-motion="transform"
            >
              {inputs.map((inp, idx) => (
                <span key={`${activeItem.slug}-${idx}`} className="tag">
                  {inp}
                </span>
              ))}
            </div>

            <div className="solution-bridge" aria-hidden="true">
              <ProvenanceLines
                viewBox="0 0 72 220"
                paths={stagePaths}
                surface="paper"
                state={provState}
              />
              <span
                className={`mk-core solution-core${coreGlow ? " glow-state" : ""}`}
                data-surface="dark"
              />
            </div>

            <div
              className="solution-win"
              data-phase={phase}
              data-motion="transform"
            >
              <ScaledSceneMockup
                scene={activeItem.scene}
                locale={locale}
                size="full"
              />
            </div>
          </div>
        </div>

        <div ref={panelsRef} className="tab-panels solution-copy">
          {items.map((s, i) => (
            <div
              key={s.slug}
              {...panelProps(i)}
              id={`solution-panel-${i}`}
              aria-labelledby={`solution-tab-${i}`}
              className="solution-panel-body"
            >
              <h3 className="h3">{s.promise}</h3>
              <p className="solution-intro">{s.intro}</p>
              <p className="solution-outputs small">{s.outputs}</p>
              <Link
                className="text-link"
                href={href(locale, `/services/${s.slug}`)}
              >
                {t(locale, "探索解决方案", "Explore solution")}
                <ArrowUpRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
