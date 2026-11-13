import fs from 'node:fs/promises';
import path from 'node:path';
import subsetFont from 'subset-font';
const root=path.resolve(import.meta.dirname,'..');
const font=path.join(root,'../assets/source/NotoSansSC-variable.ttf');
try{await fs.access(font)}catch{const url='https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf';const r=await fetch(url);if(!r.ok)throw new Error('Font download '+r.status);await fs.writeFile(font,Buffer.from(await r.arrayBuffer()))}
let source='';async function collect(dir){for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())await collect(p);else if(/\.(tsx?|json)$/.test(e.name))source+=await fs.readFile(p,'utf8')}}for(const d of ['content','components','lib'])await collect(path.join(root,d));
const glyphs=[...new Set(source.match(/[\u3000-\u9fff]/g)||[])].join('');
const data=await subsetFont(await fs.readFile(font),glyphs,{targetFormat:'woff2'});await fs.writeFile(path.join(root,'public/fonts/noto-sc-subset.woff2'),data);
await fs.writeFile(path.join(root,'app/fonts.css'),"@font-face{font-family:'Noto Sans SC';src:url('/fonts/noto-sc-subset.woff2') format('woff2');font-weight:100 900;font-display:swap}");console.log(JSON.stringify({glyphs:glyphs.length,bytes:data.length}));
