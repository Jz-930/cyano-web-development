import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import subsetFont from "subset-font";

const root = path.resolve(import.meta.dirname, "..");
const assetsSource = path.resolve(root, "../assets/source");
const appFontsDir = path.join(root, "app/fonts");
const publicArtDir = path.join(root, "public/art");

await fs.mkdir(appFontsDir, { recursive: true });
await fs.mkdir(publicArtDir, { recursive: true });

// 1. Copy Inter & Manrope into app/fonts and fetch JetBrains Mono
const ua =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

await fs.copyFile(
  path.join(root, "public/fonts/inter.woff2"),
  path.join(appFontsDir, "inter-latin.woff2")
);
await fs.copyFile(
  path.join(root, "public/fonts/manrope.woff2"),
  path.join(appFontsDir, "manrope-latin.woff2")
);

// Fetch JetBrains Mono Latin WOFF2
const jbCssResp = await fetch(
  "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap",
  { headers: { "User-Agent": ua } }
);
const jbCss = await jbCssResp.text();
// Extract latin block (last url in Google Fonts CSS is always latin)
const jbMatches = [...jbCss.matchAll(/\/\*\s*latin\s*\*\/[\s\S]*?url\((https:[^)]+)\)/g)];
const jbFallbackMatches = [...jbCss.matchAll(/url\((https:[^)]+)\)/g)];
const jbUrl = jbMatches.at(-1)?.[1] || jbFallbackMatches.at(-1)?.[1];
if (!jbUrl) throw new Error("Could not find JetBrains Mono URL");
const jbBuf = Buffer.from(await (await fetch(jbUrl)).arrayBuffer());

// Subset Inter & JetBrains Mono to exact needed Latin + arrows + symbols to keep payload ultra-tight
const latinCharset =
  " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~" +
  "\u00A0©®™°±×÷·–—―‘’“”•…‰‹›€¥£¢§¶†‡" +
  "\u2010\u2011\u2012\u2013\u2014\u2190\u2191\u2192\u2193\u2194\u2197\u2198\u21B3\u2713\u2714\u25CF\u25CB\u25A0\u25B6\u2248\u2264\u2265\u2260";

const interRaw = await fs.readFile(path.join(appFontsDir, "inter-latin.woff2"));
const interSub = await subsetFont(interRaw, latinCharset, {
  targetFormat: "woff2",
  preserveNameIds: [1, 2, 4, 6],
});
await fs.writeFile(path.join(appFontsDir, "inter-latin.woff2"), interSub);

const manropeRaw = await fs.readFile(path.join(appFontsDir, "manrope-latin.woff2"));
const manropeSub = await subsetFont(manropeRaw, latinCharset, {
  targetFormat: "woff2",
  preserveNameIds: [1, 2, 4, 6],
});
await fs.writeFile(path.join(appFontsDir, "manrope-latin.woff2"), manropeSub);

const jbSub = await subsetFont(jbBuf, latinCharset, {
  targetFormat: "woff2",
  preserveNameIds: [1, 2, 4, 6],
});
await fs.writeFile(path.join(appFontsDir, "jetbrains-mono-latin.woff2"), jbSub);

// Check if Manrope binary contains 'tnum' table tag
const hasManropeTnum = manropeRaw.includes(Buffer.from("tnum"));
const hasInterTnum = interRaw.includes(Buffer.from("tnum"));
console.log("Font sizes (bytes):", {
  inter: interSub.length,
  manrope: manropeSub.length,
  jetbrainsMono: jbSub.length,
  hasManropeTnum,
  hasInterTnum,
});

// 2. Editorial Cyan-Slate Duotone helper for Founder Portraits & Team Scene (G-21)
// Maps shadows -> #072229, mid-darks -> #1A5862, mid-lights -> #5CA3AA, highlights -> #F4FBFB
function applyBrandDuotone(data, channels) {
  const out = Buffer.alloc(data.length);
  // 5-stop gradient LUT (0..255 luminance)
  const stops = [
    { pos: 0, r: 6, g: 24, b: 30 },       // #06181E deep ink-teal
    { pos: 75, r: 16, g: 68, b: 78 },     // #10444E rich slate-teal
    { pos: 145, r: 58, g: 138, b: 146 },  // #3A8A92 brand cyan-teal
    { pos: 210, r: 192, g: 226, b: 228 }, // #C0E2E4 soft mist-cyan
    { pos: 242, r: 244, g: 251, b: 251 }, // #F4FBFB mist background
    { pos: 255, r: 244, g: 251, b: 251 }, // #F4FBFB pure mist
  ];

  const lutR = new Uint8Array(256);
  const lutG = new Uint8Array(256);
  const lutB = new Uint8Array(256);
  for (let l = 0; l < 256; l++) {
    let s0 = stops[0],
      s1 = stops[stops.length - 1];
    for (let k = 0; k < stops.length - 1; k++) {
      if (l >= stops[k].pos && l <= stops[k + 1].pos) {
        s0 = stops[k];
        s1 = stops[k + 1];
        break;
      }
    }
    const span = Math.max(1, s1.pos - s0.pos);
    const t = (l - s0.pos) / span;
    lutR[l] = Math.round(s0.r + (s1.r - s0.r) * t);
    lutG[l] = Math.round(s0.g + (s1.g - s0.g) * t);
    lutB[l] = Math.round(s0.b + (s1.b - s0.b) * t);
  }

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Perceptual luminance with slight contrast S-curve
    let lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const norm = lum / 255;
    const curved = norm < 0.5
      ? 0.5 * Math.pow(2 * norm, 1.08)
      : 1 - 0.5 * Math.pow(2 * (1 - norm), 1.08);
    const idx = Math.max(0, Math.min(255, Math.round(curved * 255)));
    // Blend 82% duotone + 18% subtle desaturated original so skin remains natural & dignified
    out[i] = Math.round(lutR[idx] * 0.86 + r * 0.14);
    out[i + 1] = Math.round(lutG[idx] * 0.86 + g * 0.14);
    out[i + 2] = Math.round(lutB[idx] * 0.86 + b * 0.14);
    if (channels === 4) out[i + 3] = data[i + 3];
  }
  return out;
}

