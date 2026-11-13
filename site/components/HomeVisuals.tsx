"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Boxes,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  Check,
  Factory,
  FileText,
  MessagesSquare,
  Network,
  PenTool,
  ShieldAlert,
  ShieldCheck,
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

const INDUSTRY_ICONS = [
  Factory,
  BriefcaseBusiness,
  Network,
  Boxes,
  Building2,
  PenTool,
];

const SOLUTION_ICONS = [
  MessagesSquare,
  FileText,
  BookOpen,
  ChartNoAxesCombined,
];

/**
 * G-03 + D-4: 3 Display-size client outcome metrics with explicit scope + 1 concise team credibility bar + 6 industries.
 */
export function ResultsBand({ locale }: { locale: Locale }) {
  return (
    <section className="surface-light border-b border-[var(--border-light)] py-14 md:py-20">
      <div className="site-container">
        {/* 3 Client Outcome Metric Cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {siteCopy.home.outcomeMetrics.map((m) => (
            <div
              key={m.sourceId}
              className="card-light relative overflow-hidden p-6 md:p-7"
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0E5961] via-[#3FA0A6] to-[#7EF5D6]"
              />
              <div className="font-mono-tech text-[clamp(1.75rem,2.6vw,2.35rem)] font-bold tracking-tight text-[#07161A]">
                {pick(locale, m.value)}
              </div>
              <p className="mt-2 text-[16px] font-semibold text-[#0E5961]">
                {pick(locale, m.label)}
              </p>
              <p className="mt-1.5 text-[13px] leading-snug text-[#496269]">
                {pick(locale, m.scope)}
              </p>
            </div>
          ))}
        </div>

        {/* Concise Team Credibility Strip (D-4: replaces confusing duplicate 100% columns) */}
        <div className="mt-6 rounded-2xl border border-[#0E5961]/18 bg-[#F3FAFA] p-5 md:px-7 md:py-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3.5">
              <span className="font-mono-tech inline-flex w-fit shrink-0 items-center rounded-full bg-[#062F3A] px-3 py-1 text-[12px] font-semibold tracking-[0.06em] text-[#7EF5D6]">
                {pick(locale, siteCopy.home.credibilityLine.badge)}
              </span>
              <p className="text-[14px] font-medium leading-relaxed text-[#1D353B] md:text-[15px]">
                {pick(locale, siteCopy.home.credibilityLine.text)}
              </p>
            </div>
            <Link
              href={href(locale, "/about")}
              className="link-inline-tech shrink-0"
            >
              <span>{t(locale, "查看团队背景", "Team background")}</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* 6 Served Industries Strip */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#D3E3E6] pt-4">
            <span className="mr-1 font-mono-tech text-[12px] font-semibold uppercase tracking-[0.06em] text-[#496269]">
              {t(locale, "已落地行业：", "In production across:")}
            </span>
            {industriesList.map((ind, idx) => {
              const Icon = INDUSTRY_ICONS[idx] || Factory;
              return (
                <Link
                  key={ind.key}
                  href={href(locale, `/cases?industry=${ind.key}`)}
                  className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full border border-[#C6DCE0] bg-white px-3 py-1 text-[13px] font-medium text-[#223B41] transition-colors hover:border-[#0E5961] hover:text-[#0E5961]"
                >
                  <Icon size={13} className="text-[#0E5961]" />
                  <span>{pick(locale, ind.label)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * G-04 + A-04: Interactive 4-solution explorer with bespoke 4-stage workflow diagram per solution
 * (eliminating duplicate screenshots from Homepage).
 */
export function SolutionsWorkflowExplorer({ locale }: { locale: Locale }) {
  const [selected, setSelected] = useState(0);
  const current = solutionsList[selected];

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const keys = [
      "ArrowDown",
      "ArrowUp",
      "ArrowRight",
      "ArrowLeft",
      "Home",
      "End",
    ];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const total = solutionsList.length;
    const next =
      e.key === "Home"
        ? 0
        : e.key === "End"
        ? total - 1
        : e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (index + 1) % total
        : (index - 1 + total) % total;
    setSelected(next);
    document.getElementById(`home-sol-tab-${next}`)?.focus();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr] lg:items-stretch">
      {/* Roving-tabindex tablist */}
      <div
        role="tablist"
        aria-label={pick(locale, siteCopy.nav.solutions)}
        className="flex flex-col gap-2.5"
      >
        {solutionsList.map((sol, idx) => {
          const Icon = SOLUTION_ICONS[idx] || FileText;
          const active = selected === idx;
          return (
            <button
              key={sol.slug}
              id={`home-sol-tab-${idx}`}
              role="tab"
              type="button"
              tabIndex={active ? 0 : -1}
              aria-selected={active}
              aria-controls="home-sol-panel"
              onClick={() => setSelected(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`group flex min-h-[78px] w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-all ${
                active
                  ? "border-[#062F3A] bg-[#062F3A] text-[#F2FAF9] shadow-lg"
                  : "border-[#D3E3E6] bg-white text-[#07161A] hover:border-[#0E5961]"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    active
                      ? "bg-[#7EF5D6]/18 text-[#7EF5D6]"
                      : "bg-[#E7F4F5] text-[#0E5961]"
                  }`}
                >
                  <Icon size={18} />
                </span>
                <div>
                  <span
                    className={`font-mono-tech block text-[12px] font-semibold ${
                      active ? "text-[#7EF5D6]" : "text-[#496269]"
                    }`}
                  >
                    0{idx + 1} · {pick(locale, sol.shortName)}
                  </span>
                  <span className="mt-0.5 block text-[15px] font-semibold leading-snug">
                    {pick(locale, sol.name)}
                  </span>
                </div>
              </div>
              <ArrowRight
                size={16}
                className={`shrink-0 transition-transform ${
                  active
                    ? "translate-x-0.5 text-[#7EF5D6]"
                    : "text-[#496269] group-hover:translate-x-0.5"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Bespoke Workflow Architecture Panel */}
      <div
        id="home-sol-panel"
        role="tabpanel"
        aria-labelledby={`home-sol-tab-${selected}`}
        className="card-obsidian flex flex-col justify-between overflow-hidden rounded-[22px] bg-[#041014] p-6 text-[#F2FAF9] shadow-xl md:p-8"
      >
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="eyebrow-badge eyebrow-badge-dark">
              0{selected + 1} · {pick(locale, current.name)}
            </span>
            <span className="font-mono-tech rounded-full border border-[#7EF5D6]/30 bg-[#0A2630] px-3 py-1 text-[12px] text-[#7EF5D6]">
              {t(locale, "定制工作流示意", "ENGINEERED WORKFLOW")}
            </span>
          </div>

          <h3 className="mt-3 text-[length:var(--fs-xl)] text-[#F2FAF9]">
            {pick(locale, current.promise)}
          </h3>
          <p className="prose-measure mt-2 text-[15px] leading-relaxed text-[#B4CFD2]">
            {pick(locale, current.intro)}
          </p>

          {/* 4-Node Custom Workflow Diagram */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {current.workflow.map((node, nIdx) => (
              <div
                key={nIdx}
                className={`relative flex flex-col justify-between rounded-xl border p-3.5 ${
                  node.humanReview
                    ? "border-[#F4C27A]/55 bg-[#1C1910]/90"
                    : "border-[#7EF5D6]/22 bg-[#081C23]/90"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono-tech text-[12px] font-semibold text-[#93B5B9]">
                      0{nIdx + 1} · {pick(locale, node.stage)}
                    </span>
                    {node.humanReview && (
                      <UserCheck size={14} className="text-[#F8D08B]" />
                    )}
                  </div>
                  <div className="mt-2 text-[14px] font-semibold leading-snug text-[#F2FAF9]">
                    {pick(locale, node.title)}
                  </div>
                  <p className="mt-1 text-[13px] leading-snug text-[#A9C5C8]">
                    {pick(locale, node.detail)}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/8">
                  <span
                    className={`font-mono-tech inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-semibold ${
                      node.humanReview
                        ? "bg-[#F4C27A]/18 text-[#F9D59B]"
                        : "bg-[#7EF5D6]/14 text-[#7EF5D6]"
                    }`}
                  >
                    {pick(locale, node.badge)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverables + Links */}
        <div className="mt-6 flex flex-col justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {current.deliverables.slice(0, 3).map((del, dIdx) => (
              <span
                key={dIdx}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[12px] text-[#D7ECEE]"
              >
                <Check size={12} className="text-[#7EF5D6]" />
                <span>{pick(locale, del)}</span>
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href={href(locale, `/services/${current.slug}`)}
              className="link-inline-tech"
            >
              <span>{t(locale, "方案详情", "Explore solution")}</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              href={href(locale, `/cases/${current.caseSlug}`)}
              className="inline-flex min-h-[38px] items-center gap-1 text-[13px] font-medium text-[#B4CFD2] hover:text-white"
            >
              <span>{t(locale, "对应客户案例", "Related case")}</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * G-05 + M-01: Interactive 4-problem Before/After Engineering Comparison.
 * Interactive tabs on desktop, clean single-column stacked cards or selector on mobile.
 */
export function EngineeringBeforeAfter({ locale }: { locale: Locale }) {
  const items = siteCopy.home.engineeringSection.items;
  const [activeIdx, setActiveIdx] = useState(0);
  const active = items[activeIdx];

  return (
    <div>
      {/* Desktop/Tablet Interactive Selector + Comparison Stage */}
      <div className="hidden md:grid md:gap-6 lg:grid-cols-[340px_1fr]">
        <div className="flex flex-col gap-2.5" role="tablist" aria-label="Engineering pillars">
          {items.map((item, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <button
                key={item.code}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveIdx(idx)}
                className={`flex min-h-[72px] flex-col items-start justify-center rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-[#7EF5D6]/65 bg-[#0A242D] shadow-[0_0_28px_-8px_rgba(126,245,214,0.35)]"
                    : "border-white/12 bg-[#061318]/85 hover:border-[#7EF5D6]/35"
                }`}
              >
                <span className="font-mono-tech text-[12px] font-semibold text-[#7EF5D6]">
                  {item.code}
                </span>
                <span className="mt-1 text-[15px] font-semibold text-[#F2FAF9]">
                  {pick(locale, item.title)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Ad-hoc Chat Column */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#F2A663]/30 bg-[#17120E]/90 p-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#F2A663]/35 bg-[#F2A663]/12 px-3 py-1 text-[12px] font-semibold text-[#F7C797]">
                <ShieldAlert size={14} />
                <span>{pick(locale, active.rawLabel)}</span>
              </div>
              <h3 className="mt-4 text-[18px] font-semibold text-[#F2FAF9]">
                {pick(locale, active.title)}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#D6CECA]">
                {pick(locale, active.rawState)}
              </p>
            </div>
            <div className="mt-6 rounded-xl border border-[#F2A663]/25 bg-black/35 px-3.5 py-2.5 text-[13px] font-medium text-[#F7C797]">
              {pick(locale, active.rawRisk)}
            </div>
          </div>

          {/* Cyano Core Column */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#7EF5D6]/45 bg-gradient-to-b from-[#0A2832] to-[#06171D] p-6 shadow-[0_18px_45px_-15px_rgba(126,245,214,0.2)]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#7EF5D6]/45 bg-[#7EF5D6]/15 px-3 py-1 text-[12px] font-semibold text-[#7EF5D6]">
                <ShieldCheck size={14} />
                <span>{pick(locale, active.engineeredLabel)}</span>
              </div>
              <h3 className="mt-4 text-[18px] font-semibold text-[#F2FAF9]">
                Cyano Core · {pick(locale, active.title)}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#D8ECEE]">
                {pick(locale, active.engineeredState)}
              </p>
            </div>
            <div className="mt-6 rounded-xl border border-[#7EF5D6]/35 bg-[#041318]/80 px-3.5 py-2.5 font-mono-tech text-[13px] font-semibold text-[#7EF5D6]">
              {pick(locale, active.engineeredGain)}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Clean Accordion Cards (M-01: zero horizontal squeeze) */}
      <div className="flex flex-col gap-3 md:hidden">
        {items.map((item, idx) => (
          <details
            key={item.code}
            open={idx === 0}
            className="group rounded-2xl border border-[#7EF5D6]/24 bg-[#07151B] p-4"
          >
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-2">
              <div>
                <span className="font-mono-tech block text-[12px] text-[#7EF5D6]">
                  {item.code}
                </span>
                <span className="text-[16px] font-semibold text-[#F2FAF9]">
                  {pick(locale, item.title)}
                </span>
              </div>
              <span className="font-mono-tech text-[13px] text-[#7EF5D6]">
                +
              </span>
            </summary>
            <div className="mt-3 space-y-3 border-t border-white/10 pt-3 text-[14px]">
              <div className="rounded-xl border border-[#F2A663]/30 bg-[#17120E] p-3">
                <div className="text-[12px] font-semibold text-[#F7C797]">
                  {pick(locale, item.rawLabel)}
                </div>
                <p className="mt-1 text-[#D6CECA]">{pick(locale, item.rawState)}</p>
              </div>
              <div className="rounded-xl border border-[#7EF5D6]/40 bg-[#0A2630] p-3">
                <div className="text-[12px] font-semibold text-[#7EF5D6]">
                  {pick(locale, item.engineeredLabel)}
                </div>
                <p className="mt-1 text-[#E4F3F4]">
                  {pick(locale, item.engineeredState)}
                </p>
                <p className="mt-2 font-mono-tech text-[12px] text-[#7EF5D6]">
                  {pick(locale, item.engineeredGain)}
                </p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

/**
 * G-06 + A-09: Shared 0–12 Week Proportional Engagement Timeline & Cards.
 */
export function EngagementTimelineScale({
  locale,
  compact = false,
}: {
  locale: Locale;
  compact?: boolean;
}) {
  const modes = siteCopy.engagementModes;

  return (
    <div className="space-y-6">
      {/* Proportional 0–12 Week Scale Bar */}
      <div className="card-light overflow-hidden p-5 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D3E3E6] pb-3">
          <span className="font-mono-tech text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0E5961]">
            {t(
              locale,
              "交付周期比例标尺（第 0 周 → 第 12 周）",
              "PROPORTIONAL DELIVERY SCALE (WEEK 0 → WEEK 12)"
            )}
          </span>
          <div className="hidden sm:flex items-center gap-6 font-mono-tech text-[12px] text-[#496269]">
            <span>W0</span>
            <span>W2</span>
            <span>W6</span>
            <span>W12+</span>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {modes.map((m, idx) => {
            const widthPct =
              m.key === "custom" ? 88 : m.key === "pilot" ? 44 : 20;
            return (
              <div
                key={m.key}
                className="grid gap-2 md:grid-cols-[220px_1fr] md:items-center md:gap-5"
              >
                <div className="flex items-baseline justify-between md:block">
                  <div className="text-[14px] font-semibold text-[#07161A]">
                    {pick(locale, m.name)}
                  </div>
                  <div className="font-mono-tech text-[12px] font-semibold text-[#0E5961]">
                    {pick(locale, m.duration)}
                  </div>
                </div>

                <div className="relative h-9 w-full overflow-hidden rounded-xl bg-[#EAF4F5] p-1">
                  {m.key === "managed" ? (
                    <div className="flex h-full items-center gap-2">
                      <div
                        style={{ width: "22%" }}
                        className="flex h-full shrink-0 items-center justify-center rounded-lg bg-[#0E5961] px-2 font-mono-tech text-[12px] font-semibold text-white"
                      >
                        &lt; 2w
                      </div>
                      <div className="flex h-full flex-1 items-center rounded-lg border border-dashed border-[#0E5961]/55 bg-[#7EF5D6]/20 px-3 text-[12px] font-medium text-[#073B42]">
                        <span className="truncate">
                          {pick(locale, m.milestoneLabel)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{ width: `${widthPct}%` }}
                      className={`flex h-full items-center rounded-lg px-3 text-[12px] font-semibold ${
                        idx === 0
                          ? "bg-[#062F3A] text-[#F2FAF9]"
                          : "bg-[#156972] text-white"
                      }`}
                    >
                      <span className="truncate">
                        {pick(locale, m.milestoneLabel)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Mode Cards */}
      {!compact && (
        <div className="grid gap-5 lg:grid-cols-3">
          {modes.map((m) => (
            <article
              key={m.key}
              className="card-light card-light-interactive flex flex-col justify-between p-6 md:p-7"
            >
              <div>
                <span className="font-mono-tech text-[12px] font-semibold text-[#0E5961]">
                  {pick(locale, m.badge)}
                </span>
                <h3 className="mt-2 text-[20px] font-semibold text-[#07161A]">
                  {pick(locale, m.name)}
                </h3>
                <div className="mt-2 inline-flex rounded-md bg-[#E7F4F5] px-2.5 py-1 font-mono-tech text-[13px] font-semibold text-[#063B42]">
                  {pick(locale, m.duration)}
                </div>
                <p className="mt-3.5 text-[15px] leading-relaxed text-[#31494F]">
                  {pick(locale, m.summary)}
                </p>
              </div>

              <div className="mt-5 border-t border-[#D3E3E6] pt-4">
                <p className="text-[13px] font-medium text-[#496269]">
                  {pick(locale, m.bestFor)}
                </p>
                <Link
                  href={href(locale, `/contact?inquiry=${m.key}#form`)}
                  className="link-inline-tech mt-2"
                >
                  <span>
                    {t(locale, "咨询此合作模式", "Discuss this model")}
                  </span>
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * G-21 + D-1: Individual brand cyan-slate duotone founder cards with distinct craft specialty.
 */
export function FoundersShowcase({
  locale,
  fullBio = false,
}: {
  locale: Locale;
  fullBio?: boolean;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {foundersList.map((f, idx) => {
        const meta = getMediaMeta(f.portrait);
        return (
          <article
            key={f.id}
            className="card-light card-light-interactive flex flex-col overflow-hidden"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-[#06181E]">
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
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
              />
              <span className="font-mono-tech absolute top-3 left-3 rounded-md border border-[#7EF5D6]/35 bg-[#041217]/85 px-2 py-0.5 text-[12px] font-semibold text-[#7EF5D6] backdrop-blur-sm">
                0{idx + 1} · {f.id}
              </span>
              <span className="absolute right-3 bottom-3 left-3 rounded-lg border border-white/14 bg-[#041217]/88 px-2.5 py-1.5 text-[12px] font-semibold text-[#E4F3F4] backdrop-blur-md">
                {pick(locale, f.specialtyBadge)}
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <h3 className="text-[18px] font-semibold text-[#07161A]">
                  {pick(locale, f.role)}
                </h3>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {f.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="rounded-md bg-[#E7F4F5] px-2 py-0.5 text-[12px] font-medium text-[#0E5961]"
                    >
                      {pick(locale, tag)}
                    </span>
                  ))}
                </div>

                {fullBio ? (
                  <p className="mt-3.5 text-[14px] leading-relaxed text-[#31494F]">
                    {pick(locale, f.bio)}
                  </p>
                ) : (
                  <p className="mt-3 text-[13px] leading-snug text-[#496269]">
                    <strong className="font-semibold text-[#07161A]">
                      {t(locale, "主导交付：", "Leads: ")}
                    </strong>
                    {pick(locale, f.focusDeliverable)}
                  </p>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
