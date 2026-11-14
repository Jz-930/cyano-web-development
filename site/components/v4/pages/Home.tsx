import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Boxes,
  BookOpen,
  Factory,
  PenTool,
} from "lucide-react";
import pageCopy from "@/content/v4/pages/Home.json";
import {
  cases,
  copyIfApproved,
  founders,
  href,
  insights,
  t,
  text,
  type Locale,
} from "@/lib/content-v4";
import { LightField } from "@/components/v4/LightField";
import { Phrase } from "@/components/v4/Phrase";
import { ProvenanceStage } from "@/components/v4/ProvenanceStage";
import { CitationPeek } from "@/components/v4/CitationPeek";
import { ConcernPanel, type ConcernItem } from "@/components/v4/ConcernPanel";
import { SolutionExplorer } from "@/components/v4/SolutionExplorer";
import { CaseCoverCard } from "@/components/v4/CaseCoverCard";
import { EngagementCards } from "@/components/v4/EngagementCards";
import { EngagementGantt } from "@/components/v4/EngagementGantt";
import { ProvenanceLines } from "@/components/v4/ProvenanceLines";
import { InsightCover } from "@/components/v4/InsightCover";
import { renderBold, renderNotEqual } from "@/components/v4/inlineFormat";
import { Picture } from "@/components/v4/Picture";

const INDUSTRY_ICONS = [
  Factory,
  BriefcaseBusiness,
  Building2,
  Boxes,
  BookOpen,
  PenTool,
] as const;

function stripArrow(s: string): string {
  return s.replace(/\s*[→↗]\s*$/, "");
}

type TrustStat = {
  num: string;
  unit: string;
  desc: string;
  meaning: string | null;
};

function buildTrustStats(locale: Locale): TrustStat[] {
  const sep = locale === "zh" ? " —— " : " — ";
  return ([1, 2, 3, 4] as const).map((n) => {
    const raw = text("D.2", `信任条数字 ${n}`, locale);
    const [left = "", ...rest] = raw.split(sep);
    const desc = rest.join(sep).trim();
    const m = left.trim().match(/^([0-9+%]+)\s*(.*)$/);
    const num = m ? m[1] : left.trim();
    const unit = m ? m[2].trim() : "";
    return {
      num,
      unit,
      desc,
      meaning: copyIfApproved(`H-6.${n}`, locale),
    };
  });
}

function splitAdoptionStep(s: string): { head: string; rest: string } {
  const m = s.match(/^\*\*(.+?)\*\*([\s\S]*)$/);
  if (!m) return { head: "", rest: s };
  return {
    head: m[1].trim(),
    rest: m[2].replace(/^\s*(?:—|:|：)\s*/, "").trim(),
  };
}

