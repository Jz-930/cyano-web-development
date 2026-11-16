"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
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
  photos,
}: {
  locale: Locale;
  items: SolutionTabItem[];
  /** One server-rendered <Photo> per item, cross-faded with the active tab. */
  photos?: ReactNode;
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
    <div className="solution-explorer [grid-template-columns:minmax(0,5fr)_minmax(0,7fr)] [@media(max-width:1023px)]:[grid-template-columns:1fr] [gap:var(--sp-7)]" data-reveal="">
      <div
        ref={tablistRef}
        className="solution-tabs relative flex flex-col [@media(max-width:1023px)]:flex-row [border-top:1px_solid_var(--line)] [@media(max-width:1023px)]:[border-top:0] [@media(max-width:1023px)]:[overflow-x:auto] [@media(max-width:1023px)]:[gap:var(--sp-2)] [@media(max-width:1023px)]:[padding-bottom:var(--sp-2)]"
        role="tablist"
        aria-label={t(locale, "解决方案", "Solutions")}
      >
        <span className="tab-indicator absolute pointer-events-none" aria-hidden="true" />
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
                {s.dept ? <span className="tag inline-flex [border-radius:var(--r-chip)] [padding:4px_10px]">{s.dept}</span> : null}
                <TimeChip before={s.before} after={s.after} />
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="solution-right min-w-0">
        {photos ? (
          <div className="ph-swap solution-photo" aria-hidden="true">
            {Children.toArray(photos).map((node, i) => (
              <div key={i} data-on={shownIndex === i || undefined}>
                {node}
              </div>
            ))}
          </div>
        ) : null}
        <div className="solution-stage relative [border-radius:var(--r-panel)] [background:var(--p2)] [border:1px_solid_var(--line)] [padding:var(--sp-5)] overflow-hidden isolate">
          <span className="dot-grid solution-stage-dots absolute inset-0 pointer-events-none [z-index:-1]" aria-hidden="true" />
          {runTick > 0 ? (
            <span
              key={runTick}
              className="solution-runner absolute [top:0] [left:0] [width:36px] [height:2px] [border-radius:var(--r-chip)] [background:var(--cyan)] [box-shadow:var(--glow-state)] pointer-events-none"
              aria-hidden="true"
            />
          ) : null}

          <div className="solution-stage-inner grid [grid-template-columns:124px_72px_minmax(0,1fr)] [@media(max-width:800px)]:[grid-template-columns:1fr] items-center [gap:var(--sp-2)] [@media(max-width:800px)]:[gap:var(--sp-4)]">
            <div
              className="solution-inputs flex flex-col [@media(max-width:800px)]:flex-row [gap:var(--sp-3)] [@media(max-width:800px)]:[gap:var(--sp-2)] [@media(max-width:800px)]:flex-wrap"
              data-phase={phase}
              data-motion="transform"
            >
              {inputs.map((inp, idx) => (
                <span key={`${activeItem.slug}-${idx}`} className="tag inline-flex [border-radius:var(--r-chip)] [padding:4px_10px]">
                  {inp}
                </span>
              ))}
            </div>

            <div className="solution-bridge relative [width:72px] [height:220px] [@media(max-width:800px)]:hidden" aria-hidden="true">
              <ProvenanceLines
                viewBox="0 0 72 220"
                paths={stagePaths}
                surface="paper"
                state={provState}
              />
              <span
                className={`mk-core [width:22px] [height:22px] inline-flex items-center [gap:var(--sp-2)] [padding:var(--sp-2)_var(--sp-3)] whitespace-nowrap solution-core${coreGlow ? " glow-state" : ""}`}
                data-surface="dark"
              />
            </div>

            <div
              className="solution-win min-w-0"
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

        <div ref={panelsRef} className="tab-panels solution-copy [margin-top:var(--sp-5)]">
          {items.map((s, i) => (
            <div
              key={s.slug}
              {...panelProps(i)}
              id={`solution-panel-${i}`}
              aria-labelledby={`solution-tab-${i}`}
              className="solution-panel-body grid [gap:var(--sp-3)]"
            >
              <h3 className="h3">{s.promise}</h3>
              <p className="solution-intro [font-size:16px] [line-height:1.75] [color:var(--muted)]">{s.intro}</p>
              <p className="solution-outputs small [color:var(--muted)] [padding-top:var(--sp-3)] [border-top:1px_solid_var(--line-soft)]">{s.outputs}</p>
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
