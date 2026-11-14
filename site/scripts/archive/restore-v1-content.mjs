// One-time content migration. The committed v1 snapshot is the authority.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import ts from 'typescript';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>execFileSync('git',['show',`b9dcf94:site/${p}`],{cwd:root,encoding:'utf8',maxBuffer:8e6});
const write=(p,s)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),s)};
const parse=s=>ts.createSourceFile('source.tsx',s,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const func=(s,n)=>parse(s).statements.find(x=>ts.isFunctionDeclaration(x)&&x.name?.text===n)?.getText();
for(const name of ['copy','cases','founders','availability'])write(`content/v1/${name}.json`,read(`content/${name}.json`));
let lib=read('lib/content.ts').replaceAll('@/content/','@/content/v1/');
lib=lib.replace('export type Locale = "zh" | "en";','export type { Locale } from "./locale";\nimport { type Locale, t, href } from "./locale";\nexport { t, href } from "./locale";').replace(/export const t = [\s\S]*?locale === "zh" \? zh : en;\n/,'').replace(/export const href = [\s\S]*?\(path \|\| "\/"\);\n/,'');
write('lib/v1-content.ts','import "server-only";\n'+lib);
write('lib/locale.ts','export type Locale = "zh" | "en";\nexport const t = (locale:Locale, zh:string, en:string) => locale === "zh" ? zh : en;\nexport const href = (locale:Locale,path="") => (locale === "en" ? "/en" : "") + (path || "/");\n');
let ui=read('components/ui.tsx').replaceAll('@/lib/content','@/lib/v1-content').replace('@/content/availability.json','@/content/v1/availability.json');
ui=ui.replace('src="/art/portraits.webp"','src={`/v3-materials/founder-${i + 1}.webp`}').replace('width="2172"','width="320"').replace('height="724"','height="320"');
ui=ui.replace('<div className="closing-art" />','<LightField strength="closing" />');
ui='import { LightField } from "./LightField";\n'+ui;
write('components/v3/ui.tsx',ui);
let pages=read('components/pages.tsx').replaceAll('@/lib/content','@/lib/v1-content').replace('@/content/copy.json','@/content/v1/copy.json');
pages=pages.replace('from "./business-visuals"','from "../visuals"').replace('from "./ui"','from "../ui"').replace('from "./interactive"','from "../interactive"');
pages=pages.replace('className="manifesto dark"','className="manifesto"').replace('className="section dark name-story"','className="section name-story"');
// The v3 plan explicitly excludes the unsupported 10x ROI metric.
pages=pages.replace('["< 200ms", "100%", "40%", "10×"]','["< 200ms", "100%", "40%"]');
pages=pages.replace('<div className="memory-layers">','<LatencyChart locale={locale} />\n          <div className="memory-layers">');
pages=pages.replace('src="/art/team.webp"','src="/v3-materials/founder-4.webp"');
// Preserve the original background section; replace only its decorative illustration.
pages=pages.replace(/<div className="about-illustration">[\s\S]*?<\/div>/,'<div className="about-illustration"><TeamDiagram locale={locale} /></div>');
const imports=parse(pages).statements.filter(ts.isImportDeclaration).map(x=>x.getText()).join('\n')+'\nimport { LatencyChart } from "../LatencyChart";\nimport { TeamDiagram } from "../visuals";\n';
const names=['PageHero','Home','EngagementCards','Services','SolutionDetail','CasesPage','CaseDetail','Technology','Engagement','About','Contact','Insights','Article','Legal','Missing'];
for(const name of names){let extra='';if(name!=='PageHero')extra+='import { PageHero } from "./PageHero";\n';if(['Home','Engagement'].includes(name))extra+='import { EngagementCards } from "./EngagementCards";\n';write(`components/v3/pages/${name}.tsx`,imports+extra+'\n'+func(pages,name)+'\n');}
const old=read('components/interactive.tsx');
const clientImports=`"use client";\nimport { useState, useEffect, useRef, type FormEvent, type ReactNode } from "react";\nimport Link from "next/link";\nimport { usePathname } from "next/navigation";\nimport { ArrowUpRight, ArrowRight, ChevronDown, Menu, X, Plus, Minus, ChevronLeft, ChevronRight, Check, LoaderCircle, Send, Globe, ShieldCheck, Search, Database } from "lucide-react";\nimport { type Locale, t, href } from "@/lib/locale";\nimport type { CaseStudy, solutions } from "@/lib/v1-content";\nimport { Logo, solutionIcons } from "./client-shared";\ntype LocalCopy = Record<string,Record<string,string>>;\n`;
let wrappers='import {type Locale, cases, solutions} from "@/lib/v1-content";\nimport raw from "@/content/v1/copy.json";\nimport {CaseCard} from "./ui";\n';
for(const name of ['Header','SolutionExplorer','CaseFilters','Gallery','ContactForm','InteractiveDemo','CopyLink']){
 let body=func(old,name),extra='';
 if(name==='InteractiveDemo'){
   const q=parse(old).statements.find(x=>ts.isVariableStatement(x)&&x.declarationList.declarations.some(d=>d.name.getText()==='demoQuestions'));
   extra='import queryDemo from "@/content/query-demo.json";\n'+q.getText()+'\n'+func(old,'BookCitation')+'\n';
 }
 const usesCopy=/\btext\(/.test(body),usesCases=/\bcases\(/.test(body),usesSolutions=/\bsolutions\(/.test(body);
 const args=[usesCopy?'copy':null,usesCases?'caseItems':null,usesSolutions?'solutionItems':null,name==='CaseFilters'?'cards':null].filter(Boolean);
 const types=[usesCopy?'copy: LocalCopy':null,usesCases?'caseItems: CaseStudy[]':null,usesSolutions?'solutionItems: ReturnType<typeof solutions>':null,name==='CaseFilters'?'cards: ReactNode[]':null].filter(Boolean);
 if(args.length){
   if(name==='InteractiveDemo')body=body.replace('data = false,','data = false,\n'+args.join(',')+',').replace('data?: boolean;','data?: boolean;\n'+types.join(';')+';');
   else body=body.replace('{ locale }: { locale: Locale }',`{ locale, ${args.join(',')} }: { locale: Locale; ${types.join(';')} }`);
 }
 body=body.replaceAll('solutions(locale)','solutionItems').replaceAll('cases(locale)','caseItems');
 if(usesCopy)body=body.replace(') {',') {\n const text = (section:string,key:string,_locale:Locale) => copy[section][key];');
 if(name==='CaseFilters')body=body.replace('<CaseCard key={c.slug} item={c} locale={locale} />','<div key={c.slug}>{cards[all.findIndex(item=>item.slug===c.slug)]}</div>');
 // Respect reduced motion while retaining all original preset responses.
 if(name==='InteractiveDemo')body=body.replace('timer.current = setInterval(() => {','if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setAnswer(full); setRunning(false); return; }\n    timer.current = setInterval(() => {');
 if(name==='SolutionExplorer')body=body.replace('onMouseEnter={() => setSelected(i)}','');
 write(`components/v3/${name}Client.tsx`,clientImports+extra+body+'\n');
 wrappers+=`import {${name} as ${name}Client} from "./${name}Client";\n`;
 const sectionKeys=name==='ContactForm'?['D.8']:['D.1'];
 const props=[usesCopy?`copy={localCopy(locale,${JSON.stringify(sectionKeys)})}`:null,usesCases?'caseItems={cases(locale)}':null,usesSolutions?'solutionItems={solutions(locale)}':null,name==='CaseFilters'?'cards={cases(locale).map(item=><CaseCard key={item.slug} item={item} locale={locale} />)}':null].filter(Boolean).join(' ');
 if(name==='Gallery')wrappers+=`export function Gallery({item,locale}:{item:ReturnType<typeof cases>[number];locale:Locale}){return <GalleryClient item={item} locale={locale}/>;}\n`;
 else wrappers+=`export function ${name}({locale${name==='InteractiveDemo'?',data=false':''}}:{locale:Locale${name==='InteractiveDemo'?';data?:boolean':''}}){return <${name}Client locale={locale} ${props} ${name==='InteractiveDemo'?'data={data}':''}/>;}\n`;
}
wrappers+='function localCopy(locale:Locale,sections:string[]){const source=raw as Record<string,Record<string,{zh:string;en:string}>>;return Object.fromEntries(sections.map(s=>[s,Object.fromEntries(Object.entries(source[s]).map(([k,v])=>[k,v[locale]]))]));}\n';
wrappers+='import {Plus,Minus} from "lucide-react";\n'+func(old,'FAQ')+'\nexport function AmbientFlow(){return null;}\n';
write('components/v3/interactive.tsx',wrappers);
write('components/v3/client-shared.tsx','import {MessagesSquare,FileText,Network,ChartNoAxesCombined} from "lucide-react";\n'+func(ui,'Logo')+'\nexport const solutionIcons=[MessagesSquare,FileText,Network,ChartNoAxesCombined];\n');
write('components/Header.tsx','export { Header } from "./v3/interactive";\n');
const mappings={HomeView:'Home',ServicesOverviewView:'Services',SolutionDetailView:'SolutionDetail',CasesOverviewView:'CasesPage',CaseDetailView:'CaseDetail',TechnologyView:'Technology',EngagementView:'Engagement',AboutView:'About',ContactView:'Contact',InsightsOverviewView:'Insights',InsightArticleView:'Article',LegalView:'Legal',NotFoundView:'Missing'};
let facade='// Page content restored from the final v1 snapshot; v3 presentation lives in ./v3.\nimport type {ComponentProps} from "react";\nimport {Footer} from "./v3/ui";\n';
for(const [view,name] of Object.entries(mappings)){facade+=`import {${name}} from "./v3/pages/${name}";\nexport function ${view}(props:ComponentProps<typeof ${name}>){return <><main id="main"><${name} {...props}/></main><Footer locale={props.locale}/></>;}\n`;}
write('components/PageTemplates.tsx',facade);
// Preserve proven layout relationships while replacing the entire old palette below.
let css=read('app/globals.css').replace(/@font-face\{[^}]*\}/g,'').replace('@import "tailwindcss";','').replace(/:root\{[^}]*\}/,'');
css=css.replace(/url\('\/art\/[^']+'\)/g,'none');
// Retire every old literal color. Material/semantic overrides are in v3.css.
css=css.replace(/#[0-9a-fA-F]{3,8}\b/g,hex=>{
 const h=hex.slice(1),s=h.length===3?[...h].map(x=>x+x).join(''):h;
 const rgb=[0,2,4].map(i=>parseInt(s.slice(i,i+2),16));const avg=rgb.reduce((a,b)=>a+b,0)/3;
 if(s.length===4||s.length===8)return 'var(--line)';
 if(avg<55)return 'var(--n1)';if(avg<130)return 'var(--muted)';if(avg>235)return 'var(--p1)';if(avg>195)return 'var(--p3)';return 'var(--brand)';
});
write('app/styles/v3-foundation.css',css);
console.log('Restored complete v1 page functions, chrome, form, presets and data.');
