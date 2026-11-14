import pageCopy from "@/content/v4/pages/Technology.json";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Network, Workflow, Check, Database } from "lucide-react";
import { Locale, t, href, text } from "@/lib/content-v4";
import { Button, Eyebrow, SectionTitle } from "../ui";
import copy from "@/content/v1/copy.json";
import { PageHero } from "./PageHero";
import { Phrase } from "@/components/v4/Phrase";

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
          {pageCopy.talk_to_our_cto[locale]}
        </Button>
      </PageHero>
      <section className="section">
        <div className="wrap">
          <div className="editorial-split">
            <Eyebrow>
              {pageCopy.platform_functions[locale]}
            </Eyebrow>
            <div>
              <h2><Phrase text="Cyano Core" locale={locale} /></h2>
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
        <div className="wrap">
          <SectionTitle
            eyebrow={pageCopy.context_engineering[locale]}
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
                  {pageCopy.core_instructions_preserved[locale][i]}
                </span>
                <div>
                  <i style={{ width: v + "%" }} />
                </div>
              </div>
            ))}
          </div>
          <div className="tech-stats">
            {["< 200ms", "100%", "40%"].map((v, i) => (
              <div key={v}>
                <strong>
                  {v}
                  <sup>*</sup>
                </strong>
                <p>
                  {pageCopy.response_latency[locale][i]}
                </p>
              </div>
            ))}
          </div>
          <p className="benchmark-note">{text("D.1", "技术页脚注", locale)}</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <SectionTitle
            eyebrow={pageCopy.designed_to_connect[locale]}
            title={text("D.6", "兼容区标题", locale)}
          />
          <div className="integration-tags">
            {[
              "OpenAI GPT",
              "Anthropic Claude",
              "Google Gemini",
              "DeepSeek",
              pageCopy.qwen[locale],
              "Llama",
              "MySQL",
              "PostgreSQL",
              pageCopy.lark[locale],
              pageCopy.dingtalk[locale],
              pageCopy.wecom[locale],
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
              <h2><Phrase text={text("D.6", "安全区标题", locale)} locale={locale} /></h2>
              <p>
                {pageCopy.the_system_includes_access[locale]}
              </p>
            </div>
            <Link
              href={href(locale, "/contact#form")}
              aria-label={pageCopy.discuss_data_security_and[locale]}
            >
              <ArrowUpRight size={28} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
