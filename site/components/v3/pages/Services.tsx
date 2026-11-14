import pageCopy from "@/content/v4/pages/Services.json";
import {Picture} from "../Picture";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Locale, t, href, text, cases, solutions } from "@/lib/content-v4";
import { Button, Eyebrow } from "../ui";
import { PageHero } from "./PageHero";
import { Phrase } from "@/components/v4/Phrase";

export function Services({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={pageCopy.solutions[locale]}
        title={text("D.3", "总览 Hero 标题", locale)}
        intro={text("D.3", "总览 Hero 导语", locale)}
      >
        <Button locale={locale}>{text("D.1", "主按钮", locale)}</Button>
      </PageHero>
      <section className="section" data-header="paper">
        <div className="wrap">
          <div className="opportunity-grid">
            {[0, 1].map((i) => (
              <div key={i}>
                <span className="index-label">0{i + 1}</span>
                <h2>
                  <Phrase text={pageCopy.expand_customer_services[locale][i]} locale={locale} />
                </h2>
                <p>
                  {pageCopy.use_product_documentation_and[locale][i]}
                </p>
              </div>
            ))}
          </div>
          <div className="service-list">
            {solutions(locale).map((s, i) => {
              const linkedCase = cases(locale).find((c) => c.slug === s.caseSlug)!;
              return (
                <article className="service-detail-card" key={s.slug}>
                  <div className="service-art">
                    <Picture src={linkedCase.images[linkedCase.main]} alt={linkedCase.system}/>
                  </div>
                  <div>
                    <Eyebrow>{"0" + (i + 1) + " / " + s.name}</Eyebrow>
                    <h2><Phrase text={s.promise} locale={locale} /></h2>
                    <p>{s.intro}</p>
                    <div className="deliverable-tags">
                      {s.outputs.split(" · ").map((x) => (
                        <span key={x}>
                          <Check size={14} />
                          {x}
                        </span>
                      ))}
                    </div>
                    <Link
                      className="text-link"
                      href={href(locale, "/services/" + s.slug)}
                    >
                      {pageCopy.explore_solution[locale]}
                      <ArrowUpRight size={18} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="inline-cta">
            <h3>
              {pageCopy.dont_see_your_use[locale]}
            </h3>
            <p>{text("D.3", "不在清单上？", locale)}</p>
            <Button locale={locale}>{text("D.1", "主按钮", locale)}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
