import pageCopy from "@/content/v3/pages/Missing.json";
import { Locale, t, href, text, cases } from "@/lib/v1-content";
import { Button } from "../ui";
import { PageHero } from "./PageHero";

export function Missing({ locale }: { locale: Locale }) {
  return (
    <PageHero
      locale={locale}
      eyebrow="404"
      title={text("D.9", "标题", locale)}
      intro={text("D.9", "正文", locale)}
    >
      <Button to={href(locale)}>{pageCopy.c515d0524d2[locale]}</Button>
      <Button secondary to={href(locale, "/cases")}>
        {pageCopy.cacaceaf63e[locale]}
      </Button>
    </PageHero>
  );
}
