import type { Metadata } from "next";
import { ContactView } from "@/components/PageTemplates";
import { buildPageMetadata, pick, siteCopy } from "@/lib/content";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routePath: "contact",
  title: pick("en", siteCopy.seo.contact.title),
  description: pick("en", siteCopy.seo.contact.description),
});

export default function EnContactPage() {
  return <ContactView locale="en" />;
}
