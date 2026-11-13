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
                将企业知识，
                <br />
                转化为可交付的
                <br />
                <span>AI 生产力</span>
                <span className="headline-period">。</span>
              </>
            ) : (
              <>
                Turn your company’s
                <br />
                knowledge into
                <br />
                <span>AI that ships.</span>
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
              "从真实业务出发，交付可用的 AI",
              "YOUR KNOWLEDGE. YOUR WORKFLOW. REAL RESULTS.",
            )}
          </div>
          <a href="#expertise" className="scroll-link">
            {t(locale, "向下探索", "SCROLL TO EXPLORE")}
            <ArrowDown size={14} />
          </a>
          <div className="visual-coordinate">
            CYANO / 01 — KNOWLEDGE IN MOTION
          </div>
        </div>
      </section>
      <section className="trust-section" id="expertise">
        <div className="container">
          <Stats locale={locale} />
          <div className="industry-strip">
            <span>{t(locale, "深耕真实业务", "BUILT FOR REAL BUSINESS")}</span>
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
                  少谈 AI 概念，
                  <br />
                  <span>多交付能用的系统。</span>
                </>
              ) : (
                <>
                  Less talk about AI.
                  <br />
                  <span>More AI that works.</span>
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
            eyebrow={t(locale, "从模型，到业务", "BEYOND THE MODEL")}
            title={text("D.2", "痛点区标题", locale)}
            description={t(
              locale,
              "模型提供能力。工程让能力进入真实业务。",
              "Models provide the capability. Engineering puts it to work.",
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
            eyebrow={t(locale, "合作方式", "BUILT AROUND YOU")}
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
              "与你一起交付的人",
              "THE PEOPLE BEHIND THE WORK",
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
              "关于 AI 落地，我们的思考",
              "Ideas grounded in delivery",
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
              ["买工具", "买使用权", "买结果"][i],
              ["OWN THE TOOL", "PROVE THE VALUE", "BUY THE OUTCOME"][i],
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
                "目标清晰、使用频率高，希望把 AI 能力沉淀为自有系统。",
                "场景还在探索，希望先低成本验证价值，再持续迭代。",
                "更关心稳定产出，希望把任务交给专业团队持续交付。",
              ][i],
              [
                "For clear goals, frequent use and teams that want to own the capability.",
                "Prove value with a focused first version, then expand as it earns its place.",
                "Reliable outcomes, delivered continuously, without building your own AI team.",
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
                    ["过去做不了，现在能做", "已经在做，但成本太高"][i],
                    [
                      "New capabilities, now possible",
                      "Work you do today, at too high a cost",
                    ][i],
                  )}
                </h2>
                <p>
                  {t(
                    locale,
                    [
                      "把企业经验转化为随时可用的服务能力，让专业咨询、精准问答和个性化内容不再受人力限制。",
                      "从文档、查询、客服和运营中找到重复工作，把时间留给真正需要判断与创造的任务。",
                    ][i],
                    [
                      "Turn company expertise into always-available capabilities: expert advice, precise answers and personalized content.",
                      "Find repetitive work in documents, support, queries and operations. Reserve human time for judgment and creativity.",
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
            eyebrow={t(locale, "你的日常，我们理解", "THE CHALLENGE")}
            title={t(
              locale,
              "这些问题，是否正在发生？",
              "Does this sound familiar?",
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
              "把经验，变成可执行的工作流",
              "Turn expertise into a working system",
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
            eyebrow={t(locale, "已经交付的答案", "IN PRODUCTION")}
            title={t(locale, "看看它在真实业务中的表现", "See it at work")}
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
                    "可以。诊断阶段会确认数据来源、接口和权限，优先复用现有数据库、文档与业务系统。",
                    "Yes. Diagnosis covers data sources, interfaces and permissions, prioritizing the systems and documents you already use.",
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
              "从业务入口到交付结果，每一步都在同一套系统中完成。",
              "From the first question to a usable result, all in one system.",
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
            <Eyebrow>{t(locale, "挑战与转变", "THE TRANSFORMATION")}</Eyebrow>
            <div>
              <h2>
                {t(
                  locale,
                  "把复杂留给系统，把时间还给团队。",
                  "Let the system handle complexity. Give the team its time back.",
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
              "从企业资料，到业务结果",
              "From company knowledge to business results",
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
              {t(locale, "工程底座", "THE ENGINEERING FOUNDATION")}
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
                      "无损保留核心指令",
                      "结构化关键状态",
                      "剪枝推理链",
                      "只保留根因的日志",
                    ][i],
                    [
                      "Core instructions, preserved",
                      "Structured key states",
                      "Pruned reasoning chains",
                      "Root-cause logs only",
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
                  "权限控制、引用溯源、全链路日志审计与敏感信息拦截，从第一天就进入架构。支持 SaaS 托管与私有化部署。",
                  "Access controls, citations, audit trails and sensitive-data filtering are built into the architecture from day one. Available as SaaS or private deployment.",
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
                              "AI 工作流与人工审核的持续结果",
                            ],
                            [
                              "包含基础维护，可持续迭代",
                              "包含在持续服务中",
                              "由 Cyano 全面负责",
                            ],
                            [
                              "希望拥有长期能力的团队",
                              "希望先验证价值的团队",
                              "希望立即释放人力的团队",
                            ],
                          ][i][j],
                          [
                            [
                              "A complete system you own",
                              "A working version, expanded as needed",
                              "Ongoing AI outputs with human review",
                            ],
                            [
                              "Maintenance with ongoing iteration",
                              "Included in the service",
                              "Fully run by Cyano",
                            ],
                            [
                              "Teams building long-term capability",
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
              "从第一步，到长期合作",
              "FROM FIRST CONVERSATION TO LASTING VALUE",
            )}
            title={t(
              locale,
              "每一步，都有清晰的交付",
              "A clear deliverable at every step",
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
                      "业务诊断",
                      "价值评估",
                      "方案报价",
                      "开发与交付",
                      "上线维护与迭代",
                    ][i],
                    [
                      "Diagnose",
                      "Size the value",
                      "Propose",
                      "Build & deliver",
                      "Run & improve",
                    ][i],
                  )}
                </h3>
                <p>
                  {t(
                    locale,
                    [
                      "梳理目标、流程与数据，一周内给出诊断结论。",
                      "测算人工、外包与返工成本，明确投入回报与优先级。",
                      "确认范围边界、合作方式、验收标准与报价。",
                      "按约定节奏交付工具、工作流或批量成果。",
                      "追踪使用反馈，优化系统，持续迭代新需求。",
                    ][i],
                    [
                      "Map goals, workflows and data. Receive a diagnosis within one week.",
                      "Size current costs, expected return and priorities.",
                      "Agree scope, engagement, acceptance criteria and price.",
                      "Deliver working tools, workflows or batch results on the agreed schedule.",
                      "Monitor real use, improve reliability and iterate on new needs.",
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
            <Eyebrow>{t(locale, "常见问题", "GOOD QUESTIONS")}</Eyebrow>
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
                {t(locale, "工程师的思考，企业级的交付", "ENGINEERS AT HEART")}
              </Eyebrow>
              <h2>
                {t(
                  locale,
                  "懂模型，也懂业务。",
                  "We know models.\nAnd we know business.",
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
            eyebrow={t(locale, "共同创造，长期负责", "BUILT TOGETHER")}
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
                "从企业经验，\n到每天都能用的能力。",
                "Your expertise.\nWorking every day.",
              )}
            </h2>
            <p>
              {t(
                locale,
                "Cyano（澜屿智创）专注一件事：把企业已有的资料、经验和流程，转化为能被团队每天使用的 AI 系统。我们从具体问题出发，把数据、模型与业务规则连接起来，并对上线后的维护与迭代负责。",
                "Cyano turns the knowledge and workflows already inside your company into AI systems your team can use every day. We start with a concrete business problem, connect data, models and rules, and take responsibility for maintenance and improvement after launch.",
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
              {t(locale, "从这里开始", "A GOOD PLACE TO START")}
            </Eyebrow>
            <h2>
              {t(
                locale,
                "有问题，\n就值得聊一聊。",
                "A good question\nis a good beginning.",
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
                    "由资深顾问亲自回复",
                    "A senior consultant will reply",
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
          "从工程现场出发，\n把 AI 落地说清楚。",
          "Perspectives from\nthe work itself.",
        )}
        intro={t(
          locale,
          "关于企业知识、AI 工程与合作选择的具体思考。",
          "Practical perspectives on company knowledge, AI engineering and choosing the right engagement.",
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
                  "把思考带回你的业务。",
                  "Bring this back to your business.",
                )}
              </h3>
              <p>
                {t(
                  locale,
                  "从一次具体的业务诊断开始，判断下一步是否值得做。",
                  "Start with a business diagnosis and decide whether the next step is worth taking.",
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
