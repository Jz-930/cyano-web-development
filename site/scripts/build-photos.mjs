// Builds responsive AVIF/WebP variants for the v5 photography set.
// Source masters live outside the site in ../assets/v5-photography/masters
// (not deployed); the generated variants and lib/photo-media.json are committed.
// Run manually after the masters change: `npm run build:photos`.
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const mastersDir = path.resolve(root, "../assets/v5-photography/masters");
const outDir = path.join(root, "public/media/photo");
// id → master file name; alt text lives in copy-new.json as approved copy `photo.<id>`.
const photos = JSON.parse(await fs.readFile(path.join(root, "content/v5/photos.json"), "utf8"));
const copyNew = JSON.parse(await fs.readFile(path.join(root, "content/v4/copy-new.json"), "utf8"));

await fs.mkdir(outDir, { recursive: true });
const manifest = {};
const keep = new Set();
for (const [id, file] of Object.entries(photos)) {
  const entry = copyNew[`photo.${id}`];
  if (entry?.status !== "approved") throw new Error(`Approved alt text missing: photo.${id}`);
  const alt = { zh: entry.zh, en: entry.en };
  const data = await fs.readFile(path.join(mastersDir, file));
  const meta = await sharp(data).metadata();
  const hash = createHash("sha256").update(data).digest("hex").slice(0, 8);
  const widths = [480, 800, 1200].filter((w) => w < meta.width);
  widths.push(meta.width);
  const variants = [];
  for (const width of widths) {
    const item = { width };
    for (const format of ["avif", "webp"]) {
      const name = `${id}-${hash}-${width}.${format}`;
      keep.add(name);
      const file = path.join(outDir, name);
      if (!(await fs.stat(file).catch(() => null))) {
        await sharp(data)
          .resize({ width, withoutEnlargement: true })
          [format](format === "avif" ? { quality: 52, effort: 6 } : { quality: 76, effort: 5 })
          .toFile(file);
      }
      item[format] = `/media/photo/${name}`;
    }
    variants.push(item);
  }
  manifest[id] = { width: meta.width, height: meta.height, alt, variants };
}
for (const name of await fs.readdir(outDir)) {
  if (!keep.has(name)) await fs.rm(path.join(outDir, name));
}
await fs.writeFile(path.join(root, "lib/photo-media.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`Built ${Object.keys(manifest).length} photos into public/media/photo.`);
