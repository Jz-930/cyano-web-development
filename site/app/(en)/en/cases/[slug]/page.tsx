import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CaseDetailView } from "@/components/PageTemplates";
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
    locale: "en",
    routePath: `cases/${item.slug}`,
    title: `${pick("en", item.system)} — ${pick("en", item.title)}`,
    description: pick("en", item.metaDescription),
  });
}

export default async function EnCaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getCase(slug)) notFound();
  return <CaseDetailView locale="en" slug={slug} />;
}
