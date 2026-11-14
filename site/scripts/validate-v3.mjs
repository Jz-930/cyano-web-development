import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import ts from 'typescript';
import {z} from 'zod';
const require=createRequire(import.meta.url),root=path.resolve(import.meta.dirname,'..');
const json=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const bilingual=z.object({zh:z.string().min(1),en:z.string().min(1)});
const copy=z.record(z.string(),z.record(z.string(),bilingual)).parse(json('content/v1/copy.json'));
const cases=z.array(z.object({slug:z.string().min(1),images:z.array(z.string().min(1)).min(1).max(50),main:z.number().int().nonnegative(),stats:z.array(z.object({value:z.string(),label:z.string(),sourceId:z.string()})).min(1).max(12)}).passthrough()).min(1).max(100).parse(json('content/v1/cases.json'));
const articles=z.record(z.string(),z.object({zh:z.array(z.object({q:z.string().min(1),a:z.string().min(1)})).min(1),en:z.array(z.object({q:z.string().min(1),a:z.string().min(1)})).min(1)})).parse(json('content/articles.json'));
z.object({email:z.boolean(),demos:z.record(z.string(),z.boolean())}).passthrough().parse(json('content/v1/availability.json'));
const sources=fs.readFileSync(path.join(root,'../content/sources.md'),'utf8');
if(new Set(cases.map(c=>c.slug)).size!==cases.length)throw Error('Duplicate case identities');
for(const c of cases){if(!c.images[c.main])throw Error(`Missing main image: ${c.slug}`);for(const src of c.images)if(!fs.existsSync(path.join(root,'public',src)))throw Error(`Missing screenshot ${src}`);for(const stat of c.stats)if(!sources.includes(`## ${stat.sourceId}`))throw Error(`Missing source ${stat.sourceId}`);}
// Retain strict schemas for the route metadata adapter. Validation stays at build time.
const module={exports:{}};
const js=ts.transpileModule(fs.readFileSync(path.join(root,'lib/schema.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
vm.runInNewContext(js,{module,exports:module.exports,require});
for(const [file,schema] of [['cases','CaseSchema'],['solutions','SolutionSchema'],['founders','FounderSchema'],['insights','InsightSchema']])z.array(module.exports[schema]).min(1).parse(json(`content/${file}-v2.json`));
const solutions=json('content/solutions-v2.json'),founders=json('content/founders-v2.json'),insights=json('content/insights-v2.json');
for(const s of solutions)if(!cases.some(c=>c.slug===s.caseSlug))throw Error(`Missing solution case ${s.slug}`);
for(const i of insights){if(!articles[i.slug])throw Error(`Missing article ${i.slug}`);if(!founders.some(f=>f.id===i.authorId))throw Error(`Missing author ${i.slug}`);}
for(const row of json('content/query-demo.json'))for(const locale of ['zh','en'])for(const cells of row.rows[locale])if(cells.length!==row.columns[locale].length)throw Error('Demo table column mismatch');
const baseline=json('content/v1/rendered-baseline.json');
const numeric=[];
for(const [route,{fragments}] of Object.entries(baseline))for(const text of fragments.filter(f=>/\d/.test(f)))numeric.push({route,text,sourceId:'v1-final-content',origin:'b9dcf94'});
const illustration=json('content/latency-illustration.json');
if(illustration.kind!=='illustration'||!illustration.source)throw Error('Chart provenance missing');
fs.writeFileSync(path.join(root,'../content/numeric-register-v3.json'),JSON.stringify({baseline:'b9dcf94',entries:numeric,illustrativeChart:illustration},null,2)+'\n');
if(!sources.includes('## v1-final-content'))throw Error('Missing final-v1 provenance entry');
console.log(`Validated v1 content, bilingual articles, metadata schemas and media references; ${numeric.length} numeric text occurrences registered.`);
