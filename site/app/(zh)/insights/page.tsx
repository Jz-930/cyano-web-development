import type { Metadata } from "next";
import { InsightsOverviewView } from "@/components/PageTemplates";
import { buildPageMetadata, pick, siteCopy } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  locale: "zh",
  routePath: "insights",
  title: pick("zh", siteCopy.seo.insights.title),
  description: pick("zh", siteCopy.seo.insights.description),
});

export default function ZhInsightsPage() {
  return <InsightsOverviewView locale="zh" />;
}
