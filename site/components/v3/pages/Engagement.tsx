import pageCopy from "@/content/v3/pages/Engagement.json";
import { Network } from "lucide-react";
import { Locale, t, text, founders } from "@/lib/v1-content";
import { Eyebrow, SectionTitle } from "../ui";
import {FAQ} from "../islands/FAQ";
import copy from "@/content/v1/copy.json";
import { PageHero } from "./PageHero";
import { EngagementCards } from "./EngagementCards";

export function Engagement({ locale }: { locale: Locale }) {
  const faq = Object.entries(copy["D.4"])
    .filter(([k]) => k.includes("?") || k.includes("？"))
    .map(([q, a]) => ({
      q: q.split(" / ")[locale === "zh" ? 0 : 1],
      a: a[locale],
    }));
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={pageCopy.c07e2733746[locale]}
        title={text("D.4", "Hero 标题", locale)}
        intro={text("D.4", "Hero 导语", locale)}
      />
      <section className="section">
        <div className="container">
          <EngagementCards locale={locale} />
          <p className="decision-note">{text("D.4", "怎么选", locale)}</p>
          <div className="comparison-wrap" role="region" aria-label={t(locale,"合作方式比较","Engagement comparison")} tabIndex={0}>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>{pageCopy.c94eb35ef5a[locale]}</th>
                  {[0, 1, 2].map((i) => (
                    <th key={i}>
                      {pageCopy.c8073196267[locale][i]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2].map((i) => (
                  <tr key={i}>
                    <th>
                      {pageCopy.cd417d93d37[locale][i]}
                    </th>
                    {[0, 1, 2].map((j) => (
                      <td key={j}>
                        {t(
                          locale,
                          [
                            [
                              "完整业务系统，归你所有",
                              "关键场景可用版本，按需扩展",
                              "按批次交付经过人工审核的结果",
                            ],
                            [
                              "包含基础维护，可持续迭代",
                              "包含在持续服务中",
                              "Cyano 负责运行与交付",
                            ],
                            [
                              "需要自有系统的团队",
                              "需要先测试效果的团队",
                              "希望委托处理任务的团队",
                            ],
                          ][i][j],
                          [
                            [
                              "A complete system you own",
                              "A working version, expanded as needed",
                              "Batch outputs reviewed by people",
                            ],
                            [
                              "Maintenance with ongoing iteration",
                              "Included in the service",
                              "Fully run by Cyano",
                            ],
                            [
                              "Teams that need their own system",
                              "Teams validating a use case",
                              "Teams needing additional capacity",
                            ],
                          ][i][j],
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="section mist" id="diagnosis">
        <div className="container">
          <SectionTitle
            eyebrow={pageCopy.c38832f88ff[locale]}
            title={pageCopy.c5abfe6869e[locale]}
          />
          <div className="process-list">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i}>
                <span>0{i + 1}</span>
                <h3>
                  {pageCopy.c819c53584b[locale][i]}
                </h3>
                <p>
                  {pageCopy.c43bbf22736[locale][i]}
                </p>
                <span className="process-owner">
                  {founders(locale)[[3, 0, 3, 1, 2][i]].role}
                </span>
              </div>
            ))}
          </div>
          <div className="deployment-grid">
            {["SaaS 托管", "私有化部署"].map((d, i) => (
              <article key={d}>
                <Network size={30} strokeWidth={1} />
                <h3>
                  {t(
                    locale,
                    d,
                    i === 0 ? "SaaS hosting" : "Private deployment",
                  )}
                </h3>
                <p>{text("D.4", d, locale)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container faq-layout">
          <div>
            <Eyebrow>{pageCopy.ce7958d33de[locale]}</Eyebrow>
            <h2>{pageCopy.c6c5c0c27ab[locale]}</h2>
          </div>
          <FAQ items={faq} />
        </div>
      </section>
    </>
  );
}
