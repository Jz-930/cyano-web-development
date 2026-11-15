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
          <div className="about-hero-visual flex flex-col [gap:var(--sp-2)] w-full [max-width:500px] [margin-left:auto] [@media(max-width:1023px)]:[margin-left:0]" aria-hidden="true">
            <div className="about-hero-portraits grid [grid-template-columns:repeat(4,minmax(0,1fr))] [gap:var(--sp-3)]">
              {team.map((f) => (
                <div key={f.id} className="mk-panel about-hero-portrait [background:var(--n1)] [border:1px_solid_var(--dark-line-soft)] [padding:6px] [border-radius:var(--r-card)] overflow-hidden">
                  <img
                    src={`/v3-materials/founder-${f.order + 1}.webp`}
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
              className="about-hero-connectors w-full [height:44px]"
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

            <ol className="about-hero-stages flex flex-wrap justify-center [gap:var(--sp-2)] list-none m-0 p-0">
              {stageNames.map((st) => (
                <li key={st} className="about-stage-pill flex items-center justify-center [gap:6px] [padding:6px_8px] [border-radius:var(--r-chip)] [background:var(--n2)] [border:1px_solid_var(--dark-line)]">
                  <span className="about-stage-dot [width:6px] [height:6px] [border-radius:var(--r-chip)] [background:var(--cyan)]" />
                  <span className="label [white-space:nowrap] [color:var(--on-dark)]">{st}</span>
                </li>
              ))}
            </ol>
          </div>
        }
      />

      {/* Section 2: Who we are (7 cols) + Team numbers (5 cols) */}
      <section className="paper about-intro-section [padding-block:var(--section-y)]" data-header="paper">
        <div className="wrap about-intro-grid grid [grid-template-columns:minmax(0,7fr)_minmax(0,5fr)] [@media(max-width:1023px)]:[grid-template-columns:minmax(0,1fr)] [gap:var(--sp-8)] [align-items:start]">
          <div className="about-who flex flex-col [gap:var(--sp-4)]" data-reveal="">
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

          <div className="about-stats flex flex-col [gap:var(--sp-3)]" data-reveal="">
            {teamStats.map((st, idx) => (
              <div key={st.label + idx} className="card about-stat-card">
                <div className="about-stat-head flex items-baseline [gap:var(--sp-3)]">
                  {idx === 0 ? (
                    <CitationPeek
                      id="team-6y"
                      locale={locale}
                      className="about-stat-cite"
                    >
                      <strong className="figure about-stat-val [font-size:32px] [line-height:1.05] [font-weight:500] [font-variant-numeric:tabular-nums]">
                        {st.value}
                      </strong>
                    </CitationPeek>
                  ) : (
                    <strong className="figure about-stat-val [font-size:32px] [line-height:1.05] [font-weight:500] [font-variant-numeric:tabular-nums]">
                      {st.value}
                    </strong>
                  )}
                  <span className="about-stat-lbl [font-size:14px] [font-weight:500] [color:var(--ink)]">{st.label}</span>
                </div>
                {statExplains[idx] ? (
                  <p className="small about-stat-exp m-0 [color:var(--muted)]">{statExplains[idx]}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: K-10 Responsibility Matrix + 4 Founder Cards */}
      <section className="paper-2 about-team-section [padding-block:var(--section-y)]" data-header="paper">
        <div className="wrap">
          <div className="about-sec-head flex flex-col [gap:var(--sp-2)] [margin-bottom:var(--stack-heading)]" data-reveal="">
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

          <div className="about-founders-grid grid [grid-template-columns:repeat(2,minmax(0,1fr))] [@media(max-width:1023px)]:[grid-template-columns:minmax(0,1fr)] [gap:var(--sp-6)]">
            {team.map((f, idx) => {
              const altObj = FOUNDER_ALTS[f.order + 1] ?? FOUNDER_ALTS[1];
              return (
                <article
                  key={f.id}
                  className="card about-founder-card"
                  data-reveal=""
                  style={{ "--i": idx } as React.CSSProperties}
                >
                  <div className="about-founder-top flex items-center [@media(max-width:600px)]:[align-items:flex-start] [gap:var(--sp-5)] [@media(max-width:600px)]:flex-col">
                    <img
                      src={`/v3-materials/founder-${f.order + 1}.webp`}
                      alt={t(locale, altObj.zh, altObj.en)}
                      width={128}
                      height={128}
                      loading="lazy"
                      decoding="async"
                      className="about-founder-img [width:128px] [max-width:160px] [height:128px] [max-height:160px] [border-radius:var(--r-card)] [object-fit:cover] [background:var(--p3)] shrink-0"
                    />
                    <div className="about-founder-meta flex flex-col [gap:var(--sp-2)]">
                      
                      <h3 className="h3">{f.role}</h3>
                      <div className="about-founder-tags flex flex-wrap [gap:var(--sp-2)]">
                        {f.tags.split(" · ").map((tg) => (
                          <span key={tg} className="tag inline-flex [border-radius:var(--r-chip)] [padding:4px_10px]">
                            {tg}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="about-founder-motto m-0 [font-size:16px] [font-weight:500] [color:var(--ink)]">{f.motto}</p>
                  <p className="about-founder-bio m-0 [font-size:15px] [color:var(--muted)]">{f.bio}</p>

                  <div className="about-founder-stages flex flex-wrap [gap:var(--sp-2)] [margin-top:auto] [padding-top:var(--sp-3)] [border-top:1px_solid_var(--line-soft)]">
                    {f.stages.map((st) => (
                      <span key={st} className="tag inline-flex [border-radius:var(--r-chip)] [padding:4px_10px]">
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
      <section className="paper about-scope-section [padding-block:var(--section-y)]" data-header="paper">
        <div className="wrap">
          <div className="card name-story" data-reveal="">
            <div className="name-story-head flex flex-col [gap:var(--sp-3)]">
              <h2 className="h2">
                {text("D.7", "名字的由来标题", locale)}
              </h2>
              <p className="name-story-lead m-0 [font-size:20px] [font-weight:500] [line-height:1.4] [color:var(--ink)]">
                <Phrase
                  text={pageCopy.designed_around_your_sources[locale]}
                  locale={locale}
                />
              </p>
            </div>
            <div className="name-story-body flex flex-col [gap:var(--sp-4)]">
              <p>{text("D.7", "名字的由来正文", locale)}</p>
              <p>{pageCopy.sales_inquiries_need_specifications[locale]}</p>
            </div>
          </div>

          <hr className="rule-dot about-rule relative [height:1px] [border:0] [background:var(--line-soft)] overflow-visible [margin-block:var(--sp-9)]" />

          <div className="about-sec-head flex flex-col [gap:var(--sp-2)] [margin-bottom:var(--stack-heading)]" data-reveal="">
            <p className="eyebrow">{pageCopy.our_principles[locale]}</p>
            <h2 className="h2">
              <Phrase text={text("D.7", "原则标题", locale)} locale={locale} />
            </h2>
          </div>

          <div className="about-principles-grid grid [grid-template-columns:repeat(2,minmax(0,1fr))] [@media(max-width:1023px)]:[grid-template-columns:minmax(0,1fr)] [gap:var(--sp-6)]">
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
