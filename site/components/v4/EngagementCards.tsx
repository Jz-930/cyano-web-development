import { ViewTransition, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import pageCopy from "@/content/v4/pages/EngagementCards.json";
import { href, type Locale } from "@/lib/locale";
import { copyNew } from "@/lib/mockups";
import type { EngagementMode } from "./EngagementGantt";

const CARD_DEFS: Array<{
  index: 0 | 1 | 2;
  mode: EngagementMode;
  angleKey: string;
  timeKey: string;
}> = [
  { index: 0, mode: "custom", angleKey: "H-5a1", timeKey: "E-T1" },
  { index: 1, mode: "pilot", angleKey: "H-5a2", timeKey: "E-T2" },
  { index: 2, mode: "managed", angleKey: "H-5a3", timeKey: "E-T3" },
];

export type EngagementCardsProps = {
  locale: Locale;
  recommendedMode?: EngagementMode | null;
  reorderOnRecommend?: boolean;
};

export function EngagementCards({
  locale,
  recommendedMode = null,
  reorderOnRecommend = false,
}: EngagementCardsProps) {
  const ordered =
    reorderOnRecommend && recommendedMode
      ? [
          ...CARD_DEFS.filter((c) => c.mode === recommendedMode),
          ...CARD_DEFS.filter((c) => c.mode !== recommendedMode),
        ]
      : CARD_DEFS;

  const recBadge = copyNew("S7-badge", locale);

  return (
    <div className="engagement-grid">
      {ordered.map((def, pos) => {
        const i = def.index;
        const isRec = recommendedMode === def.mode;
        const angle = copyNew(def.angleKey, locale);
        const timing =
          copyNew(def.timeKey, locale) ?? pageCopy.first_release_in_6[locale][i];

        const cardEl = (
          <article
            key={def.mode}
            className={`card engagement-card${isRec ? " is-recommended" : ""}`}
            data-mode={def.mode}
            data-reveal=""
            data-motion="transform"
            style={{ "--i": pos } as CSSProperties}
          >
            <div className="engagement-top">
              <span className="label">{`0${i + 1}`}</span>
              {angle ? <span className="label engagement-angle">{angle}</span> : null}
              {isRec && recBadge ? (
                <span className="tag engagement-rec-badge">{recBadge}</span>
              ) : null}
            </div>
            <span className="tag">{pageCopy.own_a_system[locale][i]}</span>
            <h3 className="h3">{pageCopy.full_custom_build[locale][i]}</h3>
            <p className="engagement-desc">
              {pageCopy.for_teams_with_clear[locale][i]}
            </p>
            <div className="engagement-bottom">
              <span className="small engagement-timing">{timing}</span>
              <Link
                href={href(locale, "/contact#form")}
                aria-label={pageCopy.discuss_engagement[locale]}
                className="engagement-arrow"
              >
                <ArrowUpRight size={20} />
              </Link>
            </div>
          </article>
        );

        return reorderOnRecommend ? (
          <ViewTransition key={def.mode} name={`eng-card-${def.mode}`}>
            {cardEl}
          </ViewTransition>
        ) : (
          cardEl
        );
      })}
    </div>
  );
}
