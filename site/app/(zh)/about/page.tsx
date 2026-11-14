import type { Metadata } from "next";
import { AboutView } from "@/components/v3/views/AboutView";
import { buildPageMetadata, pick, siteCopy } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  locale: "zh",
  routePath: "about",
  title: pick("zh", siteCopy.seo.about.title),
  description: pick("zh", siteCopy.seo.about.description),
});

export default function ZhAboutPage() {
  return <AboutView locale="zh" />;
}
