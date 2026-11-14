import {type Locale,cases} from "@/lib/content-v4";
import raw from "@/content/v1/copy.json";
import {ContactForm as ContactFormClient} from "../ContactFormClient";
export function ContactForm({locale}:{locale:Locale}){return <ContactFormClient locale={locale} copy={localCopy(locale,"D.8",["咨询类型选项","描述框提示","提交按钮"])} caseItems={cases(locale).map(({slug,title})=>({slug,title}))} />;}
function localCopy(locale:Locale,section:string,keys:string[]){const source=raw as Record<string,Record<string,{zh:string;en:string}>>;return {[section]:Object.fromEntries(keys.map(k=>[k,source[section][k][locale]]))};}
