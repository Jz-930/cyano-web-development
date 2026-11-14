import pageCopy from "@/content/v4/pages/SolutionDetail.json";
import { Check } from "lucide-react";
import { Locale, t, href, text, cases, solutions } from "@/lib/content-v4";
import { Button, SectionTitle, CaseCard, WorkflowDiagram } from "../ui";
import {FAQ} from "../islands/FAQ";
import {InteractiveDemo} from "../islands/InteractiveDemo";
import { PageHero } from "./PageHero";
import { Phrase } from "@/components/v4/Phrase";

export function SolutionDetail({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const s = solutions(locale).find((s) => s.slug === slug)!;
  const c = cases(locale).find((c) => c.slug === s.caseSlug)!;
  const pains = pageCopy.product_information_takes_too[locale][s.index].split("|");
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
          {pageCopy.see_related_work[locale]}
        </Button>
      </PageHero>
      <section className="section" data-header="paper">
        <div className="wrap">
          <div className="result-grid">
            {c.stats.map((v) => (
              <div key={v.label}>
                <strong>{v.value}</strong>
                <p>{v.label}</p>
              </div>
            ))}
          </div>
          <SectionTitle
            eyebrow={pageCopy.the_challenge[locale]}
            title={pageCopy.common_problems_in_this[locale]}
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
      <section className="section mist" data-header="paper">
        <div className="wrap">
          <SectionTitle
            eyebrow={pageCopy.the_approach[locale]}
            title={pageCopy.how_the_system_handles[locale]}
          />
          <WorkflowDiagram locale={locale} />
          <div className="deliverables">
            <h3>{pageCopy.what_you_receive[locale]}</h3>
            {[
              ...s.outputs.split(" · "),
              pageCopy.maintenance_and_ongoing_iteration[locale],
            ].map((d) => (
              <span key={d}>
                <Check size={17} />
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="section" data-header="paper">
        <div className="wrap">
          <SectionTitle
            eyebrow={pageCopy.in_production[locale]}
            title={pageCopy.related_system_and_project[locale]}
          />
          <div className="single-case">
            <CaseCard item={c} locale={locale} />
          </div>
          {["knowledge-assistant", "data-query"].includes(s.slug) && (
            <InteractiveDemo locale={locale} data={s.slug === "data-query"} />
          )}
          <div className="faq-section">
            <h2><Phrase text={pageCopy.common_questions[locale]} locale={locale} /></h2>
            <FAQ
              items={[
                {
                  q: pageCopy.can_it_connect_to[locale],
                  a: pageCopy.yes_the_assessment_covers[locale],
                },
                {
                  q: pageCopy.how_do_you_make[locale],
                  a: pageCopy.we_use_your_own[locale],
                },
                {
                  q: pageCopy.when_can_we_try[locale],
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
