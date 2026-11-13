import {
  FileText,
  Database,
  ShieldCheck,
  ArrowRight,
  Check,
  Workflow,
  Network,
  ChartNoAxesCombined,
} from "lucide-react";
import Link from "next/link";
import { Locale, t, href, cases } from "@/lib/content";
export function BusinessHeroVisual({ locale }: { locale: Locale }) {
  const c = cases(locale)[1];
  return (
    <div className="business-hero-visual">
      <div className="business-visual-label">
        <span className="status-dot" />
        {t(
          locale,
          "已交付项目 · 智能标书与方案生成",
          "IN PRODUCTION · INTELLIGENT PROPOSAL BUILDER",
        )}
      </div>
      <div className="hero-workspace">
        <div className="workspace-chrome">
          <div>
            <i />
            <i />
            <i />
          </div>
          <span>
            {t(
              locale,
              "企业知识，进入实际工作。",
              "Company knowledge. Put to work.",
            )}
          </span>
          <ShieldCheck size={13} />
        </div>
        <Link
          href={href(locale, "/cases/proposal-generation")}
          aria-label={c.title}
        >
          <img
            src={c.images[0]}
            alt={t(
              locale,
              "智能标书系统真实界面：左侧知识问答，右侧生成方案草稿",
              "Actual proposal system: knowledge-assisted dialogue and generated proposal draft",
            )}
            width="1600"
            height="1000"
            fetchPriority="high"
          />
        </Link>
      </div>
      <div className="hero-evidence">
        <div className="evidence-icon">
          <FileText size={22} strokeWidth={1.3} />
        </div>
        <div>
          <span>
            {t(
              locale,
              "从企业资料，到方案初稿",
              "FROM COMPANY SOURCES TO A FIRST DRAFT",
            )}
          </span>
          <strong>
            {t(locale, "2 天", "2 days")}
            <ArrowRight size={21} />
            <em>{t(locale, "15 分钟", "15 min")}</em>
          </strong>
        </div>
        <span className="evidence-check">
          <Check size={17} />
        </span>
      </div>
      <div className="hero-pipeline">
        {[FileText, Network, ShieldCheck].map((Icon, i) => (
          <div key={i}>
            <Icon size={13} />
            <span>
              {t(
                locale,
                ["企业资料接入", "AI 工作流处理", "可审核的交付结果"][i],
                ["Your knowledge", "AI workflows", "Reviewable results"][i],
              )}
            </span>
            {i < 2 && <ArrowRight size={12} />}
          </div>
        ))}
      </div>
    </div>
  );
}
export function CoreVisual({ locale }: { locale: Locale }) {
  return (
    <div className="core-visual" aria-hidden="true">
      <div className="core-sources">
        {[FileText, Database, Workflow].map((Icon, i) => (
          <div key={i}>
            <Icon size={22} strokeWidth={1} />
            <span>{["DOCUMENTS", "DATA", "WORKFLOWS"][i]}</span>
          </div>
        ))}
      </div>
      <div className="core-connector">
        <i />
        <i />
        <i />
      </div>
      <div className="core-engine">
        <div className="core-engine-icon">
          <Network size={35} strokeWidth={1} />
        </div>
        <div>
          CYANO<span>CORE</span>
        </div>
        <p>{t(locale, "知识与任务编排", "KNOWLEDGE & TASK ORCHESTRATION")}</p>
      </div>
      <div className="core-output">
        <Check size={16} />
        <span>
          {t(
            locale,
            "可追溯 · 可审计 · 可交付",
            "TRACEABLE · AUDITABLE · DELIVERABLE",
          )}
        </span>
      </div>
    </div>
  );
}
