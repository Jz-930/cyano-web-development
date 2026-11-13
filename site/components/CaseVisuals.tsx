"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Expand,
  Globe2,
  UserCheck,
  X,
} from "lucide-react";
import {
  type CaseItem,
  type Locale,
  casesList,
  getMediaMeta,
  href,
  industriesList,
  isDemoEnabled,
  pick,
  siteCopy,
  t,
} from "@/lib/content";

const INDUSTRY_ACCENT: Record<string, string> = {
  manufacturing: "#0B7A8C",
  consulting: "#1D4ED8",
  "enterprise-it": "#0E7490",
  retail: "#B45309",
  "real-estate": "#6D28D9",
  media: "#0369A1",
};

/**
 * Unboxed Gallery-Style CaseCard:
 * Crisp 16:10 dark titanium studio browser frame on top,
 * open editorial typography below — ZERO outer card-border clutter!
 */
export function CaseCard({
  item,
  locale,
}: {
  item: CaseItem;
  locale: Locale;
}) {
  const mainImg = item.images[item.mainImageIndex] ?? item.images[0];
  const meta = getMediaMeta(mainImg.src);
  const showDemo = Boolean(item.demoUrl && isDemoEnabled(item.slug));
  const accent = INDUSTRY_ACCENT[item.industryKey] ?? "#4F46E5";

  return (
    <article className="group flex flex-col">
      {/* Studio Browser Frame */}
      <Link
        href={href(locale, `/cases/${item.slug}`)}
        aria-label={pick(locale, item.title)}
        className="block overflow-hidden rounded-2xl bg-[#07111B] p-2.5 shadow-[0_24px_56px_-20px_rgba(11,21,32,0.22)] ring-1 ring-slate-900/[0.08] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_32px_70px_-18px_rgba(11,122,140,0.24)] sm:p-3.5"
      >
        <div className="mb-2.5 flex items-center justify-between px-1.5">
          <div className="flex items-center gap-2">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-[#FB7185]/75" />
              <span className="h-2 w-2 rounded-full bg-[#FBBF24]/80" />
              <span className="h-2 w-2 rounded-full bg-[#34D399]/80" />
            </span>
            <span className="font-mono-tech truncate text-[12px] text-[#94A3B8]">
              {pick(locale, item.system)}
            </span>
          </div>
          <ArrowUpRight
            size={15}
            className="shrink-0 text-[#94A3B8] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
          />
        </div>

        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#060911]">
          <Image
            src={mainImg.src}
            alt={`${pick(locale, item.system)} — ${pick(locale, mainImg.caption)}`}
            width={meta.width}
            height={meta.height}
            sizes="(max-width: 768px) 94vw, (max-width: 1200px) 46vw, 600px"
            placeholder={meta.blurDataURL ? "blur" : "empty"}
            blurDataURL={meta.blurDataURL || undefined}
            className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.015] ${
              item.isMobileFrame
                ? "object-contain p-3"
                : "object-cover object-top"
            }`}
          />
        </div>
      </Link>

      {/* Open Unboxed Editorial Typography Below */}
      <div className="flex flex-1 flex-col justify-between pt-6">
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <span
              className="font-mono-tech text-[12px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: accent }}
            >
              {pick(locale, item.industry)}
            </span>
            <span className="font-mono-tech inline-flex items-baseline gap-1.5 text-[15px] font-bold text-[#0B1120]">
              <span>{pick(locale, item.stats[0].value)}</span>
              <span className="font-sans text-[12px] font-normal text-[#526277]">
                {pick(locale, item.stats[0].label)}
              </span>
            </span>
          </div>

          <h3 className="mt-2.5 text-[21px] font-semibold leading-snug text-[#0B1120]">
            <Link
              href={href(locale, `/cases/${item.slug}`)}
              className="inline-block py-0.5 transition-colors hover:text-[#4F46E5]"
            >
              {pick(locale, item.title)}
            </Link>
          </h3>

          <p className="mt-2 text-[14px] leading-relaxed text-[#526277]">
            {pick(locale, item.profile)}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-6 border-t border-slate-200/80 pt-4">
          <Link
            href={href(locale, `/cases/${item.slug}`)}
            className="link-inline-tech"
          >
            <span>{t(locale, "查看项目拆解", "Read case study")}</span>
            <ArrowRight size={15} />
          </Link>

          {showDemo && item.demoUrl && (
            <a
              href={item.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[36px] items-center gap-1 text-[13px] font-medium text-[#4F46E5] transition-colors hover:text-[#0B1120]"
            >
              <span>{pick(locale, siteCopy.demo.publicButton)}</span>
              <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * CaseFilterGrid with URL sync + Core vs Specialized Vertical grouping.
 */
export function CaseFilterGrid({ locale }: { locale: Locale }) {
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const syncFromUrl = () => {
      const param = new URLSearchParams(window.location.search).get("industry");
      setFilter(
        param && industriesList.some((i) => i.key === param) ? param : "all"
      );
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  const applyFilter = (key: string) => {
    setFilter(key);
    const url = new URL(window.location.href);
    if (key === "all") url.searchParams.delete("industry");
    else url.searchParams.set("industry", key);
    window.history.replaceState(null, "", url.pathname + url.search);
  };

  const filtered =
    filter === "all"
      ? casesList
      : casesList.filter((c) => c.industryKey === filter);

  const coreCases = filtered.filter((c) => c.group === "core");
  const verticalCases = filtered.filter((c) => c.group === "vertical");

  return (
    <div className="space-y-16">
      {/* Clean Minimal Filter Strip */}
      <div
        role="group"
        aria-label={t(locale, "按行业筛选案例", "Filter case studies by industry")}
        className="flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-slate-200 pb-4"
      >
        <button
          type="button"
          aria-pressed={filter === "all"}
          onClick={() => applyFilter("all")}
          className={`min-h-[38px] rounded-full px-4 text-[13px] font-semibold transition-colors ${
            filter === "all"
              ? "bg-[#0B1120] text-white"
              : "text-[#526277] hover:bg-slate-100 hover:text-[#0B1120]"
          }`}
        >
          {t(locale, "全部项目", "All projects")} ({casesList.length})
        </button>

        {industriesList.map((ind) => {
          const active = filter === ind.key;
          return (
            <button
              key={ind.key}
              type="button"
              aria-pressed={active}
              onClick={() => applyFilter(ind.key)}
              className={`min-h-[38px] rounded-full px-4 text-[13px] font-medium transition-colors ${
                active
                  ? "bg-[#0B1120] font-semibold text-white"
                  : "text-[#526277] hover:bg-slate-100 hover:text-[#0B1120]"
              }`}
            >
              {pick(locale, ind.label)}
            </button>
          );
        })}
      </div>

      {/* Group 1: Core Enterprise Workflow Cases */}
      {coreCases.length > 0 && (
        <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
          {coreCases.map((c) => (
            <CaseCard key={c.slug} item={c} locale={locale} />
          ))}
        </div>
      )}

      {/* Group 2: Specialized Vertical Systems */}
      {verticalCases.length > 0 && (
        <div className="space-y-10 border-t border-slate-200 pt-14">
          {filter === "all" && (
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
              <h2 className="text-[24px] font-semibold text-[#0B1120]">
                {t(
                  locale,
                  "垂直场景定制系统",
                  "Specialized vertical systems"
                )}
              </h2>
              <span className="font-mono-tech text-[12px] font-medium text-[#526277]">
                {t(
                  locale,
                  "多物业资产记账 · 百万字长篇设定记忆引擎",
                  "Property Ledger OCR · Long-Form Memory Engine"
                )}
              </span>
            </div>
          )}
          <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
            {verticalCases.map((c) => (
              <CaseCard key={c.slug} item={c} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * BeforeAfterTracks:
 * Pure proportional graphic bars + unclipped legend labels below (ZERO truncated words inside bars!).
 */
export function BeforeAfterTracks({
  item,
  locale,
}: {
  item: CaseItem;
  locale: Locale;
}) {
  const beforeTotalWeight = item.beforeSegments.reduce((acc, s) => acc + s.weight, 0);
  const afterTotalWeight = item.afterSegments.reduce((acc, s) => acc + s.weight, 0);
  const beforeShades = ["#FB7185", "#F97316", "#F59E0B", "#EAB308"];
  const afterShades = ["#22D3EE", "#6366F1", "#8B5CF6", "#34D399"];

  return (
    <div className="divide-y divide-slate-200/90 border-t border-b border-slate-200/90">
      {/* BEFORE Track */}
      <div className="py-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-mono-tech text-[12px] font-semibold uppercase tracking-[0.1em] text-[#E11D48]">
            {t(locale, "改造前人工流程", "BEFORE · MANUAL WORKFLOW")}
          </span>
          <span className="font-mono-tech text-[18px] font-bold text-[#0B1120]">
            {pick(locale, item.beforeTotalLabel)}
          </span>
        </div>
        <p className="mt-1.5 text-[14px] text-[#526277]">
          {pick(locale, item.beforeSummary)}
        </p>

        {/* Pure Segmented Proportional Bar */}
        <div className="mt-5 flex h-3 w-full gap-1 overflow-hidden rounded-full bg-slate-100">
          {item.beforeSegments.map((seg, idx) => (
            <div
              key={idx}
              style={{
                width: `${(seg.weight / beforeTotalWeight) * 100}%`,
                backgroundColor: beforeShades[idx % beforeShades.length],
              }}
              className="h-full first:rounded-l-full last:rounded-r-full"
            />
          ))}
        </div>

        {/* Clean Unclipped Segment Legend */}
        <div className="mt-3.5 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#334155]">
          {item.beforeSegments.map((seg, idx) => (
            <span key={idx} className="inline-flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: beforeShades[idx % beforeShades.length] }}
              />
              <span>{pick(locale, seg.label)}</span>
            </span>
          ))}
        </div>
      </div>

      {/* AFTER Track */}
      <div className="py-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-mono-tech text-[12px] font-semibold uppercase tracking-[0.1em] text-[#4F46E5]">
            {t(locale, "接入定制系统后", "AFTER · ENGINEERED WORKFLOW")}
          </span>
          <span className="font-mono-tech text-[18px] font-bold text-[#4F46E5]">
            {pick(locale, item.afterTotalLabel)}
          </span>
        </div>
        <p className="mt-1.5 text-[14px] text-[#526277]">
          {pick(locale, item.afterSummary)}
        </p>

        {/* Proportional Compressed Bar */}
        <div className="mt-5 h-3 w-full rounded-full bg-slate-100">
          <div
            style={{ width: `${Math.max(item.afterWidthPercent, 22)}%` }}
            className="flex h-full gap-1 overflow-hidden rounded-full"
          >
            {item.afterSegments.map((seg, idx) => (
              <div
                key={idx}
                style={{
                  width: `${(seg.weight / afterTotalWeight) * 100}%`,
                  backgroundColor: seg.isHumanReview
                    ? "#F59E0B"
                    : afterShades[idx % afterShades.length],
                }}
                className="h-full"
              />
            ))}
          </div>
        </div>

        {/* Clean Unclipped Segment Legend */}
        <div className="mt-3.5 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#334155]">
          {item.afterSegments.map((seg, idx) => (
            <span key={idx} className="inline-flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: seg.isHumanReview
                    ? "#F59E0B"
                    : afterShades[idx % afterShades.length],
                }}
              />
              <span className={seg.isHumanReview ? "font-semibold text-[#B45309]" : ""}>
                {pick(locale, seg.label)}
              </span>
              {seg.isHumanReview && <UserCheck size={13} className="text-[#D97706]" />}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * AnnotatedSystemGallery:
 * Clean dark showcase frame + open hairline annotation list on the right (no cramped boxes!).
 */
export function AnnotatedSystemGallery({
  item,
  locale,
}: {
  item: CaseItem;
  locale: Locale;
}) {
  const [currentIdx, setCurrentIdx] = useState(item.mainImageIndex);
  const [activeHotspot, setActiveHotspot] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const currentImg = item.images[currentIdx] ?? item.images[0];
  const imgMeta = getMediaMeta(currentImg.src);
  const showHotspots = currentIdx === item.mainImageIndex;
  const pinColors = ["#38BDF8", "#818CF8", "#34D399", "#FBBF24"];

  useEffect(() => {
    if (!lightboxOpen) return;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") {
        setCurrentIdx((v) => (v + 1) % item.images.length);
      }
      if (e.key === "ArrowLeft") {
        setCurrentIdx((v) => (v - 1 + item.images.length) % item.images.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [lightboxOpen, item.images.length]);

  return (
    <div className="space-y-8">
      <div className="grid gap-10 lg:grid-cols-[1.45fr_0.55fr] lg:items-start">
        {/* Left Screenshot Stage */}
        <div>
          <div className="overflow-hidden rounded-2xl bg-[#0B101D] p-3 shadow-[0_28px_70px_-22px_rgba(15,23,42,0.28)] sm:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
              <span className="font-mono-tech text-[12px] text-[#CBD5E1]">
                {String(currentIdx + 1).padStart(2, "0")} /{" "}
                {String(item.images.length).padStart(2, "0")} ·{" "}
                {pick(locale, currentImg.caption)}
              </span>

              <button
                ref={triggerRef}
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="inline-flex min-h-[32px] items-center gap-1.5 text-[12px] font-medium text-[#93C5FD] transition-colors hover:text-white"
              >
                <Expand size={13} />
                <span>{t(locale, "全屏查看原图", "Expand full screen")}</span>
              </button>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-[#060911]">
              <Image
                src={currentImg.src}
                alt={`${pick(locale, item.system)} — ${pick(locale, currentImg.caption)}`}
                width={imgMeta.width}
                height={imgMeta.height}
                sizes="(max-width: 1024px) 94vw, 780px"
                placeholder={imgMeta.blurDataURL ? "blur" : "empty"}
                blurDataURL={imgMeta.blurDataURL || undefined}
                className={`mx-auto block ${
                  item.isMobileFrame
                    ? "max-h-[520px] w-auto object-contain py-3"
                    : "h-auto w-full object-cover"
                }`}
              />

              {/* Subtle Numbered Pins on Primary Screen */}
              {showHotspots &&
                item.hotspots.map((spot, idx) => {
                  const active = activeHotspot === idx;
                  const pinColor = pinColors[idx % pinColors.length];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveHotspot(idx)}
                      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                      aria-label={`${idx + 1}: ${pick(locale, spot.title)}`}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full font-mono-tech text-[12px] font-bold transition-transform ${
                        active
                          ? "scale-115 bg-white text-[#0B1120] ring-4 ring-white/35"
                          : "bg-[#0B1120]/90 text-white ring-2 ring-white/50 hover:scale-105"
                      }`}
                    >
                      <span style={active ? { color: "#0B1120" } : { color: pinColor }}>
                        {idx + 1}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          {locale === "en" && item.interfaceLanguage === "zh" && (
            <p className="mt-3 flex items-center gap-2 text-[13px] text-[#526277]">
              <Globe2 size={14} className="shrink-0 text-[#4F46E5]" />
              <span>
                Note: Client interface shown in production Chinese as deployed for the client’s working team; annotations on the right translate each workflow module.
              </span>
            </p>
          )}
        </div>

        {/* Right Open Hairline Callout List (ZERO nested boxes!) */}
        <div>
          <div className="font-mono-tech text-[12px] font-semibold uppercase tracking-[0.1em] text-[#526277]">
            {t(locale, "界面核心模块拆解", "INTERFACE MODULE BREAKDOWN")}
          </div>

          <div className="mt-3 divide-y divide-slate-200/90 border-t border-b border-slate-200/90">
            {item.hotspots.map((spot, idx) => {
              const active = showHotspots && activeHotspot === idx;
              const pinColor = pinColors[idx % pinColors.length];
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCurrentIdx(item.mainImageIndex);
                    setActiveHotspot(idx);
                  }}
                  className="relative flex w-full items-start gap-3.5 py-4 pl-3 text-left transition-colors"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-3 bottom-3 left-0 w-[2.5px] rounded-full"
                    style={{
                      backgroundColor: active ? pinColor : "transparent",
                    }}
                  />
                  <span
                    className="font-mono-tech mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
                    style={
                      active
                        ? { backgroundColor: "#0B1120", color: "#FFFFFF" }
                        : { backgroundColor: "#E2E8F0", color: "#334155" }
                    }
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-[15px] font-semibold text-[#0B1120]">
                      {pick(locale, spot.title)}
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-[#526277]">
                      {pick(locale, spot.detail)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Thumbnail Strip */}
      {item.images.length > 1 && (
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {item.images.map((im, idx) => {
            const m = getMediaMeta(im.src);
            const isCurrent = idx === currentIdx;
            return (
              <button
                key={im.src}
                type="button"
                aria-pressed={isCurrent}
                aria-label={
                  t(locale, `切换至界面 ${idx + 1}：`, `View screen ${idx + 1}: `) +
                  pick(locale, im.caption)
                }
                onClick={() => setCurrentIdx(idx)}
                className={`relative h-[64px] w-[108px] overflow-hidden rounded-xl transition-all ${
                  isCurrent
                    ? "ring-2 ring-[#4F46E5] ring-offset-2"
                    : "opacity-65 hover:opacity-100"
                }`}
              >
                <Image
                  src={im.src}
                  alt=""
                  width={m.width}
                  height={m.height}
                  sizes="110px"
                  className="h-full w-full object-cover object-top"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          id="case-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={pick(locale, item.system)}
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050811]/95 p-4 backdrop-blur-xl"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-6xl flex-col items-center"
          >
            <div className="mb-3 flex w-full items-center justify-between text-white">
              <span className="font-mono-tech text-[13px] text-[#CBD5E1]">
                {String(currentIdx + 1).padStart(2, "0")} /{" "}
                {String(item.images.length).padStart(2, "0")} ·{" "}
                {pick(locale, currentImg.caption)}
              </span>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label={t(locale, "关闭大图", "Close enlarged view")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-[#0B101D] p-2">
              {item.images.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIdx(
                      (v) => (v - 1 + item.images.length) % item.images.length
                    )
                  }
                  aria-label={t(locale, "上一张界面", "Previous screen")}
                  className="absolute left-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#070A12]/85 text-white hover:bg-white/20"
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              <img
                src={currentImg.src}
                alt={pick(locale, currentImg.caption)}
                className="max-h-[76vh] w-auto max-w-full rounded-lg object-contain"
              />

              {item.images.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIdx((v) => (v + 1) % item.images.length)
                  }
                  aria-label={t(locale, "下一张界面", "Next screen")}
                  className="absolute right-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#070A12]/85 text-white hover:bg-white/20"
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * CaseWorkflowGraph:
 * Open 4-Column Architectural Hairline Grid (ZERO card boxes!).
 */
export function CaseWorkflowGraph({
  item,
  locale,
}: {
  item: CaseItem;
  locale: Locale;
}) {
  const stepColors = ["#0891B2", "#4F46E5", "#059669", "#D97706"];

  return (
    <div className="grid gap-10 border-t border-slate-200/90 pt-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-slate-200/80">
      {item.workflowSteps.map((step, idx) => {
        const color = step.humanCheckpoint
          ? "#D97706"
          : stepColors[idx % stepColors.length];
        return (
          <div
            key={idx}
            className={`flex flex-col justify-between ${
              idx === 0
                ? "lg:pr-7"
                : idx === item.workflowSteps.length - 1
                  ? "lg:pl-7"
                  : "lg:px-7"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className="font-mono-tech text-[12px] font-bold uppercase tracking-[0.08em]"
                  style={{ color }}
                >
                  {pick(locale, step.stage)}
                </span>
                {step.humanCheckpoint && (
                  <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#B45309]">
                    <UserCheck size={13} />
                    <span>{t(locale, "人工把关", "Human gate")}</span>
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-[18px] font-semibold text-[#0B1120]">
                {pick(locale, step.title)}
              </h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-[#526277]">
                {pick(locale, step.detail)}
              </p>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-3 text-[13px] text-[#526277]">
              <span>{t(locale, "阶段产物：", "Deliverable: ")}</span>
              <strong className="font-semibold text-[#0B1120]">
                {pick(locale, step.artifact)}
              </strong>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * CaseDeliveryTimeline:
 * Clean Horizontal Milestone Progression (ZERO outer card box!).
 */
export function CaseDeliveryTimeline({
  item,
  locale,
}: {
  item: CaseItem;
  locale: Locale;
}) {
  const dots = ["#22D3EE", "#6366F1", "#8B5CF6", "#F59E0B"];

  return (
    <div className="grid gap-8 border-t border-slate-200/90 pt-8 md:grid-cols-4">
      {item.timeline.map((phase, idx) => (
        <div key={idx} className="relative flex flex-col">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: dots[idx % dots.length] }}
            />
            <span className="font-mono-tech text-[12px] font-bold text-[#4F46E5]">
              0{idx + 1} · {pick(locale, phase.duration)}
            </span>
          </div>
          <h3 className="mt-3 text-[17px] font-semibold text-[#0B1120]">
            {pick(locale, phase.phase)}
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-[#526277]">
            {pick(locale, phase.detail)}
          </p>
        </div>
      ))}
    </div>
  );
}
