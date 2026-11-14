import Link from "next/link";
import pageCopy from "@/content/v4/pages/About.json";
import engCopy from "@/content/v4/pages/Engagement.json";
import {
  copyIfApproved,
  founders,
  href,
  t,
  text,
  type Locale,
} from "@/lib/content-v4";
import { CitationPeek } from "../CitationPeek";
import { PageHero } from "../PageHero";
import { Phrase } from "../Phrase";
import { ResponsibilityMatrix } from "../ResponsibilityMatrix";

const FOUNDER_ALTS: Record<number, { zh: string; en: string }> = {
  1: {
    zh: "首席执行官插画",
    en: "Illustrated Cyano Chief Executive Officer",
  },
  2: {
    zh: "首席技术官插画",
    en: "Illustrated Cyano Chief Technology Officer",
  },
  3: {
    zh: "工程交付负责人插画",
    en: "Illustrated Cyano Head of Engineering Delivery",
  },
  4: {
    zh: "产品与解决方案负责人插画",
    en: "Illustrated Cyano Head of Product & Solutions",
  },
};

function parseTeamStats(
  raw: string,
  locale: Locale,
): Array<{ value: string; label: string }> {
  const colSep = locale === "zh" ? "：" : ": ";
  return raw.split(" · ").map((part) => {
    const idx = part.indexOf(colSep);
    if (idx < 0) return { value: part.trim(), label: "" };
    return {
      value: part.slice(0, idx).trim(),
      label: part.slice(idx + colSep.length).trim(),
    };
  });
}

