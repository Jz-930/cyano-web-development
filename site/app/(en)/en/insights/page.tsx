import type { Metadata } from "next";
import { InsightsOverviewView } from "@/components/v3/views/InsightsOverviewView";
import { buildPageMetadata, pick, siteCopy } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routePath: "insights",
  title: pick("en", siteCopy.seo.insights.title),
  description: pick("en", siteCopy.seo.insights.description),
});

export default function EnInsightsPage() {
  return <InsightsOverviewView locale="en" />;
}
