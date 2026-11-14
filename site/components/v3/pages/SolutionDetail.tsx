import pageCopy from "@/content/v3/pages/SolutionDetail.json";
import { Check } from "lucide-react";
import { Locale, t, href, text, cases, solutions } from "@/lib/v1-content";
import { Button, SectionTitle, CaseCard, WorkflowDiagram } from "../ui";
import {FAQ} from "../islands/FAQ";
import {InteractiveDemo} from "../islands/InteractiveDemo";
import { PageHero } from "./PageHero";

export function SolutionDetail({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const s = solutions(locale).find((s) => s.slug === slug)!;
  const c = cases(locale).find((c) => c.slug === s.caseSlug)!;
  const pains = pageCopy.c941685fd36[locale][s.index].split("|");
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={s.name}
        title={s.promise}
        intro={s.intro}
        art={s.index % 2 ? "/art/technology.webp" : "/art/hero.webp"}
      >
        <Button locale={locale}>{text("D.1", "主按钮", locale)}</Button>
        <Button secondary to={href(locale, "/cases/" + c.slug)}>
          {pageCopy.c7d8027cf10[locale]}
        </Button>
      </PageHero>
      <section className="section">
        <div className="container">
          <div className="result-grid">
            {c.stats.map((v) => (
              <div key={v.label}>
                <strong>{v.value}</strong>
                <p>{v.label}</p>
              </div>
            ))}
          </div>
          <SectionTitle
            eyebrow={pageCopy.c50d6ecf9ef[locale]}
            title={pageCopy.c6371e120c5[locale]}
          />
          <div className="three-columns">
            {pains.map((p, i) => (
              <article className="plain-card" key={p}>
                <span className="index-label">0{i + 1}</span>
                <h3>{p}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section mist">
        <div className="container">
          <SectionTitle
            eyebrow={pageCopy.cb2e80ebd0a[locale]}
            title={pageCopy.c7b67845196[locale]}
          />
          <WorkflowDiagram locale={locale} />
          <div className="deliverables">
            <h3>{pageCopy.c8e8a71c730[locale]}</h3>
            {[
              ...s.outputs.split(" · "),
              pageCopy.ccf14677e99[locale],
            ].map((d) => (
              <span key={d}>
                <Check size={17} />
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow={pageCopy.c186c216c6e[locale]}
            title={pageCopy.c2e9ee617bd[locale]}
          />
          <div className="single-case">
            <CaseCard item={c} locale={locale} />
          </div>
          {[2, 3].includes(s.index) && (
            <InteractiveDemo locale={locale} data={s.index === 3} />
          )}
          <div className="faq-section">
            <h2>{pageCopy.c9f70c398fd[locale]}</h2>
            <FAQ
              items={[
                {
                  q: pageCopy.c7f1a4caa4e[locale],
                  a: pageCopy.cb9bc65b425[locale],
                },
                {
                  q: pageCopy.c0d5ddd0cbb[locale],
                  a: pageCopy.c0b647bcc73[locale],
                },
                {
                  q: pageCopy.c1d935442b7[locale],
                  a: text("D.3", "合作提示（T9）", locale),
                },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
