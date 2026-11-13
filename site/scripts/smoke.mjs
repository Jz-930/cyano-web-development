import fs from 'node:fs/promises';
const base='http://localhost:3000';
const sitemap=await (await fetch(base+'/sitemap.xml')).text();
const paths=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const refs=new Set(['/robots.txt','/sitemap.xml','/icon.svg','/apple-touch-icon.png']);
const result=[];
for(const p of paths){const r=await fetch(base+p);const html=await r.text();const h1=(html.match(/<h1\b/g)||[]).length;result.push({path:p,status:r.status,h1});for(const m of html.matchAll(/(?:href|src)="(\/[^"#?]+)(?:[^"\s]*)?"/g)){if(!m[1].startsWith('//')&&!m[1].startsWith('/api/'))refs.add(m[1])}}
const archive=JSON.parse(await fs.readFile('../docs/archive-report.json','utf8'));for(const r of archive)if(r.status===200)refs.add(r.url);
const failures=[];const queue=[...refs];await Promise.all(Array.from({length:6},async()=>{while(queue.length){const p=queue.shift();const r=await fetch(base+p,{method:'HEAD'});if(r.status!==200)failures.push({path:p,status:r.status})}}));
const api=[];for(const [name,payload,origin,expected] of [['null',null,base,400],['empty',{},base,400],['cross-origin',{},'https://example.com',403],['unconfigured-delivery',{name:'Local QA',company:'Cyano',email:'local-check@example.com',inquiry:'evaluate',message:'Local validation of inquiry delivery.',consent:'yes',locale:'zh'},base,503]]){const r=await fetch(base+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json',origin},body:JSON.stringify(payload)});const body=await r.json();api.push({name,status:r.status,expected,error:body.error});if(r.status!==expected)failures.push({api:name,status:r.status,expected})}
const nf=await fetch(base+'/not-a-real-page');if(nf.status!==404)failures.push({path:'404',status:nf.status});
const report={date:'2026-11-12',pages:result,refsChecked:refs.size,api,notFoundStatus:nf.status,failures};await fs.writeFile('../docs/smoke-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({pages:result.length,refs:refs.size,api,notFound:nf.status,failures},null,2));if(result.some(r=>r.status!==200||r.h1!==1)||failures.length)process.exit(1);
