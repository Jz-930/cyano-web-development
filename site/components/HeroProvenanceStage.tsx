"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2, FileCheck2, Pause, Play, Sparkles } from "lucide-react";
import { type Locale, getMediaMeta, siteCopy, t } from "@/lib/content";

/**
 * HeroProvenanceStage (G-01 + A-02 + D-2):
 * Upright real client system screenshot (proposal builder on `/`, English-UI IT Wiki on `/en`)
 * paired with interactive source provenance traces, live check counter, and pause/play control.
 */
export function HeroProvenanceStage({ locale }: { locale: Locale }) {
  const stage = siteCopy.home.heroStage[locale];
  const imgMeta = getMediaMeta(stage.screenshot);

  const [activeSrc, setActiveSrc] = useState(0);
  const [paused, setPaused] = useState(false);
  const [checkStep, setCheckStep] = useState(stage.checkTotal);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPaused(true);
      setCheckStep(stage.checkTotal);
      return;
    }
    if (paused) return;

    const id = setInterval(() => {
      setActiveSrc((prev) => {
        const next = (prev + 1) % stage.sources.length;
        // Animate check counter upward across cycle
        setCheckStep(
          next === stage.sources.length - 1
            ? stage.checkTotal
            : Math.max(2, Math.round(((next + 1) / stage.sources.length) * stage.checkTotal))
        );
        return next;
      });
    }, 2600);

    return () => clearInterval(id);
  }, [paused, stage.checkTotal, stage.sources.length]);

  return (
    <div className="relative w-full">
      {/* Outer ambient halo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 rounded-[28px] bg-gradient-to-tr from-[#062F3A]/45 via-[#3FA0A6]/18 to-[#7EF5D6]/20 blur-2xl"
      />

      <div className="relative overflow-hidden rounded-[22px] border border-[#7EF5D6]/28 bg-[#051015]/94 p-3.5 shadow-[var(--shadow-stage)] backdrop-blur-xl sm:p-5">
        {/* Console top bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#3FA0A6]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#52C7CC]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#7EF5D6]" />
            </span>
            <span className="font-mono-tech text-[12px] font-semibold tracking-[0.04em] text-[#E4F3F4]">
              {stage.systemBadge}
            </span>
            <span className="hidden rounded-full border border-[#7EF5D6]/25 bg-[#0A252E] px-2.5 py-0.5 text-[12px] text-[#93B5B9] sm:inline-block">
              {stage.projectTag}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={t(
              locale,
              paused ? "播放溯源演示动画" : "暂停溯源演示动画",
              paused ? "Play provenance trace animation" : "Pause provenance trace animation"
            )}
            className="inline-flex min-h-[36px] min-w-[36px] items-center gap-1.5 rounded-lg border border-white/14 bg-white/5 px-2.5 text-[12px] font-medium text-[#B4CFD2] transition-colors hover:border-[#7EF5D6]/50 hover:text-[#7EF5D6]"
          >
            {paused ? <Play size={13} /> : <Pause size={13} />}
            <span>{paused ? t(locale, "播放", "Play") : t(locale, "暂停", "Pause")}</span>
          </button>
        </div>

        {/* Upright, crisp real production screenshot (zoom-cropped on `/` per G-01 & D-5) */}
        <div className="relative mt-3.5 overflow-hidden rounded-xl border border-white/12 bg-[#08171D]">
          <Image
            src={stage.screenshot}
            alt={`${stage.systemBadge} — ${stage.projectTag}`}
            width={imgMeta.width}
            height={imgMeta.height}
            priority
            sizes="(max-width: 1024px) 94vw, 640px"
            placeholder={imgMeta.blurDataURL ? "blur" : "empty"}
            blurDataURL={imgMeta.blurDataURL || undefined}
            className={`block h-auto w-full object-cover transition-transform duration-500 ${
              locale === "zh"
                ? "scale-[1.36] origin-[92%_16%]"
                : "scale-[1.03] origin-top"
            }`}
          />

          {/* Interactive Source Highlight Callout Frames inside UI canvas (G-01) */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute rounded-lg border transition-all duration-300 ${
              locale === "zh"
                ? "top-[16%] right-[5%] h-[28%] w-[52%]"
                : "top-[28%] left-[21%] h-[29%] w-[26%]"
            } ${
              activeSrc === 0
                ? "border-[#7EF5D6] bg-[#7EF5D6]/10 shadow-[0_0_18px_rgba(126,245,214,0.28)]"
                : "border-[#7EF5D6]/30 bg-transparent"
            }`}
          >
            <span className="absolute -top-2.5 left-2 rounded bg-[#04141A]/95 px-1.5 py-0.5 font-mono-tech text-[12px] font-semibold text-[#7EF5D6]">
              SRC 01
            </span>
          </div>

          <div
            aria-hidden="true"
            className={`pointer-events-none absolute rounded-lg border transition-all duration-300 ${
              locale === "zh"
                ? "top-[48%] right-[5%] h-[24%] w-[52%]"
                : "top-[28%] right-[4%] h-[42%] w-[28%]"
            } ${
              activeSrc >= 1
                ? "border-[#7EF5D6] bg-[#7EF5D6]/10 shadow-[0_0_18px_rgba(126,245,214,0.28)]"
                : "border-[#7EF5D6]/30 bg-transparent"
            }`}
          >
            <span className="absolute -top-2.5 left-2 rounded bg-[#04141A]/95 px-1.5 py-0.5 font-mono-tech text-[12px] font-semibold text-[#7EF5D6]">
              {activeSrc === 2 ? "SRC 03" : "SRC 02"}
            </span>
          </div>

          {/* Subtle bottom gradient vignette so provenance overlay connects seamlessly */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#051015]/85 to-transparent"
          />

          {/* Live verification counter pill overlaid cleanly in bottom-right corner */}
          <div className="absolute right-3 bottom-3 inline-flex items-center gap-2 rounded-full border border-[#7EF5D6]/45 bg-[#04141A]/92 px-3 py-1.5 backdrop-blur-md">
            <CheckCircle2 size={14} className="text-[#7EF5D6]" />
            <span className="text-[12px] font-medium text-[#D8ECEE]">
              {stage.checkLabel}
            </span>
            <span className="font-mono-tech rounded bg-[#7EF5D6]/18 px-1.5 py-0.5 text-[12px] font-bold text-[#7EF5D6]">
              {checkStep}/{stage.checkTotal}
            </span>
          </div>
        </div>

        {/* SVG Provenance Trace Connectors (desktop/tablet) */}
        <svg
          viewBox="0 0 600 28"
          fill="none"
          aria-hidden="true"
          className="mt-1 hidden h-7 w-full sm:block"
        >
          {[100, 300, 500].map((x, idx) => {
            const isCurrent = activeSrc === idx;
            return (
              <g key={x}>
                <path
                  d={`M ${x} 26 C ${x} 12, 300 16, 300 2`}
                  stroke={isCurrent ? "#7EF5D6" : "rgba(126,245,214,0.22)"}
                  strokeWidth={isCurrent ? "2" : "1.2"}
                  className={isCurrent && !paused ? "svg-trace-animated" : ""}
                />
                <circle
                  cx={x}
                  cy="25"
                  r={isCurrent ? "3.5" : "2.2"}
                  fill={isCurrent ? "#7EF5D6" : "#3FA0A6"}
                />
              </g>
            );
          })}
          <circle cx="300" cy="3" r="3.5" fill="#7EF5D6" />
        </svg>

        {/* Interactive 3 Source Evidence Cards */}
        <div className="mt-2 grid gap-2 sm:mt-0 sm:grid-cols-3">
          {stage.sources.map((src, idx) => {
            const selected = activeSrc === idx;
            return (
              <button
                key={src.code}
                type="button"
                onClick={() => {
                  setActiveSrc(idx);
                  setPaused(true);
                }}
                className={`flex min-h-[68px] flex-col items-start justify-between rounded-xl border p-2.5 text-left transition-all ${
                  selected
                    ? "border-[#7EF5D6]/65 bg-[#0B2630] shadow-[0_0_24px_-6px_rgba(126,245,214,0.35)]"
                    : "border-white/10 bg-[#07161C]/80 hover:border-[#7EF5D6]/35"
                }`}
              >
                <span className="flex w-full items-center justify-between gap-1">
                  <span className="font-mono-tech text-[12px] font-semibold text-[#7EF5D6]">
                    {src.code}
                  </span>
                  <FileCheck2
                    size={13}
                    className={selected ? "text-[#7EF5D6]" : "text-[#52C7CC]/60"}
                  />
                </span>
                <span className="mt-1 text-[13px] font-semibold leading-snug text-[#F2FAF9]">
                  {src.title}
                </span>
                <span className="mt-0.5 text-[12px] text-[#93B5B9]">
                  {src.meta}
                </span>
              </button>
            );
          })}
        </div>

        {/* Highlighted Outcome Finale Banner */}
        <div className="mt-3 flex flex-col justify-between gap-2 rounded-xl border border-[#7EF5D6]/32 bg-gradient-to-r from-[#062F3A]/90 via-[#093844]/85 to-[#06262F]/90 px-3.5 py-2.5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="shrink-0 text-[#7EF5D6]" />
            <span className="font-mono-tech text-[15px] font-bold text-[#7EF5D6]">
              {stage.outcomeValue}
            </span>
          </div>
          <span className="text-[12px] text-[#D7ECEE] sm:text-[13px]">
            {stage.outcomeDetail}
          </span>
        </div>
      </div>
    </div>
  );
}
