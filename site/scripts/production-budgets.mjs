import fs from 'node:fs';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
const root=path.resolve(import.meta.dirname,'..');
const results=[];
for(const route of ['index','en','technology','contact','en/terms']){
 const html=fs.readFileSync(path.join(root,`.next/server/app/${route}.html`),'utf8');
 const tags=[...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/g)];
 // Chromium does not fetch Next's nomodule compatibility bundle.
 const scripts=[...new Set(tags.filter(m=>!(/\bnomodule\b/i.test(m[0]))).map(m=>m[1]))];
 const entries=scripts.map(src=>{const file=path.join(root,'.next',src.replace(/^\/_next\//,'')),buf=fs.readFileSync(file);return{src,bytes:buf.length,gzip:gzipSync(buf).length};});
 results.push({route:route==='index'?'/':'/'+route,initialScripts:entries.length,excludedNoModule:tags.filter(m=>/\bnomodule\b/i.test(m[0])).map(m=>m[1]),gzipBytes:entries.reduce((n,e)=>n+e.gzip,0),entries});
}
const shader=gzipSync(fs.readFileSync(path.join(root,'components/v3/light-field.js'))).length;
const poster=fs.statSync(path.join(root,'public/v3-materials/field-poster.avif')).size;
const report={measurement:'Production HTML scripts for modern module-supporting browsers, gzip per file; excludes nomodule compatibility, later route prefetch and visibility-loaded islands. Not a network capture or Lighthouse result.',pages:results,shaderGzipBytes:shader,posterBytes:poster};
fs.mkdirSync(path.join(root,'../docs/implementation'),{recursive:true});fs.writeFileSync(path.join(root,'../docs/implementation/v3-build-budgets.json'),JSON.stringify(report,null,2)+'\n');
for(const r of results)console.log(`${r.route}: ${(r.gzipBytes/1024).toFixed(1)} KiB initial scripts (${r.initialScripts} files)`);
console.log(`Field: ${shader} bytes gzip; poster: ${poster} bytes`);
if(results.slice(0,2).some(r=>r.gzipBytes>180*1024)||shader>8*1024||poster>40*1024)process.exit(1);
