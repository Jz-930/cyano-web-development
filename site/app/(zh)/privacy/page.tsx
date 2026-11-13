import type { Metadata } from "next";
import { LegalView } from "@/components/PageTemplates";
import { buildPageMetadata, pick, siteCopy } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  locale: "zh",
  routePath: "privacy",
  title: pick("zh", siteCopy.seo.privacy.title),
  description: pick("zh", siteCopy.seo.privacy.description),
});

export default function ZhPrivacyPage() {
  return <LegalView locale="zh" type="privacy" />;
}
