import type { Metadata } from "next";
import { ContactView } from "@/components/v3/views/ContactView";
import { buildPageMetadata, pick, siteCopy } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  locale: "zh",
  routePath: "contact",
  title: pick("zh", siteCopy.seo.contact.title),
  description: pick("zh", siteCopy.seo.contact.description),
});

export default function ZhContactPage() {
  return <ContactView locale="zh" />;
}
