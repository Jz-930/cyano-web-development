import {type Locale,solutions} from "@/lib/content-v4";
import raw from "@/content/v1/copy.json";
import {Header as HeaderClient} from "../HeaderClient";
export function Header({locale}:{locale:Locale}){return <HeaderClient locale={locale} copy={localCopy(locale,"D.1",["主按钮"])} solutionItems={solutions(locale).map(({slug,name,promise})=>({slug,name,promise}))} />;}
function localCopy(locale:Locale,section:string,keys:string[]){const source=raw as Record<string,Record<string,{zh:string;en:string}>>;return {[section]:Object.fromEntries(keys.map(k=>[k,source[section][k][locale]]))};}
