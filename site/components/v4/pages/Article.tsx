import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import pageCopy from "@/content/v4/pages/Article.json";
import heroCopy from "@/content/v4/pages/PageHero.json";
import {
  allInsights,
  allSolutions,
  cases,
  getArticleBlocks,
  href,
  text,
  type Locale,
} from "@/lib/content-v4";
import { ArticleToc } from "../ArticleToc";
import { CaseCoverCard } from "../CaseCoverCard";
import { CopyLink } from "../CopyLink";
import { InsightCover } from "../InsightCover";
import { Phrase } from "../Phrase";

export function Article({ locale, slug }: { locale: Locale; slug: string }) {
  const ins =
    allInsights.find((i) => i.slug === slug) ?? allInsights[0];
  const blocks = getArticleBlocks(ins.slug, locale);
  const navInsights = text("D.1", "关于我们下拉", locale).split(" · ")[1];

  const allCases = cases(locale);
  const relatedCase =
    allCases.find((c) => c.slug === ins.relatedCaseSlug) ?? allCases[0];
  const relatedSol =
    allSolutions.find((s) => s.slug === ins.relatedSolutionSlug) ??
    allSolutions[0];
  const otherInsights = allInsights.filter((i) => i.slug !== ins.slug);

  const tocItems = blocks.map((b, idx) => ({
    id: `part-${idx}`,
    label: b.q,
  }));

  return (
    <>
      <section className="paper article-hero" data-header="paper">
        <div className="wrap article-hero-inner">
          <nav className="breadcrumb article-crumb" aria-label={navInsights}>
            <Link href={href(locale)}>{heroCopy.home[locale]}</Link>
            <span aria-hidden="true">/</span>
            <Link href={href(locale, "/insights")}>{navInsights}</Link>
            <span aria-hidden="true">/</span>
            <span>{ins.category[locale]}</span>
          </nav>

          <div className="article-meta-bar">
            <span className="tag">{ins.category[locale]}</span>
            <time dateTime={ins.dateIso} className="small">
              {ins.dateDisplay[locale]}
            </time>
            <span className="small">{ins.readingTime[locale]}</span>
          </div>

          <h1 className="h1-page article-title">
            <Phrase text={ins.title[locale]} locale={locale} />
          </h1>

          <p className="lede article-lede">{ins.metaDescription[locale]}</p>

          <div className="article-hero-cover">
            <InsightCover slug={ins.slug} locale={locale} size="hero" />
          </div>
        </div>
      </section>

      <section className="paper article-body-section" data-header="paper">
        <div className="wrap article-grid">
          <aside className="article-toc-col">
            <ArticleToc
              heading={pageCopy.in_this_article[locale]}
              items={tocItems}
            />
          </aside>

          <article className="prose article-prose">
            {blocks.map((b, idx) => (
              <section id={`part-${idx}`} key={idx} className="article-part">
                <h2 className="h2">
                  <Phrase text={b.q} locale={locale} />
                </h2>
                {b.a.split("\n\n").map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </section>
            ))}

            <div className="article-share-row">
              <CopyLink locale={locale} />
            </div>

            <div className="card article-cta-card">
              <h3 className="h3">
                {pageCopy.discuss_a_similar_project[locale]}
              </h3>
              <p>{pageCopy.bring_your_current_process[locale]}</p>
              <Link className="button" href={href(locale, "/contact#form")}>
                {text("D.1", "主按钮", locale)}
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="paper-2 article-related-section" data-header="paper">
        <div className="wrap article-related-stack">
          <div className="article-related-pair">
            <CaseCoverCard item={relatedCase} locale={locale} glassBadge />

            <article className="card is-clickable article-sol-card">
              <span className="eyebrow">{relatedSol.name[locale]}</span>
              <h3 className="h3">
                <Link
                  className="card-link"
                  href={href(locale, `/services/${relatedSol.slug}`)}
                >
                  <Phrase text={relatedSol.promise[locale]} locale={locale} />
                </Link>
              </h3>
              <p>{relatedSol.intro[locale]}</p>
              <span className="text-link" aria-hidden="true">
                {relatedSol.shortName[locale]}
                <ArrowUpRight size={16} />
              </span>
            </article>
          </div>

          {otherInsights.length > 0 ? (
            <div className="article-other-grid">
              {otherInsights.map((other) => (
                <article
                  key={other.slug}
                  className="card is-clickable insights-card"
                >
                  <InsightCover slug={other.slug} locale={locale} size="card" />
                  <div className="insights-card-body">
                    <div className="insights-meta">
                      <span className="tag">{other.category[locale]}</span>
                      <time dateTime={other.dateIso} className="label">
                        {other.dateDisplay[locale]}
                      </time>
                    </div>
                    <h3 className="h3">
                      <Link
                        className="card-link"
                        href={href(locale, `/insights/${other.slug}`)}
                      >
                        <Phrase text={other.title[locale]} locale={locale} />
                      </Link>
                    </h3>
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
