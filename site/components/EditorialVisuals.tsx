"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Clock, Link2 } from "lucide-react";
import {
  type InsightItem,
  type Locale,
  getFounder,
  href,
  insightsList,
  pick,
  t,
} from "@/lib/content";

/**
 * G-19: Custom typographic + engineering node schematic cover per Insight article
 * (eliminates duplicate case screenshots on Insights cards).
 */
export function InsightCoverGraphic({
  item,
  locale,
}: {
  item: InsightItem;
  locale: Locale;
}) {
  return (
    <div className="relative flex aspect-[16/9] w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#041116] via-[#07212A] to-[#041419] p-5 text-[#F2FAF9]">
      {/* Subtle blueprint grid */}
      <div
        aria-hidden="true"
        className="bg-tech-grid-dark pointer-events-none absolute inset-0 opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-[#7EF5D6]/16 blur-2xl"
      />

      <div className="relative z-10 flex items-center justify-between gap-2">
        <span className="font-mono-tech rounded-md border border-[#7EF5D6]/30 bg-[#051820]/90 px-2.5 py-1 text-[12px] font-semibold text-[#7EF5D6]">
          {item.coverCode}
        </span>
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[12px] font-medium text-[#D8ECEE]">
          {pick(locale, item.category)}
        </span>
      </div>

      {/* 3-Node Schematic Pipeline */}
      <div className="relative z-10 my-2 grid grid-cols-3 gap-2">
        {item.coverNodes.map((node, idx) => (
          <div
            key={idx}
            className={`rounded-xl border px-2.5 py-2 ${
              idx === 1
                ? "border-[#7EF5D6]/55 bg-[#0B2B35]/90 text-[#7EF5D6]"
                : "border-white/14 bg-[#05141A]/85 text-[#D8ECEE]"
            }`}
          >
            <span className="font-mono-tech block text-[12px] opacity-75">
              0{idx + 1}
            </span>
            <span className="mt-0.5 block truncate text-[12px] font-semibold">
              {pick(locale, node)}
            </span>
          </div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-white/12 pt-2.5">
        <span className="font-mono-tech text-[12px] font-semibold text-[#52C7CC]">
          {pick(locale, item.coverMetric)}
        </span>
        <ArrowUpRight size={16} className="text-[#7EF5D6]" />
      </div>
    </div>
  );
}

export function InsightCardsGrid({ locale }: { locale: Locale }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {insightsList.map((ins) => {
        const author = getFounder(ins.authorId);
        return (
          <article
            key={ins.slug}
            className="card-light card-light-interactive group flex flex-col overflow-hidden"
          >
            <Link
              href={href(locale, `/insights/${ins.slug}`)}
              aria-label={pick(locale, ins.title)}
              className="block border-b border-[#D3E3E6]"
            >
              <InsightCoverGraphic item={ins} locale={locale} />
            </Link>

            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#496269]">
                  <span>{pick(locale, ins.dateDisplay)}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={13} />
                    {pick(locale, ins.readingTime)}
                  </span>
                </div>

                <h3 className="mt-3 text-[19px] font-semibold leading-snug text-[#07161A]">
                  <Link
                    href={href(locale, `/insights/${ins.slug}`)}
                    className="group-hover:text-[#0E5961]"
                  >
                    {pick(locale, ins.title)}
                  </Link>
                </h3>

                <p className="mt-2.5 text-[14px] leading-relaxed text-[#31494F]">
                  {pick(locale, ins.metaDescription)}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#D3E3E6] pt-4">
                <span className="text-[13px] font-medium text-[#496269]">
                  {pick(locale, author.role)}
                </span>
                <Link
                  href={href(locale, `/insights/${ins.slug}`)}
                  className="link-inline-tech"
                >
                  <span>{t(locale, "阅读全文", "Read note")}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/**
 * G-20: Inline Engineering Diagram inside Article body.
 */
export function ArticleInlineDiagram({
  diagram,
  locale,
}: {
  diagram: InsightItem["diagrams"][number];
  locale: Locale;
}) {
  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-[#062F3A]/20 bg-[#051318] p-5 text-[#F2FAF9] shadow-lg md:p-6">
      <div className="border-b border-white/10 pb-3">
        <span className="font-mono-tech text-[12px] font-semibold uppercase tracking-[0.08em] text-[#7EF5D6]">
          {pick(locale, diagram.eyebrow)}
        </span>
        <h3 className="mt-1 text-[18px] font-semibold text-[#F2FAF9]">
          {pick(locale, diagram.title)}
        </h3>
      </div>

      <div
        className={`mt-4 grid gap-3 ${
          diagram.nodes.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-3"
        }`}
      >
        {diagram.nodes.map((n, idx) => (
          <div
            key={idx}
            className={`rounded-xl border p-3.5 ${
              n.highlight
                ? "border-[#7EF5D6]/55 bg-[#0A2933]"
                : "border-white/12 bg-[#081A21]"
            }`}
          >
            <span className="font-mono-tech text-[12px] font-semibold text-[#7EF5D6]">
              {n.tag}
            </span>
            <div className="mt-1 text-[15px] font-semibold text-[#F2FAF9]">
              {pick(locale, n.label)}
            </div>
            <p className="mt-1 text-[13px] leading-snug text-[#B4CFD2]">
              {pick(locale, n.note)}
            </p>
          </div>
        ))}
      </div>

      <figcaption className="mt-4 border-t border-white/10 pt-3 text-[13px] leading-relaxed text-[#93B5B9]">
        {pick(locale, diagram.caption)}
      </figcaption>
    </figure>
  );
}

/**
 * G-20: Editorial Pull-Quote Highlight Card inside Article body.
 */
export function ArticlePullQuote({
  pullQuote,
  locale,
}: {
  pullQuote: InsightItem["pullQuote"];
  locale: Locale;
}) {
  return (
    <aside className="my-8 rounded-2xl border-l-4 border-[#0E5961] bg-[#F3FAFA] p-5 md:p-6">
      <p className="text-[17px] font-semibold leading-relaxed text-[#07161A] md:text-[18px]">
        “{pick(locale, pullQuote.text)}”
      </p>
      <p className="mt-2 font-mono-tech text-[12px] font-medium text-[#0E5961]">
        — {pick(locale, pullQuote.note)}
      </p>
    </aside>
  );
}

export function CopyLinkButton({ locale }: { locale: Locale }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2400);
        } catch {
          setCopied(false);
        }
      }}
      className="inline-flex min-h-[38px] items-center gap-2 rounded-xl border border-[#C6DCE0] bg-white px-3.5 py-1.5 text-[13px] font-semibold text-[#0E5961] transition-colors hover:border-[#0E5961] hover:bg-[#F3FAFA]"
    >
      {copied ? <Check size={14} /> : <Link2 size={14} />}
      <span>
        {t(
          locale,
          copied ? "文章链接已复制" : "复制本文链接",
          copied ? "Article link copied" : "Copy article link"
        )}
      </span>
    </button>
  );
}
