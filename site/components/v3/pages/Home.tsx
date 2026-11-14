import {ProblemTabs} from "../ProblemTabs";
import pageCopy from "@/content/v3/pages/Home.json";
import Link from "next/link";
import {BusinessHeroVisual} from "../BusinessHeroVisual";
import { ArrowDown, ArrowUpRight, ShieldCheck, Layers3, Workflow, Database } from "lucide-react";
import { Locale, t, href, text, cases, solutions, insights } from "@/lib/v1-content";
import { Button, Eyebrow, SectionTitle, Stats, CaseCard, Team, InsightCards, industryIcons } from "../ui";
import {SolutionExplorer} from "../islands/SolutionExplorer";
import copy from "@/content/v1/copy.json";
import { EngagementCards } from "./EngagementCards";

export function Home({ locale }: { locale: Locale }) {
  const all = cases(locale);
  return (
    <>
      <section className="home-hero dark">
        <div className="hero-business-backdrop" />
        <div className="container hero-content">
          <Eyebrow light>{text("D.2", "Eyebrow", locale)}</Eyebrow>
          <h1>
            {locale === "zh" ? (
              <>
                
                为企业开发
                <br />
                
                日常工作用得上的
                <br />
                <span>AI</span>
                <span className="headline-period">。</span>
              </>
            ) : (
              <>
                
                Custom AI
                <br />
                
                for your
                <br />
                <span>everyday work.</span>
              </>
            )}
          </h1>
          <p className="hero-description">{text("D.2", "副标题", locale)}</p>
          <div className="hero-buttons">
            <Button locale={locale}>{text("D.1", "主按钮", locale)}</Button>
            <Link className="hero-secondary" href={href(locale, "/cases")}>
              {pageCopy.cacaceaf63e[locale]}
              <span>
                <ArrowUpRight size={20} />
              </span>
            </Link>
          </div>
        </div>
        <BusinessHeroVisual locale={locale} />
        <div className="container hero-bottom">
          <div className="hero-caption">
            <span className="status-dot" />
            {pageCopy.cbb17f6527c[locale]}
          </div>
          <a href="#expertise" className="scroll-link">
            {pageCopy.c6ccf839c13[locale]}
            <ArrowDown size={14} />
          </a>
        </div>
      </section>
      <section className="trust-section" id="expertise">
        <div className="container">
          <Stats locale={locale} />
          <div className="industry-strip">
            <span>{pageCopy.c0f6248ce56[locale]}</span>
            {[0, 1, 4, 3, 2, 5].map((i) => {
              const Icon = industryIcons[i];
              return (
                <div key={i}>
                  <Icon size={18} strokeWidth={1.3} />
                  {all[i].industry}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="manifesto">
        <div className="manifesto-contours" />
        <div className="container manifesto-grid">
          <Eyebrow light>{pageCopy.cd7bd9f82f5[locale]}</Eyebrow>
          <div>
            <h2>
              {locale === "zh" ? (
                <>
                  
                  熟悉模型研发，
                  <br />
                  <span>也做过企业系统。</span>
                </>
              ) : (
                <>
                  
                  Experience in AI models
                  <br />
                  <span>and enterprise software.</span>
                </>
              )}
            </h2>
            <div className="manifesto-copy">
              <p>{text("D.2", "宣言段 1", locale)}</p>
              <p>{text("D.2", "宣言段 2", locale)}</p>
            </div>
            <Link
              href={href(locale, "/about")}
              className="text-link light-link"
            >
              {pageCopy.cd0d27acf18[locale]}
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section solutions-section">
        <div className="container">
          <SectionTitle
            eyebrow={pageCopy.c2b5c56be3e[locale]}
            title={text("D.2", "解决方案区标题", locale)}
          >
            <Link className="text-link" href={href(locale, "/services")}>
              {pageCopy.c4d147ffe9f[locale]}
              <ArrowUpRight size={18} />
            </Link>
          </SectionTitle>
          <SolutionExplorer locale={locale} />
        </div>
      </section>
      <section className="section cases-section mist">
        <div className="container">
          <SectionTitle
            eyebrow={pageCopy.c15b3e47a84[locale]}
            title={text("D.2", "精选案例标题", locale)}
            description={text("D.2", "精选案例导语", locale)}
          >
            <Link href={href(locale, "/cases")} className="text-link">
              {pageCopy.ce637340fe2[locale]}
              <ArrowUpRight size={18} />
            </Link>
          </SectionTitle>
          <div className="home-case-grid">
            {[all[1], all[2], all[0]].map((c, i) => (
              <CaseCard
                key={c.slug}
                item={c}
                locale={locale}
                featured={i === 0}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="section dark difference-section">
        <div className="container">
          <SectionTitle
            eyebrow={pageCopy.c4fe4a61a4a[locale]}
            title={text("D.2", "痛点区标题", locale)}
            description={pageCopy.ceeb05ca333[locale]}
          />
          <ProblemTabs locale={locale} items={[1,2,3,4].map(i=>{const [before,answer]=text("D.2","痛点 "+i,locale).split("→");const [title,...body]=before.split(locale==="zh"?" —— ":" —");return {title,issue:body.join(locale==="zh"?" —— ":" —"),answer:answer.trim()};})}/>
          <Link
            href={href(locale, "/technology")}
            className="text-link light-link"
          >
            {text("D.2", "痛点区链接", locale)}
          </Link>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow={pageCopy.c6c4a9d30a1[locale]}
            title={text("D.2", "合作区标题", locale)}
          >
            <Link className="text-link" href={href(locale, "/engagement")}>
              {text("D.2", "合作区链接", locale)}
            </Link>
          </SectionTitle>
          <EngagementCards locale={locale} />
        </div>
      </section>
      <section className="section team-section mist">
        <div className="container">
          <SectionTitle
            eyebrow={pageCopy.c8bb0541485[locale]}
            title={text("D.2", "团队区标题", locale)}
            description={text("D.2", "团队区导语", locale)}
          >
            <Link className="text-link" href={href(locale, "/about")}>
              {text("D.2", "团队区链接", locale)}
            </Link>
          </SectionTitle>
          <Team locale={locale} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow={pageCopy.c52c0b6a904[locale]}
            title={pageCopy.c99ef98cdfe[locale]}
          >
            <Link className="text-link" href={href(locale, "/insights")}>
              {pageCopy.cb2e805c42d[locale]}
              <ArrowUpRight size={18} />
            </Link>
          </SectionTitle>
          <InsightCards locale={locale} />
        </div>
      </section>
    </>
  );
}
