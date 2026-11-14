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
          <div className="services-fan" aria-hidden="true">
            {FAN_SCENES.map((sc, idx) => (
              <div
                key={sc}
                className="services-fan-item"
                data-fan={idx}
                data-motion="transform"
              >
                <ScaledSceneMockup scene={sc} locale={locale} size="compact" />
              </div>
            ))}
          </div>
        }
      />

      <section className="paper-2 services-opportunities" data-header="paper">
        <div className="wrap">
          <div className="services-opp-grid">
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
                  <p className="services-opp-desc">
                    {pageCopy.use_product_documentation_and[locale][i]}
                  </p>
                  {tags.length > 0 ? (
                    <div className="services-opp-tags">
                      {tags.map((tag) => (
                        <span key={tag} className="tag">
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

      <section className="paper services-list-section" data-header="paper">
        <div className="wrap">
          <div className="services-rows">
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
                  <div className="service-row-main">
                    <div className="service-row-visual">
                      <ServiceRowMockup
                        scene={linkedCase.mockup}
                        solutionSlug={s.slug}
                        locale={locale}
                      />
                    </div>

                    <div className="service-row-copy">
                      <div className="service-row-head">
                        <span className="label">{`0${i + 1}`}</span>
                        <span className="eyebrow">{s.name}</span>
                      </div>
                      <h2 className="h2">
                        <Phrase text={s.promise} locale={locale} />
                      </h2>
                      <TimeChip before={before} after={after} />
                      <p className="service-row-intro">{s.intro}</p>
                      <ul className="service-row-outputs">
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

          <div className="services-tail" data-reveal="">
            <h2 className="h3">{pageCopy.dont_see_your_use[locale]}</h2>
            <p className="conclusion">{text("D.3", "不在清单上？", locale)}</p>
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
