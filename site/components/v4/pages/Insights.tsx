import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import pageCopy from "@/content/v4/pages/Insights.json";
import {
  allInsights,
  href,
  type Locale,
} from "@/lib/content-v4";
import { InsightCover } from "../InsightCover";
import { PageHero } from "../PageHero";
import { Phrase } from "../Phrase";

export function Insights({ locale }: { locale: Locale }) {
  const featured = allInsights[0];
  const rest = allInsights.slice(1);

  return (
    <>
      <PageHero
        locale={locale}
        posterOpacity={0.25}
        eyebrow={pageCopy.insights[locale]}
        title={pageCopy.notes_on_designing_and[locale]}
        lede={pageCopy.guides_to_knowledge_systems[locale]}
        visual={
          featured ? (
            <InsightCover slug={featured.slug} locale={locale} size="card" />
          ) : null
        }
      />

      <section className="paper insights-main-section" data-header="paper">
        <div className="wrap insights-stack">
          {featured ? (
            <article
              className="card is-clickable insights-featured"
              data-reveal=""
            >
              <div className="insights-featured-cover">
                <InsightCover
                  slug={featured.slug}
                  locale={locale}
                  size="card"
                />
              </div>

              <div className="insights-featured-body">
                <div className="insights-meta">
                  <span className="tag">{featured.category[locale]}</span>
                  <time dateTime={featured.dateIso} className="small">
                    {featured.dateDisplay[locale]}
                  </time>
                  <span className="small">{featured.readingTime[locale]}</span>
                </div>

                <h2 className="h2">
                  <Link
                    className="card-link"
                    href={href(locale, `/insights/${featured.slug}`)}
                  >
                    <Phrase text={featured.title[locale]} locale={locale} />
                  </Link>
                </h2>

                <p className="insights-excerpt">
                  {featured.metaDescription[locale]}
                </p>

                <span className="insights-cta" aria-hidden="true">
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </article>
          ) : null}

          {rest.length > 0 ? (
            <div className="insights-grid">
              {rest.map((ins, idx) => (
                <article
                  key={ins.slug}
                  className="card is-clickable insights-card"
                  data-reveal=""
                  style={{ "--i": idx } as React.CSSProperties}
                >
                  <InsightCover slug={ins.slug} locale={locale} size="card" />

                  <div className="insights-card-body">
                    <div className="insights-meta">
                      <span className="tag">{ins.category[locale]}</span>
                      <time dateTime={ins.dateIso} className="small">
                        {ins.dateDisplay[locale]}
                      </time>
                      <span className="small">{ins.readingTime[locale]}</span>
                    </div>

                    <h3 className="h3">
                      <Link
                        className="card-link"
                        href={href(locale, `/insights/${ins.slug}`)}
                      >
                        <Phrase text={ins.title[locale]} locale={locale} />
                      </Link>
                    </h3>

                    <p className="insights-excerpt">
                      {ins.metaDescription[locale]}
                    </p>

                    <span className="insights-cta" aria-hidden="true">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
