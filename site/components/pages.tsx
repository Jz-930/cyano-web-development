import Link from "next/link";
import { BusinessHeroVisual, CoreVisual } from "./business-visuals";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Network,
  Layers3,
  Workflow,
  KeyRound,
  Sprout,
  PackageCheck,
  Check,
  Database,
  Quote,
} from "lucide-react";
import {
  Locale,
  t,
  href,
  text,
  cases,
  solutions,
  founders,
  insights,
} from "@/lib/content";
import {
  Button,
  Eyebrow,
  SectionTitle,
  Stats,
  CaseCard,
  Team,
  InsightCards,
  WorkflowDiagram,
  industryIcons,
  solutionIcons,
  DemoLink,
} from "./ui";
import {
  AmbientFlow,
  SolutionExplorer,
  CaseFilters,
  Gallery,
  FAQ,
  ContactForm,
  InteractiveDemo,
  CopyLink,
} from "./interactive";
import copy from "@/content/copy.json";
import articles from "@/content/articles.json";
export function PageHero({
  locale,
  eyebrow,
  title,
  intro,
  art = "/art/hero.webp",
  children,
  compact = false,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  intro?: string;
  art?: string;
  children?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={`page-hero dark ${compact ? "page-hero-compact" : ""}`}>
      <CoreVisual locale={locale} />
      <div className="page-hero-shade" />
      <div className="container page-hero-inner">
        <div className="breadcrumb">
          <Link href={href(locale)}>{t(locale, "首页", "Home")}</Link>
          <span>/</span>
          <span>{eyebrow}</span>
        </div>
        <Eyebrow light>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
        {children && <div className="hero-buttons">{children}</div>}
      </div>
    </section>
  );
}
export function Home({ locale }: { locale: Locale }) {
  const all = cases(locale);
  return (
    <>
      <section className="home-hero dark">
        <div className="hero-business-backdrop" />
        <BusinessHeroVisual locale={locale} />
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
              {t(locale, "查看案例", "See our work")}
              <span>
                <ArrowUpRight size={20} />
              </span>
            </Link>
          </div>
        </div>
        <div className="container hero-bottom">
          <div className="hero-caption">
            <span className="status-dot" />
            {t(
              locale,
              "定制开发 · 试点 · 托管服务",
              "CUSTOM DEVELOPMENT · PILOTS · MANAGED SERVICES",
            )}
          </div>
          <a href="#expertise" className="scroll-link">
            {t(locale, "向下探索", "SCROLL TO EXPLORE")}
            <ArrowDown size={14} />
          </a>
          <div className="visual-coordinate">
            
            CYANO / ENTERPRISE AI
          </div>
        </div>
      </section>
      <section className="trust-section" id="expertise">
        <div className="container">
          <Stats locale={locale} />
          <div className="industry-strip">
            <span>{t(locale, "已服务行业", "INDUSTRIES WE SERVE")}</span>
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
      <section className="manifesto dark">
        <div className="manifesto-contours" />
        <div className="container manifesto-grid">
          <Eyebrow light>{t(locale, "我们是谁", "WHO WE ARE")}</Eyebrow>
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
              {t(locale, "认识 Cyano（澜屿智创）", "Meet Cyano")}
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section solutions-section">
        <div className="container">
          <SectionTitle
            eyebrow={t(locale, "解决方案", "WHAT WE DO")}
            title={text("D.2", "解决方案区标题", locale)}
          >
            <Link className="text-link" href={href(locale, "/services")}>
              {t(locale, "全部解决方案", "All solutions")}
              <ArrowUpRight size={18} />
            </Link>
          </SectionTitle>
          <SolutionExplorer locale={locale} />
        </div>
      </section>
      <section className="section cases-section mist">
        <div className="container">
          <SectionTitle
            eyebrow={t(locale, "精选案例", "SELECTED WORK")}
            title={text("D.2", "精选案例标题", locale)}
            description={text("D.2", "精选案例导语", locale)}
          >
            <Link href={href(locale, "/cases")} className="text-link">
              {t(locale, "查看全部案例", "View all case studies")}
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
            eyebrow={t(locale, "实施中需要处理的问题", "IMPLEMENTATION")}
            title={text("D.2", "痛点区标题", locale)}
            description={t(
              locale,
              "资料、权限和审核流程，需要与模型一起设计。",
              "Sources, access controls and review steps need to be designed alongside the model.",
            )}
          />
          <div className="difference-grid">
            {[Database, Layers3, ShieldCheck, Workflow].map((Icon, i) => {
              const s = text("D.2", "痛点 " + (i + 1), locale);
              const [before, after] = s.split("→");
              const [title, ...rest] = before.split(" —");
              const zhParts = before.split(" —— ");
              return (
                <div key={i} className="difference-item">
                  <Icon size={32} strokeWidth={1.2} />
                  <h3>{locale === "zh" ? zhParts[0] : title}</h3>
                  <p>{locale === "zh" ? zhParts[1] : rest.join(" —")}</p>
                  <div className="solution-answer">
                    <span>↳</span>
                    {after.trim()}
                  </div>
                </div>
              );
            })}
          </div>
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
            eyebrow={t(locale, "合作方式", "ENGAGEMENT OPTIONS")}
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
            eyebrow={t(
              locale,
              "团队分工",
              "OUR TEAM",
            )}
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
            eyebrow={t(locale, "思考与实践", "PERSPECTIVES")}
            title={t(
              locale,
              "项目经验与实施建议",
              "Project notes and implementation advice",
            )}
          >
            <Link className="text-link" href={href(locale, "/insights")}>
              {t(locale, "查看全部洞察", "All insights")}
              <ArrowUpRight size={18} />
            </Link>
          </SectionTitle>
          <InsightCards locale={locale} />
        </div>
      </section>
    </>
  );
}
export function EngagementCards({ locale }: { locale: Locale }) {
  return (
    <div className="engagement-grid">
      {[KeyRound, Sprout, PackageCheck].map((Icon, i) => (
        <article key={i} className={"engagement-card engagement-" + i}>
          <div className="engagement-top">
            <span>0{i + 1}</span>
            <Icon size={35} strokeWidth={1.2} />
          </div>
          <span className="tag">
            {t(
              locale,
              ["自有系统", "小范围试用", "按批次交付"][i],
              ["OWN A SYSTEM", "TEST A USE CASE", "OUTSOURCE THE WORK"][i],
            )}
          </span>
          <h3>
            {t(
              locale,
              ["完整定制开发", "低启动试点 + 持续服务", "托管式 AI 服务"][i],
              [
                "Full custom build",
                "Pilot + ongoing service",
                "Managed AI service",
              ][i],
            )}
          </h3>
          <p>
            {t(
              locale,
              [
                "适合需求明确、使用频繁，需要拥有并长期使用系统的团队。",
                "先开发一个范围较小的版本，根据实际效果决定是否扩展。",
                "客户提供资料与质量标准，Cyano 运行工作流、审核并交付结果。",
              ][i],
              [
                "For teams with clear requirements and frequent use that want to own the system.",
                "Start with a smaller working version and use the results to decide whether to expand.",
                "You provide the sources and quality criteria. Cyano runs the workflow, reviews the output and delivers it.",
              ][i],
            )}
          </p>
          <div className="engagement-bottom">
            <span>
              {t(
                locale,
                ["6–12 周首期上线", "2–6 周首个可用版本", "首批结果 2 周内"][i],
                [
                  "First release in 6–12 weeks",
                  "Working version in 2–6 weeks",
                  "First results within 2 weeks",
                ][i],
              )}
            </span>
            <Link
              href={href(locale, "/contact#form")}
              aria-label={t(locale, "咨询合作方式", "Discuss engagement")}
            >
              <ArrowUpRight size={20} />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
export function Services({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={t(locale, "解决方案", "SOLUTIONS")}
        title={text("D.3", "总览 Hero 标题", locale)}
        intro={text("D.3", "总览 Hero 导语", locale)}
      >
        <Button locale={locale}>{text("D.1", "主按钮", locale)}</Button>
      </PageHero>
      <section className="section">
        <div className="container">
          <div className="opportunity-grid">
            {[0, 1].map((i) => (
              <div key={i}>
                <span className="index-label">0{i + 1}</span>
                <h2>
                  {t(
                    locale,
                    ["扩展客户服务", "减少重复处理"][i],
                    [
                      "Expand customer services",
                      "Reduce repetitive work",
                    ][i],
                  )}
                </h2>
                <p>
                  {t(
                    locale,
                    [
                      "用产品资料和项目经验回答客户问题，按不同需求准备推荐方案与销售材料。",
                      "将资料整理、数据查询和常见客服问题交给工作流处理，减少手工录入和反复查找。",
                    ][i],
                    [
                      "Use product documentation and project experience to answer questions and prepare recommendations for each customer.",
                      "Automate recurring document preparation, data queries and support questions to reduce manual entry and repeated searches.",
                    ][i],
                  )}
                </p>
              </div>
            ))}
          </div>
          <div className="service-list">
            {solutions(locale).map((s, i) => {
              const Icon = solutionIcons[i];
              return (
                <article className="service-detail-card" key={s.slug}>
                  <div className="service-art">
                    <img
                      src={cases(locale)[i].images[cases(locale)[i].main]}
                      alt={cases(locale)[i].system}
                      width="1600"
                      height="1000"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <Eyebrow>{"0" + (i + 1) + " / " + s.name}</Eyebrow>
                    <h2>{s.promise}</h2>
                    <p>{s.intro}</p>
                    <div className="deliverable-tags">
                      {s.outputs.split(" · ").map((x) => (
                        <span key={x}>
                          <Check size={14} />
                          {x}
                        </span>
                      ))}
                    </div>
                    <Link
                      className="text-link"
                      href={href(locale, "/services/" + s.slug)}
                    >
                      {t(locale, "探索解决方案", "Explore solution")}
                      <ArrowUpRight size={18} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="inline-cta">
            <h3>
              {t(locale, "你的场景不在上面？", "Don’t see your use case?")}
            </h3>
            <p>{text("D.3", "不在清单上？", locale)}</p>
            <Button locale={locale}>{text("D.1", "主按钮", locale)}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
export function SolutionDetail({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const s = solutions(locale).find((s) => s.slug === slug)!;
  const c = cases(locale).find((c) => c.slug === s.caseSlug)!;
  const pains = t(
    locale,
    [
      "销售现场查资料慢|产品问题太专业，客服无法独立回答|销售材料千篇一律，缺少针对性",
      "历史方案分散，资料难以复用|每份初稿耗时，反复核对参数|关键条款容易遗漏，审核压力大",
      "员工反复问同样的问题|知识更新后，旧答案仍在传播|权限不同，资料不能随意开放",
      "查一个数字，要等 IT 导数|指标口径不统一，结果难核对|业务人员不会 SQL，无法自助分析",
    ][s.index],
    [
      "Product information takes too long to find|Support cannot answer specialist questions|Sales material lacks relevance",
      "Past proposals are scattered|Drafting and parameter checks take days|Critical requirements get missed",
      "Employees ask the same questions repeatedly|Old answers persist after policy updates|Different roles need different access",
      "Every query goes through the IT queue|Inconsistent metrics make results hard to trust|Business users cannot write SQL",
    ][s.index],
  ).split("|");
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={s.name}
        title={s.promise}
        intro={s.intro}
        art={s.index % 2 ? "/art/technology.webp" : "/art/hero.webp"}
      >
        <Button locale={locale}>{text("D.1", "主按钮", locale)}</Button>
        <Button secondary to={href(locale, "/cases/" + c.slug)}>
          {t(locale, "查看相关案例", "See related work")}
        </Button>
      </PageHero>
      <section className="section">
        <div className="container">
          <div className="result-grid">
            {c.stats.map((v) => (
              <div key={v.label}>
                <strong>{v.value}</strong>
                <p>{v.label}</p>
              </div>
            ))}
          </div>
          <SectionTitle
            eyebrow={t(locale, "使用场景", "THE CHALLENGE")}
            title={t(
              locale,
              "需要解决的日常问题",
              "Common problems in this workflow",
            )}
          />
          <div className="three-columns">
            {pains.map((p, i) => (
              <article className="plain-card" key={p}>
                <span className="index-label">0{i + 1}</span>
                <h3>{p}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section mist">
        <div className="container">
          <SectionTitle
            eyebrow={t(locale, "我们怎么做", "THE APPROACH")}
            title={t(
              locale,
              "系统如何处理任务",
              "How the system handles a task",
            )}
          />
          <WorkflowDiagram locale={locale} />
          <div className="deliverables">
            <h3>{t(locale, "你会得到什么", "What you receive")}</h3>
            {[
              ...s.outputs.split(" · "),
              t(
                locale,
                "上线维护与持续迭代",
                "Maintenance and ongoing iteration",
              ),
            ].map((d) => (
              <span key={d}>
                <Check size={17} />
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow={t(locale, "相关客户项目", "IN PRODUCTION")}
            title={t(locale, "查看相关系统与项目结果", "Related system and project results")}
          />
          <div className="single-case">
            <CaseCard item={c} locale={locale} />
          </div>
          {[2, 3].includes(s.index) && (
            <InteractiveDemo locale={locale} data={s.index === 3} />
          )}
          <div className="faq-section">
            <h2>{t(locale, "常见问题", "Common questions")}</h2>
            <FAQ
              items={[
                {
                  q: t(
                    locale,
                    "可以接入我们已有的系统吗？",
                    "Can it connect to our existing systems?",
                  ),
                  a: t(
                    locale,
                    "可以。评估阶段会确认数据来源、接口和权限，优先使用现有数据库、文档与业务系统。",
                    "Yes. The assessment covers data sources, interfaces and permissions, starting with the systems and documents you already use.",
                  ),
                },
                {
                  q: t(
                    locale,
                    "如何保证答案和结果可靠？",
                    "How do you make results reliable?",
                  ),
                  a: t(
                    locale,
                    "使用企业自己的资料，结合引用溯源、规则校验和人工复核点。无法确认的任务交还业务负责人处理。",
                    "We use your own sources, citations, validation rules and human review. Uncertain tasks return to a business owner.",
                  ),
                },
                {
                  q: t(
                    locale,
                    "多久能看到第一版？",
                    "When can we try a first version?",
                  ),
                  a: text("D.3", "合作提示（T9）", locale),
                },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
export function CasesPage({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={t(locale, "我们的工作", "OUR WORK")}
        title={text("D.5", "列表 Hero 标题", locale)}
        intro={text("D.5", "汇总一行", locale)}
        compact
      />
      <section className="section">
        <div className="container">
          <p className="confidential-note">
            {text("D.1", "保密说明（案例）", locale)}
          </p>
          <CaseFilters locale={locale} />
          <div className="inline-cta">
            <h2>{text("D.5", "列表收尾", locale)}</h2>
            <Button locale={locale}>
              {t(locale, "预约保密演示", "Book a confidential demo")}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
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
          {t(locale, "预约保密演示", "Book a confidential demo")}
        </Button>
        <DemoLink item={c} locale={locale} />
      </PageHero>
      <section className="case-overview">
        <div className="container">
          <div className="case-facts">
            {[
              [t(locale, "系统", "System"), c.system],
              [t(locale, "合作方式", "Engagement"), c.model],
              [t(locale, "项目周期", "Timeline"), c.duration],
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
        <div className="container">
          <SectionTitle
            eyebrow={t(locale, "真实界面", "THE SYSTEM, UP CLOSE")}
            title={c.system}
            description={t(
              locale,
              "以下界面展示系统的主要功能与操作步骤。",
              "Screenshots show the main functions and operating steps.",
            )}
          />
          <Gallery item={c} locale={locale} />
          <p className="confidential-note gallery-note">
            {text("D.1", "保密说明（案例）", locale)}
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="editorial-split">
            <Eyebrow>{t(locale, "使用前后", "BEFORE AND AFTER")}</Eyebrow>
            <div>
              <h2>
                {t(
                  locale,
                  "这项工作如何改变",
                  "What changed in the workflow",
                )}
              </h2>
              <div className="before-after">
                <div>
                  <small>{t(locale, "过去", "BEFORE")}</small>
                  <p>{c.before}</p>
                </div>
                <div>
                  <small>{t(locale, "现在", "AFTER")}</small>
                  <p>{c.after}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="section-divider" />
          <SectionTitle
            eyebrow={t(locale, "解决路径", "HOW IT WORKS")}
            title={t(
              locale,
              "资料处理与审核步骤",
              "Processing and review steps",
            )}
          />
          <WorkflowDiagram locale={locale} />
          {[2, 3].includes(c.index) && (
            <InteractiveDemo locale={locale} data={c.index === 3} />
          )}
          <div className="outcome">
            <Quote size={34} strokeWidth={1} />
            <Eyebrow>{t(locale, "项目成果摘要", "PROJECT OUTCOME")}</Eyebrow>
            <h2>{c.outcome}</h2>
            <p>
              {t(
                locale,
                "企业知识 · 工作流编排 · 权限与审计",
                "Company knowledge · Workflow orchestration · Access & audit",
              )}
            </p>
            <Link className="text-link" href={href(locale, "/technology")}>
              {t(locale, "了解背后的工程方法", "Explore the engineering")}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <SectionTitle
            eyebrow={t(locale, "继续探索", "MORE WORK")}
            title={t(
              locale,
              "其他正在运行的系统",
              "More systems in production",
            )}
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
export function Technology({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow="CYANO CORE"
        title={text("D.6", "Hero 标题", locale)}
        intro={text("D.6", "Hero 导语", locale)}
        art="/art/technology.webp"
      >
        <Button locale={locale}>
          {t(locale, "与技术负责人聊聊", "Talk to our CTO")}
        </Button>
      </PageHero>
      <section className="section">
        <div className="container">
          <div className="editorial-split">
            <Eyebrow>
              {t(locale, "平台功能", "PLATFORM FUNCTIONS")}
            </Eyebrow>
            <div>
              <h2>Cyano Core</h2>
              <p className="large-copy">
                {text("D.6", "Cyano Core 定义", locale)}
              </p>
            </div>
          </div>
          <div className="architecture">
            {[Database, Network, Workflow, ShieldCheck].map((Icon, i) => {
              const [name, desc] = text(
                "D.6",
                "第 " + (i + 1) + " 层",
                locale,
              ).split(locale === "zh" ? " —— " : " — ");
              return (
                <div className={"architecture-layer layer-" + i} key={i}>
                  <span>0{i + 1}</span>
                  <Icon size={28} strokeWidth={1.3} />
                  <h3>{name}</h3>
                  <p>{desc}</p>
                  <Check size={17} />
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section dark">
        <div className="container">
          <SectionTitle
            eyebrow={t(locale, "长上下文工程", "CONTEXT ENGINEERING")}
            title={text("D.6", "估值引擎标题", locale)}
          />
          <div className="three-columns">
            {[1, 2, 3].map((i) => {
              const [title, ...body] = text("D.6", "难题 " + i, locale).split(
                locale === "zh" ? " —— " : " — ",
              );
              return (
                <div className="plain-card" key={i}>
                  <span className="index-label">0{i}</span>
                  <h3>{title}</h3>
                  <p>{body.join(" — ")}</p>
                </div>
              );
            })}
          </div>
          <div className="memory-layers">
            {[100, 75, 40, 15].map((v, i) => (
              <div key={v}>
                <span>
                  {t(
                    locale,
                    [
                      "保留核心指令",
                      "结构化关键状态",
                      "压缩中间推理记录",
                      "保留故障原因记录",
                    ][i],
                    [
                      "Core instructions, preserved",
                      "Structured key states",
                      "Condensed reasoning records",
                      "Fault-cause records",
                    ][i],
                  )}
                </span>
                <div>
                  <i style={{ width: v + "%" }} />
                </div>
              </div>
            ))}
          </div>
          <div className="tech-stats">
            {["< 200ms", "100%", "40%", "10×"].map((v, i) => (
              <div key={v}>
                <strong>
                  {v}
                  <sup>*</sup>
                </strong>
                <p>
                  {t(
                    locale,
                    [
                      "响应延迟",
                      "核心指令召回",
                      "Token 成本最多降低",
                      "投入回报最高可达",
                    ][i],
                    [
                      "Response latency",
                      "Core instruction recall",
                      "Lower token cost, up to",
                      "Return on investment, up to",
                    ][i],
                  )}
                </p>
              </div>
            ))}
          </div>
          <p className="benchmark-note">{text("D.1", "技术页脚注", locale)}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow={t(locale, "融入现有系统", "DESIGNED TO CONNECT")}
            title={text("D.6", "兼容区标题", locale)}
          />
          <div className="integration-tags">
            {[
              "OpenAI GPT",
              "Anthropic Claude",
              "Google Gemini",
              "DeepSeek",
              "通义千问",
              "Llama",
              "MySQL",
              "PostgreSQL",
              "飞书",
              "钉钉",
              "企业微信",
              "SharePoint",
              "Confluence",
              "ERP / CRM",
              "PDF / Office",
            ].map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          <div className="security-banner">
            <ShieldCheck size={48} strokeWidth={1} />
            <div>
              <h2>{text("D.6", "安全区标题", locale)}</h2>
              <p>
                {t(
                  locale,
                  "系统提供访问权限、来源引用、处理日志和敏感信息过滤。部署可选择 SaaS 托管或私有环境。",
                  "The system includes access controls, citations, processing logs and sensitive-data filtering. Deployment is available through SaaS hosting or a private environment.",
                )}
              </p>
            </div>
            <Link
              href={href(locale, "/contact#form")}
              aria-label={t(
                locale,
                "咨询数据安全与部署",
                "Discuss data security and deployment",
              )}
            >
              <ArrowUpRight size={28} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
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
        eyebrow={t(locale, "合作方式", "HOW WE WORK")}
        title={text("D.4", "Hero 标题", locale)}
        intro={text("D.4", "Hero 导语", locale)}
      />
      <section className="section">
        <div className="container">
          <EngagementCards locale={locale} />
          <p className="decision-note">{text("D.4", "怎么选", locale)}</p>
          <div className="comparison-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>{t(locale, "对比维度", "Compare")}</th>
                  {[0, 1, 2].map((i) => (
                    <th key={i}>
                      {t(
                        locale,
                        ["完整定制开发", "低启动试点", "托管式服务"][i],
                        [
                          "Full custom build",
                          "Pilot + service",
                          "Managed service",
                        ][i],
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2].map((i) => (
                  <tr key={i}>
                    <th>
                      {t(
                        locale,
                        ["你得到什么", "系统运营", "适合谁"][i],
                        ["What you get", "Operations", "Best for"][i],
                      )}
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
            eyebrow={t(
              locale,
              "项目流程",
              "PROJECT PROCESS",
            )}
            title={t(
              locale,
              "从需求评估到上线维护",
              "Assessment, development and ongoing support",
            )}
          />
          <div className="process-list">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i}>
                <span>0{i + 1}</span>
                <h3>
                  {t(
                    locale,
                    [
                      "需求评估",
                      "价值评估",
                      "方案报价",
                      "开发与交付",
                      "上线维护与迭代",
                    ][i],
                    [
                      "Assess requirements",
                      "Estimate costs and benefits",
                      "Propose",
                      "Build & deliver",
                      "Maintain and update",
                    ][i],
                  )}
                </h3>
                <p>
                  {t(
                    locale,
                    [
                      "梳理目标、流程与数据，一周内给出评估结论。",
                      "估算人工、外包与返工成本，比较预期收益，确定开发顺序。",
                      "确认项目范围、合作方式、验收标准与报价。",
                      "按约定节奏交付工具、工作流或批量成果。",
                      "处理使用反馈与故障，按约定更新资料和功能。",
                    ][i],
                    [
                      "Review goals, workflows and data, with an assessment within one week.",
                      "Estimate current costs and expected benefits to prioritize development.",
                      "Agree scope, engagement, acceptance criteria and price.",
                      "Deliver working tools, workflows or batch results on the agreed schedule.",
                      "Address user feedback and faults, and update sources and features as agreed.",
                    ][i],
                  )}
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
            <Eyebrow>{t(locale, "常见问题", "COMMON QUESTIONS")}</Eyebrow>
            <h2>{t(locale, "开始之前，\n你可能想知道", "Before we begin")}</h2>
          </div>
          <FAQ items={faq} />
        </div>
      </section>
    </>
  );
}
export function About({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={t(locale, "关于 CYANO", "ABOUT CYANO")}
        title={text("D.7", "使命句", locale)}
        compact
      />
      <section className="section">
        <div className="container">
          <div className="about-intro">
            <div>
              <Eyebrow>
                {t(locale, "团队背景", "OUR BACKGROUND")}
              </Eyebrow>
              <h2>
                {t(
                  locale,
                  "模型研发与企业软件经验",
                  "AI research and\nenterprise software experience",
                )}
              </h2>
              <p>{text("D.7", "我们是谁 1", locale)}</p>
              <p>{text("D.7", "我们是谁 2", locale)}</p>
            </div>
            <div className="about-illustration">
              <img
                src="/art/team.webp"
                alt={t(
                  locale,
                  "Cyano 四位创始人讨论业务工作流的插画",
                  "Illustration of the four Cyano founders discussing a business workflow",
                )}
                width="1536"
                height="1024"
              />
            </div>
          </div>
          <Stats locale={locale} />
        </div>
      </section>
      <section className="section mist">
        <div className="container">
          <SectionTitle
            eyebrow={t(locale, "创始团队", "FOUNDERS")}
            title={text("D.7", "创始团队标题", locale)}
          />
          <Team locale={locale} full />
        </div>
      </section>
      <section className="section dark name-story">
        <div className="container editorial-split">
          <Eyebrow light>{text("D.7", "名字的由来标题", locale)}</Eyebrow>
          <div>
            <h2>
              {t(
                locale,
                "按你的资料与流程，\n设计合适的系统。",
                "Designed around\nyour sources and process.",
              )}
            </h2>
            <p>
              {t(
                locale,
                "销售咨询需要产品参数与项目记录；标书生成需要模板、引用和审核要求；数据查询需要明确指标与访问权限。我们根据每类工作的条件设计系统，并在上线后维护。",
                "Sales inquiries need specifications and project records. Proposals need templates, sources and review criteria. Data queries need agreed metrics and access controls. We design for those requirements and maintain the system after launch.",
              )}
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow={t(locale, "我们的原则", "OUR PRINCIPLES")}
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
export function Contact({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={t(locale, "让我们开始", "LET’S TALK")}
        title={text("D.8", "Hero 标题", locale)}
        intro={text("D.8", "Hero 导语", locale)}
        compact
      />
      <section className="section contact-section">
        <div className="container contact-layout">
          <aside>
            <Eyebrow>
              {t(locale, "可以咨询的内容", "TOPICS TO DISCUSS")}
            </Eyebrow>
            <h2>
              {t(
                locale,
                "需求、案例\n或技术问题",
                "Requirements, projects\nor technical questions",
              )}
            </h2>
            <div className="contact-starts">
              {[1, 2, 3].map((i) => {
                const [head, ...tail] = text("D.8", "起点 " + i, locale).split(
                  locale === "zh" ? " —— " : " — ",
                );
                return (
                  <div key={i}>
                    <span>0{i}</span>
                    <div>
                      <h3>{head}</h3>
                      <p>{tail.join(" — ")}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="contact-person">
              <div className="contact-avatar">
                <img
                  src="/art/team.webp"
                  alt={t(
                    locale,
                    "产品与解决方案负责人插画",
                    "Head of Product & Solutions illustration",
                  )}
                  width="1536"
                  height="1024"
                />
              </div>
              <div>
                <h3>
                  {t(
                    locale,
                    "咨询回复",
                    "Your inquiry",
                  )}
                </h3>
                <p>{text("D.8", "谁会回复你", locale)}</p>
              </div>
            </div>
            <div className="next-steps">
              <h3>{t(locale, "接下来会发生什么", "What happens next")}</h3>
              {[1, 2, 3].map((i) => (
                <p key={i}>
                  <span>{i}</span>
                  {text("D.8", "接下来 " + i, locale)}
                </p>
              ))}
            </div>
          </aside>
          <div id="form">
            <ContactForm locale={locale} />
          </div>
        </div>
      </section>
    </>
  );
}
export function Insights({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={t(locale, "洞察", "INSIGHTS")}
        title={t(
          locale,
          "企业 AI 项目的\n设计与实施经验",
          "Notes on designing\nand implementing AI",
        )}
        intro={t(
          locale,
          "介绍知识库建设、文档生成流程，以及定制、试点与托管服务的选择。",
          "Guides to knowledge systems, document generation and choosing between a custom build, pilot or managed service.",
        )}
        compact
      />
      <section className="section">
        <div className="container">
          <InsightCards locale={locale} />
        </div>
      </section>
    </>
  );
}
export function Article({ locale, slug }: { locale: Locale; slug: string }) {
  const a = insights(locale).find((i) => i.slug === slug)!;
  const blocks = (
    articles as Record<string, Record<Locale, { q: string; a: string }[]>>
  )[slug][locale];
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={a.category}
        title={a.title}
        art={a.image}
        compact
      />
      <section className="section article-section">
        <div className="container article-layout">
          <aside className="article-sidebar">
            <span>{a.date}</span>
            <h3>{a.author.role}</h3>
            <p>{t(locale, "Cyano 创始团队", "Cyano founding team")}</p>
            <CopyLink locale={locale} />
            <div className="article-toc">
              <h4>{t(locale, "本文内容", "IN THIS ARTICLE")}</h4>
              {blocks.map((b, i) => (
                <a href={"#part-" + i} key={i}>
                  {b.q}
                </a>
              ))}
            </div>
          </aside>
          <article className="article-body">
            {blocks.map((b, i) => (
              <section id={"part-" + i} key={i}>
                <h2>{b.q}</h2>
                {b.a.split("\n\n").map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </section>
            ))}
            <div className="article-end">
              <h3>
                {t(
                  locale,
                  "讨论类似的项目需求",
                  "Discuss a similar project",
                )}
              </h3>
              <p>
                {t(
                  locale,
                  "可以带着现有流程和工作样本，与我们讨论范围、成本和实施条件。",
                  "Bring your current process and a work sample to discuss scope, costs and implementation requirements.",
                )}
              </p>
              <Button locale={locale}>{text("D.1", "主按钮", locale)}</Button>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
export function Legal({
  locale,
  type,
}: {
  locale: Locale;
  type: "privacy" | "terms";
}) {
  const privacy = type === "privacy";
  const zh = privacy
    ? [
        [
          "我们收集的信息",
          "当你提交咨询时，我们收集你主动提供的姓名、公司、职位、工作邮箱、电话或微信、业务场景与启动时间。网站可能收集不跨站追踪的访问统计数据。",
        ],
        [
          "我们如何使用信息",
          "信息用于回复咨询、提供你所请求的资料、沟通项目需求及改进网站体验。我们不出售你的个人信息。",
        ],
        [
          "存储与处理",
          "信息由 Cyano 及其委托的云服务与邮件服务商存储和处理，可能涉及跨境传输。我们采取加密传输与访问控制等措施保护数据。",
        ],
        [
          "保留期限与用户权利",
          "咨询信息通常保留不超过 24 个月，或在你要求删除时提前删除。你可以通过联系表单申请查询、更正、删除个人信息或撤回同意。",
        ],
        [
          "Cookie 与统计",
          "我们不使用跨站广告追踪 Cookie。语言偏好可能存储在你的浏览器中；你可以随时清除。",
        ],
        [
          "联系与更新",
          "如有关于信息处理的疑问，请通过联系表单与 Cyano（澜屿智创）沟通。本政策更新时将在此页面公布。",
        ],
      ]
    : [
        [
          "网站内容",
          "本网站用于介绍 Cyano 的能力、服务与项目。内容仅供参考，不构成合同承诺；具体服务范围、交付标准与价格以双方协议为准。",
        ],
        [
          "知识产权",
          "网站的文字、设计、品牌资产与相关内容由 Cyano 或相应权利人拥有。未经许可，不得复制或将其用于商业用途。",
        ],
        [
          "合理使用与免责声明",
          "请勿尝试破坏网站、绕过安全措施或通过表单发送违法内容。我们努力保持信息准确，但不保证所有信息始终完整或最新。",
        ],
        [
          "外部链接",
          "网站可能链接到第三方服务或项目体验页面。相应页面由其运营者管理，适用其自身的条款与隐私政策。",
        ],
        [
          "适用法律与变更",
          "本条款依据适用法律解释。我们可能随服务变化更新条款，更新后的内容在此页面公布。",
        ],
        ["联系我们", "如对网站或条款有疑问，请通过联系表单与我们沟通。"],
      ];
  const en = privacy
    ? [
        [
          "Information we collect",
          "When you submit an inquiry, we collect the details you provide: name, company, role, work email, phone or WeChat, use case and preferred start. We may collect site analytics that do not track you across websites.",
        ],
        [
          "How we use information",
          "We use your information to answer inquiries, supply requested materials, discuss project needs and improve the website. We do not sell personal information.",
        ],
        [
          "Storage and processing",
          "Cyano and its cloud and email service providers store and process information. This may involve cross-border transfers. We use encrypted transmission and access controls to protect data.",
        ],
        [
          "Retention and your rights",
          "Inquiry information is generally retained for no more than 24 months, or deleted earlier on request. Use our contact form to request access, correction, deletion or withdrawal of consent.",
        ],
        [
          "Cookies and analytics",
          "We do not use cross-site advertising cookies. Language preferences may be stored in your browser, which you can clear at any time.",
        ],
        [
          "Contact and updates",
          "For questions about information handling, contact Cyano through the inquiry form. Policy updates will appear on this page.",
        ],
      ]
    : [
        [
          "Website information",
          "This website describes Cyano’s capabilities, services and projects. Information is provided for reference and is not a contractual commitment. Scope, delivery requirements and pricing are governed by the parties’ agreement.",
        ],
        [
          "Intellectual property",
          "Text, designs, brand assets and related content belong to Cyano or their respective owners. Commercial copying or reuse requires permission.",
        ],
        [
          "Acceptable use and disclaimers",
          "Do not disrupt the website, bypass security or submit unlawful content. We aim for accuracy but do not warrant that all information is complete or current at all times.",
        ],
        [
          "External links",
          "We may link to third-party services and project experiences. Their operators control those sites, which have their own terms and privacy policies.",
        ],
        [
          "Applicable law and changes",
          "These terms are interpreted under applicable law. We may update them as services change; updates will be published here.",
        ],
        [
          "Contact",
          "Please use the contact form for questions about this website or these terms.",
        ],
      ];
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow="CYANO"
        title={t(
          locale,
          privacy ? "隐私政策" : "使用条款",
          privacy ? "Privacy Policy" : "Terms of Use",
        )}
        compact
      />
      <section className="section">
        <article className="legal-content">
          <p className="article-meta">
            {t(
              locale,
              "更新日期：2026 年 11 月 12 日",
              "Updated November 12, 2026",
            )}
          </p>
          {(locale === "zh" ? zh : en).map(([h, p]) => (
            <section key={h}>
              <h2>{h}</h2>
              <p>{p}</p>
            </section>
          ))}
          <Link className="text-link" href={href(locale, "/contact#form")}>
            {t(locale, "联系我们", "Contact us")}
            <ArrowUpRight size={17} />
          </Link>
        </article>
      </section>
    </>
  );
}
export function Missing({ locale }: { locale: Locale }) {
  return (
    <PageHero
      locale={locale}
      eyebrow="404"
      title={text("D.9", "标题", locale)}
      intro={text("D.9", "正文", locale)}
    >
      <Button to={href(locale)}>{t(locale, "返回首页", "Back to home")}</Button>
      <Button secondary to={href(locale, "/cases")}>
        {t(locale, "查看案例", "See our work")}
      </Button>
    </PageHero>
  );
}
