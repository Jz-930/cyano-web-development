import type { Metadata } from "next";
import { AboutView } from "@/components/PageTemplates";
import { buildPageMetadata, pick, siteCopy } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routePath: "about",
  title: pick("en", siteCopy.seo.about.title),
  description: pick("en", siteCopy.seo.about.description),
});

export default function EnAboutPage() {
  return <AboutView locale="en" />;
}
