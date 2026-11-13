import type { Metadata } from "next";
import { z } from "zod";
import {
  type Locale,
  type Bilingual,
  type CaseItem,
  type SolutionItem,
  type FounderItem,
  type InsightItem,
  CaseSchema,
  SolutionSchema,
  FounderSchema,
  InsightSchema,
} from "./schema";
import rawCases from "@/content/cases-v2.json";
import rawSolutions from "@/content/solutions-v2.json";
import rawFounders from "@/content/founders-v2.json";
import rawInsights from "@/content/insights-v2.json";
import siteCopyData from "@/content/site-copy-v2.json";
import rawArticles from "@/content/articles.json";
import rawAvailability from "@/content/availability.json";
import mediaManifestData from "./media-manifest.json";

export type { Locale, Bilingual, CaseItem, SolutionItem, FounderItem, InsightItem };

export const casesList: CaseItem[] = z.array(CaseSchema).parse(rawCases);
export const solutionsList: SolutionItem[] = z.array(SolutionSchema).parse(rawSolutions);
export const foundersList: FounderItem[] = z.array(FounderSchema).parse(rawFounders);
export const insightsList: InsightItem[] = z.array(InsightSchema).parse(rawInsights);
export const siteCopy = siteCopyData;
export const availability = rawAvailability;

export type MediaMeta = {
  width: number;
  height: number;
  blurDataURL: string;
};

const manifest = mediaManifestData as Record<string, MediaMeta>;

export function getMediaMeta(src: string): MediaMeta {
  return (
    manifest[src] ?? {
      width: 1440,
      height: 900,
      blurDataURL: "",
    }
  );
}

export function t(locale: Locale, zh: string, en: string): string {
  return locale === "zh" ? zh : en;
}

export function pick(locale: Locale, b: Bilingual): string {
  return locale === "zh" ? b.zh : b.en;
}

export function href(locale: Locale, routePath = ""): string {
  const clean = routePath.startsWith("/") ? routePath : routePath ? `/${routePath}` : "";
  if (locale === "en") {
    return clean ? `/en${clean}` : "/en";
  }
  return clean || "/";
}

export function getCase(slug: string): CaseItem | undefined {
  return casesList.find((c) => c.slug === slug);
}

export function getSolution(slug: string): SolutionItem | undefined {
  return solutionsList.find((s) => s.slug === slug);
}

export function getFounder(id: FounderItem["id"]): FounderItem {
  return foundersList.find((f) => f.id === id) ?? foundersList[0];
}

export function getInsight(slug: string): InsightItem | undefined {
  return insightsList.find((i) => i.slug === slug);
}

export function getArticleBlocks(
  slug: string,
  locale: Locale
): { q: string; a: string }[] {
  const table = rawArticles as Record<
    string,
    Record<Locale, { q: string; a: string }[]>
  >;
  return table[slug]?.[locale] ?? [];
}

export function isDemoEnabled(slug: string): boolean {
  const map = availability.demos as Record<string, boolean | undefined>;
  return Boolean(map[slug]);
}

export const industriesList: { key: CaseItem["industryKey"]; label: Bilingual }[] = [
  { key: "manufacturing", label: { zh: "工程与制造", en: "Engineering & Manufacturing" } },
  { key: "consulting", label: { zh: "专业服务与投研", en: "Consulting & Research" } },
  { key: "enterprise-it", label: { zh: "企业服务与 IT", en: "Enterprise IT & Services" } },
  { key: "retail", label: { zh: "零售与供应链", en: "Retail & Supply Chain" } },
  { key: "real-estate", label: { zh: "房地产与物业", en: "Real Estate & Property" } },
  { key: "media", label: { zh: "内容与传媒", en: "Content & Media" } },
];

