import type { Metadata } from "next";
import { LegalView } from "@/components/v3/views/LegalView";
import { buildPageMetadata, pick, siteCopy } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  locale: "zh",
  routePath: "terms",
  title: pick("zh", siteCopy.seo.terms.title),
  description: pick("zh", siteCopy.seo.terms.description),
});

export default function ZhTermsPage() {
  return <LegalView locale="zh" type="terms" />;
}
