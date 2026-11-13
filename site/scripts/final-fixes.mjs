import fs from 'node:fs/promises';
const ui=await fs.readFile('components/ui.tsx','utf8');
await fs.writeFile('components/ui.tsx',ui.replace(/<svg viewBox="0 0 32 32"[\s\S]*?<\/svg><span>CYANO<\/span>/,'<img src="/logo.png" width="32" height="32" alt=""/><span>CYANO</span>'));
let client=await fs.readFile('components/interactive.tsx','utf8');
client=client.replace("(locale==='zh'?'/en':'')+(localPath==='/'?'':localPath)","((locale==='zh'?'/en':'')+(localPath==='/'?'':localPath)||'/')");
await fs.writeFile('components/interactive.tsx',client);
const config=JSON.parse((await fs.readFile('package.json','utf8')).replace(/^\uFEFF/,''));config.scripts.dev='next dev --hostname 0.0.0.0 --webpack';config.scripts.build='node scripts/preflight.mjs && next build --webpack && node scripts/scan.mjs';await fs.writeFile('package.json',JSON.stringify(config,null,2)+'\n');
