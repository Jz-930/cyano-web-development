import pageCopy from "@/content/v3/pages/Insights.json";
import { Locale, t } from "@/lib/v1-content";
import { InsightCards } from "../ui";
import { PageHero } from "./PageHero";

export function Insights({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={pageCopy.cc31ab3e384[locale]}
        title={pageCopy.c263010915a[locale]}
        intro={pageCopy.c43fe9d94f3[locale]}
        compact
      />
      <section className="section">
        <div className="container">
          <InsightCards locale={locale} />
        </div>
      </section>
    </>
  );
}
