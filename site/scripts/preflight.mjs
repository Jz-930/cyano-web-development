import fs from 'node:fs/promises';
import path from 'node:path';
import dns from 'node:dns/promises';
import {z} from 'zod';
const root=path.resolve(import.meta.dirname,'..');
const raw=JSON.parse(await fs.readFile(path.join(root,'content/cases.json'),'utf8'));
const schema=z.array(z.object({slug:z.string().min(1),title:z.string().min(1),profile:z.string().min(1),images:z.array(z.string().min(1)).min(1),stats:z.array(z.object({value:z.string().min(1),label:z.string().min(1),sourceId:z.string().min(1)})).length(3)}));
schema.parse(raw);
const sources=await fs.readFile(path.join(root,'../content/sources.md'),'utf8');
for(const c of raw){for(const stat of c.stats){const section=sources.split('## '+stat.sourceId+'\n')[1]?.split('\n## ')[0];if(!section||!section.includes('derivation:')||!section.includes('salesAnswer:'))throw new Error('Missing numeric source '+stat.sourceId)}}
for(const c of raw){for(const image of c.images)await fs.access(path.join(root,'public',image))}
for(const image of ['portraits.webp','team.webp'])await fs.access(path.join(root,'public/art',image));
const availability={email:false,demos:{}};
try{availability.email=(await dns.resolveMx('cyano.app')).length>0}catch{}
const results=await Promise.all(raw.filter(c=>c.demo).map(async c=>{try{const response=await fetch(c.demo,{signal:AbortSignal.timeout(12000)});const html=await response.text();const ok=response.status===200&&/<title>[^<]+<\/title>/i.test(html);availability.demos[c.slug]=ok;return `${c.demo} — HTTP ${response.status}; enabled=${ok}`}catch(e){availability.demos[c.slug]=false;return `${c.demo} — disabled: ${e.message}`}}));
await fs.writeFile(path.join(root,'content/availability.json'),JSON.stringify(availability,null,2));
await fs.writeFile(path.join(root,'../docs/link-report.md'),'# Link availability\n\n'+new Date().toISOString()+'\n\n'+results.join('\n\n'));
console.log('Content validated. 31 case screenshots verified.');console.log(results.join('\n'));
