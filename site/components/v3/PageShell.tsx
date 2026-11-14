import type {ReactNode} from "react";
import {type Locale,t} from "@/lib/locale";
import {organizationJsonLd,websiteJsonLd,breadcrumbJsonLd,serviceJsonLd,articleJsonLd,getSolution,getInsight} from "@/lib/content";
import {ClosingCta} from "@/components/v4/ClosingCta";
export function StructuredData({value}:{value:unknown}){return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(value).replace(/</g,"\\u003c")}}/>;}
export function PageShell({locale,route="",closing=true,children}:{locale:Locale;route?:string;closing?:boolean;children:ReactNode}){
 const solution=route.startsWith("services/")?getSolution(route.split('/')[1]):undefined;
 const article=route.startsWith("insights/")?getInsight(route.split('/')[1]):undefined;
 const schemas:unknown[]=[organizationJsonLd(locale),websiteJsonLd(locale)];
 if(route)schemas.push(breadcrumbJsonLd(locale,[{name:t(locale,"首页","Home"),path:""},{name:solution?solution.name[locale]:article?article.title[locale]:route.split('/').at(-1)!,path:"/"+route}]));
 if(solution)schemas.push(serviceJsonLd(locale,solution));
 if(article)schemas.push(articleJsonLd(locale,article));
 return <main id="main">{children}{closing && <ClosingCta locale={locale} isHome={route === ""}/>}<StructuredData value={schemas}/></main>;
}
