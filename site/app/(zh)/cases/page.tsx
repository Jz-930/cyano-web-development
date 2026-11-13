import type { Metadata } from "next";
import { CasesOverviewView } from "@/components/PageTemplates";
import { buildPageMetadata, pick, siteCopy } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  locale: "zh",
  routePath: "cases",
  title: pick("zh", siteCopy.seo.cases.title),
  description: pick("zh", siteCopy.seo.cases.description),
});

export default function ZhCasesPage() {
  return <CasesOverviewView locale="zh" />;
}
