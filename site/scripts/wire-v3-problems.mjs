import fs from 'node:fs';
import path from 'node:path';
const file=path.resolve(import.meta.dirname,'../components/v3/pages/Home.tsx');let s=fs.readFileSync(file,'utf8');
const start=s.indexOf('          <div className="difference-grid">'),end=s.indexOf('          <Link',start);
if(start>=0&&end>start){
 s=s.slice(0,start)+`          <ProblemTabs locale={locale} items={[1,2,3,4].map(i=>{const [before,answer]=text("D.2","痛点 "+i,locale).split("→");const [title,...body]=before.split(locale==="zh"?" —— ":" —");return {title,issue:body.join(locale==="zh"?" —— ":" —"),answer:answer.trim()};})}/>\n`+s.slice(end);
 s='import {ProblemTabs} from "../ProblemTabs";\n'+s;fs.writeFileSync(file,s);
}