export const legalCopy = {
  updatedDisplay: {
    zh: "更新日期：2026 年 11 月 12 日",
    en: "Last updated: November 12, 2026",
  },
  privacy: {
    zh: [
      [
        "我们收集的信息",
        "当你提交项目咨询时，我们收集你主动提供的姓名、公司、职位、工作邮箱、电话或微信、业务场景描述与期望启动时间。网站可能收集不跨站追踪的基础访问统计数据。",
      ],
      [
        "我们如何使用信息",
        "所收集信息仅用于回复咨询、提供你所请求的案例资料、沟通项目范围及改进网站体验。我们不会出售或向广告网络共享你的个人信息。",
      ],
      [
        "存储与处理保护",
        "信息由 Cyano 及其委托的基础设施与邮件服务商存储和处理，可能涉及必要的跨境协作传输。我们采取加密传输与最小访问控制措施保护数据安全。",
      ],
      [
        "保留期限与你的权利",
        "咨询信息通常保留不超过 24 个月，或在你提出要求时提前删除。你随时可以通过联系表单申请查询、更正、删除个人信息或撤回同意。",
      ],
      [
        "Cookie 与偏好存储",
        "本站不使用跨站广告追踪 Cookie。语言浏览偏好可能保存在你的本地浏览器中，你可以随时清除。",
      ],
      [
        "联系与政策更新",
        "如有关于信息处理的任何疑问，请通过联系页面表单与 Cyano（澜屿智创）沟通。本政策更新时将在本页公布。",
      ],
    ],
    en: [
      [
        "Information we collect",
        "When you submit an inquiry, we collect the details you provide: name, company, role, work email, phone or WeChat, workflow description and preferred timeline. We may collect privacy-preserving site analytics that do not track you across websites.",
      ],
      [
        "How we use information",
        "We use your information strictly to respond to inquiries, share requested case materials, evaluate project requirements and improve the site. We never sell personal information.",
      ],
      [
        "Storage and security",
        "Cyano and its infrastructure and email delivery providers store and process inquiry records, which may involve cross-border transmission. Data is protected with TLS encryption in transit and role-restricted access.",
      ],
      [
        "Retention and your rights",
        "Inquiry records are retained for no longer than 24 months, or deleted earlier upon request. You may request access, correction, deletion or withdrawal of consent at any time via our contact form.",
      ],
      [
        "Cookies and preferences",
        "We do not use cross-site advertising cookies. Language preferences may be stored locally in your browser and cleared whenever you choose.",
      ],
      [
        "Contact and updates",
        "For privacy inquiries, reach Cyano Intelligence through the contact form. Any material updates to this policy will be posted on this page.",
      ],
    ],
  },
  terms: {
    zh: [
      [
        "网站内容性质",
        "本网站用于介绍 Cyano（澜屿智创）的工程能力、服务模式与已交付项目。页面信息仅供参考，不构成直接合同承诺；具体服务范围、验收标准与费用以双方签署的正式协议为准。",
      ],
      [
        "知识产权声明",
        "本站的文字、信息架构、视觉图形、品牌标识及相关内容由 Cyano 或相应权利人拥有。未经书面许可，不得复制、镜像或用于商业招揽。",
      ],
      [
        "合理使用规范",
        "请勿尝试干扰网站运行、探测安全边界或通过表单发送违法及垃圾信息。我们持续维护页面准确性，但不对所有信息在任意时刻的绝对完整性作默示担保。",
      ],
      [
        "外部演示沙盒链接",
        "部分案例页面提供公开脱敏演示环境链接。演示沙盒仅用于展示界面与流程形态，请勿在公开演示环境中输入任何真实商业机密或个人敏感数据。",
      ],
      [
        "适用法律与条款修订",
        "本条款依据适用法律解释。我们可能随业务发展修订本条款，更新版本将在本页同步发布。",
      ],
      [
        "联系我们",
        "如对本站内容或使用条款有疑问，请通过联系我们页面提交咨询。",
      ],
    ],
    en: [
      [
        "Informational purpose",
        "This website presents Cyano Intelligence’s engineering capabilities, delivery models and client work for informational purposes. Project scope, acceptance criteria, SLAs and pricing are governed solely by written client agreements.",
      ],
      [
        "Intellectual property",
        "All copy, visual schematics, interface designs and brand marks on this website belong to Cyano Intelligence or their respective owners and may not be reproduced commercially without permission.",
      ],
      [
        "Acceptable use",
        "Do not attempt to disrupt site availability, bypass rate limits or submit unlawful content through inquiry endpoints. While we keep material accurate, content is provided without implied warranties.",
      ],
      [
        "Public demo sandboxes",
        "Select case studies link to public anonymized sandboxes. These environments illustrate workflow mechanics only—do not upload confidential business documents or personal data to public demo links.",
      ],
      [
        "Changes and governing law",
        "These terms are governed by applicable law and may be updated as our services evolve. Updated versions take effect upon publication on this page.",
      ],
      [
        "Contact",
        "For questions regarding these terms, please contact us via the inquiry form.",
      ],
    ],
  },
} as const;

