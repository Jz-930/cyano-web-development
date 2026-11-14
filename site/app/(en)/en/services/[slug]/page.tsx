import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SolutionDetailView } from "@/components/v3/views/SolutionDetailView";
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
    locale: "en",
    routePath: `services/${sol.slug}`,
    title: pick("en", sol.name),
    description: pick("en", sol.metaDescription),
  });
}

export default async function EnSolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getSolution(slug)) notFound();
  return <SolutionDetailView locale="en" slug={slug} />;
}
