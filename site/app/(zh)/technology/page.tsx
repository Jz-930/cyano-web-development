import type { Metadata } from "next";
import { TechnologyView } from "@/components/PageTemplates";
import { buildPageMetadata, pick, siteCopy } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  locale: "zh",
  routePath: "technology",
  title: pick("zh", siteCopy.seo.technology.title),
  description: pick("zh", siteCopy.seo.technology.description),
});

export default function ZhTechnologyPage() {
  return <TechnologyView locale="zh" />;
}
