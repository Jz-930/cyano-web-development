"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight, Lock, Pause, Play } from "lucide-react";
import { href, t, type Locale } from "@/lib/locale";
import { LightField } from "./LightField";
import { usePointerHalo } from "./usePointerHalo";
import { useTabs } from "./useTabs";

export type ConcernItem = {
  title: string;
  shortLabel: string | null;
  issue: string;
  answer: string;
};

// 06 §2.3: Tab 1->0 (知识摄入), Tab 2->1 (上下文编排), Tab 3->3 (权限与审计), Tab 4->2 (任务执行)
const TARGET_GATE_BY_TAB = [0, 1, 3, 2] as const;

const SCATTER_COORDS = [
  { sx: -18, sy: -10, dx: 4, dy: -3 },
  { sx: 14, sy: -14, dx: -4, dy: 3 },
  { sx: -12, sy: 12, dx: -3, dy: 4 },
  { sx: 18, sy: 10, dx: 4, dy: 2 },
  { sx: -16, sy: 14, dx: 3, dy: -4 },
  { sx: 10, sy: -12, dx: -4, dy: -2 },
  { sx: -10, sy: -8, dx: 4, dy: 3 },
  { sx: 16, sy: 12, dx: -3, dy: -4 },
];

export function ConcernPanel({
  locale,
  items,
  gates,
  conclusion,
  techLinkLabel,
}: {
  locale: Locale;
  items: ConcernItem[];
  gates: string[];
  conclusion: string | null;
  techLinkLabel: string;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  usePointerHalo(panelRef);

  const { selected, select, tabProps, panelProps, tablistRef, panelsRef } =
    useTabs(items.length, 0);

  const [autoPlay, setAutoPlay] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focusedInside, setFocusedInside] = useState(false);

  const [problemOn, setProblemOn] = useState(true);
  const [sweeping, setSweeping] = useState(false);
  const [litGate, setLitGate] = useState<number>(TARGET_GATE_BY_TAB[0]);
  const [solveOn, setSolveOn] = useState(true);

  const timersRef = useRef<number[]>([]);
  const mountedRef = useRef(false);

  // S11 timeline per selected tab (08 §S11)
  useEffect(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];

    const targetGate = TARGET_GATE_BY_TAB[selected] ?? 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !mountedRef.current) {
      mountedRef.current = true;
      setProblemOn(true);
      setSweeping(false);
      setLitGate(targetGate);
      setSolveOn(true);
      return;
    }

    setProblemOn(false);
    setSweeping(false);
    setLitGate(-1);
    setSolveOn(false);

    timersRef.current.push(
      window.setTimeout(() => setProblemOn(true), 220),
      window.setTimeout(() => setSweeping(true), 820),
    );

    for (let g = 0; g <= targetGate; g++) {
      timersRef.current.push(
        window.setTimeout(() => {
          setLitGate(g);
        }, 1100 + g * 200),
      );
    }

    timersRef.current.push(
      window.setTimeout(() => setSolveOn(true), 1300),
      window.setTimeout(() => setSweeping(false), 1500),
    );

    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, [selected]);

  // Auto-play 4s interval (pauses on hover, focus-within, or reduced motion)
  useEffect(() => {
    if (!autoPlay || hovered || focusedInside) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      select((selected + 1) % items.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [autoPlay, hovered, focusedInside, selected, items.length, select]);

  const autoLabel = t(locale, "自动播放", "Auto-play");
  const pauseLabel = t(locale, "暂停演示", "Pause demo");
  const noSourceLabel = t(locale, "来源不明", "No source");

  return (
    <div
      ref={panelRef}
      className="concern-panel dark halo-panel line-grid"
      data-surface="dark"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocusedInside(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setFocusedInside(false);
        }
      }}
    >
      <LightField preset="panel" focusSelector=".gate-row" />

      <div className="concern-toolbar">
        <button
          type="button"
          className="button-text concern-auto-toggle"
          aria-pressed={autoPlay}
          onClick={() => setAutoPlay((v) => !v)}
        >
          {autoPlay ? (
            <Pause size={14} aria-hidden="true" />
          ) : (
            <Play size={14} aria-hidden="true" />
          )}
          <span>{autoPlay ? pauseLabel : autoLabel}</span>
        </button>
      </div>

      <div
        ref={tablistRef}
        className="concern-tabs"
        role="tablist"
        aria-label={t(locale, "实施中需要处理的问题", "Implementation")}
      >
        <span className="tab-indicator" aria-hidden="true" />
        {items.map((item, i) => (
          <button
            key={item.title}
            type="button"
            {...tabProps(i)}
            id={`concern-tab-${i}`}
            aria-controls={`concern-panel-${i}`}
          >
            <span className="label">{String(i + 1).padStart(2, "0")}</span>
            {item.shortLabel ? (
              <>
                <span>{item.shortLabel}</span>
                <small>{item.title}</small>
              </>
            ) : (
              <span>{item.title}</span>
            )}
          </button>
        ))}
      </div>

      <div ref={panelsRef} className="concern-stage tab-panels">
        {items.map((item, i) => {
          const isCurrent = selected === i;
          const pActive = isCurrent ? problemOn : true;
          const sActive = isCurrent ? solveOn : true;
          const currentLitGate = isCurrent
            ? litGate
            : (TARGET_GATE_BY_TAB[i] ?? 0);

          return (
            <div
              key={item.title}
              {...panelProps(i)}
              id={`concern-panel-${i}`}
              aria-labelledby={`concern-tab-${i}`}
              className="concern-tabpanel"
            >
              <div className="concern-split">
                <span
                  className="concern-sweep"
                  data-sweep={isCurrent && sweeping ? "true" : undefined}
                  data-motion="transform"
                  aria-hidden="true"
                />

                {/* Left: Problem */}
                <div className="concern-side is-problem">
                  <span className="label">
                    {t(locale, "目前的问题", "The problem")}
                  </span>
                  <div
                    className={`concern-anim concern-anim-p-${i}`}
                    data-active={pActive ? "true" : "false"}
                    aria-hidden="true"
                  >
                    {i === 0 ? (
                      SCATTER_COORDS.map((c, k) => (
                        <i
                          key={k}
                          className="s11-frag"
                          data-motion="transform"
                          style={
                            {
                              "--k": k,
                              "--dx": `${c.dx}px`,
                              "--dy": `${c.dy}px`,
                            } as CSSProperties
                          }
                        />
                      ))
                    ) : i === 1 ? (
                      <>
                        <i className="s11-frame" />
                        {Array.from({ length: 11 }).map((_, k) => (
                          <i
                            key={k}
                            className={`s11-chunk${k >= 7 ? " is-overflow" : ""}`}
                            data-motion="transform"
                            style={{ "--k": k } as CSSProperties}
                          />
                        ))}
                      </>
                    ) : i === 2 ? (
                      <div className="s11-doc-card">
                        <i className="s11-line s11-w-82" />
                        <i className="s11-line s11-w-92" />
                        <svg
                          className="s11-wave"
                          viewBox="0 0 140 12"
                          fill="none"
                        >
                          <path
                            d="M2 7 Q 12 2, 22 7 T 42 7 T 62 7 T 82 7 T 102 7 T 122 7 T 138 7"
                            stroke="var(--risk)"
                            strokeWidth="1.75"
                            pathLength="1"
                          />
                        </svg>
                        <i className="s11-line s11-w-64" />
                        {noSourceLabel ? (
                          <span className="label s11-risk-tag">
                            {noSourceLabel}
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <>
                        {[0, 1, 2, 3].map((k) => (
                          <i
                            key={`card-${k}`}
                            className={`s11-prompt-card s11-pc-${k}`}
                            data-motion="transform"
                          />
                        ))}
                        {[0, 1, 2, 3].map((k) => (
                          <i
                            key={`av-${k}`}
                            className={`s11-avatar-dot s11-av-${k}`}
                          />
                        ))}
                        {[0, 1, 2, 3].map((k) => (
                          <i
                            key={`ln-${k}`}
                            className={`s11-solo-link s11-sl-${k}`}
                          />
                        ))}
                      </>
                    )}
                  </div>
                  <p>{item.issue}</p>
                </div>

                <div className="split-line" aria-hidden="true" />

                {/* Right: Cyano Core */}
                <div className="concern-side is-core">
                  <div className="gate-row" aria-hidden="true">
                    {gates.map((gName, gIdx) => (
                      <span key={gName} className="gate-item">
                        <span
                          className="gate"
                          data-on={currentLitGate === gIdx ? "true" : undefined}
                        >
                          {gName}
                        </span>
                        {gIdx < gates.length - 1 ? (
                          <span className="gate-arrow" />
                        ) : null}
                      </span>
                    ))}
                  </div>

                  <div
                    className={`concern-anim concern-anim-s-${i}`}
                    data-solved={sActive ? "true" : "false"}
                    aria-hidden="true"
                  >
                    {i === 0 ? (
                      <>
                        {SCATTER_COORDS.map((c, k) => (
                          <i
                            key={k}
                            className="s11-grid-frag"
                            data-motion="transform"
                            style={
                              {
                                "--k": k,
                                "--sx": `${c.sx}px`,
                                "--sy": `${c.sy}px`,
                              } as CSSProperties
                            }
                          />
                        ))}
                        <span className="s11-lock">
                          <Lock size={14} />
                        </span>
                      </>
                    ) : i === 1 ? (
                      <>
                        <i className="s11-frame is-clean" />
                        <i className="s11-sieve" data-motion="transform" />
                        {Array.from({ length: 10 }).map((_, k) => (
                          <i
                            key={k}
                            className={`s11-filter-chunk${k < 3 ? " is-kept" : " is-dropped"}`}
                            data-motion="transform"
                            style={{ "--k": k } as CSSProperties}
                          />
                        ))}
                      </>
                    ) : i === 2 ? (
                      <div className="s11-doc-card is-verified">
                        <i className="s11-line s11-w-82" />
                        <div className="s11-cited-row">
                          <i className="s11-line s11-w-76" />
                          <span className="mk-cite s11-cite-pop" data-motion="transform">
                            [1]
                          </span>
                        </div>
                        <i className="s11-line s11-w-64" />
                        <span className="s11-amber-check">
                          <svg viewBox="0 0 20 20" fill="none">
                            <path
                              d="M5 10.5 L8.5 14 L15 6.5"
                              stroke="var(--amber)"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              pathLength="1"
                            />
                          </svg>
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="s11-playbook" data-motion="transform">
                          <span className="label">Playbook</span>
                          <i className="s11-line s11-w-82" />
                          <i className="s11-line s11-w-64" />
                        </div>
                        <svg
                          className="s11-fan-svg"
                          viewBox="0 0 320 220"
                          fill="none"
                        >
                          <path
                            d="M160 132 L64 184"
                            stroke="var(--cyan-60)"
                            strokeWidth="1.25"
                            pathLength="1"
                          />
                          <path
                            d="M160 132 L128 184"
                            stroke="var(--cyan-60)"
                            strokeWidth="1.25"
                            pathLength="1"
                          />
                          <path
                            d="M160 132 L192 184"
                            stroke="var(--cyan-60)"
                            strokeWidth="1.25"
                            pathLength="1"
                          />
                          <path
                            d="M160 132 L256 184"
                            stroke="var(--cyan-60)"
                            strokeWidth="1.25"
                            pathLength="1"
                          />
                        </svg>
                        {[0, 1, 2, 3].map((k) => (
                          <i
                            key={k}
                            className={`s11-team-dot s11-td-${k}`}
                          />
                        ))}
                      </>
                    )}
                  </div>
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="concern-foot">
        {conclusion ? (
          <span className="callout-line-text">{conclusion}</span>
        ) : (
          <span />
        )}
        <Link
          className="text-link light-link"
          href={href(locale, "/technology")}
        >
          {techLinkLabel}
          <ArrowUpRight size={16} />
        </Link>
      </p>
    </div>
  );
}
