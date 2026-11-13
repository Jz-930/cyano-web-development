"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Pause, Play } from "lucide-react";
import { type Locale, getMediaMeta, siteCopy, t } from "@/lib/content";

const SOURCE_ACCENTS = ["#22D3EE", "#60A5FA", "#FBBF24"];

/**
 * HeroProvenanceStage:
 * Sleek Cinema Showcase Window presenting real production system interface +
 * live citation provenance + "2 days -> 15 min" outcome without occluding screenshot text.
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
        setCheckStep(
          next === stage.sources.length - 1
            ? stage.checkTotal
            : Math.max(
                2,
                Math.round(((next + 1) / stage.sources.length) * stage.checkTotal)
              )
        );
        return next;
      });
    }, 2800);

    return () => clearInterval(id);
  }, [paused, stage.checkTotal, stage.sources.length]);

  return (
    <div className="relative mx-auto w-full max-w-[1180px]">
      {/* Cyano Cyan + Sapphire + Warm Amber Ambient Stage Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 rounded-[36px] bg-gradient-to-r from-[#22D3EE]/20 via-[#2563EB]/16 to-[#F59E0B]/14 blur-3xl"
      />

      <div className="relative overflow-hidden rounded-[20px] border border-white/[0.14] bg-[#040D16]/96 shadow-[0_40px_100px_-24px_rgba(2,12,24,0.92)] backdrop-blur-2xl">
        {/* Minimalist Titanium Window Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.09] bg-[#02080E]/92 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#22D3EE]/85" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#60A5FA]/85" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]/85" />
            </span>
            <span className="font-mono-tech text-[13px] font-semibold text-[#F8FAFC]">
              {stage.systemBadge}
            </span>
            <span className="hidden text-[12px] text-[#94A3B8] sm:inline">
              · {stage.projectTag}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-[12px] text-[#E2E8F0]">
              <CheckCircle2 size={14} className="text-[#22D3EE]" />
              <span>{stage.checkLabel}</span>
              <span className="font-mono-tech font-bold text-[#FBBF24]">
                {checkStep}/{stage.checkTotal}
              </span>
            </span>

            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={t(
                locale,
                paused ? "播放溯源演示动画" : "暂停溯源演示动画",
                paused ? "Play provenance trace animation" : "Pause provenance trace animation"
              )}
              className="inline-flex min-h-[30px] min-w-[30px] items-center gap-1.5 text-[12px] font-medium text-[#94A3B8] transition-colors hover:text-white"
            >
              {paused ? <Play size={13} /> : <Pause size={13} />}
              <span>{paused ? t(locale, "播放", "Play") : t(locale, "暂停", "Pause")}</span>
            </button>
          </div>
        </div>

        {/* Clean Split Showcase: Left Unobstructed Production UI | Right Hairline Provenance Trace */}
        <div className="grid lg:grid-cols-[1.52fr_0.48fr]">
          {/* Left: Full, Unobstructed Production Screenshot */}
          <div className="bg-[#02070D] p-3 sm:p-5">
            <div className="overflow-hidden rounded-xl border border-white/[0.08]">
              <Image
                src={stage.screenshot}
                alt={`${stage.systemBadge} — ${stage.projectTag}`}
                width={imgMeta.width}
                height={imgMeta.height}
                sizes="(max-width: 1024px) 94vw, 760px"
                placeholder={imgMeta.blurDataURL ? "blur" : "empty"}
                blurDataURL={imgMeta.blurDataURL || undefined}
                className="block h-auto w-full"
              />
            </div>
          </div>

          {/* Right: Open Hairline Provenance Column */}
          <div className="flex flex-col justify-between border-t border-white/[0.09] bg-[#05101A] p-5 sm:p-6 lg:border-t-0 lg:border-l">
            <div>
              <div className="font-mono-tech text-[12px] font-semibold uppercase tracking-[0.12em] text-[#22D3EE]">
                {t(locale, "实时引用溯源链路", "LIVE SOURCE PROVENANCE")}
              </div>

              <div className="mt-4 divide-y divide-white/[0.08]">
                {stage.sources.map((src, idx) => {
                  const selected = activeSrc === idx;
                  const accent = SOURCE_ACCENTS[idx % SOURCE_ACCENTS.length];
                  return (
                    <button
                      key={src.code}
                      type="button"
                      onClick={() => {
                        setActiveSrc(idx);
                        setPaused(true);
                      }}
                      className="group relative flex w-full flex-col items-start py-4 pl-4 text-left transition-opacity first:pt-2 last:pb-2"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute top-3 bottom-3 left-0 w-[2px] rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: selected ? accent : "rgba(148,163,184,0.25)",
                          opacity: selected ? 1 : 0.45,
                        }}
                      />
                      <span
                        className="font-mono-tech text-[12px] font-semibold"
                        style={{ color: selected ? accent : "#94A3B8" }}
                      >
                        {src.code}
                      </span>
                      <span
                        className={`mt-1 text-[14px] font-semibold leading-snug transition-colors ${
                          selected ? "text-white" : "text-[#CBD5E1] group-hover:text-white"
                        }`}
                      >
                        {src.title}
                      </span>
                      <span className="mt-1 text-[12px] leading-relaxed text-[#94A3B8]">
                        {src.meta}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clean Unboxed Outcome Summary at Bottom */}
            <div className="mt-5 border-t border-white/[0.09] pt-4">
              <div className="font-mono-tech text-[22px] font-bold tracking-tight text-[#FBBF24]">
                {stage.outcomeValue}
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-[#CBD5E1]">
                {stage.outcomeDetail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
