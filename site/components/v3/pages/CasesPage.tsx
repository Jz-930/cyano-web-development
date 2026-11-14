import pageCopy from "@/content/v3/pages/CasesPage.json";
import { Locale, t, text } from "@/lib/v1-content";
import { Button } from "../ui";
import {CaseFilters} from "../islands/CaseFilters";
import { PageHero } from "./PageHero";

export function CasesPage({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={pageCopy.c44c4e65242[locale]}
        title={text("D.5", "列表 Hero 标题", locale)}
        intro={text("D.5", "汇总一行", locale)}
        compact
      />
      <section className="section">
        <div className="container">
          <p className="confidential-note">
            {text("D.1", "保密说明（案例）", locale)}
          </p>
          <h2 className="sr-only">{pageCopy.ca85726a4c7[locale]}</h2>
          <CaseFilters locale={locale} />
          <div className="inline-cta">
            <h2>{text("D.5", "列表收尾", locale)}</h2>
            <Button locale={locale}>
              {pageCopy.c019a52a91a[locale]}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
