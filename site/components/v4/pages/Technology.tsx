import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import pageCopy from "@/content/v4/pages/Technology.json";
import {
  copy,
  copyIfApproved,
  href,
  t,
  text,
  type Locale,
} from "@/lib/content-v4";
import { CitationPeek } from "../CitationPeek";
import { ContextPacker } from "../ContextPacker";
import { ConvergeWindow } from "../ConvergeWindow";
import { CoreArch } from "../CoreArch";
import { PageHero } from "../PageHero";
import { Phrase } from "../Phrase";
import { renderBold } from "../richText";

function parseCompareRows(
  raw: string,
  locale: Locale,
): Array<{ dim: string; before: string; after: string }> {
  const rowSep = locale === "zh" ? "；" : "; ";
  const colSep = locale === "zh" ? "：" : ": ";
  return raw
    .split(rowSep)
    .map((line) => {
      const cIdx = line.indexOf(colSep);
      if (cIdx < 0) return null;
      const dim = line.slice(0, cIdx).trim();
      const rest = line.slice(cIdx + colSep.length);
      const [before, after] = rest.split(" → ").map((s) => s.trim());
      if (!before || !after) return null;
      return { dim, before, after };
    })
    .filter(
      (r): r is { dim: string; before: string; after: string } => r !== null,
    );
}

