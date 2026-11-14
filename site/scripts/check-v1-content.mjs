// Regression guard: compare final-v1 rendered content with current production HTML.
// This is an implementation check, not a quality review or scoring workflow.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import ts from 'typescript';
const require=createRequire(import.meta.url),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(import.meta.dirname,'..'),cache=new Map();
const get=p=>execFileSync('git',['show',`b9dcf94:site/${p}`],{cwd:root,encoding:'utf8',maxBuffer:8e6});
function load(file){
 if(cache.has(file))return cache.get(file);
 if(file.endsWith('.json'))return JSON.parse(get(file));
 const module={exports:{}};cache.set(file,module.exports);
 const js=ts.transpileModule(get(file),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText;
 const localRequire=p=>{
   if(p==='next/link')return {__esModule:true,default:({children,...props})=>React.createElement('a',props,children)};
   if(p==='next/navigation')return {usePathname:()=>'/'};
   if(p.includes('business-visuals'))return {BusinessHeroVisual:()=>null,CoreVisual:()=>null};
   if(p.startsWith('@/')||p.startsWith('.')){
     let f=p.startsWith('@/')?p.slice(2):path.posix.join(path.posix.dirname(file),p);
     if(!path.extname(f))f+=f.startsWith('components/')?'.tsx':'.ts';
     return load(f);
   }
   return require(p);
 };
 vm.runInNewContext(js,{module,exports:module.exports,require:localRequire,React,console,setTimeout,clearTimeout},{filename:file});
 return module.exports;
}
const pages=load('components/pages.tsx'),ui=load('components/ui.tsx'),content=load('lib/content.ts');
const normal=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#x27;|&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,'').replace(/\u00a0/g,'');
const clean=s=>s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi,'');
const results=[],baseline={};
const baselineOnly=process.argv.includes('--baseline');
for(const locale of ['zh','en']){
 const route=(r)=>`${locale==='en'?'en/':''}${r}`;
 const tasks=[['','Home'],['services','Services'],['cases','CasesPage'],['technology','Technology'],['engagement','Engagement'],['about','About'],['contact','Contact'],['insights','Insights'],['privacy','Legal',{type:'privacy'}],['terms','Legal',{type:'terms'}],...content.solutions(locale).map(s=>[`services/${s.slug}`,'SolutionDetail',{slug:s.slug}]),...content.cases(locale).map(s=>[`cases/${s.slug}`,'CaseDetail',{slug:s.slug}]),...content.insights(locale).map(s=>[`insights/${s.slug}`,'Article',{slug:s.slug}])];
 for(const [r,name,props={}] of tasks){
   const old=clean(renderToStaticMarkup(React.createElement(React.Fragment,null,React.createElement(pages[name],{locale,...props}),React.createElement(ui.Footer,{locale}))));
   const pathname=route(r).replace(/\/$/,'')||'index';
   const htmlfile=path.join(root,'.next/server/app',pathname+'.html');
   // Text nodes, rather than whole blocks, permit visual restructuring without copy loss.
   const fragments=[...new Set(old.split(/<[^>]+>/).map(normal).filter(s=>s.length>=4))];
   baseline['/'+route(r)]={text:old.replace(/<[^>]+>/g,' '),fragments};
   if(baselineOnly)continue;
   const current=normal(clean(fs.readFileSync(htmlfile,'utf8')).replace(/<[^>]+>/g,''));
   const sharedRemoved=['CYANO/ENTERPRISEAI','01/CYANO','02/CYANO','03/CYANO','04/CYANO','05/CYANO','06/CYANO'];
   const exceptions=[...sharedRemoved,...(name==='Technology'?['10×','投入回报最高可达','Returnoninvestment,upto',...(locale==='en'?['通义千问','企业微信']:[])]:[]),...(name==='Contact'?['项目咨询','聊聊你希望改进的工作流程','预约一次30–45分钟的沟通，讨论现有流程、资料和项目目标。','CONTACTUS','Tellusaboutyourworkflow','Booka30–45minutecalltodiscussyourprocess,sourcematerialandprojectgoals.']:[])];
   const missing=fragments.filter(s=>!current.includes(s)&&!exceptions.includes(s));
   results.push({route:'/'+route(r),fragments:fragments.length,missing});
 }
}
if(baselineOnly){fs.writeFileSync(path.join(root,'content/v1/rendered-baseline.json'),JSON.stringify(baseline,null,2)+'\n');console.log('Locked 46 rendered v1 page baselines.');process.exit(0);}
const report={baseline:'b9dcf94',routes:results.length,fragments:results.reduce((n,x)=>n+x.fragments,0),exceptions:['Technology: 10× ROI metric excluded by the approved v3 plan.','English technology: Qwen/Lark/DingTalk/WeCom use their English product names.'],results};
fs.mkdirSync(path.join(root,'../docs/implementation'),{recursive:true});
fs.writeFileSync(path.join(root,'../docs/implementation/v1-content-regression.json'),JSON.stringify(report,null,2)+'\n');
const failed=results.filter(r=>r.missing.length);
console.log(`${results.length} pages; ${report.fragments} baseline text fragments; ${failed.length} pages with missing text.`);
if(failed.length){console.error(JSON.stringify(failed,null,2));process.exit(1);}
