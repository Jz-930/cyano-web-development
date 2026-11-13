import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const root=path.resolve(import.meta.dirname,'..');
const generated='C:/Users/jiack/.codex/generated_images/01a1cfd0-18b4-7ae0-97a9-58d0bc5c0906';
const sources={hero:'exec-d751d50d-39e1-4168-b154-a26ef7ba7287.png',team:'exec-918cb46c-86ab-4738-9de3-099d8322891d.png',technology:'exec-104058ae-e182-42ed-911c-011fb4dd3baa.png'};
await fs.mkdir(path.join(root,'public/art'),{recursive:true});
for(const [name,file] of Object.entries(sources)){await fs.copyFile(path.join(generated,file),path.join(root,'../assets/source',name+'.png'));await sharp(path.join(generated,file)).resize({width:name==='team'?1600:1920,withoutEnlargement:true}).webp({quality:83}).toFile(path.join(root,'public/art',name+'.webp'))}
await sharp(path.join(root,'public/art/hero.webp')).resize(1200,630).jpeg({quality:85}).toFile(path.join(root,'public/art/og.jpg'));
await sharp(path.join(root,'public/icon.svg')).resize(180,180).png().toFile(path.join(root,'public/apple-touch-icon.png'));
for(const name of ['hero','team','technology']){console.log(name,(await fs.stat(path.join(root,'public/art',name+'.webp'))).size)}
