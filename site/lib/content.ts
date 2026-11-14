import "server-only";
import baselineLegal from "@/content/legal-v1.json";
import type { Metadata } from "next";
import {
  type Locale,
  type Bilingual,
  type CaseItem,
  type SolutionItem,
  type FounderItem,
  type InsightItem,
} from "./schema";
import rawCases from "@/content/cases-v2.json";
import rawSolutions from "@/content/solutions-v2.json";
import rawFounders from "@/content/founders-v2.json";
import rawInsights from "@/content/insights-v2.json";
import siteCopyData from "@/content/site-copy-v2.json";
import rawArticles from "@/content/articles.json";
import rawAvailability from "@/content/availability.json";
import mediaManifestData from "./media-manifest.json";
import ogImage from "./og-image.json";

export type { Locale, Bilingual, CaseItem, SolutionItem, FounderItem, InsightItem };

// Schemas run in the build gate; content never enters a client module.
export const casesList = rawCases as CaseItem[];
export const solutionsList = rawSolutions as SolutionItem[];
export const foundersList = rawFounders as FounderItem[];
export const insightsList = rawInsights as InsightItem[];
export const siteCopy = siteCopyData;
export const availability = rawAvailability;

export type MediaMeta = {
  width: number;
  height: number;
  blurDataURL: string;
};

const manifest = mediaManifestData as Record<string, MediaMeta>;

export function getMediaMeta(src: string): MediaMeta {
  if (!manifest[src]) throw new Error(`Media manifest entry missing: ${src}`);
  return manifest[src];
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
  { key: "consulting", label: { zh: "专业服务与投研", en: "Professional Services & Research" } },
  { key: "enterprise-it", label: { zh: "企业服务", en: "Enterprise Services" } },
  { key: "retail", label: { zh: "零售与供应链", en: "Retail & Supply Chain" } },
  { key: "real-estate", label: { zh: "房地产与物业", en: "Real Estate & Property" } },
  { key: "media", label: { zh: "内容与传媒", en: "Content & Media" } },
];

export const legalCopy = { ...baselineLegal, updatedDisplay: { zh: "更新日期：2026 年 11 月 12 日", en: "Updated November 12, 2026" } };

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
          url: ogImage.src,
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
      images: [ogImage.src],
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
      "@type": "Organization",
      name: locale === "zh" ? "Cyano 创始团队" : "Cyano founding team",
      url: `${SITE_ORIGIN}${href(locale,"/about")}`,
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
