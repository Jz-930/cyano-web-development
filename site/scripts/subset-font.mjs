import fs from "node:fs/promises";
import path from "node:path";
import subsetFont from "subset-font";

const root = path.resolve(import.meta.dirname, "..");
const fontSource = path.join(root, "../assets/source/NotoSansSC-variable.ttf");

const CJK_RE = /[\u2000-\u206f\u3000-\u303f\u3400-\u9fff\uff00-\uffef]/g;

// 0. Ensure Latin subsets are compact (noHinting, static wght=500 on mono) so `/` total font bytes stay well under 150 KB
try {
  let ascii = "";
  for (let cp = 32; cp <= 126; cp++) ascii += String.fromCodePoint(cp);
  ascii += "·—–‘’“”…•→↗×≤≥±©®%°‑\u00A0";

  const interPath = path.join(root, "app/fonts/inter-latin.woff2");
  const interStat = await fs.stat(interPath);
  if (interStat.size > 24000) {
    const rawInter = await fs.readFile(interPath);
    const slimInter = await subsetFont(rawInter, ascii, {
      targetFormat: "woff2",
      variationAxes: { wght: 450 },
      keepFeatures: ["tnum"],
      noHinting: true,
      noLayoutClosure: true,
    });
    await fs.writeFile(interPath, slimInter);
    console.log(
      `✓ Slimmed inter-latin.woff2: ${(interStat.size / 1024).toFixed(1)} KB -> ${(slimInter.length / 1024).toFixed(1)} KB`
    );
  }

  const monoPath = path.join(root, "app/fonts/jetbrains-mono-latin.woff2");
  const monoStat = await fs.stat(monoPath);
  if (monoStat.size > 16000) {
    const rawMono = await fs.readFile(monoPath);
    const slimMono = await subsetFont(rawMono, ascii, {
      targetFormat: "woff2",
      variationAxes: { wght: 500 },
      keepFeatures: ["tnum"],
      noHinting: true,
      noLayoutClosure: true,
    });
    await fs.writeFile(monoPath, slimMono);
    console.log(
      `✓ Slimmed jetbrains-mono-latin.woff2: ${(monoStat.size / 1024).toFixed(1)} KB -> ${(slimMono.length / 1024).toFixed(1)} KB`
    );
  }
} catch {}

// 1. Collect exact homepage (`/`) + chrome glyphs so `/` downloads ONLY noto-sc-core.woff2 and stays <= 150 KB total fonts
let coreText = " ，。、；：？！“”‘’（）《》【】—…·©↗→年月日周项级倍行秒分钟";
try {
  const siteCopy = JSON.parse(await fs.readFile(path.join(root, "content/site-copy-v2.json"), "utf8"));
  coreText += JSON.stringify([
    siteCopy.brand,
    siteCopy.seo.home,
    siteCopy.seo.privacy,
    siteCopy.seo.terms,
    siteCopy.nav,
    siteCopy.footer,
    siteCopy.demo,
    siteCopy.home,
    siteCopy.engagementModes,
  ]);

  const solutions = JSON.parse(await fs.readFile(path.join(root, "content/solutions-v2.json"), "utf8"));
  for (const s of solutions) {
    coreText += JSON.stringify([
      s.name.zh,
      s.shortName.zh,
      s.promise.zh,
      s.intro.zh,
      s.deliverables.map((d) => d.zh),
      s.workflow,
    ]);
  }

  const founders = JSON.parse(await fs.readFile(path.join(root, "content/founders-v2.json"), "utf8"));
  for (const f of founders) {
    coreText += JSON.stringify([
      f.role.zh,
      f.tags.map((x) => x.zh),
      f.specialtyBadge.zh,
      f.focusDeliverable.zh,
    ]);
  }

  const cases = JSON.parse(await fs.readFile(path.join(root, "content/cases-v2.json"), "utf8"));
  for (const c of cases.filter((x) => x.group === "core")) {
    const mainImg = c.images[c.mainImageIndex] ?? c.images[0];
    coreText += JSON.stringify([
      c.industry.zh,
      c.title.zh,
      c.system.zh,
      c.solutionLabel.zh,
      c.profile.zh,
      c.stats[0]?.value?.zh,
      c.stats[0]?.label?.zh,
      mainImg?.caption?.zh,
    ]);
  }

  const insights = JSON.parse(await fs.readFile(path.join(root, "content/insights-v2.json"), "utf8"));
  for (const ins of insights) {
    coreText += JSON.stringify([
      ins.title,
      ins.metaDescription,
      ins.category,
      ins.dateDisplay,
      ins.readingTime,
      ins.coverMetric,
      ins.coverNodes,
    ]);
  }

  for (const [rel, maxLines] of [
    ["components/Header.tsx", 999],
    ["components/Footer.tsx", 999],
    ["components/HeroProvenanceStage.tsx", 999],
    ["components/HomeVisuals.tsx", 999],
    ["components/CaseVisuals.tsx", 145],
    ["components/EditorialVisuals.tsx", 290],
    ["components/PageTemplates.tsx", 428],
    ["lib/content.ts", 125],
    ["app/(zh)/layout.tsx", 999],
    ["app/(zh)/page.tsx", 999],
  ]) {
    const lines = (await fs.readFile(path.join(root, rel), "utf8")).split(/\r?\n/);
    coreText += "\n" + lines.slice(0, maxLines).join("\n");
  }
} catch (err) {
  console.error("Error collecting coreText:", err);
  process.exit(1);
}