export function Technology({ locale }: { locale: Locale }) {
  const sep = locale === "zh" ? " —— " : " — ";
  const navTech = text("D.1", "主导航", locale).split(" · ")[2];

  const coreLayers = ([1, 2, 3, 4] as const).map((n) => {
    const [name, ...rest] = text("D.6", `第 ${n} 层`, locale).split(sep);
    return {
      indexLabel: `0${n}`,
      name: name.trim(),
      desc: rest.join(sep).trim(),
    };
  });

  const challenges = ([1, 2, 3] as const).map((n) => {
    const [title, ...rest] = text("D.6", `难题 ${n}`, locale).split(sep);
    return {
      indexLabel: `0${n}`,
      title: title.trim(),
      desc: rest.join(sep).trim(),
    };
  });

  const benchIds = ["core-200ms", "core-100", "core-40"] as const;
  const benchmarks = ([1, 2, 3] as const).map((n, idx) => {
    const [val, ...rest] = text("D.6", `指标 ${n}`, locale).split(sep);
    return {
      citeId: benchIds[idx],
      value: val.trim(),
      label: rest.join(sep).trim(),
    };
  });

  const compareRows = parseCompareRows(text("D.6", "对比表行", locale), locale);
  const colBefore = copyIfApproved("T-3h1", locale) ?? t(locale, "过去", "Before");
  const colAfter =
    copyIfApproved("T-3h2", locale) ?? t(locale, "现在", "With Cyano Core");
  const neqItems = (["T-2.1", "T-2.2", "T-2.3"] as const)
    .map((id) => copyIfApproved(id, locale))
    .filter((v): v is string => Boolean(v));

  const models = [
    "OpenAI GPT",
    "Anthropic Claude",
    "Google Gemini",
    "DeepSeek",
    pageCopy.qwen[locale],
    "Llama",
  ];

  const systems = [
    "MySQL",
    "PostgreSQL",
    pageCopy.lark[locale],
    pageCopy.dingtalk[locale],
    pageCopy.wecom[locale],
    "SharePoint",
    "Confluence",
    "ERP / CRM",
    "PDF / Office",
  ];

  const securityQ = copyIfApproved("T-4q", locale);
  const securityA = copyIfApproved("D-20", locale);

  return (
    <>
      <PageHero
        locale={locale}
        live
        preset="converge"
        intro
        focusSelector=".converge-window"
        className="tech-hero"
        crumbLabel={navTech}
        eyebrow="CYANO CORE"
        title={copy("T-1", locale)}
        lede={copy("T-1s", locale)}
        footNote={text("D.1", "技术页脚注", locale)}
        overlay={<div className="line-grid tech-hero-grid" aria-hidden="true" />}
        actions={
          <Link className="button" href={href(locale, "/contact#form")}>
            {pageCopy.talk_to_our_cto[locale]}
          </Link>
        }
        visual={<ConvergeWindow layers={coreLayers.map((l) => l.name)} />}
      />

      {/* Section 2: Cyano Core 4-layer architecture (K-09 + S2) */}
      <section className="paper tech-arch-section" data-header="paper">
        <div className="wrap">
          <div className="tech-arch-head" data-reveal="">
            <p className="eyebrow">{pageCopy.platform_functions[locale]}</p>
            <h2 className="h2">
              <Phrase text="Cyano Core" locale={locale} />
            </h2>
            <p className="tech-arch-lead">
              {text("D.6", "Cyano Core 定义", locale)}
            </p>
          </div>

          <CoreArch layers={coreLayers} />
        </div>
      </section>

      {/* Section 3: Context engineering + S3 ContextPacker + Benchmarks */}
      <section
        className="dark halo-panel tech-context-section"
        data-header="dark"
      >
        <div className="wrap">
          <div className="tech-sec-head" data-reveal="">
            <p className="eyebrow on-dark">
              {pageCopy.context_engineering[locale]}
            </p>
            <h2 className="h2">
              <Phrase
                text={text("D.6", "估值引擎标题", locale)}
                locale={locale}
              />
            </h2>
          </div>

          <div className="tech-challenges-grid">
            {challenges.map((ch, idx) => (
              <article
                key={ch.indexLabel}
                className="mk-panel tech-challenge-card"
                data-reveal=""
                style={{ "--i": idx } as React.CSSProperties}
              >
                <span className="label">{ch.indexLabel}</span>
                <h3 className="h3">{ch.title}</h3>
                <p>{ch.desc}</p>
              </article>
            ))}
          </div>

          <ContextPacker locale={locale} />

          {/* Context window 4-segment profile bar (zero percentages printed) */}
          <div className="tech-profile-block" data-reveal="">
            <div className="tech-profile-bar" aria-hidden="true">
              <i className="seg-0" />
              <i className="seg-1" />
              <i className="seg-2" />
              <i className="seg-3" />
            </div>
            <ul className="tech-profile-legend">
              {pageCopy.core_instructions_preserved[locale].map((lbl, idx) => (
                <li key={lbl}>
                  <span className={`tech-legend-dot seg-${idx}`} aria-hidden="true" />
                  <span>{lbl}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="tech-stats">
            {benchmarks.map((b, idx) => (
              <div
                key={b.citeId}
                className="tech-stat-cell"
                data-reveal=""
                style={{ "--i": idx } as React.CSSProperties}
              >
                <CitationPeek
                  id={b.citeId}
                  locale={locale}
                  className="tech-stat-cite"
                >
                  <span className="figure glow-number tech-stat-figure">
                    {b.value}
                  </span>
                </CitationPeek>
                <p className="tech-stat-label">{b.label}</p>
              </div>
            ))}
          </div>

          <p className="small tech-bench-note">
            {text("D.1", "技术页脚注", locale)}
          </p>
        </div>
      </section>

      {/* Section 4: Unified management comparison table + inequalities */}
      <section className="paper tech-compare-section" data-header="paper">
        <div className="wrap">
          <div className="tech-sec-head" data-reveal="">
            <h2 className="h2">
              <Phrase
                text={text("D.6", "对比表标题", locale)}
                locale={locale}
              />
            </h2>
          </div>

          <div className="compare-scroll" data-reveal="">
            <table className="compare-table tech-compare-table">
              <thead>
                <tr>
                  <th scope="col">
                    {copyIfApproved("H-4r0", locale) ? (
                      <span className="sr-only">
                        {copyIfApproved("H-4r0", locale)}
                      </span>
                    ) : null}
                  </th>
                  <th scope="col">{colBefore}</th>
                  <th scope="col" className="is-us">
                    {colAfter}
                  </th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((r) => (
                  <tr key={r.dim}>
                    <th scope="row">{r.dim}</th>
                    <td>{r.before}</td>
                    <td className="is-us">{r.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {neqItems.length > 0 ? (
            <ul className="neq-list tech-neq-list" data-reveal="">
              {neqItems.map((item) => (
                <li key={item}>{renderBold(item)}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <div className="wrap">
        <hr className="rule-dot" />
      </div>

      {/* Section 5: Supported models & systems */}
      <section className="paper tech-compat-section" data-header="paper">
        <div className="wrap">
          <div className="tech-sec-head" data-reveal="">
            <p className="eyebrow">{pageCopy.designed_to_connect[locale]}</p>
            <h2 className="h2">
              <Phrase
                text={text("D.6", "兼容区标题", locale)}
                locale={locale}
              />
            </h2>
          </div>

          <div className="tech-compat-groups" data-reveal="">
            <div className="tech-compat-row">
              <span className="label">
                {t(locale, "模型", "Models")}
              </span>
              <div className="tech-tag-wall">
                {models.map((m) => (
                  <span key={m} className="tag">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="tech-compat-row">
              <span className="label">
                {t(locale, "系统", "System")}
              </span>
              <div className="tech-tag-wall">
                {systems.map((s) => (
                  <span key={s} className="tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Security & governance */}
      <section className="paper-2 tech-security-section" data-header="paper">
        <div className="wrap">
          <div className="card tech-security-card" data-reveal="">
            <div className="tech-security-head">
              <span className="tech-security-icon" aria-hidden="true">
                <ShieldCheck size={32} strokeWidth={1.5} />
              </span>
              <div>
                <h2 className="h2">
                  <Phrase
                    text={text("D.6", "安全区标题", locale)}
                    locale={locale}
                  />
                </h2>
                <p className="tech-security-desc">
                  {pageCopy.the_system_includes_access[locale]}
                </p>
              </div>
            </div>

            {securityQ && securityA ? (
              <div className="tech-security-qa">
                <h3 className="h3">{securityQ}</h3>
                <p>{securityA}</p>
              </div>
            ) : null}

            <div className="tech-security-foot">
              <p className="conclusion">{text("D.6", "收尾", locale)}</p>
              <Link className="button" href={href(locale, "/contact#form")}>
                {pageCopy.discuss_data_security_and[locale]}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
