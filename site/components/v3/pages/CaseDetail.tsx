import pageCopy from "@/content/v3/pages/CaseDetail.json";
import Link from "next/link";
import { ArrowUpRight, Workflow, Quote } from "lucide-react";
import { Locale, t, href, text, cases } from "@/lib/v1-content";
import { Button, Eyebrow, SectionTitle, CaseCard, WorkflowDiagram, DemoLink } from "../ui";
import {Gallery} from "../islands/Gallery";
import {InteractiveDemo} from "../islands/InteractiveDemo";
import { PageHero } from "./PageHero";

export function CaseDetail({ locale, slug }: { locale: Locale; slug: string }) {
  const c = cases(locale).find((c) => c.slug === slug)!;
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={c.industry + " / " + text("D.1", "“客户项目”标签", locale)}
        title={c.title}
        intro={c.profile}
        compact
      >
        <Button to={href(locale, "/contact?case=" + c.slug + "#form")}>
          {pageCopy.c019a52a91a[locale]}
        </Button>
        <DemoLink item={c} locale={locale} />
      </PageHero>
      <section className="case-overview">
        <div className="container">
          <div className="case-facts">
            {[
              [pageCopy.c5b5b00425e[locale], c.system],
              [pageCopy.c95ed31d988[locale], c.model],
              [pageCopy.c184eaeaf4e[locale], c.duration],
            ].map(([label, value]) => (
              <div key={label}>
                <small>{label}</small>
                <span>{value}</span>
              </div>
            ))}
          </div>
          <div className="result-grid">
            {c.stats.map((s) => (
              <div key={s.label}>
                <strong>{s.value}</strong>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section mist">
        <div className="container">
          <SectionTitle
            eyebrow={pageCopy.cde006ce3f7[locale]}
            title={c.system}
            description={pageCopy.cef3ba25bcb[locale]}
          />
          <Gallery item={c} locale={locale} />
          <p className="confidential-note gallery-note">
            {text("D.1", "保密说明（案例）", locale)}
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="editorial-split">
            <Eyebrow>{pageCopy.c102a9f05f7[locale]}</Eyebrow>
            <div>
              <h2>
                {pageCopy.c7b5688bc57[locale]}
              </h2>
              <div className="before-after">
                <div>
                  <small>{pageCopy.cd46d21be8d[locale]}</small>
                  <p>{c.before}</p>
                </div>
                <div>
                  <small>{pageCopy.c080f33ef37[locale]}</small>
                  <p>{c.after}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="section-divider" />
          <SectionTitle
            eyebrow={pageCopy.c877641ab00[locale]}
            title={pageCopy.c4600500e8f[locale]}
          />
          <WorkflowDiagram locale={locale} />
          {[2, 3].includes(c.index) && (
            <InteractiveDemo locale={locale} data={c.index === 3} />
          )}
          <div className="outcome">
            <Quote size={34} strokeWidth={1} />
            <Eyebrow>{pageCopy.c8a71fc9bde[locale]}</Eyebrow>
            <h2>{c.outcome}</h2>
            <p>
              {pageCopy.c3b730cce7f[locale]}
            </p>
            <Link className="text-link" href={href(locale, "/technology")}>
              {pageCopy.ca71b8bf131[locale]}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <SectionTitle
            eyebrow={pageCopy.c57d20e417b[locale]}
            title={pageCopy.cdb7fcdbcc3[locale]}
          />
          <div className="case-grid">
            {cases(locale)
              .filter((x) => x.slug !== slug)
              .slice(0, 2)
              .map((item) => (
                <CaseCard key={item.slug} item={item} locale={locale} />
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
