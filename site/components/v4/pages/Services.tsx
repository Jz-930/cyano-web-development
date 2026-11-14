import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import pageCopy from "@/content/v4/pages/Services.json";
import {
  cases,
  copy,
  copyIfApproved,
  href,
  solutions,
  text,
  type Locale,
} from "@/lib/content-v4";
import type { SceneId } from "@/lib/mockups";
import { PageHero } from "../PageHero";
import { Phrase } from "../Phrase";
import { TimeChip } from "../TimeChip";
import { ScaledSceneMockup } from "../scenes";
import { ServiceRowMockup, ServiceWorkflowBar } from "../ServiceRowVisual";

const FAN_SCENES: SceneId[] = ["sales", "proposal", "wiki", "data"];

function parseOpportunityTags(raw: string, locale: Locale): string[] {
  const marker = locale === "zh" ? "标签：" : "Tags: ";
  const idx = raw.indexOf(marker);
  if (idx < 0) return [];
  return raw
    .slice(idx + marker.length)
    .split(" · ")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function Services({ locale }: { locale: Locale }) {
  const allSolutions = solutions(locale);
  const allCases = cases(locale);

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={pageCopy.solutions[locale]}
        title={copy("S-1", locale)}
        lede={text("D.3", "总览 Hero 导语", locale)}
        actions={
          <Link className="button" href={href(locale, "/contact#form")}>
            {text("D.1", "主按钮", locale)}
          </Link>
        }
        visual={
          <div className="services-fan relative w-full [max-width:480px] [@media(max-width:800px)]:[max-width:340px] [height:310px] [@media(max-width:800px)]:[height:auto] [margin-inline:auto]" aria-hidden="true">
            {FAN_SCENES.map((sc, idx) => (
              <div
                key={sc}
                className="services-fan-item absolute [@media(max-width:800px)]:[position:static] [width:240px] [@media(max-width:800px)]:w-full [height:150px] [@media(max-width:800px)]:[height:auto] [border-radius:var(--r-card)] [transition:transform_var(--qtb)]"
                data-fan={idx}
                data-motion="transform"
              >
                <ScaledSceneMockup scene={sc} locale={locale} size="compact" />
              </div>
            ))}
          </div>
        }
      />

      <section className="paper-2 services-opportunities [padding-block:var(--section-y)]" data-header="paper">
        <div className="wrap">
          <div className="services-opp-grid grid [grid-template-columns:repeat(2,minmax(0,1fr))] [@media(max-width:960px)]:[grid-template-columns:minmax(0,1fr)] [gap:var(--sp-6)]">
            {([0, 1] as const).map((i) => {
              const rawOpp = text("D.3", i === 0 ? "机会 1" : "机会 2", locale);
              const tags = parseOpportunityTags(rawOpp, locale);
              return (
                <article
                  key={i}
                  className="card services-opp-card"
                  data-reveal=""
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <span className="label">{`0${i + 1}`}</span>
                  <h2 className="h2">
                    <Phrase
                      text={pageCopy.expand_customer_services[locale][i]}
                      locale={locale}
                    />
                  </h2>
                  <p className="services-opp-desc [color:var(--muted)] m-0">
                    {pageCopy.use_product_documentation_and[locale][i]}
                  </p>
                  {tags.length > 0 ? (
                    <div className="services-opp-tags flex flex-wrap [gap:var(--sp-2)] [margin-top:auto] [padding-top:var(--sp-2)]">
                      {tags.map((tag) => (
                        <span key={tag} className="tag inline-flex [border-radius:var(--r-chip)] [padding:4px_10px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="paper services-list-section [padding-block:var(--section-y)]" data-header="paper">
        <div className="wrap">
          <div className="services-rows flex flex-col [gap:var(--sp-8)]">
            {allSolutions.map((s, i) => {
              const linkedCase =
                allCases.find((c) => c.slug === s.caseSlug) ?? allCases[0];
              const s2 = copyIfApproved(`S-2.${i + 1}`, locale);
              const [before, after] = s2 ? s2.split(" → ") : [null, null];
              const isEven = i % 2 === 1;

              return (
                <article
                  key={s.slug}
                  className={`card service-row${isEven ? " is-even" : ""}`}
                  data-reveal=""
                >
                  <div className="service-row-main grid [grid-template-columns:repeat(12,minmax(0,1fr))] [@media(max-width:960px)]:[grid-template-columns:minmax(0,1fr)] [gap:var(--sp-7)] items-center">
                    <div className="service-row-visual">
                      <ServiceRowMockup
                        scene={linkedCase.mockup}
                        solutionSlug={s.slug}
                        locale={locale}
                      />
                    </div>

                    <div className="service-row-copy flex flex-col [align-items:flex-start] [gap:var(--sp-4)]">
                      <div className="service-row-head flex items-center [gap:var(--sp-3)]">
                        <span className="label">{`0${i + 1}`}</span>
                        <span className="eyebrow">{s.name}</span>
                      </div>
                      <h2 className="h2">
                        <Phrase text={s.promise} locale={locale} />
                      </h2>
                      <TimeChip before={before} after={after} />
                      <p className="service-row-intro [color:var(--muted)] m-0">{s.intro}</p>
                      <ul className="service-row-outputs flex flex-wrap [gap:var(--sp-2)_var(--sp-4)] list-none m-0 p-0">
                        {s.outputs.split(" · ").map((item) => (
                          <li key={item}>
                            <Check size={16} aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        className="text-link service-row-cta"
                        href={href(locale, `/services/${s.slug}`)}
                      >
                        {pageCopy.explore_solution[locale]}
                        <ArrowUpRight size={18} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>

                  <ServiceWorkflowBar solutionSlug={s.slug} locale={locale} />
                </article>
              );
            })}
          </div>

          <div className="services-tail [margin-top:var(--sp-9)] flex flex-col [align-items:flex-start] [gap:var(--sp-4)]" data-reveal="">
            <h2 className="h3">{pageCopy.dont_see_your_use[locale]}</h2>
            <p className="conclusion [padding-left:var(--sp-5)] [border-left:2px_solid_var(--cyan)] [font-size:18px] [line-height:1.7] [color:var(--ink)]">{text("D.3", "不在清单上？", locale)}</p>
            <Link
              className="button-secondary"
              href={href(locale, "/contact#form")}
            >
              {text("D.1", "主按钮", locale)}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
