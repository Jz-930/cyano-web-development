import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../..');
const spec=await fs.readFile(path.join(root,'Cyano官网重建方案.md'),'utf8');
const out=path.join(root,'site');
await fs.mkdir(path.join(out,'content'),{recursive:true});
const copy={}; let section='';
for(const line of spec.split(/\r?\n/)){
 const match=line.match(/^### (D\.\d+)/); if(match)section=match[1];
 if(section && line.startsWith('|')&&!line.includes('---')){
  const cells=line.split('|').slice(1,-1).map(s=>s.trim());
  if(cells.length===3 && !['位置','区块','形态','问题（中 / 英）'].includes(cells[0]))(copy[section]??={})[cells[0]]={zh:cells[1],en:cells[2]};
 }
}
await fs.writeFile(path.join(out,'content/copy.json'),JSON.stringify(copy,null,2));
const groups=[
['sales-consultant-ai','lnpe-sales-ai','lnpe-sales-consultant',['01-public-assistant','02-access-portal','03-project-match','04-price-reference'],2,'https://lnpe-2026.vercel.app/'],
['proposal-generation','huisheng-proposal-ai','huisheng-proposal-ai',['01-workflow-draft','02-start-draft'],0,'https://research-bp-writing.vercel.app/'],
['it-knowledge-assistant','enterprise-wiki-ai','enterprise-wiki-it-assistant',['01-dashboard','02-articles','03-article-detail','04-ticket-detail','05-analytics'],0],
['nl-data-query','smartdoc-ui-suite','smartdoc-ui-suite',['01-dashboard-overview','02-sql-control-center','03-knowledge-base','04-proposal-builder','05-review-audit','06-template-library'],1],
['property-management','alpha-house-ai','alpha-house',['01-login','02-messages','03-work-order-chat','04-finance','05-contacts','06-reports'],3,'https://alphahouse-demo.vercel.app/'],
['writing-memory-engine','dme-writing-engine','dme-writing-engine',['00-startup-loading','01-chat-branch-switch','02-chat-memory-drawer','03-context-memory-stats','04-note-editor-ai-panel','05-fragments-library-bulk','06-archive-pack-inspect','07-connections-settings'],1]
];
const caseRows=spec.split(/\r?\n/).filter(l=>/^\| `(?:sales-consultant-ai|proposal-generation|it-knowledge-assistant|nl-data-query|property-management|writing-memory-engine)` \|/.test(l));
const cases=groups.map(([slug,folder,prefix,shots,main,demo],i)=>{
 const cells=caseRows.find(l=>l.includes('`'+slug+'`') && l.split('|').length >= 12).split('|').slice(1,-1).map(s=>s.trim());
 return {slug,title:cells[1],system:cells[2],solution:cells[3],model:cells[4],duration:cells[5],profile:cells[6],stats:cells[7].split('；').map(s=>{const [value,...label]=s.split('：');return {value,label:label.join('：'),sourceId:'case-'+slug}}),beforeAfter:cells[8],outcome:cells[9],images:shots.map(s=>'/media/'+folder+'/'+prefix+'-'+s+'.webp'),main,demo:demo??null};
});
await fs.writeFile(path.join(out,'content/cases.json'),JSON.stringify(cases,null,2));
const founders=spec.split(/\r?\n/).filter(l=>/^\| F[1-4] \|/.test(l)&&l.split('|').length===8).map(l=>{const c=l.split('|').slice(1,-1).map(x=>x.trim());return {id:c[0],role:c[1].split(' / '),tags:c[2].split(' / '),motto:c[3].split(' / '),bio:[c[4],c[5]]}});
await fs.writeFile(path.join(out,'content/founders.json'),JSON.stringify(founders,null,2));
const urls=new Set(['/logo.png',...cases.flatMap(c=>c.images)]);
await fs.mkdir(path.join(root,'archive'),{recursive:true});
for(const page of ['','services','cases','technology','contact']){
 try {const html=await (await fetch('https://cyano.app/'+page)).text(); await fs.writeFile(path.join(root,'archive',(page||'index')+'.html'),html);
 for(const m of html.matchAll(/(?:src|href|poster)=["']([^"']+)["']/g)){let url=m[1].replaceAll('&amp;','&');if(url.startsWith('/media/'))urls.add(url);if(url.startsWith('/_next/image')){const u=new URL(url,'https://cyano.app');const media=u.searchParams.get('url');if(media?.startsWith('/media/'))urls.add(media)}}
 for(const m of html.matchAll(/\/media\/[^\s"'<>\\]+\.(?:svg|png|webp|jpe?g|mp4)/g))urls.add(m[0]);
 }catch(e){console.log('Archive failed:',page,e.message)}
}
const report=[];
const queue=[...urls];
async function worker(){while(queue.length){const url=queue.shift();try{const dest=path.join(out,'public',decodeURIComponent(url));await fs.mkdir(path.dirname(dest),{recursive:true});const response=await fetch('https://cyano.app'+url);if(!response.ok)throw new Error('HTTP '+response.status);await fs.writeFile(dest,Buffer.from(await response.arrayBuffer()));report.push({url,status:200});}catch(e){report.push({url,error:e.message})}}}
await Promise.all(Array.from({length:6},worker));
await fs.writeFile(path.join(root,'docs/archive-report.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({copySections:Object.keys(copy),cases:cases.length,founders:founders.length,downloads:report.length,failed:report.filter(r=>r.error)}));

