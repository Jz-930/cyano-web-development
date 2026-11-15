"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowLeftRight, Check, FileText } from "lucide-react";
import type { Locale } from "@/lib/locale";
import { copyNew } from "@/lib/copy-new-client";
import { SceneProposal } from "./scenes/SceneProposal";

function snapPercent(raw: number): number {
  const clamped = Math.max(0, Math.min(100, raw));
  for (const target of [0, 50, 100]) {
    if (Math.abs(clamped - target) <= 3) return target;
  }
  return Math.round(clamped);
}

export function WipeCompare({
  locale,
  beforeText,
  afterText,
}: {
  locale: Locale;
  beforeText: string;
  afterText: string;
}) {
  const [pct, setPct] = useState<number>(50);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const label = copyNew("S9-label", locale) ?? "Before and after";
  const beforeLabel = copyNew("S9-before", locale) ?? "Before";
  const afterLabel = copyNew("S9-after", locale) ?? "After";
  const r1 = copyNew("S9-r1", locale) ?? "2 days";
  const r2 = copyNew("S9-r2", locale) ?? "15 minutes";
  const bSteps = ([1, 2, 3, 4] as const)
    .map((n) => copyNew(`S9.b${n}`, locale))
    .filter((v): v is string => Boolean(v));

  const updateFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPct(snapPercent(ratio));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    draggingRef.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore synthetic pointer events without active pointerId
    }
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPct((p) => snapPercent(p - 10));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPct((p) => snapPercent(p + 10));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPct(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPct(100);
    }
  };

  return (
    <div
      className="wipe-compare flex flex-col [gap:var(--sp-4)]"
      style={{ "--wipe": pct } as CSSProperties}
    >
      <div className="wipe-header flex items-center justify-between [gap:var(--sp-4)]">
        <div
          className="wipe-readout inline-flex items-baseline [gap:var(--sp-2)] [transition:opacity_var(--qtf)]"
          data-active={pct >= 50 ? "true" : undefined}
        >
          <span className="eyebrow">{beforeLabel}</span>
          <strong className="wipe-time [font-size:24px] [font-weight:500] [font-variant-numeric:tabular-nums]">{r1}</strong>
        </div>
        <div
          className="wipe-readout is-after inline-flex items-baseline [gap:var(--sp-2)] [transition:opacity_var(--qtf)]"
          data-active={pct <= 50 ? "true" : undefined}
        >
          <span className="eyebrow">{afterLabel}</span>
          <strong className="wipe-time is-accent [font-size:24px] [font-weight:500] [font-variant-numeric:tabular-nums]">{r2}</strong>
        </div>
      </div>

      <div
        ref={trackRef}
        className="wipe-track relative [border-radius:var(--r-window)] overflow-hidden [border:1px_solid_var(--line)] [min-height:360px] select-none [touch-action:pan-y]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Base layer: After (15-min cited draft) */}
        <div className="wipe-pane wipe-pane-after flex flex-col justify-between [gap:var(--sp-4)] [padding:var(--sp-6)_var(--sp-6)_var(--sp-6)_calc(var(--wipe)*1%_+_var(--sp-6))] [@media(max-width:800px)]:[padding:var(--sp-5)] [background:var(--n1)] [color:var(--on-dark)]" data-surface="dark">
          <div className="wipe-pane-badge inline-flex items-center [align-self:flex-start] [gap:var(--sp-2)] [padding:var(--sp-1)_var(--sp-3)] [border-radius:var(--r-chip)]">
            <Check size={13} aria-hidden="true" />
            <span className="eyebrow">
              {afterLabel} · {r2}
            </span>
          </div>
          <div className="wipe-proposal-wrap [max-width:420px]" aria-hidden="true">
            <SceneProposal locale={locale} size="compact" step={6} />
          </div>
          <p className="wipe-desc on-dark m-0 [font-size:15px] [line-height:1.65] [max-width:62ch]">{afterText}</p>
        </div>

        {/* Masked overlay layer: Before (2-day manual 4-step scatter) using compositor translate3d */}
        <div className="wipe-mask inset-0 overflow-hidden">
          <div className="wipe-mask-inner wipe-pane wipe-pane-before w-full flex flex-col justify-between [gap:var(--sp-4)] [padding:var(--sp-6)] [background:var(--p2)] [color:var(--ink)]">
            <div className="wipe-pane-badge is-before inline-flex items-center [align-self:flex-start] [gap:var(--sp-2)] [padding:var(--sp-1)_var(--sp-3)] [border-radius:var(--r-chip)]">
              <FileText size={13} aria-hidden="true" />
              <span className="eyebrow">
                {beforeLabel} · {r1}
              </span>
            </div>
            <ol className="wipe-manual-steps grid [grid-template-columns:repeat(2,minmax(0,1fr))] [@media(max-width:800px)]:[grid-template-columns:minmax(0,1fr)] [gap:var(--sp-3)] list-none m-0 p-0 [max-width:460px]" aria-hidden="true">
              {bSteps.map((st, idx) => (
                <li key={idx} className="wipe-manual-card flex flex-col [gap:var(--sp-1)] [padding:var(--sp-3)] [border-radius:var(--r-control)] [background:var(--p0)] [border:1px_dashed_var(--line)] [font-size:14px] [font-weight:500] [color:var(--ink)]">
                  <span className="label">{`0${idx + 1}`}</span>
                  <span>{st}</span>
                </li>
              ))}
            </ol>
            <p className="wipe-desc m-0 [font-size:15px] [line-height:1.65] [max-width:62ch]">{beforeText}</p>
          </div>
        </div>

        {/* Draggable / keyboard slider handle */}
        <div
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          className="wipe-handle absolute inset-0 w-full pointer-events-none"
          onKeyDown={onKeyDown}
        >
          <span className="wipe-handle-line absolute [top:0] [bottom:0] [left:-1px] [width:2px] [background:var(--cyan)] [box-shadow:var(--glow-state)]" aria-hidden="true" />
          <span className="wipe-handle-knob absolute [top:50%] [left:-22px] [width:44px] [height:44px] [border-radius:var(--r-chip)] [background:var(--n1)] [border:1.5px_solid_var(--cyan)] [color:var(--ice)] grid [place-items:center] pointer-events-auto" aria-hidden="true">
            <ArrowLeftRight size={16} />
          </span>
        </div>
      </div>
    </div>
  );
}
