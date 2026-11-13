import type { Metadata } from "next";
import { ServicesOverviewView } from "@/components/PageTemplates";
import { buildPageMetadata, pick, siteCopy } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routePath: "services",
  title: pick("en", siteCopy.seo.services.title),
  description: pick("en", siteCopy.seo.services.description),
});

export default function EnServicesPage() {
  return <ServicesOverviewView locale="en" />;
}
