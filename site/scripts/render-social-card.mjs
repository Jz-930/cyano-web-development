import sharp from 'sharp';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const logo=await sharp(path.join(root,'public/logo.png')).resize(100,100).png().toBuffer();
const og=Buffer.from(`<svg width="1200" height="630"><rect width="1200" height="630" fill="#07191e"/><rect x="58" y="74" width="5" height="27" fill="#7ef5d6"/><text x="81" y="99" font-family="Arial" font-size="28" letter-spacing="6" fill="#d9eee6">CYANO INTELLIGENCE</text><text x="60" y="255" font-family="Arial" font-size="65" fill="#ffffff">Custom AI for</text><text x="60" y="345" font-family="Arial" font-size="65" fill="#7ef5d6">everyday work.</text><text x="65" y="510" font-family="Arial" font-size="22" fill="#8caeaa">Customer inquiries, proposals, knowledge and data queries.</text><line x1="65" x2="1135" y1="563" y2="563" stroke="#2c4b4c"/><text x="65" y="597" font-family="Arial" font-size="16" fill="#748f8b">CUSTOM DEVELOPMENT / PILOTS / MANAGED SERVICES</text></svg>`);
await sharp(og).composite([{input:logo,left:1030,top:80}]).jpeg({quality:90}).toFile(path.join(root,'public/art/og.jpg'));
