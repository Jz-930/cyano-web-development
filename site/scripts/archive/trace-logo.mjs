import potrace from "potrace";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const src512 = path.resolve("../assets/source/logo-512.png");
const logoPath = (await fs.stat(src512).catch(() => null))
  ? src512
  : path.resolve("public/logo.png");
const outPath = path.resolve("public/brand/cyano-mark.svg");
await fs.mkdir(path.dirname(outPath), { recursive: true });

const origRaw = await sharp(logoPath).resize(512, 512).ensureAlpha().raw().toBuffer();
const maskRaw = Buffer.alloc(512 * 512 * 4);
for (let i = 0; i < 512 * 512; i++) {
  const v = 255 - origRaw[i * 4 + 3];
  maskRaw[i * 4] = v;
  maskRaw[i * 4 + 1] = v;
  maskRaw[i * 4 + 2] = v;
  maskRaw[i * 4 + 3] = 255;
}
const maskPng = await sharp(maskRaw, {
  raw: { width: 512, height: 512, channels: 4 },
})
  .png()
  .toBuffer();

const rawSvg = await new Promise((resolve, reject) => {
  potrace.trace(
    maskPng,
    {
      threshold: 128,
      turdSize: 4,
      optTolerance: 0.3,
      color: "currentColor",
      background: "transparent",
    },
    (err, svg) => (err ? reject(err) : resolve(svg)),
  );
});

const cleaned = rawSvg
  .replace(/\s+width="[^"]*"/g, "")
  .replace(/\s+height="[^"]*"/g, "")
  .replace(/\s+version="[^"]*"/g, "")
  .replace(/\s+stroke="none"/g, "")
  .replace(/(\d+\.\d*?)0+(?=\D)/g, "$1")
  .replace(/\.(?=[,\s"MCLZ])/g, "")
  .replace(/,\s+/g, ",")
  .replace(/\s*([MCLZ])\s*/g, "$1")
  .replace(/>\s+</g, "><")
  .trim();

const bytes = Buffer.byteLength(cleaned) + 1;
if (bytes > 6144) {
  throw new Error(`cyano-mark.svg exceeds 6KB (${bytes} bytes)`);
}

await fs.writeFile(outPath, `${cleaned}\n`, "utf8");

// Overlay verification at 512x512 (#3898a8 vs original logo.png)
const svgRaw = await sharp(Buffer.from(cleaned.replace(/currentColor/g, "#3898a8")))
  .resize(512, 512)
  .ensureAlpha()
  .raw()
  .toBuffer();

let diffPixels = 0;
const totalPixels = 512 * 512;
for (let i = 0; i < totalPixels; i++) {
  const oA = origRaw[i * 4 + 3];
  const sA = svgRaw[i * 4 + 3];
  const prO = (origRaw[i * 4] * oA) / 255;
  const pgO = (origRaw[i * 4 + 1] * oA) / 255;
  const pbO = (origRaw[i * 4 + 2] * oA) / 255;
  const prS = (svgRaw[i * 4] * sA) / 255;
  const pgS = (svgRaw[i * 4 + 1] * sA) / 255;
  const pbS = (svgRaw[i * 4 + 2] * sA) / 255;
  if (
    Math.abs(prO - prS) > 48 ||
    Math.abs(pgO - pgS) > 48 ||
    Math.abs(pbO - pbS) > 48 ||
    Math.abs(oA - sA) > 64
  ) {
    diffPixels++;
  }
}
const diffPct = (diffPixels / totalPixels) * 100;
console.log(
  `✓ Wrote ${outPath} (${bytes} bytes), 512×512 overlay pixel diff = ${diffPct.toFixed(3)}% (<= 1.000%)`,
);
if (diffPct > 1) {
  throw new Error(`Overlay pixel diff ${diffPct.toFixed(3)}% exceeds 1%`);
}
