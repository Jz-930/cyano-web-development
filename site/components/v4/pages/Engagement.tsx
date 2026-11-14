import Link from "next/link";
import pageCopy from "@/content/v4/pages/Engagement.json";
import {
  copy,
  copyIfApproved,
  founderForStage,
  href,
  t,
  text,
  type Locale,
} from "@/lib/content-v4";
import { EngagementConfigurator } from "../EngagementConfigurator";
import { EngagementGantt } from "../EngagementGantt";
import { FAQ } from "../FAQ";
import { PageHero } from "../PageHero";
import { Phrase } from "../Phrase";
import { ProcessTimeline } from "../ProcessTimeline";

function SaasDeploySvg() {
  return (
    <svg
      viewBox="0 0 220 140"
      className="eng-deploy-svg [width:220px] [@media(max-width:720px)]:w-full [@media(max-width:720px)]:[max-width:240px] [height:140px] [border-radius:var(--r-card)]"
      aria-hidden="true"
      focusable="false"
    >
      {/* Cloud boundary */}
      <rect
        x="16"
        y="16"
        width="188"
        height="108"
        rx="16"
        fill="var(--p3)"
        stroke="var(--cyan-40)"
        strokeWidth="1.25"
        strokeDasharray="4 4"
      />
      {/* Isolated tenant box */}
      <rect
        x="42"
        y="36"
        width="136"
        height="68"
        rx="10"
        fill="var(--p2)"
        stroke="var(--brand)"
        strokeWidth="1.25"
      />
      <circle cx="64" cy="58" r="5" fill="var(--brand)" />
      <line
        x1="78"
        y1="58"
        x2="152"
        y2="58"
        stroke="var(--ink-20)"
        strokeWidth="2"
      />
      {/* Elastic scale bars */}
      {[0, 1, 2, 3].map((b) => (
        <rect
          key={b}
          x={60 + b * 26}
          y={84 - b * 4}
          width="16"
          height={8 + b * 4}
          rx="2"
          fill="var(--cyan-40)"
        />
      ))}
    </svg>
  );
}

function PrivateDeploySvg({ dockerLabel }: { dockerLabel: string }) {
  return (
    <svg
      viewBox="0 0 220 140"
      className="eng-deploy-svg [width:220px] [@media(max-width:720px)]:w-full [@media(max-width:720px)]:[max-width:240px] [height:140px] [border-radius:var(--r-card)]"
      aria-hidden="true"
      focusable="false"
    >
      {/* Private perimeter wall */}
      <rect
        x="16"
        y="16"
        width="188"
        height="108"
        rx="12"
        fill="var(--p2)"
        stroke="var(--ink-30)"
        strokeWidth="1.5"
      />
      {/* Server blades */}
      <rect
        x="34"
        y="34"
        width="68"
        height="72"
        rx="6"
        fill="var(--p0)"
        stroke="var(--line)"
      />
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <line
            x1="44"
            y1={50 + r * 20}
            x2="84"
            y2={50 + r * 20}
            stroke="var(--ink-20)"
            strokeWidth="2"
          />
          <circle cx="90" cy={50 + r * 20} r="2.5" fill="var(--brand)" />
        </g>
      ))}
      {/* Docker container module */}
      <rect
        x="116"
        y="44"
        width="72"
        height="52"
        rx="8"
        fill="var(--p3)"
        stroke="var(--cyan-40)"
        strokeWidth="1.25"
      />
      <text
        x="152"
        y="74"
        textAnchor="middle"
        fill="var(--link)"
        fontSize="12"
        fontFamily="var(--mono)"
        fontWeight="600"
      >
        {dockerLabel}
      </text>
    </svg>
  );
}

