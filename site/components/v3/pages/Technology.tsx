import pageCopy from "@/content/v3/pages/Technology.json";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Network, Workflow, Check, Database } from "lucide-react";
import { Locale, t, href, text } from "@/lib/v1-content";
import { Button, Eyebrow, SectionTitle } from "../ui";
import copy from "@/content/v1/copy.json";
import { LatencyChart } from "../LatencyChart";
import { PageHero } from "./PageHero";

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
          {pageCopy.cc13c665d68[locale]}
        </Button>
      </PageHero>
      <section className="section">
        <div className="container">
          <div className="editorial-split">
            <Eyebrow>
              {pageCopy.c6ba0963fc8[locale]}
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
            eyebrow={pageCopy.c60db7c1969[locale]}
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
          <LatencyChart locale={locale} />
          <div className="memory-layers">
            {[100, 75, 40, 15].map((v, i) => (
              <div key={v}>
                <span>
                  {pageCopy.c9a04516c09[locale][i]}
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
                  {pageCopy.c253678ad09[locale][i]}
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
            eyebrow={pageCopy.ce86d62dc6f[locale]}
            title={text("D.6", "兼容区标题", locale)}
          />
          <div className="integration-tags">
            {[
              "OpenAI GPT",
              "Anthropic Claude",
              "Google Gemini",
              "DeepSeek",
              pageCopy.c82e27d8604[locale],
              "Llama",
              "MySQL",
              "PostgreSQL",
              pageCopy.c279540dd01[locale],
              pageCopy.cd1f6713db3[locale],
              pageCopy.c7b722df55d[locale],
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
                {pageCopy.cd82b0e00a7[locale]}
              </p>
            </div>
            <Link
              href={href(locale, "/contact#form")}
              aria-label={pageCopy.cb7049dd516[locale]}
            >
              <ArrowUpRight size={28} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
