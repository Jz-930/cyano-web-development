"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CloudCog,
  Compass,
  Server,
  ShieldCheck,
} from "lucide-react";
import { type Locale, href, pick, siteCopy, t } from "@/lib/content";

/**
 * G-17: Interactive 3-Question Fit Recommender on /engagement.
 */
export function ModeSelectorQuiz({ locale }: { locale: Locale }) {
  const rec = siteCopy.engagement.recommender;
  const [answers, setAnswers] = useState<Record<string, number>>({
    frequency: 2,
    ops: 1,
    readiness: 1,
  });

  // Sum scores across selected options
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
    <div className="rounded-[22px] border border-[#0E5961]/24 bg-[#05141A] p-6 text-[#F2FAF9] shadow-xl md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <span className="eyebrow-badge eyebrow-badge-dark">
            {pick(locale, rec.eyebrow)}
          </span>
          <h2 className="mt-2 text-[22px] font-semibold text-[#F2FAF9] md:text-[26px]">
            {pick(locale, rec.title)}
          </h2>
        </div>
        <Compass size={26} className="text-[#7EF5D6]" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:items-center">
        {/* 3 Interactive Questions */}
        <div className="space-y-5">
          {rec.questions.map((q) => (
            <fieldset key={q.id} className="m-0 border-0 p-0">
              <legend className="text-[14px] font-semibold text-[#D8ECEE]">
                {pick(locale, q.label)}
              </legend>
              <div className="mt-2.5 grid gap-2 sm:grid-cols-3">
                {q.options.map((opt, idx) => {
                  const selected = (answers[q.id] ?? 0) === idx;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [q.id]: idx }))
                      }
                      className={`min-h-[48px] rounded-xl border px-3.5 py-2.5 text-left text-[13px] font-medium leading-snug transition-all ${
                        selected
                          ? "border-[#7EF5D6] bg-[#0B2B36] text-[#7EF5D6] shadow-[0_0_20px_-6px_rgba(126,245,214,0.35)]"
                          : "border-white/12 bg-[#081A21] text-[#C6DFE2] hover:border-[#7EF5D6]/40"
                      }`}
                    >
                      {pick(locale, opt.label)}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        {/* Dynamic Recommendation Output */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#7EF5D6]/45 bg-gradient-to-b from-[#0A2A35] to-[#06181F] p-6">
          <div>
            <span className="font-mono-tech inline-flex rounded-full bg-[#7EF5D6]/18 px-3 py-1 text-[12px] font-bold text-[#7EF5D6]">
              {t(locale, "建议起步模式", "RECOMMENDED STARTING MODEL")}
            </span>
            <h3 className="mt-3 text-[22px] font-semibold text-[#F2FAF9]">
              {pick(locale, bestMode.name)}
            </h3>
            <div className="mt-1.5 font-mono-tech text-[14px] font-semibold text-[#52C7CC]">
              {pick(locale, bestMode.duration)}
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-[#D8ECEE]">
              {pick(locale, bestMode.summary)}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/12">
            <Link
              href={href(locale, `/contact?inquiry=${bestMode.key}#form`)}
              className="btn-primary-mint w-full"
            >
              <span>{pick(locale, rec.applyCta)}</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * G-18 + M-03: 5-Row Structured Comparison Matrix on Desktop + 3 Clean Cards on Mobile.
 */
export function ComparisonMatrix({ locale }: { locale: Locale }) {
  const rows = siteCopy.engagement.comparisonRows;
  const modes = siteCopy.engagementModes;

  return (
    <div>
      {/* Desktop Table */}
      <div className="card-light hidden overflow-hidden md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#D3E3E6] bg-[#062F3A] text-[#F2FAF9]">
              <th className="w-[19%] p-5 font-mono-tech text-[12px] uppercase tracking-[0.08em] text-[#7EF5D6]">
                {t(locale, "对比维度", "Dimension")}
              </th>
              {modes.map((m) => (
                <th key={m.key} className="w-[27%] p-5">
                  <div className="text-[16px] font-semibold text-[#F2FAF9]">
                    {pick(locale, m.name)}
                  </div>
                  <div className="mt-1 font-mono-tech text-[12px] font-medium text-[#7EF5D6]">
                    {pick(locale, m.duration)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D3E3E6] text-[14px]">
            {rows.map((r, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 1 ? "bg-[#F8FCFC]" : "bg-white"}
              >
                <th className="p-5 font-semibold text-[#07161A] align-top">
                  {pick(locale, r.dimension)}
                </th>
                <td className="p-5 text-[#31494F] align-top leading-relaxed">
                  {pick(locale, r.custom)}
                </td>
                <td className="p-5 text-[#31494F] align-top leading-relaxed">
                  {pick(locale, r.pilot)}
                </td>
                <td className="p-5 text-[#31494F] align-top leading-relaxed">
                  {pick(locale, r.managed)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Mode Cards (M-03: zero cramped horizontal scroll) */}
      <div className="grid gap-4 md:hidden">
        {modes.map((m) => {
          const k = m.key as "custom" | "pilot" | "managed";
          return (
            <div key={m.key} className="card-light p-5">
              <div className="border-b border-[#D3E3E6] pb-3">
                <span className="font-mono-tech text-[12px] font-semibold text-[#0E5961]">
                  {pick(locale, m.duration)}
                </span>
                <h3 className="mt-1 text-[18px] font-semibold text-[#07161A]">
                  {pick(locale, m.name)}
                </h3>
              </div>
              <dl className="mt-3 space-y-2.5 text-[14px]">
                {rows.map((r, rIdx) => (
                  <div key={rIdx}>
                    <dt className="font-semibold text-[#07161A]">
                      {pick(locale, r.dimension)}
                    </dt>
                    <dd className="m-0 mt-0.5 text-[#31494F]">
                      {pick(locale, r[k])}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * V-15: Distinct icons & architectural framing for SaaS vs Private Environment Deployment.
 */
export function DeploymentOptionsGrid({ locale }: { locale: Locale }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {siteCopy.engagement.deployments.map((d) => {
        const isPrivate = d.key === "private";
        const Icon = isPrivate ? Server : CloudCog;
        return (
          <article key={d.key} className="card-light p-6 md:p-7">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#062F3A] text-[#7EF5D6]">
                <Icon size={22} />
              </span>
              <span className="font-mono-tech inline-flex items-center gap-1.5 rounded-full bg-[#E7F4F5] px-3 py-1 text-[12px] font-semibold text-[#0E5961]">
                {isPrivate && <ShieldCheck size={13} />}
                <span>{pick(locale, d.badge)}</span>
              </span>
            </div>
            <h3 className="mt-4 text-[20px] font-semibold text-[#07161A]">
              {pick(locale, d.title)}
            </h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-[#31494F]">
              {pick(locale, d.body)}
            </p>
          </article>
        );
      })}
    </div>
  );
}
