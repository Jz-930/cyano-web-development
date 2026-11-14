import { ViewTransition, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  copyIfApproved,
  href,
  t,
  type CaseStudy,
  type Locale,
} from "@/lib/content-v4";
import { ScaledSceneMockup } from "./scenes";
import { MetricBadge } from "./MetricBadge";
import { TimeChip } from "./TimeChip";

const CASE_H3_ROW: Record<string, string> = {
  "proposal-generation": "01",
  "it-knowledge-assistant": "02",
  "nl-data-query": "03",
  "sales-consultant-ai": "04",
  "property-management": "05",
  "writing-memory-engine": "06",
};

export type CaseCoverCardProps = {
  item: CaseStudy;
  locale: Locale;
  featured?: boolean;
  index?: number;
  glassBadge?: boolean;
  reveal?: boolean;
  style?: CSSProperties;
};

export function CaseCoverCard({
  item,
  locale,
  featured = false,
  index = 0,
  glassBadge = index < 2,
  reveal = true,
  style,
}: CaseCoverCardProps) {
  const h3Row = CASE_H3_ROW[item.slug];
  const before = h3Row ? copyIfApproved(`H-3b${h3Row}`, locale) : null;
  const after = h3Row ? copyIfApproved(`H-3a${h3Row}`, locale) : null;
  const ctaLabel =
    copyIfApproved("cite-case", locale) ?? t(locale, "阅读案例", "Read case study");

  const mergedStyle: CSSProperties = {
    "--i": index,
    ...style,
  } as CSSProperties;

  return (
    <article
      className={`case-card card is-clickable${featured ? " is-featured" : ""}`}
      data-reveal={reveal ? "" : undefined}
      style={mergedStyle}
    >
      <div className="case-cover edge-pointer" data-surface="dark">
        <img
          className="field"
          src="/media/field/panel-720.webp"
          srcSet="/media/field/panel-720.webp 720w, /media/field/panel.webp 1440w"
          sizes="(max-width: 700px) 92vw, 440px"
          alt=""
          decoding="async"
          loading="lazy"
        />
        <ViewTransition
          name={`case-shot-${item.slug}`}
          share="morph"
          default="none"
        >
          <div className="case-cover-mk" data-motion="transform" aria-hidden="true">
            <ScaledSceneMockup
              scene={item.mockup}
              locale={locale}
              size="compact"
            />
          </div>
        </ViewTransition>
        <MetricBadge
          value={item.stats[0].value}
          label={item.stats[0].label}
          glass={glassBadge}
          glow={glassBadge}
        />
      </div>

      <div className="case-body">
        <div className="case-meta-row">
          <span className="tag">{item.industry}</span>
          <span className="tag">{item.model}</span>
          <span className="small">{item.duration}</span>
        </div>
        <ViewTransition
          name={`case-title-${item.slug}`}
          share="morph"
          default="none"
        >
          <h3 className="h3">
            <Link
              className="card-link"
              href={href(locale, `/cases/${item.slug}`)}
            >
              {item.title}
            </Link>
          </h3>
        </ViewTransition>
        <TimeChip before={before} after={after} />
        <span className="text-link case-cta" aria-hidden="true">
          {ctaLabel}
          <ArrowUpRight size={16} />
        </span>
      </div>
    </article>
  );
}
