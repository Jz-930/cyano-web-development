import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';

const root = path.resolve(import.meta.dirname, '../..');
const ref = 'b9dcf94';
const read = name => execFileSync('git', ['show', `${ref}:site/${name}`], { cwd: root, encoding: 'utf8', maxBuffer: 4e6 });
const out = path.join(root, 'content/baseline-v1');
await fs.mkdir(out, {recursive:true});
const files = ['copy', 'cases', 'founders', 'articles', 'query-demo'];
const raw = {};
for (const name of files) {
  raw[name] = JSON.parse(read(`content/${name}.json`));
  await fs.writeFile(path.join(out, `${name}.json`), JSON.stringify(raw[name], null, 2) + '\n');
}
const lib = ts.transpileModule(read('lib/content.ts'), {compilerOptions:{module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2020, esModuleInterop:true}}).outputText;
const exp = {};
new Function('require', 'exports', lib)(name => raw[path.basename(name, '.json')], exp);
const normalized = {sourceCommit:ref};
for (const name of ['cases','solutions','founders','insights']) {
  const zh = exp[name]('zh'), en = exp[name]('en');
  normalized[name] = zh.map((item, i) => ({zh:item,en:en[i]}));
}
const pages = read('components/pages.tsx');
const sf = ts.createSourceFile('pages.tsx', pages, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const literal = node => {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  throw Error('Expected literal in baseline extraction');
};
const legal = sf.statements.find(s => ts.isFunctionDeclaration(s) && s.name?.text === 'Legal');
normalized.legal = {privacy:{},terms:{}};
for (const statement of legal.body.statements) {
  if (!ts.isVariableStatement(statement)) continue;
  for (const decl of statement.declarationList.declarations) {
    if (!['zh','en'].includes(decl.name.getText(sf))) continue;
    normalized.legal.privacy[decl.name.getText(sf)] = literal(decl.initializer.whenTrue);
    normalized.legal.terms[decl.name.getText(sf)] = literal(decl.initializer.whenFalse);
  }
}
normalized.inlinePairs = [];
normalized.arrayPairs = [];
for (const name of ['pages','ui','interactive','business-visuals']) {
  const source = read(`components/${name}.tsx`);
  const tree = ts.createSourceFile(name+'.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const visit = node => {
    if (ts.isCallExpression(node) && node.expression.getText(tree) === 't' && node.arguments.length === 3) {
      try { normalized.inlinePairs.push({file:`components/${name}.tsx`,line:tree.getLineAndCharacterOfPosition(node.pos).line+1, zh:literal(node.arguments[1]),en:literal(node.arguments[2])}); } catch {
        const base = n => ts.isElementAccessExpression(n) ? base(n.expression) : n;
        try { normalized.arrayPairs.push({file:`components/${name}.tsx`,line:tree.getLineAndCharacterOfPosition(node.pos).line+1,zh:literal(base(node.arguments[1])),en:literal(base(node.arguments[2]))}); } catch {}
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);
}
await fs.writeFile(path.join(out,'normalized.json'), JSON.stringify(normalized,null,2)+'\n');
await fs.writeFile(path.join(out,'README.md'), `# v1 文案基线\n\n逐字提取自 Git ${ref}；由 site/scripts/extract-v1-baseline.mjs 可重复生成。normalized.json 仅整理 v1 既有数据、双语文案和法律条款，不生成新业务事实。\n`);
console.log(`Extracted ${files.length} source files, ${normalized.inlinePairs.length} inline bilingual pairs and all legal clauses from ${ref}.`);
