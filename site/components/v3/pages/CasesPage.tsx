import pageCopy from "@/content/v4/pages/CasesPage.json";
import { Locale, t, text } from "@/lib/content-v4";
import { Button } from "../ui";
import {CaseFilters} from "../islands/CaseFilters";
import { PageHero } from "./PageHero";
import { Phrase } from "@/components/v4/Phrase";

export function CasesPage({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={pageCopy.our_work[locale]}
        title={text("D.5", "列表 Hero 标题", locale)}
        intro={text("D.5", "汇总一行", locale)}
        compact
      />
      <section className="section" data-header="paper">
        <div className="wrap">
          <p className="confidential-note">
            {text("D.1", "保密说明（案例）", locale)}
          </p>
          <h2 className="sr-only">{pageCopy.client_projects[locale]}</h2>
          <CaseFilters locale={locale} />
          <div className="inline-cta">
            <h2><Phrase text={text("D.5", "列表收尾", locale)} locale={locale} /></h2>
            <Button locale={locale}>
              {pageCopy.book_a_confidential_demo[locale]}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
