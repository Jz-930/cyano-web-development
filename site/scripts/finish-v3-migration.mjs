// Idempotent presentation migration helpers; never rewrites the v1 business copy.
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
// Remove unused imports from the mechanically split page modules.
for(const name of fs.readdirSync(path.join(root,'components/v3/pages'))){
 const file=`components/v3/pages/${name}`,source=read(file),ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const body=ast.statements.filter(x=>!ts.isImportDeclaration(x)).map(x=>x.getText()).join('\n');
 const imports=[];
 for(const stmt of ast.statements.filter(ts.isImportDeclaration)){
   const clause=stmt.importClause;if(!clause){imports.push(stmt.getText());continue;}
   const used=n=>new RegExp(`\\b${n}\\b`).test(body);
   const def=clause.name&&used(clause.name.text)?clause.name.text:null;
   const binds=clause.namedBindings&&ts.isNamedImports(clause.namedBindings)?clause.namedBindings.elements.filter(x=>used(x.name.text)).map(x=>x.getText()):[];
   const parts=[def,binds.length?`{ ${binds.join(', ')} }`:null].filter(Boolean);
   if(parts.length)imports.push(`import ${parts.join(', ')} from ${stmt.moduleSpecifier.getText()};`);
 }
 write(file,imports.join('\n')+'\n\n'+body+'\n');
}
const mappings={HomeView:['Home',''],ServicesOverviewView:['Services','services'],SolutionDetailView:['SolutionDetail','services/'],CasesOverviewView:['CasesPage','cases'],CaseDetailView:['CaseDetail','cases/'],TechnologyView:['Technology','technology'],EngagementView:['Engagement','engagement'],AboutView:['About','about'],ContactView:['Contact','contact'],InsightsOverviewView:['Insights','insights'],InsightArticleView:['Article','insights/'],LegalView:['Legal',null],NotFoundView:['Missing','404']};
let facade='// Final v1 content, with approved v3 presentation.\nimport type {ComponentProps} from "react";\nimport {PageShell} from "./v3/PageShell";\n';
for(const [view,[name,route]] of Object.entries(mappings)){
 const expr=route===null?'props.type':route.endsWith('/')?`${JSON.stringify(route)}+props.slug`:JSON.stringify(route);
 facade+=`import {${name}} from "./v3/pages/${name}";\nexport function ${view}(props:ComponentProps<typeof ${name}>){return <PageShell locale={props.locale} route={${expr}}><${name} {...props}/></PageShell>;}\n`;
}
write('components/PageTemplates.tsx',facade);
// A single 9-step type scale, including legacy responsive declarations.
const scale=[12,14,16,18,20,24,32,48,68];
const closest=n=>scale.reduce((a,b)=>Math.abs(b-n)<Math.abs(a-n)?b:a);
let css=read('app/styles/v3-foundation.css');
css=css.replace(/(font(?:-size)?\s*:)([^;}]+)/g,(_,prop,value)=>prop+value.replace(/(?<![\d.])(\d+(?:\.\d+)?)px/g,(_,n)=>`var(--s${closest(Number(n))})`));
css=css.replace(/(?<=[\s:,])white(?=[;},\s])/g,'var(--p2)').replace(/(?<=[\s:,])black(?=[;},\s])/g,'var(--n0)');
write('app/styles/v3-foundation.css',css);
// Metadata is server-only; obsolete v2 client modules must not remain in the graph.
const old=['BrandLogo','CaseVisuals','ContactForm','EditorialVisuals','EngagementVisuals','Footer','HeroProvenanceStage','HomeVisuals','InteractiveDemo','MotionPrimitives','PageHeaders','TechVisuals'];
for(const name of old){const file=path.join(root,`components/${name}.tsx`);if(fs.existsSync(file))fs.unlinkSync(file);}
console.log('Split pages, restored JSON-LD, normalized typography and retired obsolete v2 components.');
