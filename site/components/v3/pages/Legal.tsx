import pageCopy from "@/content/v3/pages/Legal.json";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Locale, t, href, text } from "@/lib/v1-content";
import { PageHero } from "./PageHero";

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
        paper
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
            {pageCopy.ca3e2396ff3[locale]}
          </p>
          {(locale === "zh" ? zh : en).map(([h, p]) => (
            <section key={h}>
              <h2>{h}</h2>
              <p>{p}</p>
            </section>
          ))}
          <Link className="text-link" href={href(locale, "/contact#form")}>
            {pageCopy.c3d1bb514d5[locale]}
            <ArrowUpRight size={17} />
          </Link>
        </article>
      </section>
    </>
  );
}
