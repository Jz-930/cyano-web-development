import type { Metadata } from "next";
import { CasesOverviewView } from "@/components/PageTemplates";
import { buildPageMetadata, pick, siteCopy } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routePath: "cases",
  title: pick("en", siteCopy.seo.cases.title),
  description: pick("en", siteCopy.seo.cases.description),
});

export default function EnCasesPage() {
  return <CasesOverviewView locale="en" />;
}
