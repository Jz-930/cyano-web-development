import pageCopy from "@/content/v4/pages/Missing.json";
import { Locale, t, href, text, cases } from "@/lib/content-v4";
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
      <Button to={href(locale)}>{pageCopy.back_to_home[locale]}</Button>
      <Button secondary to={href(locale, "/cases")}>
        {pageCopy.see_our_work[locale]}
      </Button>
    </PageHero>
  );
}
