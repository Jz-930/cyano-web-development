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

/**
 * Consistent engineered CaseCard (fixes V-11 arbitrary 02/03/01 badge numbers & M-02 mobile crop).
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

  return (
    <article className="card-light card-light-interactive group flex flex-col overflow-hidden">
      <Link
        href={href(locale, `/cases/${item.slug}`)}
        aria-label={pick(locale, item.title)}
        className="relative block overflow-hidden border-b border-[#D3E3E6] bg-[#06151B]"
      >
        {/* Top console header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#041015] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex gap-1" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-[#3FA0A6]/70" />
              <span className="h-2 w-2 rounded-full bg-[#7EF5D6]" />
            </span>
            <span className="font-mono-tech truncate text-[12px] font-medium text-[#D8ECEE]">
              {pick(locale, item.system)}
            </span>
          </div>
          <ArrowUpRight
            size={15}
            className="shrink-0 text-[#7EF5D6] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>

        {/* Crisp 16:10 screenshot viewport; mobile-frame screenshots centered cleanly on dark backdrop */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#081A21]">
          <Image
            src={mainImg.src}
            alt={`${pick(locale, item.system)} — ${pick(locale, mainImg.caption)}`}
            width={meta.width}
            height={meta.height}
            sizes="(max-width: 768px) 94vw, (max-width: 1200px) 46vw, 580px"
            placeholder={meta.blurDataURL ? "blur" : "empty"}
            blurDataURL={meta.blurDataURL || undefined}
            className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.02] ${
              item.isMobileFrame
                ? "object-contain p-2"
                : "object-cover object-top"
            }`}
          />
        </div>
      </Link>

      {/* Card copy & scoped primary metric */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-[#E7F4F5] px-3 py-1 text-[12px] font-semibold text-[#0E5961]">
              {pick(locale, item.industry)}
            </span>
            <span className="font-mono-tech inline-flex items-baseline gap-1.5 text-[14px] font-bold text-[#062F3A]">
              <span>{pick(locale, item.stats[0].value)}</span>
              <span className="font-sans text-[12px] font-medium text-[#496269]">
                {pick(locale, item.stats[0].label)}
              </span>
            </span>
          </div>

          <h3 className="mt-3.5 text-[19px] font-semibold leading-snug text-[#07161A]">
            <Link
              href={href(locale, `/cases/${item.slug}`)}
              className="inline-block py-0.5 hover:text-[#0E5961]"
            >
              {pick(locale, item.title)}
            </Link>
          </h3>

          <p className="mt-2 text-[14px] leading-relaxed text-[#31494F]">
            {pick(locale, item.profile)}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#D3E3E6] pt-4">
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
              className="inline-flex min-h-[38px] items-center gap-1 rounded-full border border-[#0E5961]/30 bg-[#F3FAFA] px-3 py-1 text-[12px] font-semibold text-[#0E5961] transition-colors hover:border-[#0E5961] hover:bg-[#E7F4F5]"
            >
              <span>{pick(locale, siteCopy.demo.publicButton)}</span>
              <ArrowUpRight size={13} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * CaseFilterGrid with URL sync + D-6 Core Enterprise Workflows vs Specialized Vertical Systems grouping.
 */
export function CaseFilterGrid({ locale }: { locale: Locale }) {
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("industry");
    if (param) {
      // Support both industryKey ('manufacturing') and legacy case slug
      const matchedBySlug = casesList.find((c) => c.slug === param);
      setFilter(matchedBySlug ? matchedBySlug.industryKey : param);
    }
  }, []);

  const selectFilter = (val: string) => {
    setFilter(val);
    const url = new URL(window.location.href);
    if (val === "all") url.searchParams.delete("industry");
    else url.searchParams.set("industry", val);
    window.history.replaceState(null, "", url);
  };

  const filtered =
    filter === "all"
      ? casesList
      : casesList.filter(
          (c) => c.industryKey === filter || c.slug === filter
        );

  const coreCases = filtered.filter((c) => c.group === "core");
  const verticalCases = filtered.filter((c) => c.group === "vertical");

  return (
    <div className="space-y-10">
      {/* Filter pill bar */}
      <div
        role="group"
        aria-label={t(locale, "按行业筛选客户项目", "Filter case studies by industry")}
        className="flex flex-wrap items-center gap-2"
      >
        <button
          type="button"
          aria-pressed={filter === "all"}
          onClick={() => selectFilter("all")}
          className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-colors ${
            filter === "all"
              ? "border-[#062F3A] bg-[#062F3A] text-[#F2FAF9]"
              : "border-[#C6DCE0] bg-white text-[#1E373D] hover:border-[#0E5961]"
          }`}
        >
          <span>{t(locale, "全部项目", "All projects")}</span>
          <span className="font-mono-tech text-[12px] opacity-80">06</span>
        </button>

        {industriesList.map((ind) => {
          const active = filter === ind.key;
          return (
            <button
              key={ind.key}
              type="button"
              aria-pressed={active}
              onClick={() => selectFilter(ind.key)}
              className={`inline-flex min-h-[40px] items-center rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors ${
                active
                  ? "border-[#062F3A] bg-[#062F3A] text-[#F2FAF9]"
                  : "border-[#C6DCE0] bg-white text-[#1E373D] hover:border-[#0E5961]"
              }`}
            >
              {pick(locale, ind.label)}
            </button>
          );
        })}
      </div>

      {/* Core Enterprise Workflow Cases */}
      {coreCases.length > 0 && (
        <div className="space-y-5">
          {filter === "all" && (
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#D3E3E6] pb-3">
              <h2 className="text-[22px] font-semibold text-[#07161A]">
                {t(
                  locale,
                  "核心企业工作流系统",
                  "Core enterprise workflow systems"
                )}
              </h2>
              <span className="font-mono-tech text-[12px] font-semibold text-[#0E5961]">
                {t(
                  locale,
                  "销售问答 · 标书方案 · 内部知识库 · 数据查询",
                  "Sales Q&A · Proposals · Internal Wiki · SQL Analytics"
                )}
              </span>
            </div>
          )}
          <div className="grid gap-6 md:grid-cols-2">
            {coreCases.map((c) => (
              <CaseCard key={c.slug} item={c} locale={locale} />
            ))}
          </div>
        </div>
      )}

      {/* Specialized Vertical Systems (D-6) */}
      {verticalCases.length > 0 && (
        <div className="space-y-5 pt-2">
          {filter === "all" && (
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#D3E3E6] pb-3">
              <h2 className="text-[22px] font-semibold text-[#07161A]">
                {t(
                  locale,
                  "垂直场景定制系统",
                  "Specialized vertical systems"
                )}
              </h2>
              <span className="font-mono-tech text-[12px] font-semibold text-[#496269]">
                {t(
                  locale,
                  "多物业资产记账 · 百万字长篇设定记忆引擎",
                  "Property Ledger OCR · Long-Form Memory Engine"
                )}
              </span>
            </div>
          )}
          <div className="grid gap-6 md:grid-cols-2">
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
 * G-12: Proportional Before & After Dual Time-Track Infographic.
 */
export function BeforeAfterTracks({
  item,
  locale,
}: {
  item: CaseItem;
  locale: Locale;
}) {
  const beforeTotalWeight = item.beforeSegments.reduce(
    (acc, s) => acc + s.weight,
    0
  );
  const afterTotalWeight = item.afterSegments.reduce(
    (acc, s) => acc + s.weight,
    0
  );

  return (
    <div className="card-light p-6 md:p-8">
      <div className="grid gap-7">
        {/* BEFORE Track (Full 100% Baseline) */}
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-mono-tech text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8A4B08]">
              {t(locale, "改造前流程", "BEFORE · MANUAL WORKFLOW")}
            </span>
            <span className="font-mono-tech text-[14px] font-bold text-[#8A4B08]">
              {pick(locale, item.beforeTotalLabel)}
            </span>
          </div>
          <p className="mt-1 text-[14px] text-[#31494F]">
            {pick(locale, item.beforeSummary)}
          </p>

          <div className="mt-3 flex min-h-[44px] w-full gap-1 overflow-hidden rounded-xl border border-[#E7B97A] bg-[#FEF6EC] p-1">
            {item.beforeSegments.map((seg, idx) => (
              <div
                key={idx}
                style={{ width: `${(seg.weight / beforeTotalWeight) * 100}%` }}
                className="flex items-center justify-center rounded-lg bg-[#F5DFC1] px-2.5 py-1.5 text-center text-[12px] font-medium text-[#5C3104]"
              >
                <span className="truncate">{pick(locale, seg.label)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AFTER Track (Proportional Compressed Width + Explicit Human Review Gate) */}
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-mono-tech text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0E5961]">
              {t(locale, "接入系统后", "AFTER · ENGINEERED WORKFLOW")}
            </span>
            <span className="font-mono-tech text-[15px] font-bold text-[#062F3A]">
              {pick(locale, item.afterTotalLabel)}
            </span>
          </div>
          <p className="mt-1 text-[14px] text-[#31494F]">
            {pick(locale, item.afterSummary)}
          </p>

          <div className="mt-3 w-full rounded-xl bg-[#EAF4F5] p-1.5">
            <div
              style={{
                width: `${Math.max(item.afterWidthPercent, 34)}%`,
              }}
              className="flex min-h-[42px] min-w-[260px] max-w-full gap-1"
            >
              {item.afterSegments.map((seg, idx) => (
                <div
                  key={idx}
                  style={{ width: `${(seg.weight / afterTotalWeight) * 100}%` }}
                  className={`flex items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 text-center text-[12px] font-semibold ${
                    seg.isHumanReview
                      ? "border border-[#D99B38] bg-[#FFF4DF] text-[#6E3D05]"
                      : "bg-[#062F3A] text-[#7EF5D6]"
                  }`}
                >
                  {seg.isHumanReview && (
                    <UserCheck size={13} className="shrink-0" />
                  )}
                  <span className="truncate">{pick(locale, seg.label)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * G-13 + D-2: Annotated System Screenshot Gallery with Interactive 1-4 Hotspots,
 * All 31 Captioned Screenshots, Accessible Lightbox, and EN Client Interface Note.
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

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerBtnRef = useRef<HTMLButtonElement>(null);

  const currentImg = item.images[currentIdx] ?? item.images[0];
  const imgMeta = getMediaMeta(currentImg.src);
  const showHotspots = currentIdx === item.mainImageIndex;

  useEffect(() => {
    if (!lightboxOpen) return;
    closeBtnRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight")
        setCurrentIdx((v) => (v + 1) % item.images.length);
      if (e.key === "ArrowLeft")
        setCurrentIdx((v) => (v - 1 + item.images.length) % item.images.length);
      if (e.key === "Tab") {
        const btns = [
          ...document.querySelectorAll<HTMLButtonElement>(
            "#case-lightbox button"
          ),
        ];
        if (!btns.length) return;
        const idx = btns.indexOf(document.activeElement as HTMLButtonElement);
        e.preventDefault();
        btns[(idx + (e.shiftKey ? -1 : 1) + btns.length) % btns.length]?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      triggerBtnRef.current?.focus();
    };
  }, [lightboxOpen, item.images.length]);

  return (
    <div className="space-y-5">
      {/* Polite client working-language note on /en when screenshot UI is Chinese (D-2) */}
      {locale === "en" && item.interfaceLanguage === "zh" && (
        <div className="inline-flex items-center gap-2 rounded-xl border border-[#C6DCE0] bg-white px-3.5 py-2 text-[13px] text-[#31494F]">
          <Globe2 size={15} className="shrink-0 text-[#0E5961]" />
          <span>
            Client operating language: Chinese — numbered callouts below explain
            each interface zone in English.
          </span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
        {/* Main Annotated Frame */}
        <div className="overflow-hidden rounded-[20px] border border-[#062F3A]/20 bg-[#051116] p-3 shadow-xl sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
            <span className="font-mono-tech text-[12px] text-[#B4CFD2]">
              {String(currentIdx + 1).padStart(2, "0")} /{" "}
              {String(item.images.length).padStart(2, "0")} ·{" "}
              {pick(locale, item.system)}
            </span>
            <button
              ref={triggerBtnRef}
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 text-[12px] font-medium text-[#E4F3F4] hover:border-[#7EF5D6] hover:text-[#7EF5D6]"
            >
              <Expand size={13} />
              <span>{t(locale, "全屏放大查看", "Enlarge screen")}</span>
            </button>
          </div>

          <div className="relative mt-3 overflow-hidden rounded-xl bg-[#081A21]">
            <Image
              src={currentImg.src}
              alt={`${pick(locale, item.system)} — ${pick(locale, currentImg.caption)}`}
              width={imgMeta.width}
              height={imgMeta.height}
              sizes="(max-width: 1024px) 94vw, 820px"
              placeholder={imgMeta.blurDataURL ? "blur" : "empty"}
              blurDataURL={imgMeta.blurDataURL || undefined}
              className={`block w-full ${
                item.isMobileFrame
                  ? "max-h-[540px] object-contain mx-auto"
                  : "h-auto object-cover"
              }`}
            />

            {/* Interactive 1-4 Numbered Callout Pins on Main Screen */}
            {showHotspots &&
              item.hotspots.map((spot, idx) => {
                const selected = activeHotspot === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`${idx + 1}: ${pick(locale, spot.title)}`}
                    onClick={() => setActiveHotspot(idx)}
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    className={`-translate-x-1/2 -translate-y-1/2 absolute flex h-8 w-8 items-center justify-center rounded-full border-2 font-mono-tech text-[13px] font-bold transition-transform ${
                      selected
                        ? "hotspot-pulse scale-110 border-white bg-[#7EF5D6] text-[#03161B]"
                        : "border-[#7EF5D6] bg-[#04141A]/90 text-[#7EF5D6] hover:scale-105"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
          </div>

          <p className="mt-3 text-[13px] leading-relaxed text-[#C6DFE2]">
            {pick(locale, currentImg.caption)}
          </p>
        </div>

        {/* Right Side: Interactive Callout Guide (or Screen List when viewing secondary screens) */}
        <div className="card-light p-5">
          <div className="flex items-center justify-between border-b border-[#D3E3E6] pb-3">
            <span className="font-mono-tech text-[12px] font-semibold uppercase tracking-[0.06em] text-[#0E5961]">
              {t(locale, "核心界面拆解标注", "INTERFACE CALLOUTS")}
            </span>
            {!showHotspots && (
              <button
                type="button"
                onClick={() => setCurrentIdx(item.mainImageIndex)}
                className="text-[12px] font-semibold text-[#0E5961] underline"
              >
                {t(locale, "返回主标注图", "Show annotated main view")}
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-col gap-2.5">
            {item.hotspots.map((spot, idx) => {
              const active = showHotspots && activeHotspot === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCurrentIdx(item.mainImageIndex);
                    setActiveHotspot(idx);
                  }}
                  className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
                    active
                      ? "border-[#0E5961] bg-[#EDF8F8]"
                      : "border-[#E1ECEE] bg-white hover:border-[#9DB8BE]"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono-tech text-[12px] font-bold ${
                      active
                        ? "bg-[#062F3A] text-[#7EF5D6]"
                        : "bg-[#E7F4F5] text-[#0E5961]"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-[14px] font-semibold text-[#07161A]">
                      {pick(locale, spot.title)}
                    </div>
                    <p className="mt-1 text-[13px] leading-snug text-[#31494F]">
                      {pick(locale, spot.detail)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Thumbnail Strip for All Screens in This Project */}
      {item.images.length > 1 && (
        <div className="flex flex-wrap items-center gap-2.5">
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
                className={`relative h-[64px] w-[104px] overflow-hidden rounded-xl border-2 transition-all ${
                  isCurrent
                    ? "border-[#0E5961] ring-2 ring-[#0E5961]/25"
                    : "border-[#C6DCE0] opacity-75 hover:opacity-100"
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
                <span className="font-mono-tech absolute right-1 bottom-1 rounded bg-[#030A0D]/80 px-1 text-[12px] text-white">
                  0{idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Accessible Lightbox Modal */}
      {lightboxOpen && (
        <div
          id="case-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={pick(locale, item.system)}
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020709]/95 p-4 backdrop-blur-xl"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-6xl flex-col items-center"
          >
            <div className="mb-3 flex w-full items-center justify-between text-[#F2FAF9]">
              <span className="font-mono-tech text-[13px] text-[#7EF5D6]">
                {String(currentIdx + 1).padStart(2, "0")} /{" "}
                {String(item.images.length).padStart(2, "0")} ·{" "}
                {pick(locale, currentImg.caption)}
              </span>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label={t(locale, "关闭大图", "Close enlarged view")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:border-[#7EF5D6]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-[#061318] p-2">
              {item.images.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIdx(
                      (v) => (v - 1 + item.images.length) % item.images.length
                    )
                  }
                  aria-label={t(locale, "上一张界面", "Previous screen")}
                  className="absolute left-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#030A0D]/85 text-white hover:border-[#7EF5D6]"
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
                  className="absolute right-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#030A0D]/85 text-white hover:border-[#7EF5D6]"
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
 * G-14: Project-Specific 4-Stage Workflow Diagram per Case.
 */
export function CaseWorkflowGraph({
  item,
  locale,
}: {
  item: CaseItem;
  locale: Locale;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {item.workflowSteps.map((step, idx) => (
        <div
          key={idx}
          className={`flex flex-col justify-between rounded-2xl border p-5 ${
            step.humanCheckpoint
              ? "border-[#D99B38] bg-[#FFFBF4]"
              : "border-[#D3E3E6] bg-white"
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono-tech text-[12px] font-semibold text-[#0E5961]">
                {pick(locale, step.stage)}
              </span>
              {step.humanCheckpoint && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF0D6] px-2.5 py-0.5 text-[12px] font-semibold text-[#8A4B08]">
                  <UserCheck size={12} />
                  <span>{t(locale, "人工把关", "Human gate")}</span>
                </span>
              )}
            </div>
            <h3 className="mt-2.5 text-[17px] font-semibold text-[#07161A]">
              {pick(locale, step.title)}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[#31494F]">
              {pick(locale, step.detail)}
            </p>
          </div>

          <div className="mt-4 border-t border-[#E5EFF1] pt-3">
            <span className="font-mono-tech block text-[12px] text-[#496269]">
              {t(locale, "阶段产物：", "Artifact: ")}
              <strong className="text-[#07161A]">
                {pick(locale, step.artifact)}
              </strong>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * G-15: Project-Specific 4-Phase Delivery Timeline.
 */
export function CaseDeliveryTimeline({
  item,
  locale,
}: {
  item: CaseItem;
  locale: Locale;
}) {
  return (
    <div className="card-light p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-4">
        {item.timeline.map((phase, idx) => (
          <div key={idx} className="relative flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#062F3A] text-[12px] font-bold text-[#7EF5D6]">
                0{idx + 1}
              </span>
              <span className="font-mono-tech rounded bg-[#E7F4F5] px-2 py-0.5 text-[12px] font-semibold text-[#0E5961]">
                {pick(locale, phase.duration)}
              </span>
            </div>
            <h3 className="mt-3 text-[15px] font-semibold text-[#07161A]">
              {pick(locale, phase.phase)}
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#31494F]">
              {pick(locale, phase.detail)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
