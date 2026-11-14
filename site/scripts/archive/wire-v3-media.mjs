import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const root=path.resolve(import.meta.dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
const visualFile='components/v3/visuals.tsx';let visuals=read(visualFile);
let ast=ts.createSourceFile(visualFile,visuals,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const diagram=ast.statements.find(x=>ts.isFunctionDeclaration(x)&&x.name?.text==='EngineeringDiagram');
if(diagram){
 let source=diagram.getText().replace('return <svg','const id=useId(); return <svg').replaceAll('grid-${variant}','grid-${id}');
 write('components/v3/EngineeringDiagram.tsx','import {useId} from "react";\n'+source+'\n');
 visuals=visuals.slice(0,diagram.pos)+visuals.slice(diagram.end);
 visuals='import {EngineeringDiagram} from "./EngineeringDiagram";\n'+visuals;
 visuals=visuals.replace(/<img src=\{`\/v3-materials\/founder-\$\{i\+1\}\.webp`\}[^>]+\/>/,'<span className="team-role-number" aria-hidden="true">0{i+1}</span>');
 write(visualFile,visuals);
}
// Generated cover geometry removes screenshot duplication without adding new claims.
let ui=read('components/v3/ui.tsx');
ui=ui.replace(/<img\s+src=\{a.image\}[\s\S]*?\/>/,'<EngineeringDiagram variant={i+2}/>');
if(!ui.includes('import {EngineeringDiagram}'))ui='import {EngineeringDiagram} from "./EngineeringDiagram";\n'+ui;
write('components/v3/ui.tsx',ui);
let explorer=read('components/v3/SolutionExplorerClient.tsx');
explorer=explorer.replace(/<img\s+src=\{caseItems\[selected\][\s\S]*?\/>/,'<EngineeringDiagram variant={selected}/>');
if(!explorer.includes('import {EngineeringDiagram}'))explorer=explorer.replace('"use client";','"use client";\nimport {EngineeringDiagram} from "./EngineeringDiagram";');
write('components/v3/SolutionExplorerClient.tsx',explorer);
for(const file of ['components/v3/ui.tsx','components/v3/pages/Services.tsx','components/v3/pages/Contact.tsx','components/v3/ScreenshotZoom.tsx']){
 let source=read(file),replacements=[];const parsed=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 function walk(node){
  if(ts.isJsxSelfClosingElement(node)&&node.tagName.getText()==='img'){
   const attrs=node.attributes.properties.filter(ts.isJsxAttribute);
   const src=attrs.find(a=>a.name.getText()==='src')?.initializer?.getText(),alt=attrs.find(a=>a.name.getText()==='alt')?.initializer?.getText();
   if(src&&alt&&src!=='"/logo.png"'){
    const hero=src==='{crop}';replacements.push([node.getStart(),node.end,`<Picture src=${src} alt=${alt}${hero?' priority sizes="(max-width: 800px) 90vw, 450px"':src==='{image}'?' sizes="90vw"':''}/>`]);
   }
  }
  ts.forEachChild(node,walk);
 }walk(parsed);
 for(const [start,end,value]of replacements.reverse())source=source.slice(0,start)+value+source.slice(end);
 if(replacements.length){const imp=`import {Picture} from "${file.includes('/pages/')?'../':'./'}Picture";\n`;source=source.startsWith('"use client";')?source.replace('"use client";','"use client";\n'+imp):imp+source;write(file,source);}
}
const api='app/api/contact/route.ts',route=read(api),cut=route.indexOf('  /* Legacy mail-only');if(cut>=0)write(api,route.slice(0,cut)+'}\n');
console.log('Connected responsive imagery and removed screenshot/decorative duplication.');