// 2. Collect ALL glyphs across entire site
let allText = coreText;
async function collect(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name === "node_modules" || e.name === ".next") continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await collect(p);
      else if (/\.(tsx?|json)$/.test(e.name)) {
        allText += "\n" + (await fs.readFile(p, "utf8"));
      }
    }
  } catch {}
}
for (const d of ["content", "components", "lib", "app"]) {
  await collect(path.join(root, d));
}
await collect(path.join(root, "../content/inputs"));

const coreSet = new Set(coreText.match(CJK_RE) || []);
const allSet = new Set(allText.match(CJK_RE) || []);
const extChars = [...allSet].filter((ch) => !coreSet.has(ch)).sort();
const coreChars = [...coreSet].sort();

function toUnicodeRange(chars) {
  if (chars.length === 0) return "U+3000";
  const codes = chars.map((c) => c.codePointAt(0)).sort((a, b) => a - b);
  const ranges = [];
  let start = codes[0];
  let prev = codes[0];
  for (let i = 1; i < codes.length; i++) {
    if (codes[i] === prev + 1) {
      prev = codes[i];
    } else {
      ranges.push(
        start === prev
          ? `U+${start.toString(16).toUpperCase()}`
          : `U+${start.toString(16).toUpperCase()}-${prev.toString(16).toUpperCase()}`
      );
      start = prev = codes[i];
    }
  }
  ranges.push(
    start === prev
      ? `U+${start.toString(16).toUpperCase()}`
      : `U+${start.toString(16).toUpperCase()}-${prev.toString(16).toUpperCase()}`
  );
  return ranges.join(",");
}

const rawFont = await fs.readFile(fontSource);
const opts = {
  targetFormat: "woff2",
  variationAxes: { wght: 400 },
  keepFeatures: [],
  noLayoutClosure: true,
  noHinting: true,
};

const coreBuf = await subsetFont(rawFont, " " + coreChars.join(""), opts);
const extBuf =
  extChars.length > 0
    ? await subsetFont(rawFont, " " + extChars.join(""), opts)
    : Buffer.alloc(0);

const pubFonts = path.join(root, "public/fonts");
await fs.mkdir(pubFonts, { recursive: true });
await fs.writeFile(path.join(pubFonts, "noto-sc-core.woff2"), coreBuf);
if (extBuf.length > 0) {
  await fs.writeFile(path.join(pubFonts, "noto-sc-ext.woff2"), extBuf);
}

const stylesDir = path.join(root, "app/styles");
await fs.mkdir(stylesDir, { recursive: true });

let css = `/* Auto-generated by scripts/subset-font.mjs — DO NOT EDIT MANUALLY */
@font-face {
  font-family: "Noto Sans SC Subset";
  src: url("/fonts/noto-sc-core.woff2") format("woff2");
  font-weight: 400 700;
  font-style: normal;
  font-display: swap;
  unicode-range: ${toUnicodeRange(coreChars)};
}
`;

if (extChars.length > 0) {
  css += `@font-face {
  font-family: "Noto Sans SC Subset";
  src: url("/fonts/noto-sc-ext.woff2") format("woff2");
  font-weight: 400 700;
  font-style: normal;
  font-display: swap;
  unicode-range: ${toUnicodeRange(extChars)};
}
`;
}

await fs.writeFile(path.join(stylesDir, "cjk-font.css"), css);

console.log(
  `✓ CJK subsets built: core=${coreChars.length} glyphs (${(coreBuf.length / 1024).toFixed(1)} KB), ext=${extChars.length} glyphs (${(extBuf.length / 1024).toFixed(1)} KB)`
);
