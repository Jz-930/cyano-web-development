import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SolutionDetailView } from "@/components/PageTemplates";
import {
  buildPageMetadata,
  getSolution,
  pick,
  solutionsList,
} from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return solutionsList.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sol = getSolution(slug);
  if (!sol) return {};
  return buildPageMetadata({
    locale: "zh",
    routePath: `services/${sol.slug}`,
    title: pick("zh", sol.name),
    description: pick("zh", sol.metaDescription),
  });
}

export default async function ZhSolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getSolution(slug)) notFound();
  return <SolutionDetailView locale="zh" slug={slug} />;
}
