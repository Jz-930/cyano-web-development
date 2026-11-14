import "server-only";
import baselineLegal from "@/content/legal-v1.json";
import type { Metadata } from "next";
import { type Locale, type Bilingual } from "./schema";
import {
  allCases,
  allIndustries,
  allInsights,
  allSolutions,
  allTeam,
  getArticleBlocks,
  siteCopy,
} from "./content-v4";
import rawAvailability from "@/content/availability.json";
import ogImage from "./og-image.json";

export type { Locale, Bilingual };
export { getArticleBlocks, siteCopy };

export const casesList = allCases.map((c) => ({
  ...c,
  metaDescription: c.outcome,
}));
export type CaseRouteItem = (typeof casesList)[number];

export const solutionsList = allSolutions;
export type SolutionRouteItem = (typeof solutionsList)[number];

export const foundersList = allTeam;
export type FounderRouteItem = (typeof foundersList)[number];

export const insightsList = allInsights;
export type InsightRouteItem = (typeof insightsList)[number];

export const availability = rawAvailability;

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

export function getCase(slug: string): CaseRouteItem | undefined {
  return casesList.find((c) => c.slug === slug);
}

export function getSolution(slug: string): SolutionRouteItem | undefined {
  return solutionsList.find((s) => s.slug === slug);
}

export function getFounder(id: FounderRouteItem["id"]): FounderRouteItem {
  return foundersList.find((f) => f.id === id) ?? foundersList[0];
}

export function getInsight(slug: string): InsightRouteItem | undefined {
  return insightsList.find((i) => i.slug === slug);
}

export function isDemoEnabled(slug: string): boolean {
  const map = availability.demos as Record<string, boolean | undefined>;
  return Boolean(map[slug]);
}

export const industriesList = allIndustries.map((ind) => ({
  key: ind.id,
  label: ind.label,
}));

export const legalCopy = {
  ...baselineLegal,
  updatedDisplay: { zh: "更新日期：2026 年 11 月 12 日", en: "Updated November 12, 2026" },
};

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

const INSIGHT_OG_IMAGES: Record<string, Record<Locale, string>> = {
  "why-chatgpt-is-not-a-knowledge-base": {
    zh: "/og/why-chatgpt-is-not-a-knowledge-base-zh.png",
    en: "/og/why-chatgpt-is-not-a-knowledge-base-en.png",
  },
  "proposal-draft-in-15-minutes": {
    zh: "/og/proposal-draft-in-15-minutes-zh.png",
    en: "/og/proposal-draft-in-15-minutes-en.png",
  },
  "buy-pilot-or-managed": {
    zh: "/og/buy-pilot-or-managed-zh.png",
    en: "/og/buy-pilot-or-managed-en.png",
  },
};

export function buildPageMetadata({
  locale,
  routePath,
  title,
  description,
  ogType = "website",
  publishedTime,
}: {
  locale: Locale;
  routePath: string;
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
  const insightSlug = clean.startsWith("insights/")
    ? clean.slice("insights/".length)
    : "";
  const resolvedOgSrc = INSIGHT_OG_IMAGES[insightSlug]?.[locale] ?? ogImage.src;

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
          url: resolvedOgSrc,
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
      images: [resolvedOgSrc],
    },
    icons: {
      icon: "/icon.svg",
      shortcut: "/favicon.ico",
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
  items: { name: string; path: string }[],
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

export function serviceJsonLd(locale: Locale, sol: SolutionRouteItem) {
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

export function articleJsonLd(locale: Locale, ins: InsightRouteItem) {
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
      url: `${SITE_ORIGIN}${href(locale, "/about")}`,
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
  faqs: { q: Bilingual; a: Bilingual }[],
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
