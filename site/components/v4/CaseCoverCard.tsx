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
      <div className="case-cover edge-pointer relative [aspect-ratio:16_/_10] [background:var(--n1)] [border-radius:var(--r-card)_var(--r-card)_0_0] overflow-visible [@media(max-width:700px)]:overflow-hidden isolate" data-surface="dark">
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
          <div className="case-cover-mk absolute [left:16%] [top:12%] [right:-12px] [bottom:-12px] [@media(max-width:700px)]:[right:0] [@media(max-width:700px)]:[bottom:-8px] [transition:transform_var(--dur-scene)_var(--ease-out)]" data-motion="transform" aria-hidden="true">
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

      <div className="case-body [padding:var(--sp-5)_var(--sp-5)_var(--sp-6)] flex flex-col [gap:var(--sp-3)] [flex:1]">
        <div className="case-meta-row flex flex-wrap items-center [gap:var(--sp-2)]">
          <span className="tag inline-flex [border-radius:var(--r-chip)] [padding:4px_10px]">{item.industry}</span>
          <span className="tag inline-flex [border-radius:var(--r-chip)] [padding:4px_10px]">{item.model}</span>
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
        <span className="text-link case-cta [padding-top:var(--sp-2)] [font-size:14px]" aria-hidden="true">
          {ctaLabel}
          <ArrowUpRight size={16} />
        </span>
      </div>
    </article>
  );
}
