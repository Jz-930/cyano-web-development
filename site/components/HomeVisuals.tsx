"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  UserCheck,
} from "lucide-react";
import {
  type Locale,
  foundersList,
  getMediaMeta,
  href,
  industriesList,
  pick,
  siteCopy,
  solutionsList,
  t,
} from "@/lib/content";

export const SOLUTION_GALLERY_THEMES: Record<
  string,
  { accent: string; art: string }
> = {
  "sales-ai": {
    accent: "#0B7A8C",
    art: "/art/cyano-sol-sales.webp",
  },
  "document-automation": {
    accent: "#1D4ED8",
    art: "/art/cyano-sol-docs.webp",
  },
  "knowledge-assistant": {
    accent: "#6D28D9",
    art: "/art/cyano-sol-kb.webp",
  },
  "data-query": {
    accent: "#B45309",
    art: "/art/cyano-sol-data.webp",
  },
};

const FALLBACK_SOLUTION_THEMES = [
  { accent: "#0B7A8C", art: "/art/cyano-sol-sales.webp" },
  { accent: "#1D4ED8", art: "/art/cyano-sol-docs.webp" },
  { accent: "#6D28D9", art: "/art/cyano-sol-kb.webp" },
  { accent: "#B45309", art: "/art/cyano-sol-data.webp" },
];

/**
 * ResultsBand:
 * Pure Gallery White (#FFFFFF), zero boxes.
 * Three monumental light-weight columns crowned with Cyano Teal, Sapphire Cobalt, and Warm Amber bars.
 */
