import Link from "next/link";
import pageCopy from "@/content/v4/pages/CasesPage.json";
import {
  cases,
  href,
  industries,
  text,
  type Locale,
} from "@/lib/content-v4";
import type { SceneId } from "@/lib/mockups";
import { CaseCoverCard } from "../CaseCoverCard";
import { CaseFilters } from "../CaseFilters";
import { PageHero } from "../PageHero";
import { ScaledSceneMockup } from "../scenes";

const MOSAIC_SCENES: SceneId[] = [
  "proposal",
  "wiki",
  "data",
  "sales",
  "property",
  "writing",
];

export function CasesPage({ locale }: { locale: Locale }) {
  const allCases = cases(locale);
  const allIndustries = industries[locale];
  const cards = allCases.map((item, idx) => ({
    slug: item.slug,
    industry: item.industry,
    node: (
      <CaseCoverCard
        item={item}
        locale={locale}
        index={idx}
        glassBadge={idx < 2}
        reveal={false}
      />
    ),
  }));

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={pageCopy.our_work[locale]}
        crumbLabel={pageCopy.client_projects[locale]}
        title={text("D.5", "列表 Hero 标题", locale)}
        lede={text("D.5", "汇总一行", locale)}
        actions={
          <>
            <Link className="button" href={href(locale, "/contact#form")}>
              {pageCopy.book_a_confidential_demo[locale]}
            </Link>
            <Link
              className="button-secondary on-dark"
              href={href(locale, "/contact?topic=casebook#form")}
            >
              {text("D.5", "案例集按钮", locale)}
            </Link>
          </>
        }
        visual={
          <div className="cases-mosaic grid [gap:var(--sp-3)] w-full [padding-bottom:var(--sp-4)] [@media(max-width:800px)]:[padding-bottom:0]" aria-hidden="true">
            {MOSAIC_SCENES.map((sc, idx) => (
              <div
                key={sc}
                className="cases-mosaic-cell [aspect-ratio:360_/_225] overflow-hidden"
                data-col={idx % 3}
                data-idx={idx}
              >
                <ScaledSceneMockup scene={sc} locale={locale} size="compact" />
              </div>
            ))}
          </div>
        }
      />

      <section className="paper cases-main-section [padding-block:var(--section-y)]" data-header="paper">
        <div className="wrap">
          <p className="cases-nda-note [font-size:14px] [color:var(--muted)] [margin:0_0_var(--sp-6)]">{text("D.1", "保密说明（案例）", locale)}</p>

          <CaseFilters
            locale={locale}
            cards={cards}
            industries={allIndustries}
          />

          <div className="cases-tail [margin-top:var(--sp-9)] flex flex-col [align-items:flex-start] [gap:var(--sp-4)]" data-reveal="">
            <p className="conclusion [padding-left:var(--sp-5)] [border-left:2px_solid_var(--cyan)] [font-size:18px] [line-height:1.7] [color:var(--ink)]">{text("D.5", "列表收尾", locale)}</p>
            <Link className="button" href={href(locale, "/contact#form")}>
              {pageCopy.book_a_confidential_demo[locale]}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
