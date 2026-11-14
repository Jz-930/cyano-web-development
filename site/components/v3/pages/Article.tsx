import pageCopy from "@/content/v4/pages/Article.json";
import { Locale, t, href, text, insights, getArticleBlocks } from "@/lib/content-v4";
import { Button } from "../ui";
import {CopyLink} from "../islands/CopyLink";
import { PageHero } from "./PageHero";
import { Phrase } from "@/components/v4/Phrase";

export function Article({ locale, slug }: { locale: Locale; slug: string }) {
  const a = insights(locale).find((i) => i.slug === slug)!;
  const blocks = getArticleBlocks(slug, locale);
  return (
    <>
      <PageHero
        paper
        locale={locale}
        eyebrow={a.category}
        title={a.title}
        art={a.image}
        compact
      />
      <section className="section article-section" data-header="paper">
        <div className="wrap">
          <div className="article-layout">
          <aside className="article-sidebar">
            <span>{a.date}</span>
            <h3>{a.author.role}</h3>
            <p>{pageCopy.cyano_founding_team[locale]}</p>
            <CopyLink locale={locale} />
            <div className="article-toc">
              <h4>{pageCopy.in_this_article[locale]}</h4>
              {blocks.map((b, i) => (
                <a href={"#part-" + i} key={i}>
                  {b.q}
                </a>
              ))}
            </div>
          </aside>
          <article className="article-body">
            {blocks.map((b, i) => (
              <section id={"part-" + i} key={i}>
                <h2><Phrase text={b.q} locale={locale} /></h2>
                {b.a.split("\n\n").map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </section>
            ))}
            <div className="article-end">
              <h3>
                {pageCopy.discuss_a_similar_project[locale]}
              </h3>
              <p>
                {pageCopy.bring_your_current_process[locale]}
              </p>
              <Button locale={locale}>{text("D.1", "主按钮", locale)}</Button>
            </div>
          </article>
          </div>
        </div>
      </section>
    </>
  );
}
