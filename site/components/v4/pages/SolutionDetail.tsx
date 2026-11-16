import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
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
import { Photo } from "../Photo";
import { SOLUTION_PHOTO } from "../SolutionExplorer";
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

  // The content already lists maintenance for every solution; de-duplicate
  // so it is not rendered twice.
  const deliverables = [
    ...new Set([
      ...sol.deliverables.map((d) => d[locale]),
      pageCopy.maintenance_and_ongoing_iteration[locale],
    ]),
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
              <div className="glass-badge sol-hero-stats flex flex-wrap items-center [gap:var(--sp-3)_var(--sp-5)] [padding:var(--sp-3)_var(--sp-4)] [border-radius:var(--r-card)]">
                {repCase.stats.map((st, idx) => (
                  <CitationPeek
                    key={st.sourceId + idx}
                    id={st.sourceId}
                    locale={locale}
                    className="sol-stat-pill"
                  >
                    <strong className="sol-stat-val glow-number [font-size:15px] [font-weight:500] [color:var(--ice)] [font-variant-numeric:tabular-nums]">
                      {st.value}
                    </strong>
                    <span className="sol-stat-lbl [font-size:13px] [color:var(--on-dark)]">{st.label}</span>
                  </CitationPeek>
                ))}
              </div>
            }
          />
        }
      />

      {/* Section 2: Representative case results */}
      <section className="paper-2 sol-results-section [padding-block:var(--sp-8)]" data-header="paper">
        <div className="wrap">
          <div className="result-grid [margin:50px_0_0] [@media(max-width:600px)]:[margin:35px_0_0] [gap:var(--sp-6)]">
            {repCase.stats.map((st, idx) => (
              <div
                key={st.sourceId + idx}
                className="result-cell flex flex-col [align-items:flex-start] [gap:var(--sp-2)] [padding-left:var(--sp-4)] [border-left:1px_solid_var(--line)]"
                data-reveal=""
                style={{ "--i": idx } as React.CSSProperties}
              >
                <CitationPeek
                  id={st.sourceId}
                  locale={locale}
                  className="result-cite-btn"
                >
                  <span className="figure result-figure [font-size:48px] [line-height:1.05] [font-weight:500] [@media(max-width:720px)]:[font-size:38px] [font-variant-numeric:tabular-nums]">
                    {st.value}
                  </span>
                </CitationPeek>
                <p className="result-label m-0 [color:var(--muted)] [font-size:15px]">{st.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Pains & inequality */}
      <section className="paper sol-pains-section [padding-block:var(--section-y)]" data-header="paper">
        <div className="wrap">
          <div className="sol-sec-head flex flex-col [gap:var(--sp-2)] [margin-bottom:var(--stack-heading)]" data-reveal="">
            <p className="eyebrow">{pageCopy.the_challenge[locale]}</p>
            <h2 className="h2">
              <Phrase
                text={pageCopy.common_problems_in_this[locale]}
                locale={locale}
              />
            </h2>
          </div>

          {SOLUTION_PHOTO[sol.slug] ? (
            <Photo
              id={SOLUTION_PHOTO[sol.slug]}
              locale={locale}
              className="ph ph-band"
              sizes="(max-width: 1280px) calc(100vw - 32px), 1232px"
            />
          ) : null}

          <div className="sol-pains-grid grid [grid-template-columns:repeat(3,minmax(0,1fr))] [@media(max-width:1024px)]:[grid-template-columns:minmax(0,1fr)] [gap:var(--sp-6)]">
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
                  <div className="sol-pain-top flex items-center justify-between [gap:var(--sp-2)]">
                    <span className="label">{`0${i + 1}`}</span>
                    <span className="tag inline-flex [border-radius:var(--r-chip)] [padding:4px_10px]">{p.metricTag[locale]}</span>
                  </div>
                  <h3 className="h3">{p.title[locale]}</h3>
                  <p className="sol-pain-desc m-0 [color:var(--muted)]">{p.scenario[locale]}</p>
                  {ans ? <div className="card-answer [margin-top:auto] [padding-top:var(--sp-3)] [border-top:1px_solid_var(--line-soft)] [font-size:14px] [font-weight:500] [color:var(--link)]">{ans}</div> : null}
                </article>
              );
            })}
          </div>

          {neq ? (
            <p className="conclusion sol-neq [padding-left:var(--sp-5)] [border-left:2px_solid_var(--cyan)] [font-size:18px] [line-height:1.7] [color:var(--ink)]" data-reveal="">
              {renderBold(neq)}
            </p>
          ) : null}
        </div>
      </section>

      <div className="wrap">
        <hr className="rule-dot relative [height:1px] [border:0] [background:var(--line-soft)] overflow-visible" />
      </div>

      {/* Section 4: Workflow S5 */}
      <section className="paper sol-workflow-section [padding-block:var(--section-y)]" data-header="paper">
        <div className="wrap">
          <div className="sol-sec-head flex flex-col [gap:var(--sp-2)] [margin-bottom:var(--stack-heading)]" data-reveal="">
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
      <section className="paper-2 sol-deliverables-section [padding-block:var(--section-y)]" data-header="paper">
        <div className="wrap">
          <div className="sol-sec-head flex flex-col [gap:var(--sp-2)] [margin-bottom:var(--stack-heading)]" data-reveal="">
            <h2 className="h2">
              <Phrase
                text={pageCopy.what_you_receive[locale]}
                locale={locale}
              />
            </h2>
          </div>
          <ul className="sol-deliverables-grid grid [grid-template-columns:repeat(2,minmax(0,1fr))] [@media(max-width:720px)]:[grid-template-columns:minmax(0,1fr)] [gap:var(--sp-4)_var(--sp-7)] list-none m-0 p-0" data-reveal="">
            {deliverables.map((item) => (
              <li key={item} className="sol-deliverable-item flex [align-items:flex-start] [gap:var(--sp-3)] [padding:var(--sp-4)] [border-radius:var(--r-card)] [background:var(--p1)] [border:1px_solid_var(--line-soft)] [color:var(--ink)]">
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
        className="paper sol-case-section [padding-block:var(--section-y)]"
        data-header="paper"
      >
        <div className="wrap">
          <div className="sol-sec-head flex flex-col [gap:var(--sp-2)] [margin-bottom:var(--stack-heading)]" data-reveal="">
            <p className="eyebrow">{pageCopy.in_production[locale]}</p>
            <h2 className="h2">
              <Phrase
                text={pageCopy.related_system_and_project[locale]}
                locale={locale}
              />
            </h2>
          </div>
          <div className="sol-single-case grid [grid-template-columns:minmax(0,1fr)_minmax(0,1fr)] [@media(max-width:1024px)]:[grid-template-columns:minmax(0,1fr)] [gap:var(--sp-7)] [align-items:center]">
            <CaseCoverCard item={repCase} locale={locale} glassBadge />
            <div className="grid [gap:var(--sp-4)] [align-content:start]" data-reveal="">
              <p className="eyebrow">{repCase.system}</p>
              <p className="m-0 [color:var(--muted)]">{repCase.profile}</p>
              <p className="m-0 [font-size:18px] [line-height:1.75] [color:var(--ink)]">{repCase.outcome}</p>
              <dl className="grid [grid-template-columns:repeat(3,minmax(0,1fr))] [gap:var(--sp-4)] m-0 [padding-top:var(--sp-4)] [border-top:1px_solid_var(--line)]">
                {repCase.stats.map((st, idx) => (
                  <div key={st.sourceId + idx} className="grid [gap:var(--sp-1)]">
                    <dt className="[order:2] [font-size:13px] [line-height:1.5] [color:var(--muted)]">{st.label}</dt>
                    <dd className="m-0 [font-size:22px] [line-height:1.2] [font-weight:500] [color:var(--link)]">{st.value}</dd>
                  </div>
                ))}
              </dl>
              <Link className="text-link" href={href(locale, `/cases/${repCase.slug}`)}>
                {locale === "zh" ? "阅读完整案例" : "Read the full case"}
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Interactive Demo (knowledge-assistant & data-query) */}
      {hasInteractiveDemo ? (
        <section
          className="dark halo-panel sol-demo-section [padding-block:var(--section-y)]"
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
      <section className="paper-2 sol-faq-section [padding-block:var(--section-y)]" data-header="paper">
        <div className="wrap">
          <div className="sol-sec-head flex flex-col [gap:var(--sp-2)] [margin-bottom:var(--stack-heading)]" data-reveal="">
            <h2 className="h2">{pageCopy.common_questions[locale]}</h2>
          </div>
          <FAQ items={faqItems} openCount={0} />
        </div>
      </section>
    </>
  );
}
