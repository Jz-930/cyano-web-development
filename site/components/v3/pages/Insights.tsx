import pageCopy from "@/content/v4/pages/Insights.json";
import { Locale, t } from "@/lib/content-v4";
import { InsightCards } from "../ui";
import { PageHero } from "./PageHero";

export function Insights({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={pageCopy.insights[locale]}
        title={pageCopy.notes_on_designing_and[locale]}
        intro={pageCopy.guides_to_knowledge_systems[locale]}
        compact
      />
      <section className="section">
        <div className="wrap">
          <InsightCards locale={locale} />
        </div>
      </section>
    </>
  );
}
