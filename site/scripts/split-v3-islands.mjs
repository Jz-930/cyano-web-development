import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const root=path.resolve(import.meta.dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
// Chart geometry is server-rendered; the slider implementation loads near the viewport.
let chart=read('components/v3/LatencyChart.tsx');
if(chart.startsWith('"use client"')){
 const figure=chart.replace('"use client";\n','').replace('import {useId,useState} from "react";','import {useId} from "react";\nimport illustration from "@/content/latency-illustration.json";').replace(/const points=\[.*\];/,'const points=illustration.points;').replace('export function LatencyChart({locale}:{locale:Locale})','export function ChartFigure({locale,turn=50,onChange}:{locale:Locale;turn?:number;onChange?:(turn:number)=>void})').replace('const [turn,setTurn]=useState(50),id=useId();','const id=useId();').replace('onChange={e=>setTurn(Number(e.target.value))}','disabled={!onChange} onChange={onChange?e=>onChange(Number(e.target.value)):undefined}');
 write('components/v3/ChartFigure.tsx',figure);
 write('components/v3/ChartControl.tsx','"use client";\nimport {useState} from "react";\nimport {type Locale} from "@/lib/locale";\nimport {ChartFigure} from "./ChartFigure";\nexport function ChartControl({locale}:{locale:Locale}){const [turn,setTurn]=useState(50);return <ChartFigure locale={locale} turn={turn} onChange={setTurn}/>;}\n');
 write('components/v3/LatencyChart.tsx','import {type Locale} from "@/lib/locale";\nimport {ChartFigure} from "./ChartFigure";\nimport {ChartIsland} from "./VisibleIslands";\nexport function LatencyChart({locale}:{locale:Locale}){return <ChartIsland locale={locale}><ChartFigure locale={locale}/></ChartIsland>;}\n');
}
// Extract preset arrays without rewriting any original question or response.
let demo=read('components/v3/InteractiveDemoClient.tsx');
if(demo.includes('const demoQuestions =')){
 const sf=ts.createSourceFile('demo.tsx',demo,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const q=sf.statements.find(n=>ts.isVariableStatement(n)&&n.declarationList.declarations[0].name.getText()==='demoQuestions');
 const qObj=ts.transpileModule(q.getText().replace('const demoQuestions =','module.exports ='),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 const mod={exports:{}};new Function('module',qObj)(mod);
 const zh=['本月各区域销售额是多少？','哪些商品库存低于安全线？','近六个月销售趋势如何？','华东地区最畅销的商品？','哪些库存周转较慢？','本月销量与上月相比？'];
 const en=['Sales by region this month?','Which items are below safety stock?','Sales trend over six months?','Top products in the East region?','Which inventory moves slowly?','Sales compared with last month?'];
 const payload={knowledge:mod.exports,data:{zh,en}};
 write('content/v1/demo-questions.json',JSON.stringify(payload,null,2)+'\n');
 demo=demo.slice(0,q.pos)+demo.slice(q.end);
 demo=demo.replace('import queryDemo from','import presetQuestions from "@/content/v1/demo-questions.json";\nimport queryDemo from');
 demo=demo.replace(/  const questions = data[\s\S]*?: demoQuestions\[locale\];/,'  const questions = presetQuestions[data?"data":"knowledge"][locale];');
 write('components/v3/InteractiveDemoClient.tsx',demo);
}
let wrappers=read('components/v3/interactive.tsx');
wrappers=wrappers.replace('import {InteractiveDemo as InteractiveDemoClient} from "./InteractiveDemoClient";','import {DemoIsland} from "./VisibleIslands";\nimport {DemoPreview} from "./DemoPreview";');
wrappers=wrappers.replace('return <InteractiveDemoClient locale={locale} copy={localCopy(locale,["D.1"])} data={data}/>;','return <DemoIsland locale={locale} data={data} copy={localCopy(locale,["D.1"])}><DemoPreview locale={locale} data={data}/></DemoIsland>;');
write('components/v3/interactive.tsx',wrappers);
console.log('Moved chart controls, preset demos and image dialogs into on-demand islands.');
