import { ViewTransition } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import pageCopy from "@/content/v4/pages/CaseDetail.json";
import { isDemoEnabled, type Locale } from "@/lib/content";
import {
  cases,
  copyIfApproved,
  href,
  text,
} from "@/lib/content-v4";
import { CaseCoverCard } from "../CaseCoverCard";
import { CaseGallery } from "../CaseGallery";
import { CitationPeek } from "../CitationPeek";
import { InteractiveDemo } from "../InteractiveDemo";
import { PageHero } from "../PageHero";
import { Phrase } from "../Phrase";
import { ScaledSceneMockup } from "../scenes";
import { WipeCompare } from "../WipeCompare";
import { WorkflowRun } from "../WorkflowRun";
import { renderBold } from "../richText";

export function CaseDetail({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const allCases = cases(locale);
  const c = allCases.find((x) => x.slug === slug) ?? allCases[0];
  const related = allCases.filter((x) => x.slug !== c.slug).slice(0, 2);

  const navCases = text("D.1", "主导航", locale).split(" · ")[1];
  const timeBanner = copyIfApproved(`C-1.${c.slug}`, locale);
  const captions = c.images.map((_, idx) =>
    copyIfApproved(`G.${c.slug}.${idx + 1}`, locale),
  );

  const facts: Array<[string, string]> = [
    [text("D.1", "“客户项目”标签", locale), c.industry],
    [pageCopy.system[locale], c.system],
    [pageCopy.engagement[locale], c.model],
    [pageCopy.timeline[locale], c.duration],
  ];

  const c3Title = copyIfApproved("C-3t", locale);
  const demoEnabled = isDemoEnabled(c.slug);
  const c3Live = demoEnabled && c.demo ? copyIfApproved("C-3.1", locale) : null;
  const c3Nda = copyIfApproved("C-3.2", locale);
  const c3Book = copyIfApproved("C-3.3", locale);
  const hasInteractiveDemo = [
    "it-knowledge-assistant",
    "nl-data-query",
  ].includes(c.slug);
  const isProposal = c.slug === "proposal-generation";

  return (
    <>
      <PageHero
        locale={locale}
        live
        preset="solution"
        focusSelector=".mk-window"
        className="case-hero"
        parentCrumb={{ label: navCases, href: href(locale, "/cases") }}
        crumbLabel={c.title}
        eyebrow={`${c.industry} · ${c.model}`}
        titleNode={
          <ViewTransition
            name={`case-title-${c.slug}`}
            share="morph"
            default="none"
          >
            <h1 className="h1-page">
              <Phrase text={c.title} locale={locale} />
            </h1>
          </ViewTransition>
        }
        lede={c.profile}
        actions={
          <>
            <Link
              className="button"
              href={href(locale, `/contact?case=${c.slug}#form`)}
            >
              {pageCopy.book_a_confidential_demo[locale]}
            </Link>
            {demoEnabled && c.demo ? (
              <a
                className="button-secondary on-dark"
                href={c.demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                {text("D.1", "在线 Demo 按钮", locale).replace(/\s*↗\s*$/, "")}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ) : null}
          </>
        }
        visual={
          <ViewTransition
            name={`case-shot-${c.slug}`}
            share="morph"
            default="none"
          >
            <div className="case-hero-shot relative">
              <ScaledSceneMockup
                scene={c.mockup}
                locale={locale}
                size="full"
              />
            </div>
          </ViewTransition>
        }
      >
        <div className="case-hero-stats grid [grid-template-columns:repeat(3,minmax(0,1fr))] [@media(max-width:800px)]:[grid-template-columns:repeat(2,minmax(0,1fr))] [gap:var(--sp-5)] [margin-top:var(--sp-6)] [padding-top:var(--sp-5)] [border-top:1px_solid_var(--dark-line-soft)]">
          {c.stats.map((st, idx) => (
            <div key={st.sourceId + idx} className="case-hero-stat flex flex-col [align-items:flex-start] [gap:var(--sp-1)]">
              <CitationPeek
                id={st.sourceId}
                locale={locale}
                className="case-stat-cite"
              >
                <span className="figure glow-number case-hero-figure [font-size:clamp(32px,3.6vw,48px)] [line-height:1.05] [font-weight:650] [font-variant-numeric:tabular-nums]">
                  {st.value}
                </span>
              </CitationPeek>
              <span className="case-hero-stat-label [font-size:13px] [line-height:1.4] [color:var(--on-dark)]">{st.label}</span>
            </div>
          ))}
        </div>
      </PageHero>

      {/* Section 2: Time banner + 4-col project facts */}
      <section className="paper case-facts-section [padding-top:calc(var(--sp-9)_+_var(--sp-5))] [padding-bottom:var(--sp-8)] [@media(max-width:1023px)]:[padding-top:var(--section-y)]" data-header="paper">
        <div className="wrap">
          {timeBanner ? (
            <p className="case-time-banner [margin:0_0_var(--sp-7)] [font-size:clamp(22px,2.8vw,32px)] [line-height:1.25] [font-weight:500] [color:var(--muted)] [font-variant-numeric:tabular-nums]" data-reveal="">
              {renderBold(timeBanner)}
            </p>
          ) : null}

          <dl className="case-facts grid [grid-template-columns:repeat(4,minmax(0,1fr))] [@media(max-width:800px)]:[grid-template-columns:repeat(2,minmax(0,1fr))] [gap:var(--sp-5)] m-0 [padding:var(--sp-5)_0]" data-reveal="">
            {facts.map(([k, v]) => (
              <div key={k} className="case-fact-item flex flex-col [gap:var(--sp-1)]">
                <dt className="eyebrow">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Section 3: Real system screenshots inside dark halo-panel */}
      <section
        className="dark halo-panel case-gallery-section [padding-block:var(--section-y)]"
        data-header="dark"
      >
        <div className="wrap">
          <div className="case-sec-head flex flex-col [gap:var(--sp-2)] [margin-bottom:var(--sp-6)]" data-reveal="">
            <p className="eyebrow on-dark">
              {pageCopy.the_system_up_close[locale]}
            </p>
            <h2 className="h2">
              <Phrase
                text={pageCopy.screenshots_show_the_main[locale]}
                locale={locale}
              />
            </h2>
          </div>

          <CaseGallery
            locale={locale}
            system={c.system}
            images={c.images}
            main={c.main}
            captions={captions}
          />

          <p className="case-gallery-nda [margin:var(--sp-5)_0_0] [font-size:13px] [color:var(--on-dark)]">
            {text("D.1", "保密说明（案例）", locale)}
          </p>
        </div>
      </section>

      {/* Section 4: Combined Before/After (S9 on proposal-generation) + Workflow S5 */}
      <section className="paper case-ba-section [padding-block:var(--section-y)]" data-header="paper">
        <div className="wrap">
          <div className="card dot-grid case-combined-card">
            <div className="case-sec-head flex flex-col [gap:var(--sp-2)] [margin-bottom:var(--sp-6)]" data-reveal="">
              <p className="eyebrow">{pageCopy.before_and_after[locale]}</p>
              <h2 className="h2">
                <Phrase
                  text={pageCopy.what_changed_in_the[locale]}
                  locale={locale}
                />
              </h2>
            </div>

            {isProposal ? (
              <WipeCompare
                locale={locale}
                beforeText={c.before}
                afterText={c.after}
              />
            ) : (
              <div className="case-ba-grid grid [grid-template-columns:minmax(0,1fr)_auto_minmax(0,1fr)] [@media(max-width:800px)]:[grid-template-columns:minmax(0,1fr)] [gap:var(--sp-5)] items-stretch" data-reveal="">
                <div className="case-ba-box is-before flex flex-col [gap:var(--sp-3)] [padding:var(--sp-6)] [border-radius:var(--r-card)]">
                  <span className="eyebrow">{pageCopy.before[locale]}</span>
                  <p>{c.before}</p>
                </div>
                <div className="case-ba-arrow flex items-center justify-center [color:var(--link)]" aria-hidden="true">
                  <ArrowRight size={22} />
                </div>
                <div className="case-ba-box is-after flex flex-col [gap:var(--sp-3)] [padding:var(--sp-6)] [border-radius:var(--r-card)]">
                  <span className="eyebrow">{pageCopy.after[locale]}</span>
                  <p>{c.after}</p>
                </div>
              </div>
            )}

            <hr className="case-card-divider [margin-block:var(--sp-7)]" />

            <div className="case-sec-head flex flex-col [gap:var(--sp-2)] [margin-bottom:var(--sp-6)]" data-reveal="">
              <p className="eyebrow">{pageCopy.how_it_works[locale]}</p>
              <h2 className="h3">
                <Phrase
                  text={pageCopy.processing_and_review_steps[locale]}
                  locale={locale}
                />
              </h2>
            </div>

            <WorkflowRun locale={locale} slug={c.slug} />
          </div>
        </div>
      </section>

      {/* Section 5: Interactive Demo (it-knowledge-assistant & nl-data-query) */}
      {hasInteractiveDemo ? (
        <section
          className="dark halo-panel case-demo-section [padding-block:var(--section-y)]"
          data-header="dark"
        >
          <div className="wrap">
            <InteractiveDemo
              locale={locale}
              data={c.slug === "nl-data-query"}
              liveBadge={text("D.1", "网页内 Demo 标签", locale)}
              disclaimer={text("D.1", "交互 Demo 说明小字", locale)}
            />
          </div>
        </section>
      ) : null}

      {/* Section 6: Outcome summary + verification card */}
      <section className="paper-2 case-outcome-section [padding-block:var(--section-y)]" data-header="paper">
        <div className="wrap case-outcome-grid grid [gap:var(--sp-7)] [align-items:start]">
          <div className="outcome-bar flex flex-col [align-items:flex-start] [gap:var(--sp-4)] [padding-left:var(--sp-5)] [border-left:3px_solid_var(--brand)]" data-reveal="">
            <p className="eyebrow">{pageCopy.project_outcome[locale]}</p>
            <p className="outcome-text m-0 [font-size:18px] [line-height:1.7] [color:var(--ink)]">{c.outcome}</p>
            <div className="outcome-tags flex flex-wrap [gap:var(--sp-2)]">
              {pageCopy.company_knowledge_workflow_orchestration[locale]
                .split(" · ")
                .map((tag) => (
                  <span key={tag} className="tag inline-flex [border-radius:var(--r-chip)] [padding:4px_10px]">
                    {tag}
                  </span>
                ))}
            </div>
            <Link className="text-link" href={href(locale, "/technology")}>
              {pageCopy.explore_the_engineering[locale]}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {c3Title ? (
            <div className="card case-verify-card" data-reveal="">
              <h3 className="h3">{c3Title}</h3>
              <ul className="case-verify-list flex flex-col [gap:var(--sp-3)] list-none m-0 p-0">
                {c3Live && c.demo ? (
                  <li>
                    <a
                      className="case-verify-link flex items-center justify-between [gap:var(--sp-3)] [padding:var(--sp-3)_var(--sp-4)] [border-radius:var(--r-control)] [background:var(--p1)] [font-size:14px] [font-weight:500] [transition:border-color_var(--qtf),color_var(--qtf),opacity_var(--qtp)]"
                      href={c.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{c3Live}</span>
                    </a>
                  </li>
                ) : null}
                {c3Nda ? (
                  <li>
                    <Link
                      className="case-verify-link flex items-center justify-between [gap:var(--sp-3)] [padding:var(--sp-3)_var(--sp-4)] [border-radius:var(--r-control)] [background:var(--p1)] [font-size:14px] [font-weight:500] [transition:border-color_var(--qtf),color_var(--qtf),opacity_var(--qtp)]"
                      href={href(locale, `/contact?case=${c.slug}#form`)}
                    >
                      <span>{c3Nda}</span>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  </li>
                ) : null}
                {c3Book ? (
                  <li>
                    <Link
                      className="case-verify-link flex items-center justify-between [gap:var(--sp-3)] [padding:var(--sp-3)_var(--sp-4)] [border-radius:var(--r-control)] [background:var(--p1)] [font-size:14px] [font-weight:500] [transition:border-color_var(--qtf),color_var(--qtf),opacity_var(--qtp)]"
                      href={href(locale, "/contact?topic=casebook#form")}
                    >
                      <span>{c3Book}</span>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      {/* Section 7: Related cases */}
      <section className="paper case-more-section [padding-block:var(--section-y)]" data-header="paper">
        <div className="wrap">
          <div className="case-sec-head flex flex-col [gap:var(--sp-2)] [margin-bottom:var(--sp-6)]" data-reveal="">
            <p className="eyebrow">{pageCopy.more_work[locale]}</p>
            <h2 className="h2">
              <Phrase
                text={pageCopy.more_systems_in_production[locale]}
                locale={locale}
              />
            </h2>
          </div>
          <div className="case-more-grid grid [gap:var(--sp-6)]">
            {related.map((item, idx) => (
              <CaseCoverCard
                key={item.slug}
                item={item}
                locale={locale}
                index={idx}
                glassBadge={idx === 0}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