export function ResultsBand({ locale }: { locale: Locale }) {
  const barColors = ["#0B7A8C", "#1D4ED8", "#B45309"];

  return (
    <section className="surface-light border-b border-black/[0.08] py-20 md:py-28">
      <div className="site-container">
        <div className="grid gap-12 md:grid-cols-3 md:gap-0 md:divide-x md:divide-black/[0.09]">
          {siteCopy.home.outcomeMetrics.map((item, idx) => {
            const caseSlug = item.sourceId.replace(/^case-/, "");
            return (
              <div
                key={item.sourceId}
                className={`${
                  idx === 0
                    ? "md:pr-10"
                    : idx === 1
                      ? "md:px-10"
                      : "md:pl-10"
                }`}
              >
                <div
                  aria-hidden="true"
                  className="h-[2.5px] w-12"
                  style={{ backgroundColor: barColors[idx % barColors.length] }}
                />
                <div className="mt-7 text-[clamp(2.45rem,4vw,3.5rem)] font-light leading-none tracking-tight text-[#0B1520] tabular-nums">
                  {pick(locale, item.value)}
                </div>
                <div className="mt-5 text-[18px] font-medium text-[#0B1520]">
                  {pick(locale, item.label)}
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-[#52606D]">
                  {pick(locale, item.scope)}
                </p>

                <Link
                  href={href(locale, `/cases/${caseSlug}`)}
                  className="link-inline-tech mt-5"
                >
                  <span>{t(locale, "查看该交付案例", "Read case study")}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Quiet Single-Hairline Team & Industries Editorial Strip */}
        <div className="mt-16 border-t border-black/[0.08] pt-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-baseline">
            <p className="max-w-2xl text-[15px] leading-relaxed text-[#2C3A47]">
              <strong className="mr-2.5 font-semibold text-[#0B7A8C]">
                {pick(locale, siteCopy.home.credibilityLine.badge)} ·
              </strong>
              <span>{pick(locale, siteCopy.home.credibilityLine.text)}</span>
            </p>

            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[13px] text-[#52606D]">
              <span className="font-medium text-[#0B1520]">
                {t(locale, "已落地行业：", "Industries:")}
              </span>
              {industriesList.map((ind, idx) => (
                <React.Fragment key={ind.key}>
                  {idx > 0 && <span aria-hidden="true" className="text-black/20">/</span>}
                  <Link
                    href={href(locale, `/cases?industry=${ind.key}`)}
                    className="inline-flex min-h-[28px] items-center transition-colors hover:text-[#0B7A8C]"
                  >
                    {pick(locale, ind.label)}
                  </Link>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * SolutionsWorkflowExplorer:
 * White-gallery architectural switcher pairing each solution with its OWN dedicated
 * large-scale Cyano optical sculpture (`cyano-sol-sales/docs/kb/data.webp`) + open 4-stage pipeline.
 */
export function SolutionsWorkflowExplorer({ locale }: { locale: Locale }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = solutionsList[activeIdx];
  const theme =
    SOLUTION_GALLERY_THEMES[current.slug] ??
    FALLBACK_SOLUTION_THEMES[activeIdx % FALLBACK_SOLUTION_THEMES.length];
  const artMeta = getMediaMeta(theme.art);

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      {/* Left Unboxed Editorial Index */}
      <div
        role="tablist"
        aria-label={t(locale, "四类核心解决方案", "Four core AI solutions")}
        className="divide-y divide-black/[0.1] border-t border-b border-black/[0.1] lg:col-span-4"
      >
        {solutionsList.map((sol, idx) => {
          const isSelected = idx === activeIdx;
          const itemTheme =
            SOLUTION_GALLERY_THEMES[sol.slug] ??
            FALLBACK_SOLUTION_THEMES[idx % FALLBACK_SOLUTION_THEMES.length];
          return (
            <button
              key={sol.slug}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveIdx(idx)}
              className="group relative flex w-full flex-col items-start py-6 pl-5 text-left transition-colors"
            >
              <span
                aria-hidden="true"
                className="absolute top-5 bottom-5 left-0 w-[2.5px] transition-all duration-200"
                style={{
                  backgroundColor: isSelected ? itemTheme.accent : "transparent",
                }}
              />
              <span
                className="font-mono-tech text-[12px] font-semibold"
                style={{ color: isSelected ? itemTheme.accent : "#64748B" }}
              >
                0{idx + 1}
              </span>
              <span
                className={`mt-1 text-[20px] font-normal tracking-tight transition-colors ${
                  isSelected
                    ? "text-[#0B1520]"
                    : "text-[#52606D] group-hover:text-[#0B1520]"
                }`}
              >
                {pick(locale, sol.name)}
              </span>
              {isSelected && (
                <span className="mt-2 text-[14px] leading-relaxed text-[#2C3A47]">
                  {pick(locale, sol.promise)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right Borderless White Gallery Stage */}
      <div className="lg:col-span-8">
        {/* Top Editorial Intro + Large Seamless Multiply Sculpture */}
        <div className="grid items-center gap-10 pb-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <span
              className="font-mono-tech text-[12px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: theme.accent }}
            >
              0{activeIdx + 1} · {pick(locale, current.shortName)}
            </span>
            <h3 className="mt-3 text-[clamp(1.65rem,2.6vw,2.25rem)] font-normal leading-snug tracking-tight text-[#0B1520]">
              {pick(locale, current.promise)}
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-[#2C3A47]">
              {pick(locale, current.intro)}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-6">
              <Link
                href={href(locale, `/services/${current.slug}`)}
                className="link-inline-tech"
              >
                <span>{t(locale, "查看方案详情", "Explore solution")}</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href={href(locale, `/cases/${current.caseSlug}`)}
                className="inline-flex min-h-[36px] items-center gap-1.5 text-[14px] text-[#52606D] transition-colors hover:text-[#0B7A8C]"
              >
                <span>{t(locale, "查看对应客户案例", "See production case")}</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center md:col-span-6">
            <Image
              src={theme.art}
              alt=""
              aria-hidden="true"
              width={artMeta.width}
              height={artMeta.height}
              sizes="(max-width: 768px) 92vw, 460px"
              className="art-on-white h-auto w-full max-w-[460px] object-contain transition-opacity duration-300"
            />
          </div>
        </div>

        {/* Spacious 4-Column Hairline Workflow */}
        <div className="grid gap-8 border-t border-black/[0.1] pt-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-black/[0.08]">
          {current.workflow.map((node, nIdx) => (
            <div
              key={nIdx}
              className={`${
                nIdx === 0
                  ? "lg:pr-6"
                  : nIdx === current.workflow.length - 1
                    ? "lg:pl-6"
                    : "lg:px-6"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="font-mono-tech text-[12px] font-semibold uppercase"
                  style={{ color: node.humanReview ? "#B45309" : theme.accent }}
                >
                  0{nIdx + 1} · {pick(locale, node.stage)}
                </span>
                {node.humanReview && (
                  <UserCheck size={14} className="shrink-0 text-[#B45309]" />
                )}
              </div>
              <div className="mt-2.5 text-[16px] font-medium leading-snug text-[#0B1520]">
                {pick(locale, node.title)}
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[#52606D]">
                {pick(locale, node.detail)}
              </p>
            </div>
          ))}
        </div>

        {/* Quiet Deliverables Line */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-black/[0.08] pt-5 text-[13px] text-[#2C3A47]">
          {current.deliverables.map((d, dIdx) => (
            <span key={dIdx} className="inline-flex items-center gap-1.5">
              <Check size={14} style={{ color: theme.accent }} className="shrink-0" />
              <span>{pick(locale, d)}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * EngineeringBeforeAfter:
 * Expansive Nocturnal Art Diptych (`cyano-context-prism.webp` + `cyano-wave-spectrum.webp`) +
 * Open 4-Row Hairline Comparison on Pure #000000.
 */
export function EngineeringBeforeAfter({ locale }: { locale: Locale }) {
  const items = siteCopy.home.engineeringSection.items;
  const prismMeta = getMediaMeta("/art/cyano-context-prism.webp");
  const waveMeta = getMediaMeta("/art/cyano-wave-spectrum.webp");

  return (
    <div className="space-y-16">
      {/* Large-Scale Nocturnal Optical Diptych Giving Deep Visual Breathing Room */}
      <div className="grid items-center gap-8 lg:grid-cols-12">
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#030A12] lg:col-span-7">
          <Image
            src="/art/cyano-context-prism.webp"
            alt={t(
              locale,
              "光学棱镜示意：散乱原始碎片经棱镜收敛为四道平行的青、蓝、金受控光束",
              "Optical prism transforming scattered fragments into four parallel laminar beams"
            )}
            width={prismMeta.width}
            height={prismMeta.height}
            sizes="(max-width: 1024px) 95vw, 740px"
            className="block h-auto w-full object-cover"
          />
        </div>

        <div className="space-y-5 lg:col-span-5">
          <Image
            src="/art/cyano-wave-spectrum.webp"
            alt=""
            aria-hidden="true"
            width={waveMeta.width}
            height={waveMeta.height}
            sizes="(max-width: 1024px) 95vw, 500px"
            className="art-on-black block h-[180px] w-full object-cover object-center sm:h-[210px]"
          />
          <p className="text-[14px] leading-relaxed text-white/65">
            {t(
              locale,
              "将散落在各部门文档、数据表与审批记录中的非结构化输入，收敛为带权限边界、上下文估值与人工复核门禁的稳定工作流。",
              "Transforming scattered documents, tables and approval rules into permission-aware, context-budgeted workflows with explicit human review gates."
            )}
          </p>
        </div>
      </div>

      {/* Open Hairline Comparison Rows on Pure #000000 */}
      <div className="divide-y divide-white/[0.12] border-t border-b border-white/[0.12]">
        {items.map((item) => (
          <div
            key={item.code}
            className="grid gap-6 py-9 lg:grid-cols-[260px_1fr_1fr] lg:gap-12"
          >
            {/* Dimension Title */}
            <div>
              <span className="font-mono-tech text-[12px] font-medium text-[#22D3EE]">
                {item.code}
              </span>
              <h3 className="mt-2 text-[20px] font-normal text-white">
                {pick(locale, item.title)}
              </h3>
            </div>

            {/* Generic Chat Failure Mode */}
            <div className="relative pl-5">
              <span
                aria-hidden="true"
                className="absolute top-1.5 bottom-1.5 left-0 w-[2px] bg-[#FB7185]"
              />
              <div className="font-mono-tech text-[12px] font-medium uppercase tracking-[0.08em] text-[#FDA4AF]">
                {pick(locale, item.rawLabel)}
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-white/68">
                {pick(locale, item.rawState)}
              </p>
              <p className="mt-2 text-[13px] font-medium text-[#FDA4AF]">
                {pick(locale, item.rawRisk)}
              </p>
            </div>

            {/* Cyano Core Engineered Solution */}
            <div className="relative pl-5">
              <span
                aria-hidden="true"
                className="absolute top-1.5 bottom-1.5 left-0 w-[2px] bg-gradient-to-b from-[#22D3EE] via-[#3B82F6] to-[#FBBF24]"
              />
              <div className="font-mono-tech text-[12px] font-medium uppercase tracking-[0.08em] text-[#22D3EE]">
                {pick(locale, item.engineeredLabel)}
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-white/90">
                {pick(locale, item.engineeredState)}
              </p>
              <p className="mt-2 text-[13px] font-medium text-[#FBBF24]">
                {pick(locale, item.engineeredGain)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * EngagementTimelineScale:
 * Features the bespoke Gallery Triptych Sculpture (`cyano-white-engagement.webp`) +
 * Open Proportional Bar Architecture.
 */
export function EngagementTimelineScale({
  locale,
  compact = false,
}: {
  locale: Locale;
  compact?: boolean;
}) {
  const modes = siteCopy.engagementModes;
  const triptychMeta = getMediaMeta("/art/cyano-white-engagement.webp");

  const modeStyles: Record<string, { pct: string; gradient: string; color: string }> = {
    managed: {
      pct: "24%",
      gradient: "linear-gradient(90deg, #22D3EE 0%, #F59E0B 100%)",
      color: "#B45309",
    },
    pilot: {
      pct: "52%",
      gradient: "linear-gradient(90deg, #0B7A8C 0%, #2563EB 100%)",
      color: "#1D4ED8",
    },
    custom: {
      pct: "100%",
      gradient: "linear-gradient(90deg, #0B7A8C 0%, #2563EB 55%, #7C3AED 100%)",
      color: "#0B7A8C",
    },
  };

  return (
    <div className="space-y-14">
      {/* Gallery-Scale Triptych Sculpture on Pure White (Full-Custom Cube / Pilot Seed / Managed Ring) */}
      {!compact && (
        <div className="mx-auto max-w-[920px] py-2">
          <Image
            src="/art/cyano-white-engagement.webp"
            alt={t(
              locale,
              "三种合作模式光学雕塑示意：完整定制晶体、模块化试点棱镜与托管持续服务环",
              "Three optical glass sculptures representing Full Custom Build, Scoped Pilot, and Managed Service"
            )}
            width={triptychMeta.width}
            height={triptychMeta.height}
            sizes="(max-width: 1024px) 94vw, 920px"
            className="art-on-white mx-auto block h-auto w-full object-contain"
          />
        </div>
      )}

      <div>
        {/* Scale Header */}
        <div className="flex items-center justify-between pb-4 text-[12px] text-[#52606D]">
          <span className="font-mono-tech font-semibold uppercase tracking-[0.1em] text-[#0B1520]">
            {t(
              locale,
              "交付周期比例标尺（第 0 周 → 第 12 周）",
              "PROPORTIONAL DELIVERY SCALE (WEEK 0 → WEEK 12)"
            )}
          </span>
          <div className="font-mono-tech hidden items-center gap-10 sm:flex">
            <span>W0</span>
            <span>W2</span>
            <span>W6</span>
            <span>W12+</span>
          </div>
        </div>

        {/* 3 Open Hairline Rows */}
        <div className="divide-y divide-black/[0.1] border-t border-b border-black/[0.1]">
          {modes.map((m) => {
            const st = modeStyles[m.key] ?? modeStyles.custom;
            return (
              <div
                key={m.key}
                className="grid gap-6 py-9 lg:grid-cols-[260px_1fr_280px] lg:items-start lg:gap-12"
              >
                {/* Mode & Duration */}
                <div>
                  <div
                    className="font-mono-tech text-[12px] font-semibold uppercase tracking-[0.08em]"
                    style={{ color: st.color }}
                  >
                    {pick(locale, m.badge)}
                  </div>
                  <h3 className="mt-1.5 text-[22px] font-normal text-[#0B1520]">
                    {pick(locale, m.name)}
                  </h3>
                  <div className="font-mono-tech mt-1.5 text-[14px] font-medium text-[#2C3A47]">
                    {pick(locale, m.duration)}
                  </div>
                </div>

                {/* Pure Luminous Proportional Bar + Unclipped Milestone & Summary Below */}
                <div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/[0.07]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: st.pct, background: st.gradient }}
                    />
                  </div>
                  <div className="mt-3.5 text-[14px] font-medium text-[#0B1520]">
                    {pick(locale, m.milestoneLabel)}
                  </div>
                  {!compact && (
                    <p className="mt-2 text-[14px] leading-relaxed text-[#52606D]">
                      {pick(locale, m.summary)}
                    </p>
                  )}
                </div>

                {/* Best-For & Direct Action */}
                <div className="flex flex-col justify-between lg:items-end lg:text-right">
                  <p className="text-[13px] leading-relaxed text-[#52606D]">
                    {pick(locale, m.bestFor)}
                  </p>
                  {!compact && (
                    <Link
                      href={href(locale, `/contact?inquiry=${m.key}#form`)}
                      className="link-inline-tech mt-3.5"
                    >
                      <span>{t(locale, "咨询此合作模式", "Discuss this model")}</span>
                      <ArrowRight size={15} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * FoundersShowcase:
 * Natural Full-Color Editorial Portraits (all 4 wearing glasses, zero duotone wash).
 */
export function FoundersShowcase({
  locale,
  fullBio = false,
}: {
  locale: Locale;
  fullBio?: boolean;
}) {
  const roleAccents = ["#0B7A8C", "#1D4ED8", "#6D28D9", "#B45309"];

  return (
    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
      {foundersList.map((f, idx) => {
        const meta = getMediaMeta(f.portrait);
        return (
          <article key={f.id} className="group flex flex-col">
            <div className="overflow-hidden rounded-2xl bg-[#F8F6F2] ring-1 ring-black/[0.05]">
              <Image
                src={f.portrait}
                alt={t(
                  locale,
                  `Cyano ${pick(locale, f.role)}插画肖像`,
                  `Illustrated portrait of Cyano ${pick(locale, f.role)}`
                )}
                width={meta.width}
                height={meta.height}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 290px"
                placeholder={meta.blurDataURL ? "blur" : "empty"}
                blurDataURL={meta.blurDataURL || undefined}
                className="aspect-[4/4.35] h-auto w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>

            <div className="pt-5">
              <div
                className="font-mono-tech text-[12px] font-semibold uppercase tracking-[0.08em]"
                style={{ color: roleAccents[idx % roleAccents.length] }}
              >
                {pick(locale, f.specialtyBadge)}
              </div>

              <h3 className="mt-1.5 text-[20px] font-normal text-[#0B1520]">
                {pick(locale, f.role)}
              </h3>

              <p className="mt-1.5 text-[13px] text-[#52606D]">
                {f.tags.map((tag) => pick(locale, tag)).join(" · ")}
              </p>

              {fullBio ? (
                <p className="mt-3 text-[14px] leading-relaxed text-[#2C3A47]">
                  {pick(locale, f.bio)}
                </p>
              ) : (
                <p className="mt-3 text-[14px] leading-relaxed text-[#2C3A47]">
                  {pick(locale, f.focusDeliverable)}
                </p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
