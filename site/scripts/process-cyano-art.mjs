import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const siteDir = process.cwd();
const rootDir = path.resolve(siteDir, "..");
const artOutDir = path.join(siteDir, "public", "art");
const sourceArchiveDir = path.join(rootDir, "assets", "source", "cyano-v2");

fs.mkdirSync(artOutDir, { recursive: true });
fs.mkdirSync(sourceArchiveDir, { recursive: true });

/**
 * Canonical Cyano v2 Art Slots.
 * Drop updated high-res renders (.png, .webp, .jpg, or .jpeg) into `assets/source/cyano-v2/<name>.<ext>`,
 * then run `node scripts/process-cyano-art.mjs` from `site/` to rebuild all web assets,
 * edge-clamp seamless #FFFFFF / #000000 plates, regenerate `og.jpg`, and sync `lib/media-manifest.json`.
 */
const ART_JOBS = [
  // Dark / Nocturnal Seamless Stage Artworks (mode: "black" clamps near-black outer pixels to pure #000000)
  { name: "cyano-hero-laminar", mode: "black", width: 1600, height: 900 },
  { name: "cyano-closing-aurora", mode: "black", width: 1600, height: 900 },
  { name: "cyano-wave-spectrum", mode: "black", width: 1600, height: 900 },
  { name: "cyano-core-strata", mode: "cover", width: 1400, height: 875 },
  { name: "cyano-context-prism", mode: "cover", width: 1400, height: 788 },

  // White Gallery Seamless Multiply Artworks (mode: "white" clamps outer edges & >=236 studio whites to pure #FFFFFF)
  { name: "cyano-sol-sales", mode: "white", width: 1400, height: 788 },
  { name: "cyano-sol-docs", mode: "white", width: 1400, height: 788 },
  { name: "cyano-sol-kb", mode: "white", width: 1400, height: 788 },
  { name: "cyano-sol-data", mode: "white", width: 1400, height: 788 },
  { name: "cyano-white-c-monolith", mode: "white", width: 1400, height: 788 },
  { name: "cyano-white-tech-astrolabe", mode: "white", width: 1400, height: 788 },
  { name: "cyano-white-engagement", mode: "white", width: 1400, height: 788 },
  { name: "cyano-white-prisms", mode: "white", width: 1400, height: 788 },

  // 3 Bespoke Editorial Covers (16:10)
  { name: "cyano-insight-kb", mode: "cover", width: 1400, height: 875 },
  { name: "cyano-insight-proposal", mode: "cover", width: 1400, height: 875 },
  { name: "cyano-insight-delivery", mode: "cover", width: 1400, height: 875 },
];

