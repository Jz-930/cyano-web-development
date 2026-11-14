import type { Metadata } from "next";
import { LegalView } from "@/components/v3/views/LegalView";
import { buildPageMetadata, pick, siteCopy } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routePath: "terms",
  title: pick("en", siteCopy.seo.terms.title),
  description: pick("en", siteCopy.seo.terms.description),
});

export default function EnTermsPage() {
  return <LegalView locale="en" type="terms" />;
}
