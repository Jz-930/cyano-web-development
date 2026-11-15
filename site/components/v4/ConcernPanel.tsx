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
  { sx: -18, sy: -10, dx: 4, dy: -3, l: "16%", t: "18%", r: "-8deg" },
  { sx: 14, sy: -14, dx: -4, dy: 3, l: "42%", t: "12%", r: "6deg" },
  { sx: -12, sy: 12, dx: -3, dy: 4, l: "68%", t: "20%", r: "-4deg" },
  { sx: 18, sy: 10, dx: 4, dy: 2, l: "26%", t: "48%", r: "9deg" },
  { sx: -16, sy: 14, dx: 3, dy: -4, l: "56%", t: "44%", r: "-7deg" },
  { sx: 10, sy: -12, dx: -4, dy: -2, l: "76%", t: "56%", r: "5deg" },
  { sx: -10, sy: -8, dx: 4, dy: 3, l: "18%", t: "70%", r: "4deg" },
  { sx: 16, sy: 12, dx: -3, dy: -4, l: "48%", t: "70%", r: "-6deg" },
] as const;

const CHUNK_COORDS = [
  ["20%", "28%", 56],
  ["52%", "26%", 56],
  ["20%", "36%", 76],
  ["60%", "18%", 76],
  ["20%", "24%", 96],
  ["48%", "30%", 96],
  ["20%", "58%", 116],
  ["18%", "30%", 152],
  ["52%", "30%", 152],
  ["22%", "26%", 174],
  ["52%", "26%", 174],
] as const;

const FILTER_COORDS = [
  ["22%", "56%", 64],
  ["22%", "46%", 92],
  ["22%", "52%", 120],
  ["22%", "24%", 172],
  ["50%", "24%", 172],
  ["22%", "24%", 190],
  ["50%", "24%", 190],
  ["20%", "24%", 20],
  ["52%", "24%", 20],
  ["36%", "24%", 20],
] as const;

