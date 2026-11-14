import type { Metadata } from "next";
import { HomeView } from "@/components/v3/views/HomeView";
import { buildPageMetadata, pick, siteCopy } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routePath: "",
  title: pick("en", siteCopy.seo.home.title),
  description: pick("en", siteCopy.seo.home.description),
});

export default function EnHomePage() {
  return <HomeView locale="en" />;
}
