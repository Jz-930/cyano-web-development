import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const forbidden=/TODO|TBD|FIXME|待定|待确认|待补充|待填写|占位|lorem|ipsum|示例文字|请替换|此处填写|执行者|执行 Agent|本方案|本文档|内部用|内部代号|出于保密|竞业|演示公司|虚构企业|服务器位于|海外部署|境外部署|境内部署/i;
async function walk(dir){const all=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())all.push(...await walk(p));else all.push(p)}return all}
const htmlFiles=(await walk(path.join(root,'.next/server/app'))).filter(f=>f.endsWith('.html'));
let fails=[];for(const file of htmlFiles){let html=await fs.readFile(file,'utf8');html=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ');const match=html.match(forbidden);if(match)fails.push({file,match:match[0]})}
if(fails.length){console.error(fails);process.exit(1)}console.log(`Public copy scan passed: ${htmlFiles.length} rendered pages.`);
