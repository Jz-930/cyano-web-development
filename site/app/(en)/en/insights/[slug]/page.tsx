import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { InsightArticleView } from "@/components/v3/views/InsightArticleView";
import {
  buildPageMetadata,
  getInsight,
  insightsList,
  pick,
} from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return insightsList.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ins = getInsight(slug);
  if (!ins) return {};
  return buildPageMetadata({
    locale: "en",
    routePath: `insights/${ins.slug}`,
    title: pick("en", ins.title),
    description: pick("en", ins.metaDescription),
    ogType: "article",
    publishedTime: ins.dateIso,
  });
}

export default async function EnInsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getInsight(slug)) notFound();
  return <InsightArticleView locale="en" slug={slug} />;
}
