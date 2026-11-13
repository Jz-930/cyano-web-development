import type { Metadata } from "next";
import { ServicesOverviewView } from "@/components/PageTemplates";
import { buildPageMetadata, pick, siteCopy } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  locale: "zh",
  routePath: "services",
  title: pick("zh", siteCopy.seo.services.title),
  description: pick("zh", siteCopy.seo.services.description),
});

export default function ZhServicesPage() {
  return <ServicesOverviewView locale="zh" />;
}