export const baseRoutes = [
  "",
  "services",
  ...solutionsList.map((s) => `services/${s.slug}`),
  "cases",
  ...casesList.map((c) => `cases/${c.slug}`),
  "technology",
  "engagement",
  "about",
  "insights",
  ...insightsList.map((i) => `insights/${i.slug}`),
  "contact",
  "privacy",
  "terms",
];

export const routes = baseRoutes.flatMap((r) => [
  r,
  r ? `en/${r}` : "en",
]);

const SITE_ORIGIN = "https://cyano.app";

export function buildPageMetadata({
  locale,
  routePath,
  title,
  description,
  ogType = "website",
  publishedTime,
}: {
  locale: Locale;
  routePath: string; // "" for home, "services/sales-ai" etc. (no leading slash)
  title: string;
  description: string;
  ogType?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const clean = routePath.replace(/^\/+|\/+$/g, "");
  const zhUrl = clean ? `${SITE_ORIGIN}/${clean}` : SITE_ORIGIN;
  const enUrl = clean ? `${SITE_ORIGIN}/en/${clean}` : `${SITE_ORIGIN}/en`;
  const canonical = locale === "zh" ? zhUrl : enUrl;
  const fullTitle = `${title} | Cyano`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_ORIGIN),
    alternates: {
      canonical,
      languages: {
        "zh-CN": zhUrl,
        en: enUrl,
        "x-default": zhUrl,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: "Cyano Intelligence",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: ogType,
      ...(publishedTime ? { publishedTime } : {}),
      images: [
        {
          url: "/art/og.jpg",
          width: 1200,
          height: 630,
          alt: `Cyano Intelligence — ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/art/og.jpg"],
    },
    icons: {
      icon: "/icon.svg",
      apple: "/apple-touch-icon.png",
    },
  };
}

export function organizationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Cyano Intelligence",
    alternateName: "澜屿智创",
    url: locale === "zh" ? SITE_ORIGIN : `${SITE_ORIGIN}/en`,
    logo: `${SITE_ORIGIN}/logo.png`,
    description: pick(locale, siteCopy.footer.positioning),
    areaServed: ["CN", "US", "CA"],
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Cyano Intelligence",
    alternateName: "澜屿智创",
    url: locale === "zh" ? SITE_ORIGIN : `${SITE_ORIGIN}/en`,
    inLanguage: locale === "zh" ? "zh-CN" : "en",
  };
}

export function breadcrumbJsonLd(
  locale: Locale,
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${SITE_ORIGIN}${href(locale, item.path)}`,
    })),
  };
}

export function serviceJsonLd(locale: Locale, sol: SolutionItem) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: pick(locale, sol.name),
    description: pick(locale, sol.metaDescription),
    provider: {
      "@type": "Organization",
      name: "Cyano Intelligence",
      url: SITE_ORIGIN,
    },
    url: `${SITE_ORIGIN}${href(locale, `/services/${sol.slug}`)}`,
  };
}

export function articleJsonLd(locale: Locale, ins: InsightItem) {
  const author = getFounder(ins.authorId);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pick(locale, ins.title),
    description: pick(locale, ins.metaDescription),
    datePublished: ins.dateIso,
    dateModified: ins.dateIso,
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    author: {
      "@type": "Person",
      jobTitle: pick(locale, author.role),
      worksFor: {
        "@type": "Organization",
        name: "Cyano Intelligence",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "Cyano Intelligence",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_ORIGIN}/logo.png`,
      },
    },
    mainEntityOfPage: `${SITE_ORIGIN}${href(locale, `/insights/${ins.slug}`)}`,
  };
}

export function faqJsonLd(
  locale: Locale,
  faqs: { q: Bilingual; a: Bilingual }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: pick(locale, f.q),
      acceptedAnswer: {
        "@type": "Answer",
        text: pick(locale, f.a),
      },
    })),
  };
}