function resolveSourceFile(baseName) {
  for (const ext of [".png", ".webp", ".jpg", ".jpeg"]) {
    const candidate = path.join(sourceArchiveDir, `${baseName}${ext}`);
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error(
    `Missing source artwork for '${baseName}' in ${sourceArchiveDir} (.png/.webp/.jpg/.jpeg)`
  );
}

function clampWhiteSeamless(buf, w, h) {
  const out = Buffer.from(buf);
  const padX = Math.round(w * 0.035);
  const padY = Math.round(h * 0.035);
  for (let y = 0; y < h; y++) {
    const dy = Math.min(y, h - 1 - y);
    const fy = dy < padY ? dy / padY : 1;
    for (let x = 0; x < w; x++) {
      const dx = Math.min(x, w - 1 - x);
      const fx = dx < padX ? dx / padX : 1;
      const edgeFactor = Math.min(fx, fy);

      const i = (y * w + x) * 3;
      let r = out[i];
      let g = out[i + 1];
      let b = out[i + 2];

      // Smoothly lift studio near-white (>= 236) to pure 255 so CSS multiply blend has zero rectangle edge
      const minCh = Math.min(r, g, b);
      if (minCh >= 236) {
        const boost = (minCh - 236) / (255 - 236);
        r = Math.round(r + (255 - r) * Math.min(1, boost * 1.35));
        g = Math.round(g + (255 - g) * Math.min(1, boost * 1.35));
        b = Math.round(b + (255 - b) * Math.min(1, boost * 1.35));
      }

      if (edgeFactor < 1) {
        const ease = edgeFactor * edgeFactor * (3 - 2 * edgeFactor);
        r = Math.round(255 * (1 - ease) + r * ease);
        g = Math.round(255 * (1 - ease) + g * ease);
        b = Math.round(255 * (1 - ease) + b * ease);
      }

      out[i] = r;
      out[i + 1] = g;
      out[i + 2] = b;
    }
  }
  return out;
}

function clampBlackSeamless(buf, w, h) {
  const out = Buffer.from(buf);
  for (let p = 0; p < out.length; p += 3) {
    const maxCh = Math.max(out[p], out[p + 1], out[p + 2]);
    if (maxCh <= 12) {
      const scale = maxCh <= 5 ? 0 : (maxCh - 5) / 7;
      out[p] = Math.round(out[p] * scale);
      out[p + 1] = Math.round(out[p + 1] * scale);
      out[p + 2] = Math.round(out[p + 2] * scale);
    }
  }
  return out;
}

async function makeBlurDataURL(webpPath) {
  const tiny = await sharp(webpPath)
    .resize(16, 10, { fit: "cover" })
    .webp({ quality: 35 })
    .toBuffer();
  return `data:image/webp;base64,${tiny.toString("base64")}`;
}

const manifestPath = path.join(siteDir, "lib", "media-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

for (const job of ART_JOBS) {
  const inputFile = resolveSourceFile(job.name);

  const { data, info } = await sharp(inputFile)
    .resize(job.width, job.height, { fit: "cover", position: "center" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let processed = data;
  if (job.mode === "white") {
    processed = clampWhiteSeamless(data, info.width, info.height);
  } else if (job.mode === "black") {
    processed = clampBlackSeamless(data, info.width, info.height);
  }

  const outWebp = path.join(artOutDir, `${job.name}.webp`);
  await sharp(processed, {
    raw: { width: info.width, height: info.height, channels: 3 },
  })
    .webp({ quality: 86, effort: 5 })
    .toFile(outWebp);

  const publicKey = `/art/${job.name}.webp`;
  manifest[publicKey] = {
    width: info.width,
    height: info.height,
    blurDataURL: await makeBlurDataURL(outWebp),
  };

  const kb = (fs.statSync(outWebp).size / 1024).toFixed(1);
  console.log(`✓ ${publicKey} (${info.width}x${info.height}, ${kb} KB, mode=${job.mode})`);
}

// Build warm, vibrant natural-color founder portraits & team illustration (cache-busted *-natural.webp)
const portraitsSrc = path.join(rootDir, "assets", "source", "portraits-business-glasses.png");
if (fs.existsSync(portraitsSrc)) {
  const pMeta = await sharp(portraitsSrc).metadata();
  const qWidth = Math.floor(pMeta.width / 4);
  const pHeight = pMeta.height;

  for (let idx = 0; idx < 4; idx++) {
    const { data, info } = await sharp(portraitsSrc)
      .extract({ left: idx * qWidth, top: 0, width: qWidth, height: pHeight })
      .removeAlpha()
      .modulate({ saturation: 1.08 })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const outBuf = Buffer.from(data);
    for (let p = 0; p < outBuf.length; p += 3) {
      const r = outBuf[p];
      const g = outBuf[p + 1];
      const b = outBuf[p + 2];
      // Replace pale cool-mint studio backdrop with warm sunlit gallery ivory (#F8F6F2)
      const minCh = Math.min(r, g, b);
      if (minCh >= 222 && b >= r && g >= r) {
        const t = Math.min(1, (minCh - 222) / 24);
        outBuf[p] = Math.round(r * (1 - t) + 248 * t);
        outBuf[p + 1] = Math.round(g * (1 - t) + 246 * t);
        outBuf[p + 2] = Math.round(b * (1 - t) + 242 * t);
      }
    }

    const naturalName = `founder-${idx + 1}-natural.webp`;
    const legacyName = `founder-${idx + 1}.webp`;
    const naturalPath = path.join(artOutDir, naturalName);
    await sharp(outBuf, {
      raw: { width: info.width, height: info.height, channels: 3 },
    })
      .webp({ quality: 90, effort: 5 })
      .toFile(naturalPath);
    fs.copyFileSync(naturalPath, path.join(artOutDir, legacyName));

    if (idx === 3) {
      // Headshot square crop for founder-4 avatar
      const avatarSize = Math.round(info.width * 0.56);
      const avatarLeft = Math.round((info.width - avatarSize) / 2);
      const avatarTop = Math.round(info.height * 0.08);
      const avatarPath = path.join(artOutDir, "founder-4-avatar-natural.webp");
      await sharp(outBuf, {
        raw: { width: info.width, height: info.height, channels: 3 },
      })
        .extract({ left: avatarLeft, top: avatarTop, width: avatarSize, height: avatarSize })
        .resize(160, 160)
        .webp({ quality: 90 })
        .toFile(avatarPath);
      fs.copyFileSync(avatarPath, path.join(artOutDir, "founder-4-avatar.webp"));
    }
  }
  console.log("✓ Built warm natural-color founder-1..4-natural.webp & avatar");
}

const teamSrc = path.join(rootDir, "assets", "source", "team-business-glasses.png");
if (fs.existsSync(teamSrc)) {
  const teamNaturalPath = path.join(artOutDir, "team-natural.webp");
  await sharp(teamSrc)
    .modulate({ saturation: 1.06 })
    .webp({ quality: 88, effort: 5 })
    .toFile(teamNaturalPath);
  fs.copyFileSync(teamNaturalPath, path.join(artOutDir, "team.webp"));
  console.log("✓ Built natural-color team-natural.webp");
}

for (const existing of [
  "team.webp",
  "team-natural.webp",
  "portraits.webp",
  "founder-1.webp",
  "founder-2.webp",
  "founder-3.webp",
  "founder-4.webp",
  "founder-4-avatar.webp",
  "founder-1-natural.webp",
  "founder-2-natural.webp",
  "founder-3-natural.webp",
  "founder-4-natural.webp",
  "founder-4-avatar-natural.webp",
  "cyano-logo-dark.webp",
  "cyano-logo-light.webp",
]) {
  const fp = path.join(artOutDir, existing);
  if (fs.existsSync(fp)) {
    const m = await sharp(fp).metadata();
    manifest[`/art/${existing}`] = {
      width: m.width,
      height: m.height,
      blurDataURL: await makeBlurDataURL(fp),
    };
  }
}

// Generate Cyano Branded OpenGraph Card (1200x630) with official logo + laminar C sculpture
const heroPath = path.join(artOutDir, "cyano-hero-laminar.webp");
const darkLogoBuf = await sharp(path.join(artOutDir, "cyano-logo-dark.webp"))
  .resize(76, 76)
  .png()
  .toBuffer();

const ogSvg = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#02080E" stop-opacity="0.96"/>
      <stop offset="52%" stop-color="#02080E" stop-opacity="0.78"/>
      <stop offset="100%" stop-color="#02080E" stop-opacity="0.08"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#fade)"/>
  <text x="166" y="128" fill="#FFFFFF" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="30" font-weight="600" letter-spacing="7">CYANO</text>
  <text x="72" y="290" fill="#22D3EE" font-family="monospace" font-size="18" font-weight="600" letter-spacing="3">ENTERPRISE AI ENGINEERING</text>
  <text x="72" y="366" fill="#FFFFFF" font-family="system-ui, -apple-system, PingFang SC, Microsoft YaHei, sans-serif" font-size="52" font-weight="500">AI systems built for</text>
  <text x="72" y="432" fill="#FFFFFF" font-family="system-ui, -apple-system, PingFang SC, Microsoft YaHei, sans-serif" font-size="52" font-weight="500">everyday business work</text>
  <text x="72" y="512" fill="#94A3B8" font-family="system-ui, -apple-system, sans-serif" font-size="22">Sales · Proposals · Knowledge · Data · Cyano Core</text>
</svg>`);

await sharp(heroPath)
  .resize(1200, 630, { fit: "cover", position: "right" })
  .composite([
    { input: ogSvg, top: 0, left: 0 },
    { input: darkLogoBuf, top: 78, left: 72 },
  ])
  .jpeg({ quality: 88 })
  .toFile(path.join(artOutDir, "og.jpg"));

const iconLogo128 = await sharp(path.join(artOutDir, "cyano-logo-dark.webp"))
  .resize(124, 124)
  .png()
  .toBuffer();

await sharp({
  create: {
    width: 180,
    height: 180,
    channels: 4,
    background: { r: 3, g: 12, b: 20, alpha: 1 },
  },
})
  .composite([{ input: iconLogo128, top: 28, left: 28 }])
  .png()
  .toFile(path.join(siteDir, "public", "apple-touch-icon.png"));

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log("✓ Updated media-manifest.json, og.jpg, and apple-touch-icon.png");
