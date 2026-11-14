import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const root=path.resolve(import.meta.dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),write=(p,s)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),s)};
const parse=(s,f='file.tsx')=>ts.createSourceFile(f,s,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
function prune(source){
 const ast=parse(source),body=ast.statements.filter(x=>!ts.isImportDeclaration(x)).map(x=>x.getText()).join('\n');
 const imports=[];
 for(const stmt of ast.statements.filter(ts.isImportDeclaration)){
  const clause=stmt.importClause;if(!clause){imports.push(stmt.getText());continue;}
  const used=n=>new RegExp(`\\b${n}\\b`).test(body);
  const def=clause.name&&used(clause.name.text)?clause.name.text:null;
  const binds=clause.namedBindings&&ts.isNamedImports(clause.namedBindings)?clause.namedBindings.elements.filter(x=>used(x.name.text)).map(x=>x.getText()):[];
  const parts=[def,binds.length?`{${binds.join(',')}}`:null].filter(Boolean);if(parts.length)imports.push(`import ${clause.isTypeOnly?'type ':''}${parts.join(',')} from ${stmt.moduleSpecifier.getText()};`);
 }
 return imports.join('\n')+'\n'+body+'\n';
}
const facade=read('components/PageTemplates.tsx'),ast=parse(facade),imports=ast.statements.filter(ts.isImportDeclaration).map(x=>x.getText()).join('\n');
for(const fn of ast.statements.filter(ts.isFunctionDeclaration)){
 const name=fn.name.text;let code=prune(imports+'\n'+fn.getText());code=code.replaceAll('"./v3/','"../');write(`components/v3/views/${name}.tsx`,code);
}
function walk(dir){for(const entry of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const file=`${dir}/${entry.name}`;if(entry.isDirectory())walk(file);else if(file.endsWith('.tsx')){let source=read(file);source=source.replace(/import \{ (\w+) \} from "@\/components\/PageTemplates";/g,(_,name)=>`import { ${name} } from "@/components/v3/views/${name}";`);write(file,source);}}}walk('app');
const interactive=read('components/v3/interactive.tsx'),ia=parse(interactive),ii=ia.statements.filter(ts.isImportDeclaration).map(x=>x.getText()).join('\n'),local=ia.statements.find(x=>ts.isFunctionDeclaration(x)&&x.name?.text==='localCopy').getText();
for(const fn of ia.statements.filter(x=>ts.isFunctionDeclaration(x)&&x.name?.text!=='localCopy')){
 const name=fn.name.text;const body=fn.getText()+(fn.getText().includes('localCopy')?'\n'+local:'');let code=prune(ii+'\n'+body);code=code.replaceAll('from "./','from "../');write(`components/v3/islands/${name}.tsx`,code);
}
write('components/Header.tsx','export {Header} from "./v3/islands/Header";\n');
for(const name of fs.readdirSync(path.join(root,'components/v3/pages'))){const file=`components/v3/pages/${name}`;let source=read(file);source=source.replace(/import \{([^}]+)\} from "\.\.\/interactive";/g,(_,names)=>names.split(',').map(n=>n.trim()).filter(Boolean).map(n=>`import {${n}} from "../islands/${n}";`).join('\n'));write(file,source);}
const visuals=read('components/v3/visuals.tsx'),va=parse(visuals),vi=va.statements.filter(ts.isImportDeclaration).map(x=>x.getText()).join('\n');
for(const fn of va.statements.filter(ts.isFunctionDeclaration))write(`components/v3/${fn.name.text}.tsx`,prune(vi+'\n'+fn.getText()));
for(const name of fs.readdirSync(path.join(root,'components/v3/pages'))){const file=`components/v3/pages/${name}`;write(file,read(file).replace(/import \{([^}]+)\} from "\.\.\/visuals";/g,(_,names)=>names.split(',').map(n=>n.trim()).filter(Boolean).map(n=>`import {${n}} from "../${n}";`).join('\n')));}
console.log('Each route now has an independent server entry and imports only its own client islands.');
