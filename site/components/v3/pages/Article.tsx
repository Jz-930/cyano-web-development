import pageCopy from "@/content/v3/pages/Article.json";
import { Locale, t, href, text, insights } from "@/lib/v1-content";
import { Button } from "../ui";
import {CopyLink} from "../islands/CopyLink";
import articles from "@/content/articles.json";
import { PageHero } from "./PageHero";

export function Article({ locale, slug }: { locale: Locale; slug: string }) {
  const a = insights(locale).find((i) => i.slug === slug)!;
  const blocks = (
    articles as Record<string, Record<Locale, { q: string; a: string }[]>>
  )[slug][locale];
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
      <section className="section article-section">
        <div className="wrap">
          <div className="article-layout">
          <aside className="article-sidebar">
            <span>{a.date}</span>
            <h3>{a.author.role}</h3>
            <p>{pageCopy.cc92632c3cd[locale]}</p>
            <CopyLink locale={locale} />
            <div className="article-toc">
              <h4>{pageCopy.cc98a765438[locale]}</h4>
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
                <h2>{b.q}</h2>
                {b.a.split("\n\n").map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </section>
            ))}
            <div className="article-end">
              <h3>
                {pageCopy.c6d9279dc73[locale]}
              </h3>
              <p>
                {pageCopy.cb0bcab9e81[locale]}
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
