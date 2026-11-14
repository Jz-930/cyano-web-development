import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");

async function writeSafe(filePath, data) {
  const nextBuf = Buffer.isBuffer(data) ? data : Buffer.from(data, "utf8");
  try {
    const existing = await fs.readFile(filePath);
    if (existing.equals(nextBuf)) return;
  } catch {}
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await fs.writeFile(filePath, nextBuf);
      return;
    } catch (err) {
      if (attempt === 4) throw err;
      await new Promise((r) => setTimeout(r, 120 * (attempt + 1)));
    }
  }
}

const cases = JSON.parse(await fs.readFile(path.join(root, "content/v1/cases.json"), "utf8"));
const sources = [
  ...new Set([
    ...cases.flatMap((c) => c.images),
    ...Array.from({ length: 4 }, (_, i) => `founder-${i + 1}`).map(
      (n) => `/v3-materials/${n}.webp`,
    ),
  ]),
];
const out = path.join(root, "public/media/v3");
await fs.mkdir(out, { recursive: true });
const manifest = {};
for (const src of sources) {
  const data = await fs.readFile(path.join(root, "public", src));
  const meta = await sharp(data).metadata();
  const hash = createHash("sha256").update(data).digest("hex").slice(0, 12);
  const widths = [160, 320, 640, 960, 1440].filter((w) => w <= meta.width);
  if (!widths.length) widths.push(meta.width);
  const variants = [];
  for (const width of widths) {
    const item = { width };
    for (const format of ["avif", "webp"]) {
      const name = `${hash}-${width}.${format}`;
      const file = path.join(out, name);
      if (!(await fs.stat(file).catch(() => null))) {
        await sharp(data)
          .resize({ width, withoutEnlargement: true })
          [format]({ quality: format === "avif" ? 60 : 82, effort: 4 })
          .toFile(file);
      }
      item[format] = "/media/v3/" + name;
    }
    variants.push(item);
  }
  manifest[src] = { width: meta.width, height: meta.height, variants };
}
await writeSafe(path.join(root, "lib/responsive-media.json"), JSON.stringify(manifest, null, 2) + "\n");

const icon = await sharp(path.join(root, "public/logo.png")).resize(32, 32).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header[6] = 32;
header[7] = 32;
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(icon.length, 14);
header.writeUInt32LE(22, 18);
await writeSafe(path.join(root, "public/favicon.ico"), Buffer.concat([header, icon]));

const ogSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g"><stop stop-color="#0B6F80"/><stop offset="1" stop-color="#070B0F"/></radialGradient></defs><rect width="1200" height="630" fill="#070B0F"/><ellipse cx="1050" cy="250" rx="570" ry="360" fill="url(#g)"/><g fill="none" stroke="#38C8E0" stroke-width="2" opacity=".6"><path d="M650 510C870 490 740 200 1200 190"/><path d="M670 530C890 510 760 220 1220 210"/><path d="M690 550C910 530 780 240 1240 230"/></g><text x="78" y="110" fill="#A5ECF5" font-family="Arial,sans-serif" font-size="30" letter-spacing="5">CYANO</text><text x="78" y="280" fill="#E8FBFE" font-family="Arial,sans-serif" font-size="68">Custom AI for</text><text x="78" y="365" fill="#E8FBFE" font-family="Arial,sans-serif" font-size="68">everyday work.</text><text x="78" y="540" fill="#B8CBD3" font-family="Arial,sans-serif" font-size="22">Custom development · Pilots · Managed services</text></svg>`;
const og = await sharp(Buffer.from(ogSvg)).jpeg({ quality: 88 }).toBuffer();
const ogHash = createHash("sha256").update(og).digest("hex").slice(0, 12);
const ogSrc = `/media/v3/og-${ogHash}.jpg`;
await writeSafe(path.join(root, "public", ogSrc), og);
await writeSafe(path.join(root, "lib/og-image.json"), JSON.stringify({ src: ogSrc, width: 1200, height: 630 }) + "\n");
console.log(`Built responsive AVIF/WebP variants for ${sources.length} original interface/portrait assets.`);
