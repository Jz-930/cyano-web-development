"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CloudCog,
  Server,
  ShieldCheck,
} from "lucide-react";
import { type Locale, href, pick, siteCopy, t } from "@/lib/content";

/**
 * ModeSelectorQuiz:
 * Clean Swiss-modernist interactive recommender — ZERO heavy dark-green nested boxes!
 */
export function ModeSelectorQuiz({ locale }: { locale: Locale }) {
  const rec = siteCopy.engagement.recommender;
  const [answers, setAnswers] = useState<Record<string, number>>({
    frequency: 2,
    ops: 1,
    readiness: 1,
  });

  const totals = { custom: 0, pilot: 0, managed: 0 };
  rec.questions.forEach((q) => {
    const idx = answers[q.id] ?? 0;
    const opt = q.options[idx] ?? q.options[0];
    totals.custom += opt.scores.custom;
    totals.pilot += opt.scores.pilot;
    totals.managed += opt.scores.managed;
  });

  const bestKey: "custom" | "pilot" | "managed" =
    totals.managed >= totals.custom && totals.managed >= totals.pilot
      ? "managed"
      : totals.custom > totals.pilot
        ? "custom"
        : "pilot";

  const bestMode =
    siteCopy.engagementModes.find((m) => m.key === bestKey) ??
    siteCopy.engagementModes[1];

  return (
    <div className="grid gap-12 border-t border-b border-slate-900/15 py-12 lg:grid-cols-12 lg:items-start">
      {/* Left 7 Columns: 3 Clean Questions */}
      <div className="space-y-9 lg:col-span-7">
        <div>
          <div className="text-[14px] font-medium text-[#0B7A8C]">
            {pick(locale, rec.eyebrow)}
          </div>
          <h2 className="mt-2 text-[clamp(1.85rem,3vw,2.5rem)] font-normal tracking-tight text-[#0B1520]">
            {pick(locale, rec.title)}
          </h2>
        </div>

        <div className="divide-y divide-slate-200">
          {rec.questions.map((q) => (
            <div key={q.id} className="py-6 first:pt-0 last:pb-0">
              <div className="text-[16px] font-medium text-[#0B1520]">
                {pick(locale, q.label)}
              </div>
              <div className="mt-3.5 flex flex-wrap gap-2.5">
                {q.options.map((opt, oIdx) => {
                  const active = (answers[q.id] ?? 0) === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                      }
                      className={`min-h-[40px] rounded-full px-4 py-2 text-[14px] transition-all ${
                        active
                          ? "bg-[#0B7A8C] font-medium text-white shadow-sm"
                          : "border border-slate-300 bg-white text-[#334155] hover:border-[#0B7A8C] hover:text-[#0B1520]"
                      }`}
                    >
                      {pick(locale, opt.label)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right 5 Columns: Calm Nocturnal Recommendation Panel */}
      <div className="rounded-2xl bg-[#02080E] p-8 text-white ring-1 ring-white/[0.08] sm:p-10 lg:col-span-5">
        <div className="font-mono-tech text-[12px] uppercase tracking-[0.12em] text-[#22D3EE]">
          {t(locale, "推荐起步方式", "RECOMMENDED STARTING MODEL")}
        </div>
        <h3 className="mt-3 text-[28px] font-normal text-white">
          {pick(locale, bestMode.name)}
        </h3>
        <div className="font-mono-tech mt-2 text-[15px] text-[#FBBF24]">
          {pick(locale, bestMode.duration)} · {pick(locale, bestMode.milestoneLabel)}
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-white/75">
          {pick(locale, bestMode.summary)}
        </p>
        <p className="mt-4 border-t border-white/12 pt-4 text-[14px] text-white/60">
          {pick(locale, bestMode.bestFor)}
        </p>

        <Link
          href={href(locale, `/contact?inquiry=${bestMode.key}#form`)}
          className="mt-7 inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold text-white transition-colors hover:text-[#22D3EE]"
        >
          <span>{t(locale, "按此模式预约评估", "Discuss this starting model")}</span>
          <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}

/**
 * ComparisonMatrix:
 * Clean Architectural Table on Desktop + 3 Clean Hairline Blocks on Mobile (M-03).
 */
export function ComparisonMatrix({ locale }: { locale: Locale }) {
  const rows = siteCopy.engagement.comparisonRows;
  const modes = siteCopy.engagementModes;

  return (
    <div>
      {/* Desktop Clean Hairline Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-900/20">
              <th className="py-5 pr-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">
                {t(locale, "对比维度", "DIMENSION")}
              </th>
              {modes.map((m) => (
                <th key={m.key} className="py-5 px-6">
                  <div className="text-[18px] font-medium text-[#111111]">
                    {pick(locale, m.name)}
                  </div>
                  <div className="font-mono-tech mt-1 text-[13px] text-[#4F46E5]">
                    {pick(locale, m.duration)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row, rIdx) => (
              <tr key={rIdx}>
                <td className="py-5 pr-6 text-[15px] font-medium text-[#111111]">
                  {pick(locale, row.dimension)}
                </td>
                <td className="py-5 px-6 text-[15px] leading-relaxed text-[#334155]">
                  {pick(locale, row.custom)}
                </td>
                <td className="py-5 px-6 text-[15px] leading-relaxed text-[#334155]">
                  {pick(locale, row.pilot)}
                </td>
                <td className="py-5 px-6 text-[15px] leading-relaxed text-[#334155]">
                  {pick(locale, row.managed)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Blocks */}
      <div className="grid gap-6 md:hidden">
        {modes.map((m) => (
          <div
            key={m.key}
            className="border border-slate-900/15 bg-white p-6"
          >
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-[20px] font-medium text-[#111111]">
                {pick(locale, m.name)}
              </h3>
              <div className="font-mono-tech mt-1 text-[13px] text-[#4F46E5]">
                {pick(locale, m.duration)}
              </div>
            </div>
            <dl className="mt-4 space-y-3">
              {rows.map((row, idx) => {
                const val =
                  m.key === "custom"
                    ? row.custom
                    : m.key === "pilot"
                      ? row.pilot
                      : row.managed;
                return (
                  <div key={idx}>
                    <dt className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#64748B]">
                      {pick(locale, row.dimension)}
                    </dt>
                    <dd className="m-0 mt-0.5 text-[14px] text-[#111111]">
                      {pick(locale, val)}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * DeploymentOptionsGrid:
 * jrvs.ca-inspired Minimalist Architectural Line Blocks with Distinct Line Icons!
 */
export function DeploymentOptionsGrid({ locale }: { locale: Locale }) {
  const icons = [CloudCog, Server, ShieldCheck];
  const accents = ["#0B7A8C", "#1D4ED8", "#B45309"];
  const opts = siteCopy.engagement.deployments;

  return (
    <div className="divide-y divide-black/15 border border-black/15 bg-white">
      {opts.map((opt, idx) => {
        const Icon = icons[idx % icons.length];
        const accent = accents[idx % accents.length];
        return (
          <div
            key={opt.key}
            className="flex flex-col justify-between gap-6 p-8 sm:p-10 md:flex-row md:items-start"
          >
            <div className="max-w-3xl">
              <span
                className="font-mono-tech text-[12px] font-medium uppercase tracking-[0.1em]"
                style={{ color: accent }}
              >
                {pick(locale, opt.badge)}
              </span>
              <h3 className="mt-2 text-[24px] font-normal tracking-tight text-[#0B1520]">
                {pick(locale, opt.title)}
              </h3>
              <p className="mt-3 text-[16px] leading-relaxed text-[#334155]">
                {pick(locale, opt.body)}
              </p>
            </div>
            <Icon
              size={36}
              strokeWidth={1.25}
              style={{ color: accent }}
              className="shrink-0"
            />
          </div>
        );
      })}
    </div>
  );
}
