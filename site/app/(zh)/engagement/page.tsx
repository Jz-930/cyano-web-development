import type { Metadata } from "next";
import { EngagementView } from "@/components/v3/views/EngagementView";
import { buildPageMetadata, pick, siteCopy } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  locale: "zh",
  routePath: "engagement",
  title: pick("zh", siteCopy.seo.engagement.title),
  description: pick("zh", siteCopy.seo.engagement.description),
});

export default function ZhEngagementPage() {
  return <EngagementView locale="zh" />;
}
