import pageCopy from "@/content/v3/pages/About.json";
import { Locale, t, text } from "@/lib/v1-content";
import { Eyebrow, SectionTitle, Stats, Team } from "../ui";
import {TeamDiagram} from "../TeamDiagram";
import { PageHero } from "./PageHero";

export function About({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={pageCopy.c3a2700fd76[locale]}
        title={text("D.7", "使命句", locale)}
        compact
      />
      <section className="section">
        <div className="wrap">
          <div className="about-intro">
            <div>
              <Eyebrow>
                {pageCopy.cde7dfbce78[locale]}
              </Eyebrow>
              <h2>
                {pageCopy.c8aa02c4d5b[locale]}
              </h2>
              <p>{text("D.7", "我们是谁 1", locale)}</p>
              <p>{text("D.7", "我们是谁 2", locale)}</p>
            </div>
            <div className="about-illustration"><TeamDiagram locale={locale} /></div>
          </div>
          <Stats locale={locale} />
        </div>
      </section>
      <section className="section mist">
        <div className="wrap">
          <SectionTitle
            eyebrow={pageCopy.c6949dc8060[locale]}
            title={text("D.7", "创始团队标题", locale)}
          />
          <Team locale={locale} full />
        </div>
      </section>
      <section className="section name-story">
        <div className="wrap editorial-split">
          <Eyebrow light>{text("D.7", "名字的由来标题", locale)}</Eyebrow>
          <div>
            <h2>
              {pageCopy.ccf8724750f[locale]}
            </h2>
            <p>
              {pageCopy.c6f5481fb45[locale]}
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <SectionTitle
            eyebrow={pageCopy.c16b9b0df26[locale]}
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
