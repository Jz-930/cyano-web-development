"use client";

import { useEffect, useId, useRef, useState } from "react";
import rawEngagementCopy from "@/content/v4/pages/EngagementCards.json";
import { t, type Locale } from "@/lib/locale";

export type EngagementMode = "custom" | "pilot" | "managed";

export type EngagementGanttProps = {
  locale: Locale;
  variant?: "paper" | "hero";
  compact?: boolean;
  activeMode?: EngagementMode | null;
  onHoverMode?: (mode: EngagementMode | null) => void;
};

const MODES: EngagementMode[] = ["custom", "pilot", "managed"];
const TICKS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export function EngagementGantt({
  locale,
  variant = "paper",
  compact = false,
  activeMode = null,
  onHoverMode,
}: EngagementGanttProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const hatchId = `gantt-hatch-${uid}`;

  const [inView, setInView] = useState(false);
  const [localMode, setLocalMode] = useState<EngagementMode | null>(null);
  const [hoverDiamond, setHoverDiamond] = useState<string | null>(null);

  const effectiveMode = activeMode ?? localMode;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Sync hover with sibling .engagement-card[data-mode] inside the same section
  useEffect(() => {
    const el = rootRef.current;
    const section = el?.closest("section");
    if (!section) return;

    const setDomHighlight = (mode: EngagementMode | null) => {
      const cards = section.querySelectorAll<HTMLElement>(
        ".engagement-card[data-mode]",
      );
      cards.forEach((card) => {
        if (mode && card.dataset.mode === mode) {
          card.dataset.linked = "true";
        } else {
          delete card.dataset.linked;
        }
      });
    };

    const onOver = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.(
        ".engagement-card[data-mode]",
      ) as HTMLElement | null;
      if (card) {
        const m = card.dataset.mode as EngagementMode;
        setLocalMode(m);
        onHoverMode?.(m);
        setDomHighlight(m);
      }
    };
    const onOut = (e: PointerEvent) => {
      const fromCard = (e.target as Element | null)?.closest?.(
        ".engagement-card[data-mode]",
      ) as HTMLElement | null;
      const toCard = (e.relatedTarget as Element | null)?.closest?.(
        ".engagement-card[data-mode]",
      ) as HTMLElement | null;
      if (fromCard && fromCard !== toCard) {
        const next = (toCard?.dataset.mode as EngagementMode | undefined) ?? null;
        setLocalMode(next);
        onHoverMode?.(next);
        setDomHighlight(next);
      }
    };

    section.addEventListener("pointerover", onOver);
    section.addEventListener("pointerout", onOut);
    return () => {
      section.removeEventListener("pointerover", onOver);
      section.removeEventListener("pointerout", onOut);
      setDomHighlight(null);
    };
  }, [onHoverMode]);

  useEffect(() => {
    const el = rootRef.current;
    const section = el?.closest("section");
    if (!section) return;
    const cards = section.querySelectorAll<HTMLElement>(
      ".engagement-card[data-mode]",
    );
    cards.forEach((card) => {
      if (effectiveMode && card.dataset.mode === effectiveMode) {
        card.dataset.linked = "true";
      } else {
        delete card.dataset.linked;
      }
    });
  }, [effectiveMode]);

  const rowTitles = rawEngagementCopy.full_custom_build[locale];
  const g1 = t(locale, "需求评估", "Assessment");
  const g2 = t(locale, "首期上线", "First release");
  const g3 = t(locale, "首个可用版本", "First working version");
  const g4 = t(locale, "首批结果", "First results");
  const g5 = t(locale, "按月 / 按批次持续交付", "Ongoing monthly or batch delivery");
  const g6 = t(locale, "试点", "Pilot");
  const g7 = t(locale, "人工验收", "Human sign-off");
  const gCap = t(
    locale,
    "三种合作方式的典型周期对比",
    "Typical timelines for the three engagement models",
  );
  const gNote = t(
    locale,
    "典型安排；具体范围与时间以需求评估和双方协议为准。",
    "Typical schedule; scope and timing depend on the assessment and our agreement.",
  );

  const ownCustom = t(
    locale,
    "系统归你 · 维护范围合作时约定",
    "You own the system · Support scope agreed upfront",
  );
  const ownPilot = t(
    locale,
    "先验证效果 · 维护范围合作时约定",
    "Check the results first · Support scope agreed upfront",
  );
  const ownManaged = t(
    locale,
    "Cyano 运行并交付结果",
    "Cyano runs it and delivers results",
  );
  const showOwnCol =
    !compact &&
    variant === "paper" &&
    Boolean(ownCustom && ownPilot && ownManaged);
  const ownTexts = [ownCustom, ownPilot, ownManaged];

  // SVG coordinate system:
  // Left label column: x=0..180 (hero: 0..156), Timeline: x0..x12 (12 weeks * weekW), Optional end col rendered via HTML or wide viewBox
  const labelW = variant === "hero" ? 148 : 188;
  const weekW = variant === "hero" ? 34 : 48;
  const endColW = showOwnCol ? 216 : 0;
  const axisX0 = labelW;
  const axisX12 = axisX0 + 12 * weekW;
  const vbWidth = axisX12 + 24 + endColW;
  const rowStep = compact ? 52 : variant === "hero" ? 56 : 64;
  const headerH = 38;
  const vbHeight = headerH + 3 * rowStep + 14;
  const wx = (w: number) => axisX0 + w * weekW;

  const handleRowEnter = (m: EngagementMode) => {
    setLocalMode(m);
    onHoverMode?.(m);
  };
  const handleRowLeave = () => {
    setLocalMode(null);
    onHoverMode?.(null);
    setHoverDiamond(null);
  };

  return (
    <figure
      ref={rootRef}
      className={`gantt gantt-${variant}${compact ? " is-compact" : ""}${inView ? " is-in" : ""}`}
      data-surface={variant === "hero" ? "dark" : undefined}
      onPointerLeave={handleRowLeave}
    >
      {gCap ? <figcaption className="sr-only">{gCap}</figcaption> : null}

      <ul className="sr-only">
        <li>
          <span>{rowTitles[0]}</span> · <span>{g1}</span> · <span>W0</span> ·{" "}
          <span>W1</span> · <span>{g2}</span> · <span>W6</span> · <span>W12</span> ·{" "}
          <span>{g7}</span> · <span>W1</span> · <span>W12</span>
        </li>
        <li>
          <span>{rowTitles[1]}</span> · <span>{g1}</span> · <span>W0</span> ·{" "}
          <span>W1</span> · <span>{g6}</span> · <span>W1</span> · <span>W2</span> ·{" "}
          <span>{g3}</span> · <span>W2</span> · <span>W6</span> · <span>{g7}</span> ·{" "}
          <span>W1</span> · <span>W6</span>
        </li>
        <li>
          <span>{rowTitles[2]}</span> · <span>{g1}</span> · <span>W0</span> ·{" "}
          <span>W1</span> · <span>{g4}</span> · <span>W1</span> · <span>W2</span> ·{" "}
          <span>{g5}</span> · <span>W6</span> · <span>W10</span> · <span>{g7}</span> ·{" "}
          <span>W2</span>
        </li>
      </ul>

      <div className="gantt-scroll" tabIndex={0}>
        <svg
          className="gantt-svg"
          viewBox={`0 0 ${vbWidth} ${vbHeight}`}
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <pattern
              id={hatchId}
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="8"
                stroke="var(--cyan-40)"
                strokeWidth="2"
              />
            </pattern>
          </defs>

          {/* Week axis W0..W12 */}
          {TICKS.map((w) => (
            <g key={w}>
              <line
                x1={wx(w)}
                y1={headerH - 6}
                x2={wx(w)}
                y2={vbHeight - 10}
                stroke={
                  variant === "hero" ? "var(--dark-line-soft)" : "var(--line-soft)"
                }
                strokeWidth="1"
                strokeDasharray={w === 0 || w === 12 ? undefined : "3 4"}
              />
              <text
                x={wx(w)}
                y="20"
                textAnchor="middle"
                className="gantt-tick"
              >
                {`W${w}`}
              </text>
            </g>
          ))}

          {/* 3 Engagement tracks */}
          {MODES.map((mode, idx) => {
            const ry = headerH + idx * rowStep + rowStep / 2;
            const barY = ry - 10;
            const barH = 20;
            const dimmed = effectiveMode !== null && effectiveMode !== mode;
            const diamonds =
              mode === "custom"
                ? [1, 12]
                : mode === "pilot"
                  ? [1, 6]
                  : [2];

            return (
              <g
                key={mode}
                className="gantt-row"
                data-mode={mode}
                data-dimmed={dimmed ? "true" : undefined}
                style={{ "--row-i": idx } as React.CSSProperties}
                onPointerEnter={() => handleRowEnter(mode)}
              >
                <rect
                  x="0"
                  y={headerH + idx * rowStep}
                  width={vbWidth}
                  height={rowStep}
                  fill="transparent"
                />
                <text
                  x="0"
                  y={ry + 5}
                  className="gantt-row-title"
                >
                  {rowTitles[idx]}
                </text>

                {/* Baseline */}
                <line
                  x1={wx(0)}
                  y1={ry}
                  x2={wx(12)}
                  y2={ry}
                  stroke={
                    variant === "hero" ? "var(--dark-line)" : "var(--line)"
                  }
                  strokeWidth="1"
                />

                {/* Animated track bars */}
                <g className="gantt-bars" data-motion="transform">
                  {/* W0-W1 Assessment */}
                  <rect
                    x={wx(0)}
                    y={barY}
                    width={weekW}
                    height={barH}
                    rx="4"
                    fill="var(--brand)"
                    className="gantt-seg"
                  />

                  {mode === "custom" ? (
                    <>
                      <rect
                        x={wx(1)}
                        y={barY}
                        width={5 * weekW}
                        height={barH}
                        rx="4"
                        fill="var(--cyan)"
                        className="gantt-seg"
                      />
                      <rect
                        x={wx(6)}
                        y={barY}
                        width={6 * weekW}
                        height={barH}
                        rx="4"
                        fill={`url(#${hatchId})`}
                        stroke="var(--cyan-40)"
                        strokeWidth="1.25"
                        className="gantt-seg"
                      />
                      <text
                        x={wx(9)}
                        y={ry - 15}
                        textAnchor="middle"
                        className="gantt-seg-label"
                      >
                        {g2}
                      </text>
                    </>
                  ) : mode === "pilot" ? (
                    <>
                      <rect
                        x={wx(1)}
                        y={barY}
                        width={weekW}
                        height={barH}
                        rx="4"
                        fill="var(--cyan)"
                        className="gantt-seg"
                      />
                      <rect
                        x={wx(2)}
                        y={barY}
                        width={4 * weekW}
                        height={barH}
                        rx="4"
                        fill={`url(#${hatchId})`}
                        stroke="var(--cyan-40)"
                        strokeWidth="1.25"
                        className="gantt-seg"
                      />
                      <text
                        x={wx(4)}
                        y={ry - 15}
                        textAnchor="middle"
                        className="gantt-seg-label"
                      >
                        {g3}
                      </text>
                    </>
                  ) : (
                    <>
                      <rect
                        x={wx(1)}
                        y={barY}
                        width={weekW}
                        height={barH}
                        rx="4"
                        fill="var(--cyan)"
                        className="gantt-seg"
                      />
                      <line
                        x1={wx(2)}
                        y1={ry}
                        x2={wx(12)}
                        y2={ry}
                        stroke="var(--cyan-40)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                      {[6, 10].map((mw) => (
                        <rect
                          key={mw}
                          x={wx(mw) - 3}
                          y={barY}
                          width="6"
                          height={barH}
                          rx="2"
                          fill="var(--cyan)"
                          className="gantt-seg"
                        />
                      ))}
                      <text
                        x={wx(7)}
                        y={ry - 15}
                        textAnchor="middle"
                        className="gantt-seg-label"
                      >
                        {g5}
                      </text>
                    </>
                  )}
                </g>

                {/* Amber human sign-off diamonds */}
                {diamonds.map((dw) => {
                  const dKey = `${mode}-${dw}`;
                  const isHovered = hoverDiamond === dKey;
                  const dx = wx(dw);
                  const dy = barY - 8;
                  return (
                    <g
                      key={dKey}
                      className="gantt-diamond"
                      onPointerEnter={() => setHoverDiamond(dKey)}
                      onPointerLeave={() => setHoverDiamond(null)}
                    >
                      <circle cx={dx} cy={dy} r="12" fill="transparent" />
                      <rect
                        x={dx - 5}
                        y={dy - 5}
                        width="10"
                        height="10"
                        fill="var(--amber-12)"
                        stroke="var(--amber)"
                        strokeWidth="1.5"
                        transform={`rotate(45 ${dx} ${dy})`}
                      />
                      {isHovered ? (
                        <g
                          transform={`translate(${Math.min(dx, axisX12 - 36)}, ${dy - 14})`}
                        >
                          <rect
                            x="-40"
                            y="-16"
                            width="80"
                            height="18"
                            rx="4"
                            fill="var(--n1)"
                            stroke="var(--amber)"
                            strokeWidth="1"
                          />
                          <text
                            x="0"
                            y="-4"
                            textAnchor="middle"
                            className="gantt-signoff-tip"
                          >
                            {g7}
                          </text>
                        </g>
                      ) : null}
                    </g>
                  );
                })}

                {/* End ownership column on full paper variant */}
                {showOwnCol && ownTexts[idx] ? (
                  <text
                    x={axisX12 + 20}
                    y={ry + 4}
                    className="gantt-own-text"
                  >
                    {ownTexts[idx]}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      {gNote ? <p className="gantt-note small">{gNote}</p> : null}
    </figure>
  );
}
