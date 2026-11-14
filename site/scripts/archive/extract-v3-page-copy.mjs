// Move restored v1 inline bilingual copy into content files without changing a word.
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const directory=path.join(root,'components/v3/pages');
fs.mkdirSync(path.join(root,'content/v3/pages'),{recursive:true});
let count=0;
for(const name of fs.readdirSync(directory)){
 const file=path.join(directory,name),source=fs.readFileSync(file,'utf8'),sf=ts.createSourceFile(name,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),copy={},edits=[];
 const literal=n=>ts.isStringLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n)?n.text:ts.isArrayLiteralExpression(n)&&n.elements.every(e=>literal(e)!==undefined)?n.elements.map(literal):undefined;
 function walk(node){
  if(ts.isCallExpression(node)&&node.expression.getText()==='t'&&node.arguments.length===3){
   const [locale,zh,en]=node.arguments;let z=literal(zh),e=literal(en),suffix='';
   if(z===undefined&&ts.isElementAccessExpression(zh)&&ts.isElementAccessExpression(en)&&zh.argumentExpression.getText()===en.argumentExpression.getText()){
    z=literal(zh.expression);e=literal(en.expression);suffix=`[${zh.argumentExpression.getText()}]`;
   }
   if(z!==undefined&&e!==undefined){
    const key='c'+createHash('sha256').update(JSON.stringify([z,e])).digest('hex').slice(0,10);copy[key]={zh:z,en:e};edits.push([node.getStart(),node.end,`pageCopy.${key}[${locale.getText()}]${suffix}`]);return;
   }
  }
  ts.forEachChild(node,walk);
 }walk(sf);
 if(!edits.length)continue;
 let changed=source;for(const [a,b,value]of edits.reverse())changed=changed.slice(0,a)+value+changed.slice(b);
 const jsonName=name.replace('.tsx','.json');
 fs.writeFileSync(path.join(root,'content/v3/pages',jsonName),JSON.stringify(copy,null,2)+'\n');
 fs.writeFileSync(file,`import pageCopy from "@/content/v3/pages/${jsonName}";\n`+changed);count+=edits.length;
}
console.log(`Moved ${count} verbatim bilingual page expressions to content/v3/pages.`);
