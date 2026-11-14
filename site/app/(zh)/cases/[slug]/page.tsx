import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CaseDetailView } from "@/components/v3/views/CaseDetailView";
import {
  buildPageMetadata,
  casesList,
  getCase,
  pick,
} from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return casesList.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) return {};
  return buildPageMetadata({
    locale: "zh",
    routePath: `cases/${item.slug}`,
    title: `${pick("zh", item.system)} — ${pick("zh", item.title)}`,
    description: pick("zh", item.metaDescription),
  });
}

export default async function ZhCaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getCase(slug)) notFound();
  return <CaseDetailView locale="zh" slug={slug} />;
}
