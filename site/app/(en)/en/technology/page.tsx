import type { Metadata } from "next";
import { TechnologyView } from "@/components/v3/views/TechnologyView";
import { buildPageMetadata, pick, siteCopy } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routePath: "technology",
  title: pick("en", siteCopy.seo.technology.title),
  description: pick("en", siteCopy.seo.technology.description),
});

export default function EnTechnologyPage() {
  return <TechnologyView locale="en" />;
}
