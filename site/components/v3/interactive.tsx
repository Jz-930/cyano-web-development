import {type Locale, cases, solutions} from "@/lib/v1-content";
import raw from "@/content/v1/copy.json";
import {CaseCard} from "./ui";
import {Header as HeaderClient} from "./HeaderClient";
export function Header({locale}:{locale:Locale}){return <HeaderClient locale={locale} copy={localCopy(locale,"D.1",["主按钮"])} solutionItems={solutions(locale).map(({slug,name,promise})=>({slug,name,promise}))} />;}
import {SolutionExplorer as SolutionExplorerClient} from "./SolutionExplorerClient";
export function SolutionExplorer({locale}:{locale:Locale}){return <SolutionExplorerClient locale={locale} solutionItems={solutions(locale)} />;}
import {CaseFilters as CaseFiltersClient} from "./CaseFiltersClient";
export function CaseFilters({locale}:{locale:Locale}){return <CaseFiltersClient locale={locale} caseItems={cases(locale).map(({slug,industry})=>({slug,industry}))} cards={cases(locale).map(item=><CaseCard key={item.slug} item={item} locale={locale} />)} />;}
import {Gallery as GalleryClient} from "./GalleryIsland";
export function Gallery({item,locale}:{item:ReturnType<typeof cases>[number];locale:Locale}){return <GalleryClient item={{images:item.images,main:item.main,system:item.system}} locale={locale}/>;}
import {ContactForm as ContactFormClient} from "./ContactFormClient";
export function ContactForm({locale}:{locale:Locale}){return <ContactFormClient locale={locale} copy={localCopy(locale,"D.8",["咨询类型选项","描述框提示","提交按钮"])} caseItems={cases(locale).map(({slug,title})=>({slug,title}))} />;}
import {DemoIsland} from "./VisibleIslands";
import {DemoPreview} from "./DemoPreview";
export function InteractiveDemo({locale,data=false}:{locale:Locale;data?:boolean}){return <DemoIsland locale={locale} data={data} copy={localCopy(locale,"D.1",["交互 Demo 说明小字"])}><DemoPreview locale={locale} data={data}/></DemoIsland>;}
import {CopyLink as CopyLinkClient} from "./CopyLinkClient";
export function CopyLink({locale}:{locale:Locale}){return <CopyLinkClient locale={locale}  />;}
function localCopy(locale:Locale,section:string,keys:string[]){const source=raw as Record<string,Record<string,{zh:string;en:string}>>;return {[section]:Object.fromEntries(keys.map(k=>[k,source[section][k][locale]]))};}
import {Plus,Minus} from "lucide-react";
import {StructuredData} from "./PageShell";
export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq-list">
      <StructuredData value={{"@context":"https://schema.org","@type":"FAQPage",mainEntity:items.map(f=>({"@type":"Question",name:f.q,acceptedAnswer:{"@type":"Answer",text:f.a}}))}} />
      {items.map((f, i) => (
        <details key={i}>
          <summary>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {f.q}
            <Plus className="faq-plus" size={19} />
            <Minus className="faq-minus" size={19} />
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
export function AmbientFlow(){return null;}
