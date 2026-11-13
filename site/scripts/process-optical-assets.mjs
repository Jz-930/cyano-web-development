import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const siteRoot = path.resolve(import.meta.dirname, "..");
const repoRoot = path.resolve(siteRoot, "..");
const brain =
  "C:/Users/jiack/.gemini/antigravity/brain/412675c6-b3c8-4b28-9c7f-9f8bcc7e5a0d";
const srcDir = path.join(repoRoot, "assets/source");
const artDir = path.join(siteRoot, "public/art");
const manifestPath = path.join(siteRoot, "lib/media-manifest.json");
const mediaManifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

const items = [
  ["v2-hero-optics", "v2_hero_optics_refined_png_1794544145255.jpg", 1600, 78],
  ["v2-core-lattice", "v2_core_lattice_strata_png_1794544191045.jpg", 1440, 76],
  ["v2-core-prism", "v2_core_lattice_refined_png_1794544175872.jpg", 1440, 78],
  ["v2-cta-aurora", "v2_cta_aurora_refined_png_1794544222644.jpg", 1600, 76],
];

for (const [id, file, width, quality] of items) {
  const from = path.join(brain, file);
  const archived = path.join(srcDir, `${id}.jpg`);
  const outWebp = path.join(artDir, `${id}.webp`);
  await fs.copyFile(from, archived);
  await sharp(from)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(outWebp);
  const meta = await sharp(outWebp).metadata();
  const tiny = await sharp(outWebp).resize(20, 11).webp({ quality: 35 }).toBuffer();
  const url = `/art/${id}.webp`;
  mediaManifest[url] = {
    src: url,
    width: meta.width,
    height: meta.height,
    blurDataURL: `data:image/webp;base64,${tiny.toString("base64")}`,
  };
  const stat = await fs.stat(outWebp);
  console.log(`${id}: ${Math.round(stat.size / 1024)}KB (${meta.width}x${meta.height})`);
}

// Upgrade OG share card (1200x630) composited over v2-hero-optics
const baseBg = await sharp(path.join(srcDir, "v2-hero-optics.jpg"))
  .resize(1200, 630, { fit: "cover" })
  .toBuffer();

const overlaySvg = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="#030607" stop-opacity="0.92"/>
      <stop offset="58%" stop-color="#030607" stop-opacity="0.62"/>
      <stop offset="100%" stop-color="#030607" stop-opacity="0.12"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="72" y="76" width="8" height="8" rx="1.5" fill="#7EF5D6"/>
  <text x="92" y="85" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="600" letter-spacing="3" fill="#7EF5D6">ENTERPRISE AI ENGINEERING</text>
  <text x="72" y="236" font-family="Segoe UI, Arial, sans-serif" font-size="64" font-weight="300" fill="#F4FBFB">Custom AI for</text>
  <text x="72" y="314" font-family="Segoe UI, Arial, sans-serif" font-size="64" font-weight="400" fill="#7EF5D6">everyday work.</text>
  <text x="72" y="400" font-family="Segoe UI, Arial, sans-serif" font-size="22" fill="#9EB4B8">Verified sources, governed workflows, production delivery.</text>
  <line x1="72" y1="536" x2="1128" y2="536" stroke="#1C434A" stroke-width="1"/>
  <text x="72" y="574" font-family="Consolas, monospace" font-size="16" letter-spacing="2.5" fill="#7EF5D6">CYANO INTELLIGENCE</text>
  <text x="1128" y="574" text-anchor="end" font-family="Consolas, monospace" font-size="15" fill="#9EB4B8">cyano.app</text>
</svg>`);

await sharp(baseBg)
  .composite([{ input: overlaySvg, left: 0, top: 0 }])
  .jpeg({ quality: 88 })
  .toFile(path.join(artDir, "og.jpg"));

await fs.writeFile(manifestPath, JSON.stringify(mediaManifest, null, 2));

// Update root assets/manifest.json with v2 asset provenance
const rootManifestPath = path.join(repoRoot, "assets/manifest.json");
const rootManifest = JSON.parse(await fs.readFile(rootManifestPath, "utf8"));
rootManifest.v2Updated = "2026-11-12";
rootManifest.v2Assets = [
  {
    id: "v2-hero-optics",
    source: "assets/source/v2-hero-optics.jpg",
    output: "site/public/art/v2-hero-optics.webp",
    usage: "Homepage Hero dark optical glass ambient layer",
    constraints: "Zero text, zero geographical imagery, brand cyan-mint palette",
  },
  {
    id: "v2-core-lattice",
    source: "assets/source/v2-core-lattice.jpg",
    output: "site/public/art/v2-core-lattice.webp",
    usage: "Technology 4-layer architecture optical strata backdrop",
    constraints: "Zero text, zero geographical imagery, brand cyan-mint palette",
  },
  {
    id: "v2-core-prism",
    source: "assets/source/v2-core-prism.jpg",
    output: "site/public/art/v2-core-prism.webp",
    usage: "Context Valuation Engine optical convergence visual",
    constraints: "Zero text, zero geographical imagery, brand cyan-mint palette",
  },
  {
    id: "v2-cta-aurora",
    source: "assets/source/v2-cta-aurora.jpg",
    output: "site/public/art/v2-cta-aurora.webp",
    usage: "Closing CTA frosted obsidian ambient backdrop",
    constraints: "Zero text, zero geographical imagery, brand cyan-mint palette",
  },
  {
    id: "founder-1..4",
    source: "assets/source/portraits-business-glasses.png",
    output: "site/public/art/founder-1.webp .. founder-4.webp",
    usage: "Unified brand cyan-slate duotone founder portraits (G-21)",
    postProcess: "Quarter slice + 5-stop brand cyan-slate duotone LUT",
  },
];
await fs.writeFile(rootManifestPath, JSON.stringify(rootManifest, null, 2));
console.log("OG card and root assets/manifest.json updated.");