const PROMPT_CARDS = [
  ["12%", 44, "rotate(-7deg)"],
  ["34%", 38, "rotate(5deg)"],
  ["56%", 46, "rotate(-4deg)"],
  ["76%", 40, "rotate(8deg)"],
] as const;

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
      className="concern-panel dark halo-panel line-grid relative [border-radius:var(--r-panel)] [padding:var(--sp-6)_var(--sp-7)_var(--sp-7)] [@media(max-width:1023px)]:[padding:var(--sp-5)] grid [grid-template-columns:260px_minmax(0,1fr)] [@media(max-width:1023px)]:[grid-template-columns:1fr] [gap:var(--sp-5)_var(--sp-7)] overflow-hidden [background:var(--n1)] [border:1px_solid_var(--dark-line)]"
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

      <div className="concern-toolbar [grid-column:1_/_-1] relative [z-index:var(--z-stage)] flex [justify-content:flex-end] [margin-bottom:calc(-1_*_var(--sp-2))]">
        <button
          type="button"
          className="button-text concern-auto-toggle no-underline [min-height:36px] [padding:var(--sp-1)_var(--sp-3)] [border-radius:var(--r-chip)] [font-size:13px] [transition:background-color_var(--qtf),border-color_var(--qtf),color_var(--qtf),transform_var(--qtp)]"
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
        className="concern-tabs flex flex-col [@media(max-width:1023px)]:flex-row [gap:var(--sp-1)] relative [z-index:var(--z-content)] [padding-left:var(--sp-4)] [@media(max-width:1023px)]:[padding-left:0] [align-self:start] [@media(max-width:1023px)]:[overflow-x:auto]"
        role="tablist"
        aria-label={t(locale, "实施中需要处理的问题", "Implementation")}
      >
        <span className="tab-indicator absolute pointer-events-none" aria-hidden="true" />
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

      <div ref={panelsRef} className="concern-stage tab-panels relative [z-index:var(--z-content)] min-w-0">
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
              <div className="concern-split relative grid [grid-template-columns:minmax(0,1fr)_1px_minmax(0,1fr)] [@media(max-width:800px)]:[grid-template-columns:1fr] [gap:var(--sp-6)] overflow-hidden">
                <span
                  className="concern-sweep absolute [top:0] [bottom:0] [left:-140px] [width:120px] [z-index:var(--z-stage)] pointer-events-none [background:linear-gradient(90deg,transparent,var(--cyan-22),transparent)]"
                  data-sweep={isCurrent && sweeping ? "true" : undefined}
                  data-motion="transform"
                  aria-hidden="true"
                />

                {/* Left: Problem */}
                <div className="concern-side is-problem">
                  <span className="label">
                    {t(locale, "现在的情况", "Today")}
                  </span>
                  <div
                    className={`concern-anim relative [height:220px] [border-radius:var(--r-card)] [background:var(--n2)] [border:1px_solid_var(--dark-line-soft)] overflow-hidden concern-anim-p-${i}`}
                    data-active={pActive ? "true" : "false"}
                    aria-hidden="true"
                  >
                    {i === 0 ? (
                      SCATTER_COORDS.map((c, k) => (
                        <i
                          key={k}
                          className="s11-frag absolute [width:28px] [height:36px] [border-radius:var(--qr4)] [background:var(--n3)] [border:1px_solid_var(--dark-line)] [transition:transform_var(--dur-enter)_var(--ease-spring),opacity_var(--qtb),border-color_var(--qtb)]"
                          data-motion="transform"
                          style={
                            {
                              left: c.l,
                              top: c.t,
                              "--r": c.r,
                              "--k": k,
                              "--dx": `${c.dx}px`,
                              "--dy": `${c.dy}px`,
                            } as CSSProperties
                          }
                        />
                      ))
                    ) : i === 1 ? (
                      <>
                        <i className="s11-frame absolute [left:16%] [right:16%] [top:44px] [height:120px] [border-radius:var(--r-control)]" />
                        {CHUNK_COORDS.map(([left, width, top], k) => (
                          <i
                            key={k}
                            className={`s11-chunk absolute [height:12px] [border-radius:var(--qr4)] [transition:transform_var(--qte),opacity_var(--qte),border-color_var(--qtb)] ${k >= 7 ? " is-overflow" : ""}`}
                            data-motion="transform"
                            style={{ left, width, top, "--k": k } as CSSProperties}
                          />
                        ))}
                      </>
                    ) : i === 2 ? (
                      <div className="s11-doc-card absolute [left:14%] [right:14%] [top:42px] [padding:var(--sp-4)] [border-radius:var(--r-control)] [background:var(--n1)] grid [gap:var(--sp-2)]">
                        <i className="s11-line s11-w-82 block [height:8px] [border-radius:var(--r-chip)] [background:var(--frost-15)] [width:82%]" />
                        <i className="s11-line s11-w-92 block [height:8px] [border-radius:var(--r-chip)] [background:var(--frost-15)] [width:92%]" />
                        <svg
                          className="s11-wave [width:140px] [height:12px] [margin-top:-4px]"
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
                        <i className="s11-line s11-w-64 block [height:8px] [border-radius:var(--r-chip)] [background:var(--frost-15)] [width:64%]" />
                        {noSourceLabel ? (
                          <span className="label s11-risk-tag [justify-self:start] [padding:2px_8px] [border-radius:var(--r-chip)] [background:var(--risk-12)] [border:1px_solid_var(--risk)]">
                            {noSourceLabel}
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <>
                        {PROMPT_CARDS.map(([left, top, transform], k) => (
                          <i
                            key={`card-${k}`}
                            className="s11-prompt-card absolute [width:48px] [height:36px] [border-radius:var(--qr6)] [background:var(--n3)] [border:1px_solid_var(--dark-line)]"
                            data-motion="transform"
                            style={{ left, top, transform }}
                          />
                        ))}
                        {[0, 1, 2, 3].map((k) => (
                          <i
                            key={`av-${k}`}
                            className="s11-avatar-dot absolute [width:12px] [height:12px] [border-radius:var(--q50)] [bottom:28px] [margin-left:-6px] [background:var(--frost-15)] [border:1px_solid_var(--dark-line)]"
                            style={{ left: `${(k + 1) * 20}%` }}
                          />
                        ))}
                        {[0, 1, 2, 3].map((k) => (
                          <i
                            key={`ln-${k}`}
                            className="s11-solo-link absolute [width:1px] [height:76px] [top:86px] [background:var(--dark-line-soft)]"
                            style={{ left: `${(k + 1) * 20}%` }}
                          />
                        ))}
                      </>
                    )}
                  </div>
                  <p>{item.issue}</p>
                </div>

                <div className="split-line [width:1px] [align-self:stretch] [background:linear-gradient(_180deg,transparent_0%,var(--cyan-40)_50%,transparent_100%_)]" aria-hidden="true" />

                {/* Right: Cyano Core */}
                <div className="concern-side is-core">
                  <div className="gate-row flex flex-wrap items-center [gap:6px] [margin-bottom:var(--sp-3)]" aria-hidden="true">
                    {gates.map((gName, gIdx) => (
                      <span key={gName} className="gate-item inline-flex items-center [gap:6px]">
                        <span
                          className="gate inline-flex items-center [padding:5px_10px] [border-radius:var(--r-chip)] [font-size:13px] [transition:color_var(--qtb),border-color_var(--qtb),box-shadow_var(--qtb)]"
                          data-on={currentLitGate === gIdx ? "true" : undefined}
                        >
                          {gName}
                        </span>
                        {gIdx < gates.length - 1 ? (
                          <span className="gate-arrow [width:10px] [height:1px] [background:var(--dark-line)]" />
                        ) : null}
                      </span>
                    ))}
                  </div>

                  <div
                    className={`concern-anim relative [height:220px] [border-radius:var(--r-card)] [background:var(--n2)] [border:1px_solid_var(--dark-line-soft)] overflow-hidden concern-anim-s-${i}`}
                    data-solved={sActive ? "true" : "false"}
                    aria-hidden="true"
                  >
                    {i === 0 ? (
                      <>
                        {SCATTER_COORDS.map((c, k) => (
                          <i
                            key={k}
                            className="s11-grid-frag absolute [width:28px] [height:36px] [border-radius:var(--qr4)]"
                            data-motion="transform"
                            style={
                              {
                                left: `calc(50% + ${(k % 4) * 40 - 76}px)`,
                                top: k < 4 ? 58 : 112,
                                "--k": k,
                                "--sx": `${c.sx}px`,
                                "--sy": `${c.sy}px`,
                              } as CSSProperties
                            }
                          />
                        ))}
                        <span className="s11-lock absolute [right:calc(50%_-_92px)] [top:38px] [width:24px] [height:24px] [border-radius:var(--q50)] grid [place-items:center] [background:var(--n1)] [border:1px_solid_var(--cyan-60)] [color:var(--ice)] [transition:opacity_var(--qtb)]">
                          <Lock size={14} />
                        </span>
                      </>
                    ) : i === 1 ? (
                      <>
                        <i className="s11-frame is-clean absolute [left:16%] [right:16%] [top:44px] [height:120px] [border-radius:var(--r-control)]" />
                        <i className="s11-sieve absolute [left:12%] [right:12%] [top:32px] [height:1px] [border-top:1.5px_dashed_var(--cyan)] [transition:transform_var(--dur-scene)_var(--ease-in-out),opacity_var(--qtb)]" data-motion="transform" />
                        {FILTER_COORDS.map(([left, width, top], k) => (
                          <i
                            key={k}
                            className={`s11-filter-chunk absolute [height:12px] [border-radius:var(--qr4)] [transition:transform_var(--qte),opacity_var(--qte),border-color_var(--qtb)] ${k < 3 ? " is-kept" : " is-dropped"}`}
                            data-motion="transform"
                            style={{ left, width, top, "--k": k } as CSSProperties}
                          />
                        ))}
                      </>
                    ) : i === 2 ? (
                      <div className="s11-doc-card is-verified absolute [left:14%] [right:14%] [top:42px] [padding:var(--sp-4)] [border-radius:var(--r-control)] [background:var(--n1)] grid [gap:var(--sp-2)]">
                        <i className="s11-line s11-w-82 block [height:8px] [border-radius:var(--r-chip)] [background:var(--frost-15)] [width:82%]" />
                        <div className="s11-cited-row flex items-center [gap:var(--sp-2)]">
                          <i className="s11-line s11-w-76 block [height:8px] [border-radius:var(--r-chip)] [background:var(--frost-15)] [width:76%]" />
                          <span className="mk-cite s11-cite-pop inline-flex items-center justify-center [margin-left:var(--sp-1)] [padding:1px_6px] [min-width:20px] [min-height:20px] [border-radius:var(--r-control)] [font:500_12px/1.3_var(--mono)] [color:var(--ice)] [transition:transform_var(--dur-enter)_var(--ease-spring),opacity_var(--qtb)]" data-motion="transform">
                            [1]
                          </span>
                        </div>
                        <i className="s11-line s11-w-64 block [height:8px] [border-radius:var(--r-chip)] [background:var(--frost-15)] [width:64%]" />
                        <span className="s11-amber-check [width:26px] [height:26px] [border-radius:var(--q50)] [background:var(--amber-12)] [border:1px_solid_var(--amber)] grid">
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
                        <div className="s11-playbook absolute [left:50%] [top:34px] [width:156px] [margin-left:-78px] [padding:var(--sp-3)] [border-radius:var(--r-control)] [background:var(--n1)] [border:1px_solid_var(--cyan-60)] grid [gap:6px] [z-index:var(--z-content)] [transition:transform_var(--dur-enter)_var(--ease-spring),opacity_var(--qtb)]" data-motion="transform">
                          <span className="label">Playbook</span>
                          <i className="s11-line s11-w-82 block [height:8px] [border-radius:var(--r-chip)] [background:var(--frost-15)] [width:82%]" />
                          <i className="s11-line s11-w-64 block [height:8px] [border-radius:var(--r-chip)] [background:var(--frost-15)] [width:64%]" />
                        </div>
                        <svg
                          className="s11-fan-svg absolute inset-0 w-full h-full pointer-events-none"
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
                            className="s11-team-dot absolute [width:12px] [height:12px] [border-radius:var(--q50)] [bottom:28px] [margin-left:-6px] [background:var(--cyan-22)] [border:1.5px_solid_var(--cyan)]"
                            style={{ left: `${(k + 1) * 20}%` }}
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

      <p className="concern-foot [grid-column:1_/_-1] relative [z-index:var(--z-content)] flex flex-wrap justify-between items-center [gap:var(--sp-4)] [padding-top:var(--sp-5)] [border-top:1px_solid_var(--dark-line-soft)] [font-size:16px] [color:var(--light)]">
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