const portraitsPath = path.join(assetsSource, "portraits-business-glasses.png");
const pMeta = await sharp(portraitsPath).metadata();
const quarterW = Math.floor(pMeta.width / 4);
const pHeight = pMeta.height;

for (let i = 0; i < 4; i++) {
  const { data, info } = await sharp(portraitsPath)
    .extract({
      left: i * quarterW,
      top: 0,
      width: quarterW,
      height: pHeight,
    })
    .resize({ width: 560, withoutEnlargement: true })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const duo = applyBrandDuotone(data, info.channels);
  const outPath = path.join(publicArtDir, `founder-${i + 1}.webp`);
  await sharp(duo, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .webp({ quality: 84 })
    .toFile(outPath);

  if (i === 3) {
    // Small 128x128 avatar of F4 (Head of Product & Solutions) for Contact page
    const avHeight = Math.min(info.width, Math.floor(info.height * 0.62));
    await sharp(duo, {
      raw: { width: info.width, height: info.height, channels: info.channels },
    })
      .extract({
        left: Math.floor((info.width - avHeight) / 2),
        top: Math.floor(info.height * 0.04),
        width: avHeight,
        height: avHeight,
      })
      .resize(160, 160)
      .webp({ quality: 84 })
      .toFile(path.join(publicArtDir, "founder-4-avatar.webp"));
  }
}

// Team collaboration scene duotone
const teamSrcPath = path.join(assetsSource, "team-business-glasses.png");
const { data: teamData, info: teamInfo } = await sharp(teamSrcPath)
  .resize({ width: 1280, withoutEnlargement: true })
  .raw()
  .toBuffer({ resolveWithObject: true });
const teamDuo = applyBrandDuotone(teamData, teamInfo.channels);
await sharp(teamDuo, {
  raw: {
    width: teamInfo.width,
    height: teamInfo.height,
    channels: teamInfo.channels,
  },
})
  .webp({ quality: 82 })
  .toFile(path.join(publicArtDir, "team-duotone.webp"));

// 3. Build media-manifest.json with exact dimensions + blurDataURL for all screenshots & portraits
async function makeBlurMeta(absPath, publicUrl) {
  const meta = await sharp(absPath).metadata();
  const tiny = await sharp(absPath)
    .resize(20, Math.max(12, Math.round((20 * (meta.height || 10)) / (meta.width || 16))), {
      fit: "inside",
    })
    .webp({ quality: 35 })
    .toBuffer();
  return {
    src: publicUrl,
    width: meta.width || 1440,
    height: meta.height || 900,
    blurDataURL: `data:image/webp;base64,${tiny.toString("base64")}`,
  };
}

const mediaManifest = {};
for (let i = 1; i <= 4; i++) {
  const url = `/art/founder-${i}.webp`;
  mediaManifest[url] = await makeBlurMeta(path.join(root, "public", url), url);
}
mediaManifest["/art/founder-4-avatar.webp"] = await makeBlurMeta(
  path.join(publicArtDir, "founder-4-avatar.webp"),
  "/art/founder-4-avatar.webp"
);
mediaManifest["/art/team-duotone.webp"] = await makeBlurMeta(
  path.join(publicArtDir, "team-duotone.webp"),
  "/art/team-duotone.webp"
);
mediaManifest["/art/team.webp"] = await makeBlurMeta(
  path.join(publicArtDir, "team.webp"),
  "/art/team.webp"
);

const mediaRoot = path.join(root, "public/media");
for (const entry of await fs.readdir(mediaRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const dirPath = path.join(mediaRoot, entry.name);
  for (const file of await fs.readdir(dirPath)) {
    if (!/\.(webp|png|jpg)$/i.test(file)) continue;
    const url = `/media/${entry.name}/${file}`;
    mediaManifest[url] = await makeBlurMeta(path.join(dirPath, file), url);
  }
}

await fs.mkdir(path.join(root, "lib"), { recursive: true });
await fs.writeFile(
  path.join(root, "lib/media-manifest.json"),
  JSON.stringify(mediaManifest, null, 2)
);
console.log(
  `Prepared 4 duotone portraits, avatar, team-duotone, and ${Object.keys(mediaManifest).length} blur placeholders.`
);
