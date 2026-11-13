"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock, Link2 } from "lucide-react";
import {
  type InsightItem,
  type Locale,
  getFounder,
  getMediaMeta,
  href,
  insightsList,
  pick,
  t,
} from "@/lib/content";

const INSIGHT_ART: Record<string, string> = {
  "why-chatgpt-is-not-a-knowledge-base": "/art/cyano-insight-kb.webp",
  "proposal-draft-in-15-minutes": "/art/cyano-insight-proposal.webp",
  "buy-pilot-or-managed": "/art/cyano-insight-delivery.webp",
};

/**
 * InsightCoverGraphic:
 * Clean, unobstructed 3D optical editorial artwork (ZERO boxes pasted on top!).
 */
export function InsightCoverGraphic({
  item,
}: {
  item: InsightItem;
  locale: Locale;
}) {
  const artSrc = INSIGHT_ART[item.slug] ?? "/art/cyano-insight-kb.webp";
  const meta = getMediaMeta(artSrc);

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#02080E]">
      <Image
        src={artSrc}
        alt=""
        width={meta.width}
        height={meta.height}
        sizes="(max-width: 768px) 94vw, (max-width: 1200px) 48vw, 720px"
        placeholder={meta.blurDataURL ? "blur" : "empty"}
        blurDataURL={meta.blurDataURL || undefined}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </div>
  );
}

/**
 * InsightCardsGrid:
 * Open Unboxed Magazine Columns (Artwork + Clean Editorial Typography Below).
 */
export function InsightCardsGrid({ locale }: { locale: Locale }) {
  const accents = ["#0B7A8C", "#1D4ED8", "#B45309"];

  return (
    <div className="grid gap-x-9 gap-y-14 md:grid-cols-3">
      {insightsList.map((ins, idx) => {
        const author = getFounder(ins.authorId);
        return (
          <article key={ins.slug} className="group flex flex-col">
            <Link
              href={href(locale, `/insights/${ins.slug}`)}
              aria-label={pick(locale, ins.title)}
              className="block"
            >
              <InsightCoverGraphic item={ins} locale={locale} />
            </Link>

            <div className="flex flex-1 flex-col justify-between pt-6">
              <div>
                <div className="flex flex-wrap items-center gap-2.5 text-[13px] text-[#64748B]">
                  <span
                    className="font-semibold"
                    style={{ color: accents[idx % accents.length] }}
                  >
                    {pick(locale, ins.category)}
                  </span>
                  <span>·</span>
                  <span>{pick(locale, ins.dateDisplay)}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={13} />
                    {pick(locale, ins.readingTime)}
                  </span>
                </div>

                <h3 className="mt-3 text-[21px] font-medium leading-snug text-[#0B1520]">
                  <Link
                    href={href(locale, `/insights/${ins.slug}`)}
                    className="inline-block py-0.5 transition-colors group-hover:text-[#0B7A8C]"
                  >
                    {pick(locale, ins.title)}
                  </Link>
                </h3>

                <p className="mt-2.5 text-[14px] leading-relaxed text-[#475569]">
                  {pick(locale, ins.metaDescription)}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-200/80 pt-4">
                <span className="text-[13px] text-[#64748B]">
                  {pick(locale, author.role)}
                </span>
                <Link
                  href={href(locale, `/insights/${ins.slug}`)}
                  className="link-inline-tech"
                >
                  <span>{t(locale, "阅读全文", "Read article")}</span>
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
 * ArticleInlineDiagram:
 * Clean Open Hairline Architectural Diagram (ZERO cramped dark boxes!).
 */
export function ArticleInlineDiagram({
  diagram,
  locale,
}: {
  diagram: InsightItem["diagrams"][number];
  locale: Locale;
}) {
  const nodeAccents = ["#0B7A8C", "#1D4ED8", "#6D28D9", "#B45309"];

  return (
    <figure className="my-12 border-t border-b border-slate-900/15 py-8">
      <div>
        <span className="font-mono-tech text-[12px] font-semibold uppercase tracking-[0.1em] text-[#0B7A8C]">
          {pick(locale, diagram.eyebrow)}
        </span>
        <h3 className="mt-1.5 text-[21px] font-medium text-[#0B1520]">
          {pick(locale, diagram.title)}
        </h3>
      </div>

      <div
        className={`mt-6 grid gap-8 ${
          diagram.nodes.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-3"
        }`}
      >
        {diagram.nodes.map((n, idx) => (
          <div key={idx} className="relative pl-4">
            <span
              aria-hidden="true"
              className="absolute top-1 bottom-1 left-0 w-[2.5px] rounded-full"
              style={{
                backgroundColor: n.highlight
                  ? "#B45309"
                  : nodeAccents[idx % nodeAccents.length],
              }}
            />
            <span className="font-mono-tech text-[12px] font-semibold text-[#64748B]">
              {n.tag}
            </span>
            <div className="mt-1 text-[16px] font-semibold text-[#0B1520]">
              {pick(locale, n.label)}
            </div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-[#475569]">
              {pick(locale, n.note)}
            </p>
          </div>
        ))}
      </div>

      <figcaption className="mt-6 text-[13px] leading-relaxed text-[#64748B]">
        {pick(locale, diagram.caption)}
      </figcaption>
    </figure>
  );
}

/**
 * ArticlePullQuote:
 * Editorial Pull-Quote with Cyano Teal Accent Line (no box!).
 */
export function ArticlePullQuote({
  pullQuote,
  locale,
}: {
  pullQuote: InsightItem["pullQuote"];
  locale: Locale;
}) {
  return (
    <aside className="my-12 border-l-2 border-[#0B7A8C] pl-6">
      <p className="text-[20px] font-normal leading-relaxed text-[#0B1520] md:text-[22px]">
        “{pick(locale, pullQuote.text)}”
      </p>
      <p className="mt-3 text-[13px] font-medium text-[#64748B]">
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
      className="inline-flex min-h-[38px] items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-1.5 text-[13px] font-medium text-[#111111] transition-colors hover:border-[#111111]"
    >
      {copied ? <Check size={14} className="text-[#059669]" /> : <Link2 size={14} />}
      <span>
        {copied
          ? t(locale, "已复制文章链接", "Link copied")
          : t(locale, "复制本文链接", "Copy link")}
      </span>
    </button>
  );
}
