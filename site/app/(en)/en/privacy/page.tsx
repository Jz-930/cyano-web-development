import type { Metadata } from "next";
import { LegalView } from "@/components/v3/views/LegalView";
import { buildPageMetadata, pick, siteCopy } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routePath: "privacy",
  title: pick("en", siteCopy.seo.privacy.title),
  description: pick("en", siteCopy.seo.privacy.description),
});

export default function EnPrivacyPage() {
  return <LegalView locale="en" type="privacy" />;
}
