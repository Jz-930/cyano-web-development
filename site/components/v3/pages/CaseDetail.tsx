import pageCopy from "@/content/v4/pages/CaseDetail.json";
import Link from "next/link";
import { ArrowUpRight, Workflow } from "lucide-react";
import { Locale, t, href, text, cases } from "@/lib/content-v4";
import { Button, Eyebrow, SectionTitle, CaseCard, WorkflowDiagram, DemoLink } from "../ui";
import {Gallery} from "../islands/Gallery";
import {InteractiveDemo} from "../islands/InteractiveDemo";
import { PageHero } from "./PageHero";
import { Phrase } from "@/components/v4/Phrase";

export function CaseDetail({ locale, slug }: { locale: Locale; slug: string }) {
  const c = cases(locale).find((c) => c.slug === slug)!;
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={c.industry + " / " + text("D.1", "“客户项目”标签", locale)}
        title={c.title}
        intro={c.profile}
        compact
      >
        <Button to={href(locale, "/contact?case=" + c.slug + "#form")}>
          {pageCopy.book_a_confidential_demo[locale]}
        </Button>
        <DemoLink item={c} locale={locale} />
      </PageHero>
      <section className="case-overview">
        <div className="wrap">
          <div className="case-facts">
            {[
              [pageCopy.system[locale], c.system],
              [pageCopy.engagement[locale], c.model],
              [pageCopy.timeline[locale], c.duration],
            ].map(([label, value]) => (
              <div key={label}>
                <small>{label}</small>
                <span>{value}</span>
              </div>
            ))}
          </div>
          <div className="result-grid">
            {c.stats.map((s) => (
              <div key={s.label}>
                <strong>{s.value}</strong>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section mist">
        <div className="wrap">
          <SectionTitle
            eyebrow={pageCopy.the_system_up_close[locale]}
            title={c.system}
            description={pageCopy.screenshots_show_the_main[locale]}
          />
          <Gallery item={c} locale={locale} />
          <p className="confidential-note gallery-note">
            {text("D.1", "保密说明（案例）", locale)}
          </p>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="editorial-split">
            <Eyebrow>{pageCopy.before_and_after[locale]}</Eyebrow>
            <div>
              <h2>
                <Phrase text={pageCopy.what_changed_in_the[locale]} locale={locale} />
              </h2>
              <div className="before-after">
                <div>
                  <small>{pageCopy.before[locale]}</small>
                  <p>{c.before}</p>
                </div>
                <div>
                  <small>{pageCopy.after[locale]}</small>
                  <p>{c.after}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="section-divider" />
          <SectionTitle
            eyebrow={pageCopy.how_it_works[locale]}
            title={pageCopy.processing_and_review_steps[locale]}
          />
          <WorkflowDiagram locale={locale} />
          {["it-knowledge-assistant", "nl-data-query"].includes(c.slug) && (
            <InteractiveDemo locale={locale} data={c.slug === "nl-data-query"} />
          )}
          <div className="outcome outcome-bar">
            <Eyebrow>{pageCopy.project_outcome[locale]}</Eyebrow>
            <h2><Phrase text={c.outcome} locale={locale} /></h2>
            <p>
              {pageCopy.company_knowledge_workflow_orchestration[locale]}
            </p>
            <Link className="text-link" href={href(locale, "/technology")}>
              {pageCopy.explore_the_engineering[locale]}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <SectionTitle
            eyebrow={pageCopy.more_work[locale]}
            title={pageCopy.more_systems_in_production[locale]}
          />
          <div className="case-grid">
            {cases(locale)
              .filter((x) => x.slug !== slug)
              .slice(0, 2)
              .map((item) => (
                <CaseCard key={item.slug} item={item} locale={locale} />
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
