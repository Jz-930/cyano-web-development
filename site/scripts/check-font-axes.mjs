import fs from 'node:fs/promises';
import path from 'node:path';
import fontverter from 'fontverter';
const root=path.resolve(import.meta.dirname,'..');
const css=await fs.readFile(path.join(root,'app/styles/cjk-font.css'),'utf8');
const cjk=[...css.matchAll(/url\("([^" ]+)"\)/g)].map(m=>`public${m[1]}`);
for(const file of ['app/fonts/inter-latin.woff2','app/fonts/manrope-latin.woff2',...cjk]){
 const font=await fontverter.convert(await fs.readFile(path.join(root,file)),'sfnt');
 let offset;
 for(let i=0;i<font.readUInt16BE(4);i++){const d=12+i*16;if(font.toString('ascii',d,d+4)==='fvar')offset=font.readUInt32BE(d+8);}
 if(offset===undefined)throw Error(`${file} has no variable axis`);
 const count=font.readUInt16BE(offset+8),size=font.readUInt16BE(offset+10),start=offset+font.readUInt16BE(offset+4),axes=[];
 for(let i=0;i<count;i++){const a=start+i*size;axes.push({tag:font.toString('ascii',a,a+4),min:font.readInt32BE(a+4)/65536,max:font.readInt32BE(a+12)/65536});}
 if(!axes.some(a=>a.tag==='wght'&&a.min<=400&&a.max>=600))throw Error(`${file} cannot render distinct 400/600 weights`);
 console.log(file,JSON.stringify(axes));
}
