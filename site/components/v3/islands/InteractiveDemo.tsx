import {type Locale} from "@/lib/content-v4";
import raw from "@/content/v1/copy.json";
import {DemoIsland} from "../VisibleIslands";
import {DemoPreview} from "../DemoPreview";
export function InteractiveDemo({locale,data=false}:{locale:Locale;data?:boolean}){return <DemoIsland locale={locale} data={data} copy={localCopy(locale,"D.1",["交互 Demo 说明小字"])}><DemoPreview locale={locale} data={data}/></DemoIsland>;}
function localCopy(locale:Locale,section:string,keys:string[]){const source=raw as Record<string,Record<string,{zh:string;en:string}>>;return {[section]:Object.fromEntries(keys.map(k=>[k,source[section][k][locale]]))};}
