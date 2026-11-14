import {type Locale,cases} from "@/lib/v1-content";
import {CaseCard} from "../ui";
import {CaseFilters as CaseFiltersClient} from "../CaseFiltersClient";
export function CaseFilters({locale}:{locale:Locale}){return <CaseFiltersClient locale={locale} caseItems={cases(locale).map(({slug,industry})=>({slug,industry}))} cards={cases(locale).map(item=><CaseCard key={item.slug} item={item} locale={locale} />)} />;}
