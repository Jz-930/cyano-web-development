import {Picture} from "./Picture";
import {CountValue} from "./CountValue";
import {EngineeringDiagram} from "./EngineeringDiagram";
import { LightField } from "./LightField";
import { Phrase } from "@/components/v4/Phrase";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Factory,
  BriefcaseBusiness,
  Building2,
  Boxes,
  BookOpen,
  PenTool,
  Layers3,
  ShieldCheck,
  Workflow,
  Database,
  MessagesSquare,
  FileText,
  Network,
  ChartNoAxesCombined,
} from "lucide-react";
import {
  Locale,
  t,
  href,
  text,
  CaseStudy,
  founders,
  insights,
  solutions,
} from "@/lib/content-v4";
import availability from "@/content/v1/availability.json";
export const Arrow = ({ diagonal = false }: { diagonal?: boolean }) =>
  diagonal ? <ArrowUpRight size={18} /> : <ArrowRight size={18} />;
export function Button({
  children,
  to,
  secondary = false,
  locale = "zh",
  className = "",
}: {
  children: React.ReactNode;
  to?: string;
  secondary?: boolean;
  locale?: Locale;
  className?: string;
}) {
  return (
    <Link
      className={`button ${secondary ? "button-outline" : ""} ${className}`}
      href={to || href(locale, "/contact#form")}
    >
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
export function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div className={`eyebrow ${light ? "eyebrow-light" : ""}`}>
      <span />
      {children}
    </div>
  );
}
export function SectionTitle({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2><Phrase text={title} /></h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}
export function Logo() {
  return (
    <span className="brand">
      <img src="/logo.png" width="32" height="32" alt="" />
      <span>CYANO</span>
    </span>
  );
}
export const industryIcons = [
  Factory,
  BriefcaseBusiness,
  Building2,
  Boxes,
  BookOpen,
  PenTool,
];
export const solutionIcons = [
  MessagesSquare,
  FileText,
  Network,
  ChartNoAxesCombined,
];
export function Stats({
  locale,
  compact = false,
}: {
  locale: Locale;
  compact?: boolean;
}) {
  return (
    <div className={`stats-grid ${compact ? "compact" : ""}`}>
      {["6+", "100%", "100%", "6"].map((v, i) => (
        <div className="stat" key={i}>
          <div className="stat-value">
            <CountValue value={v}/>
            <span>
              {i === 0
                ? t(locale, "年", "years")
                : i === 3
                  ? t(locale, "个", "industries")
                  : ""}
            </span>
          </div>
          <p>
            {t(
              locale,
              [
                "每位核心成员的最低开发经验",
                "核心成员拥有 AI 模型研发经验",
                "核心成员拥有世界 500 强企业工作经历",
                "已服务行业",
              ][i],
              [
                "Minimum engineering experience",
                "Hands-on AI model R&D",
                "Fortune Global 500 experience",
                "Industries in production",
              ][i],
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
export function DemoLink({
  item,
  locale,
}: {
  item: CaseStudy;
  locale: Locale;
}) {
  const ok = availability.demos[item.slug as keyof typeof availability.demos];
  return item.demo && ok ? (
    <a
      href={item.demo}
      target="_blank"
      rel="noopener noreferrer"
      className="text-link"
    >
      {text("D.1", "在线 Demo 按钮", locale)}
    </a>
  ) : null;
}
export function CaseCard({
  item,
  locale,
  featured = false,
}: {
  item: CaseStudy;
  locale: Locale;
  featured?: boolean;
}) {
  return (
    <article className={`case-card ${featured ? "case-featured" : ""}`}>
      <Link
        href={href(locale, "/cases/" + item.slug)}
        className={`case-visual visual-${item.index}`}
        aria-label={item.title}
      >
        <div className="case-visual-top">
          <span>{item.system}</span>
          <ArrowUpRight size={21} />
        </div>
        <div className="browser-frame">
          <div className="browser-chrome">
            <i />
            <i />
            <i />
            <span>{item.system}</span>
          </div>
          <Picture src={item.images[item.main]} alt={item.system}/>
        </div>
        <div className="case-visual-footer">
          <span>{text("D.1", "“客户项目”标签", locale)}</span>
        </div>
      </Link>
      <div className="case-meta">
        <span className="tag">{item.industry}</span>
        <span className="case-result">
          {item.stats[0].value}
          <small>{item.stats[0].label}</small>
        </span>
      </div>
      <h3>
        <Link href={href(locale, "/cases/" + item.slug)}>{item.title}</Link>
      </h3>
      <p>{item.profile}</p>
      <div className="case-links">
        <Link className="text-link" href={href(locale, "/cases/" + item.slug)}>
          {t(locale, "阅读案例", "Read case study")}
          <Arrow />
        </Link>
        <DemoLink item={item} locale={locale} />
      </div>
    </article>
  );
}
export function Team({
  locale,
  full = false,
}: {
  locale: Locale;
  full?: boolean;
}) {
  return (
    <div className="team-grid">
      {founders(locale).map((f, i) => (
        <article key={f.id} className="team-card">
          <div className={`portrait portrait-${i}`}>
            <Picture src={`/v3-materials/founder-${i + 1}.webp`} alt={t(
                locale,
                `Cyano ${f.role}插画形象`,
                `Illustrated Cyano ${f.role}`,
              )}/>
            <span className="portrait-number">0{i + 1}</span>
          </div>
          <h3>{f.role}</h3>
          <p className="team-tags">{f.tags}</p>
          {full && <p className="team-bio">{f.bio}</p>}
        </article>
      ))}
    </div>
  );
}
export function InsightCards({ locale }: { locale: Locale }) {
  return (
    <div className="insight-grid">
      {insights(locale).map((a, i) => (
        <article className="insight-card" key={a.slug}>
          <Link
            href={href(locale, "/insights/" + a.slug)}
            className={`insight-image insight-${i}`}
            aria-label={a.title}
          >
            <EngineeringDiagram variant={i+2}/>
            <span className="tag">{a.category}</span>
            <span className="circle-link">
              <Arrow diagonal />
            </span>
          </Link>
          <div className="article-meta">
            <span>{a.date.replaceAll("-", ".")}</span>
            <span>{a.author.role}</span>
          </div>
          <h3>
            <Link href={href(locale, "/insights/" + a.slug)}>{a.title}</Link>
          </h3>
        </article>
      ))}
    </div>
  );
}
export function WorkflowDiagram({ locale }: { locale: Locale }) {
  return (
    <div className="workflow-diagram">
      {[Database, Network, ShieldCheck, Layers3].map((Icon, i) => (
        <div key={i} className="workflow-step">
          <span className="step-no">0{i + 1}</span>
          <Icon size={28} strokeWidth={1.3} />
          <h3>
            {t(
              locale,
              [
                "接入资料",
                "检索与生成",
                "校验与人工复核",
                "交付结果",
              ][i],
              [
                "Connect sources",
                "Retrieve & generate",
                "Validate & review",
                "Deliver results",
              ][i],
            )}
          </h3>
          <p>
            {t(
              locale,
              [
                "资料、数据库与现有系统",
                "检索、编排与任务处理",
                "引用、规则与权限检查",
                "查看、编辑或导出结果",
              ][i],
              [
                "Documents, databases, systems",
                "Retrieval, orchestration, tasks",
                "Sources, rules, permissions",
                "View, edit or export results",
              ][i],
            )}
          </p>
          {i < 3 && <ArrowRight className="step-arrow" size={20} />}
        </div>
      ))}
    </div>
  );
}
export function ClosingCta({ locale }: { locale: Locale }) {
  return (
    <section className="closing dark">
      <LightField strength="closing" />
      <div className="wrap closing-inner">
        <div>
          <Eyebrow light>
            {t(locale, "项目咨询", "CONTACT US")}
          </Eyebrow>
          <h2><Phrase text={text("D.1", "收尾 CTA 口号", locale)} locale={locale} /></h2>
          <p>{text("D.1", "收尾 CTA 副句", locale)}</p>
        </div>
        <Button locale={locale}>{text("D.1", "主按钮", locale)}</Button>
      </div>
    </section>
  );
}
export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="footer dark">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href={href(locale)} aria-label="Cyano">
              <Logo />
            </Link>
            <p>{text("D.1", "页脚定位句", locale)}</p>
            <span>{text("D.1", "页脚服务地区", locale)}</span>
          </div>
          <div>
            <h3>{t(locale, "解决方案", "Solutions")}</h3>
            {solutions(locale).map((s) => (
              <Link key={s.slug} href={href(locale, "/services/" + s.slug)}>
                {s.name}
              </Link>
            ))}
          </div>
          <div>
            <h3>{t(locale, "公司", "Company")}</h3>
            {["about", "cases", "technology", "engagement", "insights"].map(
              (p, i) => (
                <Link key={p} href={href(locale, "/" + p)}>
                  {t(
                    locale,
                    ["关于我们", "案例", "方法与技术", "合作方式", "洞察"][i],
                    [
                      "About",
                      "Case studies",
                      "Technology",
                      "How we work",
                      "Insights",
                    ][i],
                  )}
                </Link>
              ),
            )}
          </div>
          <div>
            <h3>{t(locale, "联系", "Contact")}</h3>
            <Link href={href(locale, "/contact#form")}>
              {text("D.1", "主按钮", locale)} ↗
            </Link>
            {availability.email && (
              <a href="mailto:hello@cyano.app">hello@cyano.app</a>
            )}
            <span className="footer-location">
              <span className="status-dot" />
              {t(
                locale,
                "中国 · 北美 · 全球远程交付",
                "China · North America · Worldwide",
              )}
            </span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            {t(
              locale,
              "© 2026 Cyano Intelligence · 澜屿智创 版权所有",
              "© 2026 Cyano Intelligence. All rights reserved.",
            )}
          </span>
          <div>
            <Link href={href(locale, "/privacy")}>
              {t(locale, "隐私政策", "Privacy Policy")}
            </Link>
            <Link href={href(locale, "/terms")}>
              {t(locale, "使用条款", "Terms of Use")}
            </Link>
            <span>CYANO INTELLIGENCE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
