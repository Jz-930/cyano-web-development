import type { Metadata } from "next";
import { EngagementView } from "@/components/PageTemplates";
import { buildPageMetadata, pick, siteCopy } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routePath: "engagement",
  title: pick("en", siteCopy.seo.engagement.title),
  description: pick("en", siteCopy.seo.engagement.description),
});

export default function EnEngagementPage() {
  return <EngagementView locale="en" />;
}
