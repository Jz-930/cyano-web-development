import pageCopy from "@/content/v4/pages/About.json";
import { Locale, t, text } from "@/lib/content-v4";
import { Eyebrow, SectionTitle, Stats, Team } from "../ui";
import {TeamDiagram} from "../TeamDiagram";
import { PageHero } from "./PageHero";
import { Phrase } from "@/components/v4/Phrase";

export function About({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={pageCopy.about_cyano[locale]}
        title={text("D.7", "使命句", locale)}
        compact
      />
      <section className="section" data-header="paper">
        <div className="wrap">
          <div className="about-intro">
            <div>
              <Eyebrow>
                {pageCopy.our_background[locale]}
              </Eyebrow>
              <h2>
                <Phrase text={pageCopy.ai_research_and_enterprise[locale]} locale={locale} />
              </h2>
              <p>{text("D.7", "我们是谁 1", locale)}</p>
              <p>{text("D.7", "我们是谁 2", locale)}</p>
            </div>
            <div className="about-illustration"><TeamDiagram locale={locale} /></div>
          </div>
          <Stats locale={locale} />
        </div>
      </section>
      <section className="section mist" data-header="paper">
        <div className="wrap">
          <SectionTitle
            eyebrow={pageCopy.founders[locale]}
            title={text("D.7", "创始团队标题", locale)}
          />
          <Team locale={locale} full />
        </div>
      </section>
      <section className="section name-story" data-header="dark">
        <div className="wrap editorial-split">
          <Eyebrow light>{text("D.7", "名字的由来标题", locale)}</Eyebrow>
          <div>
            <h2>
              <Phrase text={pageCopy.designed_around_your_sources[locale]} locale={locale} />
            </h2>
            <p>
              {pageCopy.sales_inquiries_need_specifications[locale]}
            </p>
          </div>
        </div>
      </section>
      <section className="section" data-header="paper">
        <div className="wrap">
          <SectionTitle
            eyebrow={pageCopy.our_principles[locale]}
            title={text("D.7", "原则标题", locale)}
          />
          <div className="principles-grid">
            {[1, 2, 3, 4].map((i) => {
              const parts = text("D.7", "原则 " + i, locale).split(
                locale === "zh" ? " —— " : " — ",
              );
              return (
                <div key={i}>
                  <span className="index-label">0{i}</span>
                  <h3>{parts[0]}</h3>
                  <p>{parts[1]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