export function Engagement({ locale }: { locale: Locale }) {
  const navEng = text("D.1", "主导航", locale).split(" · ")[3];
  const e1 = copy("E-1", locale);
  const dockerLabel = copyIfApproved("G-8", locale) ?? "Docker";

  const processSteps = ([0, 1, 2, 3, 4] as const).map((i) => {
    const founder = founderForStage(i + 1, locale);
    return {
      indexLabel: `0${i + 1}`,
      title: pageCopy.assess_requirements[locale][i],
      desc: pageCopy.review_goals_workflows_and[locale][i],
      ownerRole: founder.role,
      ownerAvatar: `/v3-materials/founder-${founder.order + 1}.webp`,
    };
  });

  // 07 §6.5 exact 9 FAQ items
  const faqItems = [
    {
      q:
        copyIfApproved("E-5q1", locale) ??
        t(locale, "应该完整定制，还是从试点开始？", "Full build or pilot first?"),
      a: text(
        "D.4",
        "应该完整定制，还是从试点开始？ / Full build or pilot first?",
        locale,
      ),
    },
    {
      q:
        copyIfApproved("E-5q2", locale) ??
        t(locale, "数据安全如何保障？", "How is our data protected?"),
      a:
        copyIfApproved("D-20", locale) ??
        text("D.4", "数据安全如何保障？ / How is our data protected?", locale),
    },
    {
      q:
        copyIfApproved("E-5q3", locale) ??
        t(locale, "如果效果不达预期怎么办？", "What if results fall short?"),
      a:
        copyIfApproved("E-3", locale) ??
        text(
          "D.4",
          "如果效果不达预期怎么办？ / What if results fall short?",
          locale,
        ),
    },
    {
      q:
        copyIfApproved("E-5q4", locale) ??
        t(
          locale,
          "什么时候适合托管式 AI 服务？",
          "When does managed service make sense?",
        ),
      a: text(
        "D.4",
        "什么时候适合托管式 AI 服务？ / When does managed service make sense?",
        locale,
      ),
    },
    {
      q:
        copyIfApproved("E-5q5", locale) ??
        t(locale, "上线之后谁来维护？", "Who maintains it after launch?"),
      a: text(
        "D.4",
        "上线之后谁来维护？ / Who maintains it after launch?",
        locale,
      ),
    },
    {
      q:
        copyIfApproved("E-5q6", locale) ??
        t(locale, "如何获得适合自己的方案？", "How do we get a tailored proposal?"),
      a: text(
        "D.4",
        "如何获得适合自己的方案？ / How do we get a tailored proposal?",
        locale,
      ),
    },
    {
      q:
        copyIfApproved("E-5q7", locale) ??
        t(locale, "需求评估会提供什么？", "What does the assessment provide?"),
      a: text(
        "D.4",
        "需求评估会提供什么？ / What does the assessment provide?",
        locale,
      ),
    },
    ...(copyIfApproved("E-5q8", locale) && copyIfApproved("E-5a8", locale)
      ? [
          {
            q: copy("E-5q8", locale),
            a: copy("E-5a8", locale),
          },
        ]
      : []),
    ...(copyIfApproved("E-5q9", locale) && copyIfApproved("E-5a9", locale)
      ? [
          {
            q: copy("E-5q9", locale),
            a: copy("E-5a9", locale),
          },
        ]
      : []),
  ];

  return (
    <>
      <PageHero
        locale={locale}
        crumbLabel={navEng}
        eyebrow={pageCopy.how_we_work[locale]}
        title={text("D.4", "Hero 标题", locale)}
        lede={text("D.4", "Hero 导语", locale)}
        footNote={e1}
        actions={
          <Link className="button" href={href(locale, "/contact#form")}>
            {text("D.1", "主按钮", locale)}
          </Link>
        }
        visual={<EngagementGantt locale={locale} variant="hero" compact />}
      />

      {/* Section 2: S7 Configurator + Cards + Gantt + Compare Table */}
      <section className="paper eng-main-section [padding-block:var(--section-y)]" data-header="paper">
        <div className="wrap">
          <EngagementConfigurator
            locale={locale}
            decisionNote={text("D.4", "怎么选", locale)}
          />
        </div>
      </section>

      <div className="wrap">
        <hr className="rule-dot relative [height:1px] [border:0] [background:var(--line-soft)] overflow-visible" />
      </div>

      {/* Section 3: 5-step process with vertical provenance line + founder avatars */}
      <section
        id="diagnosis"
        className="paper eng-process-section [padding-block:var(--section-y)]"
        data-header="paper"
      >
        <div className="wrap">
          <div className="eng-sec-head flex flex-col [gap:var(--sp-2)] [margin-bottom:var(--stack-heading)]" data-reveal="">
            <p className="eyebrow">{pageCopy.project_process[locale]}</p>
            <h2 className="h2">
              <Phrase
                text={pageCopy.assessment_development_and_ongoing[locale]}
                locale={locale}
              />
            </h2>
          </div>

          <ProcessTimeline steps={processSteps} />
        </div>
      </section>

      {/* Section 4: Deployment options (SaaS vs Private SVG diagrams) */}
      <section className="paper-2 eng-deploy-section [padding-block:var(--section-y)]" data-header="paper">
        <div className="wrap">
          <div className="eng-deploy-grid grid [grid-template-columns:repeat(2,minmax(0,1fr))] [@media(max-width:1023px)]:[grid-template-columns:minmax(0,1fr)] [gap:var(--sp-6)]">
            <article className="card eng-deploy-card" data-reveal="">
              <SaasDeploySvg />
              <div className="eng-deploy-copy flex flex-col [gap:var(--sp-2)]">
                <h3 className="h3">
                  {t(locale, "SaaS 托管", "SaaS hosting")}
                </h3>
                <p>{text("D.4", "SaaS 托管", locale)}</p>
              </div>
            </article>

            <article
              className="card eng-deploy-card"
              data-reveal=""
              style={{ "--i": 1 } as React.CSSProperties}
            >
              <PrivateDeploySvg dockerLabel={dockerLabel} />
              <div className="eng-deploy-copy flex flex-col [gap:var(--sp-2)]">
                <h3 className="h3">
                  {t(locale, "私有化部署", "Private deployment")}
                </h3>
                <p>{text("D.4", "私有化部署", locale)}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Section 5: 9-item FAQ */}
      <section id="faq" className="paper eng-faq-section [padding-block:var(--section-y)]" data-header="paper">
        <div className="wrap eng-faq-grid grid [grid-template-columns:minmax(220px,4fr)_minmax(0,8fr)] [@media(max-width:1023px)]:[grid-template-columns:minmax(0,1fr)] [gap:var(--sp-7)] [align-items:start]">
          <div className="eng-faq-side sticky [@media(max-width:1023px)]:[position:static] [top:108px] flex flex-col [gap:var(--sp-2)]" data-reveal="">
            <p className="eyebrow">
              {copyIfApproved("E-5t", locale) ??
                pageCopy.common_questions[locale]}
            </p>
            <h2 className="h2">
              <Phrase text={pageCopy.before_we_begin[locale]} locale={locale} />
            </h2>
          </div>

          <div className="eng-faq-main">
            <FAQ items={faqItems} openCount={3} />
          </div>
        </div>
      </section>
    </>
  );
}
