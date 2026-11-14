import type { Metadata } from "next";
import { HomeView } from "@/components/v3/views/HomeView";
import { buildPageMetadata, pick, siteCopy } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  locale: "zh",
  routePath: "",
  title: pick("zh", siteCopy.seo.home.title),
  description: pick("zh", siteCopy.seo.home.description),
});

export default function ZhHomePage() {
  return <HomeView locale="zh" />;
}
