import pageCopy from "@/content/v3/pages/Services.json";
import {Picture} from "../Picture";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Locale, t, href, text, cases, solutions } from "@/lib/v1-content";
import { Button, Eyebrow, solutionIcons } from "../ui";
import { PageHero } from "./PageHero";

export function Services({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={pageCopy.c8dd6daa6a7[locale]}
        title={text("D.3", "总览 Hero 标题", locale)}
        intro={text("D.3", "总览 Hero 导语", locale)}
      >
        <Button locale={locale}>{text("D.1", "主按钮", locale)}</Button>
      </PageHero>
      <section className="section">
        <div className="container">
          <div className="opportunity-grid">
            {[0, 1].map((i) => (
              <div key={i}>
                <span className="index-label">0{i + 1}</span>
                <h2>
                  {pageCopy.cb06e9a23e9[locale][i]}
                </h2>
                <p>
                  {pageCopy.ce42639c94b[locale][i]}
                </p>
              </div>
            ))}
          </div>
          <div className="service-list">
            {solutions(locale).map((s, i) => {
              const Icon = solutionIcons[i];
              return (
                <article className="service-detail-card" key={s.slug}>
                  <div className="service-art">
                    <Picture src={cases(locale)[i].images[cases(locale)[i].main]} alt={cases(locale)[i].system}/>
                  </div>
                  <div>
                    <Eyebrow>{"0" + (i + 1) + " / " + s.name}</Eyebrow>
                    <h2>{s.promise}</h2>
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
                      {pageCopy.cd04c0a8c0b[locale]}
                      <ArrowUpRight size={18} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="inline-cta">
            <h3>
              {pageCopy.c106ef4a857[locale]}
            </h3>
            <p>{text("D.3", "不在清单上？", locale)}</p>
            <Button locale={locale}>{text("D.1", "主按钮", locale)}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