export function About({ locale }: { locale: Locale }) {
  const navAbout = text("D.1", "主导航", locale).split(" · ")[4];
  const team = founders(locale);
  const stageNames = engCopy.assess_requirements[locale];

  const who1 = text("D.7", "我们是谁 1", locale);
  const who2 = text("D.7", "我们是谁 2", locale);
  const heroLede =
    locale === "zh"
      ? `${who1.split("。")[0]}。`
      : `${who1.split(". ")[0]}.`;

  const teamStats = parseTeamStats(text("D.7", "团队数字", locale), locale);
  const statExplains = [
    copyIfApproved("A-1.1", locale),
    copyIfApproved("A-1.2", locale),
    copyIfApproved("A-1.3", locale),
    null,
  ];

  const sep = locale === "zh" ? " —— " : " — ";
  const principles = ([1, 2, 3, 4] as const).map((n) => {
    const [origTitle, ...rest] = text("D.7", `原则 ${n}`, locale).split(sep);
    return {
      indexLabel: `0${n}`,
      title: copyIfApproved(`A-2.${n}`, locale) ?? origTitle.trim(),
      body: rest.join(sep).trim(),
    };
  });

  return (
    <>
      <PageHero
        locale={locale}
        crumbLabel={navAbout}
        eyebrow={pageCopy.about_cyano[locale]}
        title={text("D.7", "使命句", locale)}
        lede={heroLede}
        actions={
          <Link className="button" href={href(locale, "/contact#form")}>
            {text("D.1", "主按钮", locale)}
          </Link>
        }
        visual={
          <div className="about-hero-visual" aria-hidden="true">
            <div className="about-hero-portraits">
              {team.map((f) => (
                <div key={f.id} className="mk-panel about-hero-portrait">
                  <img
                    src={`/v3-materials/founder-${f.order}.webp`}
                    alt=""
                    width={120}
                    height={160}
                    decoding="async"
                  />
                </div>
              ))}
            </div>

            <svg
              viewBox="0 0 480 48"
              className="about-hero-connectors"
              focusable="false"
            >
              {/* Connect 4 portrait centers (60, 180, 300, 420) to 5 stage nodes (48, 144, 240, 336, 432) */}
              {team.flatMap((f, fIdx) => {
                const fx = 60 + fIdx * 120;
                return f.stages.map((st) => {
                  const sx = 48 + (st - 1) * 96;
                  return (
                    <path
                      key={`${f.id}-${st}`}
                      d={`M${fx} 2 C ${fx} 24, ${sx} 24, ${sx} 44`}
                      fill="none"
                      stroke="var(--cyan-40)"
                      strokeWidth="1.25"
                    />
                  );
                });
              })}
            </svg>

            <ol className="about-hero-stages">
              {stageNames.map((st, idx) => (
                <li key={st} className="about-stage-pill">
                  <span className="about-stage-dot" />
                  <span className="label">{`0${idx + 1}`}</span>
                </li>
              ))}
            </ol>
          </div>
        }
      />

      {/* Section 2: Who we are (7 cols) + Team numbers (5 cols) */}
      <section className="paper about-intro-section" data-header="paper">
        <div className="wrap about-intro-grid">
          <div className="about-who" data-reveal="">
            <p className="eyebrow">{pageCopy.our_background[locale]}</p>
            <h2 className="h2">
              <Phrase
                text={pageCopy.ai_research_and_enterprise[locale]}
                locale={locale}
              />
            </h2>
            <p>{who1}</p>
            <p>{who2}</p>
          </div>

          <div className="about-stats" data-reveal="">
            {teamStats.map((st, idx) => (
              <div key={st.label + idx} className="card about-stat-card">
                <div className="about-stat-head">
                  {idx === 0 ? (
                    <CitationPeek
                      id="team-6y"
                      locale={locale}
                      className="about-stat-cite"
                    >
                      <strong className="figure about-stat-val">
                        {st.value}
                      </strong>
                    </CitationPeek>
                  ) : (
                    <strong className="figure about-stat-val">
                      {st.value}
                    </strong>
                  )}
                  <span className="about-stat-lbl">{st.label}</span>
                </div>
                {statExplains[idx] ? (
                  <p className="small about-stat-exp">{statExplains[idx]}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: K-10 Responsibility Matrix + 4 Founder Cards */}
      <section className="paper-2 about-team-section" data-header="paper">
        <div className="wrap">
          <div className="about-sec-head" data-reveal="">
            <p className="eyebrow">{pageCopy.founders[locale]}</p>
            <h2 className="h2">
              <Phrase
                text={text("D.7", "创始团队标题", locale)}
                locale={locale}
              />
            </h2>
          </div>

          <ResponsibilityMatrix
            founders={team.map((f) => ({
              id: f.id,
              order: f.order,
              role: f.role,
              stages: f.stages,
            }))}
            stageNames={stageNames}
          />

          <div className="about-founders-grid">
            {team.map((f, idx) => {
              const altObj = FOUNDER_ALTS[f.order] ?? FOUNDER_ALTS[1];
              return (
                <article
                  key={f.id}
                  className="card about-founder-card"
                  data-reveal=""
                  style={{ "--i": idx } as React.CSSProperties}
                >
                  <div className="about-founder-top">
                    <img
                      src={`/v3-materials/founder-${f.order}.webp`}
                      alt={t(locale, altObj.zh, altObj.en)}
                      width={128}
                      height={128}
                      loading="lazy"
                      decoding="async"
                      className="about-founder-img"
                    />
                    <div className="about-founder-meta">
                      <span className="label">{f.id}</span>
                      <h3 className="h3">{f.role}</h3>
                      <div className="about-founder-tags">
                        {f.tags.split(" · ").map((tg) => (
                          <span key={tg} className="tag">
                            {tg}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="about-founder-motto">{f.motto}</p>
                  <p className="about-founder-bio">{f.bio}</p>

                  <div className="about-founder-stages">
                    {f.stages.map((st) => (
                      <span key={st} className="tag">
                        {stageNames[st - 1]}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: Service scope (.name-story) + Principles */}
      <section className="paper about-scope-section" data-header="paper">
        <div className="wrap">
          <div className="card name-story" data-reveal="">
            <div className="name-story-head">
              <h2 className="h2">
                {text("D.7", "名字的由来标题", locale)}
              </h2>
              <p className="name-story-lead">
                <Phrase
                  text={pageCopy.designed_around_your_sources[locale]}
                  locale={locale}
                />
              </p>
            </div>
            <div className="name-story-body">
              <p>{text("D.7", "名字的由来正文", locale)}</p>
              <p>{pageCopy.sales_inquiries_need_specifications[locale]}</p>
            </div>
          </div>

          <hr className="rule-dot about-rule" />

          <div className="about-sec-head" data-reveal="">
            <p className="eyebrow">{pageCopy.our_principles[locale]}</p>
            <h2 className="h2">
              <Phrase text={text("D.7", "原则标题", locale)} locale={locale} />
            </h2>
          </div>

          <div className="about-principles-grid">
            {principles.map((p, idx) => (
              <article
                key={p.indexLabel}
                className="card about-principle-card"
                data-reveal=""
                style={{ "--i": idx } as React.CSSProperties}
              >
                <span className="label">{p.indexLabel}</span>
                <h3 className="h3">{p.title}</h3>
                <p>{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
