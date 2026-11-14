import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { PageShell } from "@/components/v3/PageShell";
import {
  allInsights,
  cases,
  copyIfApproved,
  href,
  solutions,
  text,
} from "@/lib/content-v4";
import type { SceneId } from "@/lib/mockups";
import { mkCallouts } from "@/lib/mockups-extra";
import { LightField } from "./LightField";
import { Phrase } from "./Phrase";
import { ProvenanceStage } from "./ProvenanceStage";
import { ScaledSceneMockup } from "./scenes";
import { Callout } from "./Callout";
import { MetricBadge } from "./MetricBadge";
import { TimeChip } from "./TimeChip";
import { InsightCover } from "./InsightCover";
import { CitationPeek } from "./CitationPeek";

const ALL_SCENES: SceneId[] = [
  "proposal",
  "wiki",
  "sales",
  "data",
  "property",
  "writing",
];

export function V4StudyView() {
  const locale = "zh" as const;
  const allCasesList = cases(locale);
  const proposalCase = allCasesList.find((c) => c.slug === "proposal-generation")!;
  const docCallouts = mkCallouts("document-automation", locale);
  const sols = solutions(locale);

  return (
    <PageShell locale={locale} route="v4-study" closing={false}>
      {/* 1. Hero stage (LightField hero + ProvenanceStage S1 + CitationPeek S10) */}
      <section
        className="home-hero dark grain isolate [height:auto] [min-height:min(860px,100svh)] [@media(max-width:800px)]:min-h-0 [padding:104px_0_0] [@media(max-width:800px)]:[padding-top:104px] flex flex-col [gap:0]"
        data-header="dark"
        style={{
          position: "relative",
          paddingBlock: "132px var(--sp-8)",
          overflow: "hidden",
        }}
      >
        <LightField
          preset="hero"
          focusSelector=".mk-core"
          textEdgeSelector=".hero-copy"
          intro
        />
        <div
          style={{
            position: "relative",
            zIndex: "var(--z-content)",
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--sp-6)",
            alignItems: "center",
          }}
        >
          <div
            className="hero-copy relative [z-index:var(--z-stage)] [padding-right:var(--sp-6)] [@media(max-width:1023px)]:[padding-right:0]"
            style={{
              position: "relative",
              zIndex: "var(--z-stage)",
              flex: "1 1 360px",
              maxWidth: "480px",
              display: "grid",
              gap: "var(--sp-4)",
            }}
          >
            <p className="eyebrow on-dark">
              {copyIfApproved("H-0", locale) ?? text("D.2", "Eyebrow", locale)}
            </p>
            <h1 className="h1-home">
              <Phrase text={text("D.2", "主标题", locale)} locale={locale} />
            </h1>
            <p className="lede">{text("D.2", "副标题", locale)}</p>
            <div
              className="hero-buttons"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--sp-3)",
                marginTop: "var(--sp-2)",
              }}
            >
              <Link className="button" href={href(locale, "/contact")}>
                {text("D.1", "主按钮", locale)}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link className="button-secondary" href={href(locale, "/cases")}>
                {text("D.2", "按钮", locale).split(" · ")[1]}
              </Link>
            </div>
            {copyIfApproved("H-1n", locale) ? (
              <p className="small">{copyIfApproved("H-1n", locale)}</p>
            ) : null}
          </div>

          <div style={{ flex: "1 1 520px", minWidth: 0 }}>
            <ProvenanceStage locale={locale} />
          </div>
        </div>

        {/* Evidence strip with S10 CitationPeek */}
        <div
          style={{
            position: "relative",
            zIndex: "var(--z-stage)",
            marginTop: "var(--sp-7)",
            paddingTop: "var(--sp-5)",
            borderTop: "1px solid var(--dark-line-soft)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--sp-4)",
          }}
        >
          <div>
            <CitationPeek id="case-proposal-15min" locale={locale}>
              <strong>{proposalCase.stats[0].value}</strong>
            </CitationPeek>{" "}
            <span className="small">{proposalCase.stats[0].label}</span>
          </div>
          <div>
            <CitationPeek id="case-proposal-99" locale={locale}>
              <strong>{proposalCase.stats[1].value}</strong>
            </CitationPeek>{" "}
            <span className="small">{proposalCase.stats[1].label}</span>
          </div>
          <div>
            <CitationPeek id="case-wiki-80" locale={locale}>
              <strong>80%</strong>
            </CitationPeek>{" "}
            <span className="small">
              {allCasesList.find((c) => c.slug === "it-knowledge-assistant")!.stats[0].label}
            </span>
          </div>
          <div>
            <CitationPeek id="core-200ms" locale={locale}>
              <strong>{"< 200ms"}</strong>
            </CitationPeek>{" "}
            <span className="small">{text("D.1", "技术页脚注", locale)}</span>
          </div>
        </div>
      </section>

      {/* 2. Six UI Mockup Scenes (full + Callout + compact K-06 preview) */}
      <section className="section dot-grid" data-header="paper">
        <div className="wrap" style={{ display: "grid", gap: "var(--sp-6)" }}>
          <div style={{ display: "grid", gap: "var(--sp-2)" }}>
            <p className="eyebrow">{text("D.2", "解决方案区标题", locale)}</p>
            <h2 className="h2">{text("D.2", "精选案例标题", locale)}</h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 440px), 1fr))",
              gap: "var(--sp-5)",
            }}
          >
            {ALL_SCENES.map((sceneId) => (
              <div
                key={sceneId}
                className="card"
                style={{ padding: "var(--sp-4)", display: "grid", gap: "var(--sp-3)" }}
              >
                <ScaledSceneMockup scene={sceneId} locale={locale} size="full">
                  {sceneId === "proposal"
                    ? docCallouts.map((c) => (
                        <Callout
                          key={c.n}
                          n={c.n}
                          x={c.x}
                          y={c.y}
                          label={c.label}
                          showLabel
                        />
                      ))
                    : null}
                </ScaledSceneMockup>
              </div>
            ))}
          </div>

          {/* K-06 Compact dark mockup case card preview */}
          <article
            className="card is-clickable"
            style={{ maxWidth: "420px", overflow: "hidden", padding: 0 }}
          >
            <div
              className="case-cover-top"
              data-surface="dark"
              style={{
                background: "var(--n1)",
                padding: "var(--sp-4) var(--sp-4) 0",
              }}
            >
              <ScaledSceneMockup
                scene="proposal"
                locale={locale}
                size="compact"
              />
            </div>
            <div style={{ padding: "var(--sp-5)", display: "grid", gap: "var(--sp-3)" }}>
              <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                <span className="tag inline-flex [border-radius:var(--r-chip)] [padding:4px_10px]">{proposalCase.industry}</span>
                <TimeChip
                  before={copyIfApproved("H-3b02", locale)}
                  after={copyIfApproved("H-3a02", locale)}
                />
              </div>
              <h3 className="h3">
                <Link
                  className="card-link"
                  href={href(locale, `/cases/${proposalCase.slug}`)}
                >
                  {proposalCase.title}
                </Link>
              </h3>
              <p className="small">{proposalCase.outcome}</p>
            </div>
          </article>
        </div>
      </section>

      <hr className="rule-dot relative [height:1px] [border:0] [background:var(--line-soft)] overflow-visible" />

      {/* 3. InsightCover (all 3 articles) */}
      <section className="section mist" data-header="paper">
        <div className="wrap" style={{ display: "grid", gap: "var(--sp-6)" }}>
          <h2 className="h2">{text("D.2", "洞察区标题", locale)}</h2>
          <InsightCover
            slug="proposal-draft-in-15-minutes"
            locale={locale}
            size="hero"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "var(--sp-5)",
            }}
          >
            {allInsights.map((ins) => (
              <div key={ins.slug} style={{ display: "grid", gap: "var(--sp-3)" }}>
                <InsightCover slug={ins.slug} locale={locale} size="card" />
                <h3 className="h3">{ins.title[locale]}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Dark panel + MetricBadge + TimeChip + Decor & Micro-interactions */}
      <section className="section" data-header="paper">
        <div className="wrap" style={{ display: "grid", gap: "var(--sp-6)" }}>
          <div
            className="dark halo-panel line-grid"
            data-surface="dark"
            style={{
              position: "relative",
              borderRadius: "var(--r-panel)",
              padding: "var(--sp-7)",
              display: "grid",
              gap: "var(--sp-5)",
            }}
          >
            <LightField preset="panel" />
            <div
              style={{
                position: "relative",
                zIndex: "var(--z-content)",
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--sp-4)",
                alignItems: "center",
              }}
            >
              <MetricBadge
                value={proposalCase.stats[0].value}
                label={proposalCase.stats[0].label}
              />
              <MetricBadge
                value={proposalCase.stats[1].value}
                label={proposalCase.stats[1].label}
              />
              <TimeChip
                before={copyIfApproved("H-3b02", locale)}
                after={copyIfApproved("H-3a02", locale)}
              />
              <span className="halo-button isolate inline-flex">
                <Link className="button" href={href(locale, "/contact")}>
                  {text("D.1", "主按钮", locale)}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </span>
            </div>
          </div>

          {/* Micro-interaction controls */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--sp-3)",
              alignItems: "center",
            }}
          >
            {sols.map((s, idx) => (
              <Link
                key={s.slug}
                className="chip"
                data-active={idx === 0 ? "true" : undefined}
                href={href(locale, `/services/${s.slug}`)}
              >
                {s.shortName}
              </Link>
            ))}
            <CitationPeek id="team-6y" locale={locale}>
              <strong>6+</strong>
            </CitationPeek>
          </div>

          <div className="faq-list">
            <details className="faq-item [border-bottom:1px_solid_var(--line)] [interpolate-size:allow-keywords]" open>
              <summary>
                <span>{copyIfApproved("H-7q1", locale)}</span>
                <ChevronDown className="faq-icon" size={18} aria-hidden="true" />
              </summary>
              <div className="faq-answer">
                <div>
                  <p>
                    {text(
                      "D.4",
                      "数据安全如何保障？ / How is our data protected?",
                      locale,
                    )}
                  </p>
                </div>
              </div>
            </details>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