function EvidenceStrip({
  locale,
  trustStats,
}: {
  locale: Locale;
  trustStats: TrustStat[];
}) {
  const h1Items = (
    [
      { id: "H-1a", cite: "case-proposal-15min" },
      { id: "H-1b", cite: "case-wiki-80" },
      { id: "H-1c", cite: null },
      { id: "H-1d", cite: null },
    ] as const
  )
    .map((entry) => ({
      ...entry,
      val: copyIfApproved(entry.id, locale),
    }))
    .filter((entry): entry is typeof entry & { val: string } =>
      Boolean(entry.val),
    );

  if (h1Items.length === 0) {
    return (
      <div className="evidence-strip wrap">
        <ul style={{ "--cols": 4 } as CSSProperties}>
          {trustStats.map((st, idx) => (
            <li key={idx}>
              {idx === 0 ? (
                <CitationPeek id="team-6y" locale={locale}>
                  <strong>{st.num}</strong>
                  {st.unit ? ` ${st.unit}` : ""}
                </CitationPeek>
              ) : (
                <>
                  <strong>{st.num}</strong>
                  {st.unit ? ` ${st.unit}` : ""}
                </>
              )}{" "}
              <span>{st.desc}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="evidence-strip wrap">
      <ul style={{ "--cols": h1Items.length } as CSSProperties}>
        {h1Items.map((item) => (
          <li key={item.id}>
            {item.cite ? (
              <CitationPeek id={item.cite} locale={locale}>
                {renderBold(item.val)}
              </CitationPeek>
            ) : (
              renderBold(item.val)
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AdoptionPath({ steps }: { steps: string[] }) {
  return (
    <div className="adoption-path" data-reveal="">
      {steps.map((raw, idx) => {
        const { head, rest } = splitAdoptionStep(raw);
        return (
          <div key={idx} className="adoption-step-group">
            <div className="adoption-step">
              {head ? <strong className="figure">{head}</strong> : null}
              <p>{rest}</p>
            </div>
            {idx < steps.length - 1 ? (
              <div className="adoption-connector" aria-hidden="true">
                <ProvenanceLines
                  viewBox="0 0 88 24"
                  paths={["M2 12 L 80 12"]}
                  surface="paper"
                  state="rest"
                />
                <span className="adoption-arrow" />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function Home({ locale }: { locale: Locale }) {
  const allCaseItems = cases(locale);
  const caseBySlug = new Map(allCaseItems.map((c) => [c.slug, c]));
  const featuredCases = [
    caseBySlug.get("proposal-generation") ?? allCaseItems[1],
    caseBySlug.get("it-knowledge-assistant") ?? allCaseItems[2],
    caseBySlug.get("sales-consultant-ai") ?? allCaseItems[0],
  ];

  const heroButtons = text("D.2", "按钮", locale).split(" · ");
  const secondaryCta =
    heroButtons[1]?.trim() ?? pageCopy.see_our_work[locale];
  const heroSubtitle = text("D.2", "副标题", locale);
  const heroSubSplitIdx =
    locale === "zh"
      ? heroSubtitle.indexOf("。")
      : heroSubtitle.indexOf(". ");
  const heroSubParts =
    heroSubSplitIdx > 0
      ? locale === "zh"
        ? [
            heroSubtitle.slice(0, heroSubSplitIdx + 1),
            heroSubtitle.slice(heroSubSplitIdx + 1).trim(),
          ]
        : [
            heroSubtitle.slice(0, heroSubSplitIdx + 1),
            heroSubtitle.slice(heroSubSplitIdx + 2).trim(),
          ]
      : [heroSubtitle];
  const stageNote = copyIfApproved("H-1n", locale);

  const trustStats = buildTrustStats(locale);
  const anyH1Approved = (["H-1a", "H-1b", "H-1c", "H-1d"] as const).some((k) =>
    Boolean(copyIfApproved(k, locale)),
  );

  // Section 2: Concerns (K-02 + S11)
  const concernTitle =
    copyIfApproved("H-2t", locale) ?? text("D.2", "痛点区标题", locale);
  const concernSub = copyIfApproved("H-2s", locale);
  const concernConclusion = copyIfApproved("H-2c", locale);
  const concernItems: ConcernItem[] = ([1, 2, 3, 4] as const).map((i) => {
    const [before = "", answer = ""] = text("D.2", `痛点 ${i}`, locale).split(
      "→",
    );
    const sep = locale === "zh" ? " —— " : " — ";
    const [title = "", ...body] = before.split(sep);
    return {
      title: title.trim(),
      shortLabel: copyIfApproved(`H-2k${i}`, locale),
      issue: body.join(sep).trim(),
      answer: answer.trim(),
    };
  });
  const concernGates = ([1, 2, 3, 4] as const).map((i) => {
    const sep = locale === "zh" ? " —— " : " — ";
    return text("D.6", `第 ${i} 层`, locale).split(sep)[0].trim();
  });

  // Section 3: Compare table (H-4)
  const h4e = copyIfApproved("H-4e", locale);
  const h4t = copyIfApproved("H-4t", locale);
  const h4r0 = copyIfApproved("H-4r0", locale);
  const h4c1 = copyIfApproved("H-4c1", locale);
  const h4c2 = copyIfApproved("H-4c2", locale);
  const h4c3 = copyIfApproved("H-4c3", locale);
  const h4n1 = copyIfApproved("H-4n1", locale);
  const h4n2 = copyIfApproved("H-4n2", locale);
  const h4n3 = copyIfApproved("H-4n3", locale);
  const h4z = copyIfApproved("H-4z", locale);
  const showCompare = Boolean(
    h4e && h4t && h4r0 && h4c1 && h4c2 && h4c3 && h4n1 && h4n2 && h4n3 && h4z,
  );
  const compareRows = ([1, 2, 3, 4, 5, 6, 7] as const)
    .map((r) => {
      const head = copyIfApproved(`H-4r${r}`, locale);
      const c1 = copyIfApproved(`H-4r${r}c1`, locale);
      const c2 = copyIfApproved(`H-4r${r}c2`, locale);
      const c3 = copyIfApproved(`H-4r${r}c3`, locale);
      return head && c1 && c2 && c3 ? { id: r, head, c1, c2, c3 } : null;
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  // Section 5: Industries in D.2/行业名 order
  const industryLabels = text("D.2", "行业名", locale).split(" · ");

  // Section 6: Adoption path (E-2)
  const e2Steps = (["E-2.1", "E-2.2", "E-2.3"] as const).map((k) =>
    copyIfApproved(k, locale),
  );
  const pathApproved = e2Steps.every((s): s is string => Boolean(s));

  // Section 7: Team
  const teamMembers = founders(locale);

  // Section 8: Buyer FAQ (H-7)
  const h7t = copyIfApproved("H-7t", locale);
  const h7q1 = copyIfApproved("H-7q1", locale);
  const h7q2 = copyIfApproved("H-7q2", locale);
  const h7q3 = copyIfApproved("H-7q3", locale);
  const h7l = copyIfApproved("H-7l", locale);
  const showFaq = Boolean(h7t && h7q1 && h7q2 && h7q3 && h7l);
  const faqItems = showFaq
    ? [
        {
          q: h7q1!,
          a: text(
            "D.4",
            "数据安全如何保障？ / How is our data protected?",
            locale,
          ),
        },
        {
          q: h7q2!,
          a: text(
            "D.4",
            "如果效果不达预期怎么办？ / What if results fall short?",
            locale,
          ),
        },
        {
          q: h7q3!,
          a: text(
            "D.4",
            "应该完整定制，还是从试点开始？ / Full build or pilot first?",
            locale,
          ),
        },
      ]
    : [];

  // Section 9: Insights
  const articleItems = insights(locale);

  return (
    <>
      {/* 1. 首屏 + 证据条 + 三层舞台（K-01, S1） */}
      <section className="home-hero dark" data-header="dark">
        <LightField
          preset="hero"
          focusSelector=".mk-core"
          textEdgeSelector=".hero-copy"
          intro
        />
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow on-dark">
              {copyIfApproved("H-0", locale) ?? text("D.2", "Eyebrow", locale)}
            </p>
            <h1 className="h1-home">
              {locale === "zh" ? (
                <>
                  <span className="phrase">为企业开发</span>
                  <span className="phrase">日常工作</span>
                  <br />
                  <span className="phrase">
                    用得上的 <span className="h1-accent">AI</span>
                    <span className="headline-period">。</span>
                  </span>
                </>
              ) : (
                <>
                  Custom AI
                  <br />
                  for your
                  <br />
                  <span className="h1-accent">everyday work.</span>
                </>
              )}
            </h1>
            <p className="lede">
              {heroSubParts.map((part, i) => (
                <span key={i} className="lede-sent">
                  {i > 0 && locale === "en" ? ` ${part}` : part}
                </span>
              ))}
            </p>
            <div className="hero-actions">
              <Link className="button" href={href(locale, "/contact#form")}>
                {text("D.1", "主按钮", locale)}
                <ArrowUpRight size={18} />
              </Link>
              <Link
                className="button-secondary"
                href={href(locale, "/cases")}
              >
                {secondaryCta}
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>

          <div className="hero-stage-col">
            <div className="hero-stage-stack">
              <ProvenanceStage locale={locale} />
              {stageNote ? (
                <p className="stage-note label">{stageNote}</p>
              ) : null}
            </div>
          </div>
        </div>

        <EvidenceStrip locale={locale} trustStats={trustStats} />
      </section>

      {/* 2. 顾虑四问（K-02, S11） */}
      <section
        className="home-concerns section halo-paper-leak"
        data-header="paper"
      >
        <div className="wrap">
          <header className="section-head" data-reveal="">
            <p className="eyebrow">{pageCopy.implementation[locale]}</p>
            <h2 className="h2">
              <Phrase text={concernTitle} locale={locale} />
            </h2>
            {concernSub ? <p className="lede">{concernSub}</p> : null}
          </header>
          <ConcernPanel
            locale={locale}
            items={concernItems}
            gates={concernGates}
            conclusion={concernConclusion}
            techLinkLabel={stripArrow(text("D.2", "痛点区链接", locale))}
          />
        </div>
      </section>

      {/* 3. 几种做法怎么选（H-4） */}
      {showCompare && compareRows.length > 0 ? (
        <section className="home-compare mist" data-header="paper">
          <hr className="rule-dot" />
          <div className="wrap section">
            <header className="section-head" data-reveal="">
              <p className="eyebrow">{h4e}</p>
              <h2 className="h2">
                <Phrase text={h4t!} locale={locale} />
              </h2>
            </header>
            <div className="compare-table-wrap" data-reveal="">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th scope="col">
                      <span className="sr-only">{h4r0}</span>
                    </th>
                    <th scope="col">{h4c1}</th>
                    <th scope="col">{h4c2}</th>
                    <th scope="col" className="is-us">
                      {h4c3}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row) => (
                    <tr key={row.id}>
                      <th scope="row">{row.head}</th>
                      <td>{row.c1}</td>
                      <td>{row.c2}</td>
                      <td className="is-us">{row.c3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="neq-list" data-reveal="">
              {[h4n1!, h4n2!, h4n3!].map((stmt, idx) => (
                <li key={idx}>{renderNotEqual(stmt)}</li>
              ))}
            </ul>
            <p className="conclusion" data-reveal="">
              {h4z}
            </p>
          </div>
        </section>
      ) : null}

      {/* 4. 四类场景（K-03, S6） */}
      <section className="home-solutions section" data-header="paper">
        <div className="wrap">
          <header className="section-head" data-reveal="">
            <p className="eyebrow">{pageCopy.what_we_do[locale]}</p>
            <h2 className="h2">
              <Phrase text={text("D.2", "解决方案区标题", locale)} locale={locale} />
            </h2>
            <Link className="text-link" href={href(locale, "/services")}>
              {pageCopy.all_solutions[locale]}
              <ArrowUpRight size={16} />
            </Link>
          </header>
          <SolutionExplorer locale={locale} />
        </div>
      </section>

      {/* 5. 已交付的客户项目（K-06）+ 行业条 */}
      <section className="home-cases section mist" data-header="paper">
        <div className="wrap">
          <header className="section-head" data-reveal="">
            <p className="eyebrow">{pageCopy.selected_work[locale]}</p>
            <h2 className="h2">
              <Phrase text={text("D.2", "精选案例标题", locale)} locale={locale} />
            </h2>
            <p className="lede">{text("D.2", "精选案例导语", locale)}</p>
            <Link className="text-link" href={href(locale, "/cases")}>
              {pageCopy.view_all_case_studies[locale]}
              <ArrowUpRight size={16} />
            </Link>
          </header>

          <div className="home-case-grid">
            {featuredCases.map((c, i) => (
              <CaseCoverCard
                key={c.slug}
                item={c}
                locale={locale}
                featured={i === 0}
                index={i}
              />
            ))}
          </div>

          <div className="industry-strip" data-reveal="">
            <span className="label">{pageCopy.industries_we_serve[locale]}</span>
            {industryLabels.map((label, idx) => {
              const Icon = INDUSTRY_ICONS[idx] ?? Factory;
              return (
                <span key={label} className="industry-item">
                  <Icon size={18} strokeWidth={1.4} aria-hidden="true" />
                  <span>{label}</span>
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. 合作方式与落地路径（K-11） */}
      <section className="home-engagement section" data-header="paper">
        <div className="wrap">
          <header className="section-head" data-reveal="">
            <p className="eyebrow">{pageCopy.engagement_options[locale]}</p>
            <h2 className="h2">
              <Phrase text={text("D.2", "合作区标题", locale)} locale={locale} />
            </h2>
            <Link className="text-link" href={href(locale, "/engagement")}>
              {stripArrow(text("D.2", "合作区链接", locale))}
              <ArrowUpRight size={16} />
            </Link>
          </header>

          <EngagementCards locale={locale} />
          {pathApproved ? <AdoptionPath steps={e2Steps as string[]} /> : null}
          <EngagementGantt locale={locale} compact />
        </div>
      </section>

      {/* 7. 团队（宣言 + 数字 + 四张小卡） */}
      <section className="home-team section mist" data-header="paper">
        <div className="wrap">
          <div
            className={`home-team-top${anyH1Approved ? "" : " is-full"}`}
            data-reveal=""
          >
            <div className="home-manifesto">
              <p className="eyebrow">{pageCopy.who_we_are[locale]}</p>
              <h2 className="h2">
                <Phrase
                  text={
                    locale === "zh"
                      ? "熟悉模型研发，\n也做过企业系统。"
                      : text("D.2", "宣言句", locale)
                  }
                  locale={locale}
                />
              </h2>
              <p className="home-manifesto-p">
                {text("D.2", "宣言段 1", locale)}
              </p>
              <p className="home-manifesto-p">
                {text("D.2", "宣言段 2", locale)}
              </p>
              <Link className="text-link" href={href(locale, "/about")}>
                {pageCopy.meet_cyano[locale]}
                <ArrowUpRight size={16} />
              </Link>
            </div>

            {anyH1Approved ? (
              <div className="home-trust-grid">
                {trustStats.map((st, idx) => (
                  <div key={idx} className="home-trust-item">
                    <div className="home-trust-val">
                      {idx === 0 ? (
                        <CitationPeek id="team-6y" locale={locale}>
                          <strong className="figure">{st.num}</strong>
                        </CitationPeek>
                      ) : (
                        <strong className="figure">{st.num}</strong>
                      )}
                      {st.unit ? (
                        <span className="stat-unit">{st.unit}</span>
                      ) : null}
                    </div>
                    <p className="home-trust-desc">{st.desc}</p>
                    {st.meaning ? (
                      <p className="small home-trust-meaning">{st.meaning}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <hr className="rule-dot home-team-rule" />

          <header className="section-head home-founders-head" data-reveal="">
            <p className="eyebrow">{pageCopy.our_team[locale]}</p>
            <h2 className="h2">{text("D.2", "团队区标题", locale)}</h2>
            <p className="lede">{text("D.2", "团队区导语", locale)}</p>
            <Link className="text-link" href={href(locale, "/about")}>
              {stripArrow(text("D.2", "团队区链接", locale))}
              <ArrowUpRight size={16} />
            </Link>
          </header>

          <div className="home-founder-grid">
            {teamMembers.map((f, i) => (
              <article
                key={f.id}
                className="card home-founder-card"
                data-reveal=""
                style={{ "--i": i } as CSSProperties}
              >
                <div className="home-founder-avatar">
                  <Picture
                    src={`/v3-materials/founder-${i + 1}.webp`}
                    alt={t(
                      locale,
                      `Cyano ${f.role}插画形象`,
                      `Illustrated Cyano ${f.role}`,
                    )}
                    sizes="64px"
                    thumbnail
                  />
                </div>
                <div className="home-founder-info">
                  <h3 className="home-founder-role">{f.role}</h3>
                  <p className="home-founder-tags">{f.tags}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8. 买方会问的三个问题（H-7） */}
      {showFaq ? (
        <section className="home-faq section" data-header="paper">
          <div className="wrap">
            <header className="section-head" data-reveal="">
              <h2 className="h2">{h7t}</h2>
            </header>
            <div className="faq" data-reveal="">
              {faqItems.map((item) => (
                <details key={item.q} className="faq-item">
                  <summary>
                    <span>{item.q}</span>
                    <span className="faq-icon" aria-hidden="true" />
                  </summary>
                  <div className="faq-a">
                    <p>{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
            <div className="home-faq-foot" data-reveal="">
              <Link className="text-link" href={href(locale, "/engagement#faq")}>
                {h7l}
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* 9. 洞察（K-12 封面） */}
      <section className="home-insights section mist" data-header="paper">
        <div className="wrap">
          <header className="section-head" data-reveal="">
            <p className="eyebrow">{pageCopy.perspectives[locale]}</p>
            <h2 className="h2">
              <Phrase
                text={pageCopy.project_notes_and_implementation[locale]}
                locale={locale}
              />
            </h2>
            <Link className="text-link" href={href(locale, "/insights")}>
              {pageCopy.all_insights[locale]}
              <ArrowUpRight size={16} />
            </Link>
          </header>

          <div className="home-insight-grid">
            {articleItems.map((a, i) => (
              <article
                key={a.slug}
                className="card is-clickable home-insight-card"
                data-reveal=""
                style={{ "--i": i } as CSSProperties}
              >
                <div className="home-insight-cover-wrap" data-motion="transform">
                  <InsightCover slug={a.slug} locale={locale} size="card" />
                </div>
                <div className="home-insight-body">
                  <span className="tag">{a.category}</span>
                  <h3 className="h3">
                    <Link
                      className="card-link"
                      href={href(locale, `/insights/${a.slug}`)}
                    >
                      {a.title}
                    </Link>
                  </h3>
                  <span className="label">{a.date}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
