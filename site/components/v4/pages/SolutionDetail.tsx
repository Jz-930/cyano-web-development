import Link from "next/link";
import { Check } from "lucide-react";
import pageCopy from "@/content/v4/pages/SolutionDetail.json";
import type { Locale } from "@/lib/content";
import {
  allSolutions,
  cases,
  copyIfApproved,
  href,
  text,
} from "@/lib/content-v4";
import { CaseCoverCard } from "../CaseCoverCard";
import { CitationPeek } from "../CitationPeek";
import { FAQ } from "../FAQ";
import { InteractiveDemo } from "../InteractiveDemo";
import { PageHero } from "../PageHero";
import { Phrase } from "../Phrase";
import { SolutionHeroStage } from "../SolutionHeroStage";
import { WorkflowRun } from "../WorkflowRun";
import { renderBold } from "../richText";

const HERO_D3_KEY: Record<string, string> = {
  "sales-ai": "销售 Hero",
  "document-automation": "文档 Hero",
  "knowledge-assistant": "知识库 Hero",
  "data-query": "数据 Hero",
};

export function SolutionDetail({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const sol =
    allSolutions.find((s) => s.slug === slug) ?? allSolutions[0];
  const navSolutions = text("D.1", "主导航", locale).split(" · ")[0];
  const heroTitleKey = HERO_D3_KEY[sol.slug] ?? "销售 Hero";
  const heroTitle = text("D.3", heroTitleKey, locale);

  const allCases = cases(locale);
  const repCase =
    allCases.find((c) => c.slug === sol.caseSlug) ?? allCases[0];

  const neq = copyIfApproved(`S-3neq.${sol.slug}`, locale);
  const isDocAuto = sol.slug === "document-automation";
  const hasInteractiveDemo = ["knowledge-assistant", "data-query"].includes(
    sol.slug,
  );

  const deliverables = [
    ...sol.deliverables.map((d) => d[locale]),
    pageCopy.maintenance_and_ongoing_iteration[locale],
  ];

  const faqItems = [
    {
      q: copyIfApproved("S-4q1", locale) ?? pageCopy.can_it_connect_to[locale],
      a: pageCopy.yes_the_assessment_covers[locale],
    },
    {
      q: copyIfApproved("S-4q2", locale) ?? pageCopy.how_do_you_make[locale],
      a: pageCopy.we_use_your_own[locale],
    },
    {
      q: copyIfApproved("S-4q3", locale) ?? pageCopy.when_can_we_try[locale],
      a: text("D.3", "合作提示（T9）", locale),
    },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        live
        preset="solution"
        focusSelector=".mk-core"
        parentCrumb={{ label: navSolutions, href: href(locale, "/services") }}
        crumbLabel={sol.name[locale]}
        eyebrow={sol.name[locale]}
        title={heroTitle}
        lede={sol.intro[locale]}
        actions={
          <>
            <Link className="button" href={href(locale, "/contact#form")}>
              {text("D.1", "主按钮", locale)}
            </Link>
            <Link className="button-secondary on-dark" href="#related-case">
              {pageCopy.see_related_work[locale]}
            </Link>
          </>
        }
        visual={
          <SolutionHeroStage
            solutionSlug={sol.slug}
            caseSlug={sol.caseSlug}
            locale={locale}
            statsSlot={
              <div className="glass-badge sol-hero-stats">
                {repCase.stats.map((st, idx) => (
                  <CitationPeek
                    key={st.sourceId + idx}
                    id={st.sourceId}
                    locale={locale}
                    className="sol-stat-pill"
                  >
                    <strong className="sol-stat-val glow-number">
                      {st.value}
                    </strong>
                    <span className="sol-stat-lbl">{st.label}</span>
                  </CitationPeek>
                ))}
              </div>
            }
          />
        }
      />

      {/* Section 2: Representative case results */}
      <section className="paper-2 sol-results-section" data-header="paper">
        <div className="wrap">
          <div className="result-grid">
            {repCase.stats.map((st, idx) => (
              <div
                key={st.sourceId + idx}
                className="result-cell"
                data-reveal=""
                style={{ "--i": idx } as React.CSSProperties}
              >
                <CitationPeek
                  id={st.sourceId}
                  locale={locale}
                  className="result-cite-btn"
                >
                  <span className="figure result-figure">
                    {st.value}
                  </span>
                </CitationPeek>
                <p className="result-label">{st.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Pains & inequality */}
      <section className="paper sol-pains-section" data-header="paper">
        <div className="wrap">
          <div className="sol-sec-head" data-reveal="">
            <p className="eyebrow">{pageCopy.the_challenge[locale]}</p>
            <h2 className="h2">
              <Phrase
                text={pageCopy.common_problems_in_this[locale]}
                locale={locale}
              />
            </h2>
          </div>

          <div className="sol-pains-grid">
            {sol.pains.map((p, i) => {
              const ans = isDocAuto
                ? copyIfApproved(`S-3a${i + 1}`, locale)
                : null;
              return (
                <article
                  key={i}
                  className="card sol-pain-card"
                  data-reveal=""
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <div className="sol-pain-top">
                    <span className="label">{`0${i + 1}`}</span>
                    <span className="tag">{p.metricTag[locale]}</span>
                  </div>
                  <h3 className="h3">{p.title[locale]}</h3>
                  <p className="sol-pain-desc">{p.scenario[locale]}</p>
                  {ans ? <div className="card-answer">{ans}</div> : null}
                </article>
              );
            })}
          </div>

          {neq ? (
            <p className="conclusion sol-neq" data-reveal="">
              {renderBold(neq)}
            </p>
          ) : null}
        </div>
      </section>

      <div className="wrap">
        <hr className="rule-dot" />
      </div>

      {/* Section 4: Workflow S5 */}
      <section className="paper sol-workflow-section" data-header="paper">
        <div className="wrap">
          <div className="sol-sec-head" data-reveal="">
            <p className="eyebrow">{pageCopy.the_approach[locale]}</p>
            <h2 className="h2">
              <Phrase
                text={pageCopy.how_the_system_handles[locale]}
                locale={locale}
              />
            </h2>
          </div>
          <WorkflowRun locale={locale} slug={sol.slug} />
        </div>
      </section>

      {/* Section 5: Deliverables */}
      <section className="paper-2 sol-deliverables-section" data-header="paper">
        <div className="wrap">
          <div className="sol-sec-head" data-reveal="">
            <h2 className="h2">
              <Phrase
                text={pageCopy.what_you_receive[locale]}
                locale={locale}
              />
            </h2>
          </div>
          <ul className="sol-deliverables-grid" data-reveal="">
            {deliverables.map((item) => (
              <li key={item} className="sol-deliverable-item">
                <Check size={16} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Section 6: Representative case */}
      <section
        id="related-case"
        className="paper sol-case-section"
        data-header="paper"
      >
        <div className="wrap">
          <div className="sol-sec-head" data-reveal="">
            <p className="eyebrow">{pageCopy.in_production[locale]}</p>
            <h2 className="h2">
              <Phrase
                text={pageCopy.related_system_and_project[locale]}
                locale={locale}
              />
            </h2>
          </div>
          <div className="sol-single-case">
            <CaseCoverCard item={repCase} locale={locale} glassBadge />
          </div>
        </div>
      </section>

      {/* Section 7: Interactive Demo (knowledge-assistant & data-query) */}
      {hasInteractiveDemo ? (
        <section
          className="dark halo-panel sol-demo-section"
          data-header="dark"
        >
          <div className="wrap">
            <InteractiveDemo
              locale={locale}
              data={sol.slug === "data-query"}
              liveBadge={text("D.1", "网页内 Demo 标签", locale)}
              disclaimer={text("D.1", "交互 Demo 说明小字", locale)}
            />
          </div>
        </section>
      ) : null}

      {/* Section 8: FAQ + T9 */}
      <section className="paper-2 sol-faq-section" data-header="paper">
        <div className="wrap">
          <div className="sol-sec-head" data-reveal="">
            <h2 className="h2">{pageCopy.common_questions[locale]}</h2>
          </div>
          <FAQ items={faqItems} openCount={0} />
          <p className="conclusion sol-pilot-note" data-reveal="">
            {text("D.3", "合作提示（T9）", locale)}
          </p>
        </div>
      </section>
    </>
  );
}
