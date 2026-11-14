import fs from "node:fs/promises";
import path from "node:path";
import subsetFont from "subset-font";
import { createHash } from "node:crypto";

const root = path.resolve(import.meta.dirname, "..");
const notoSource = path.join(root, "../assets/source/NotoSansSC-variable.ttf");
const interSource = path.join(root, "../assets/source/inter-variable.woff2");
const manropeSource = path.join(root, "../assets/source/manrope-variable.woff2");

const CJK_RE = /[\u2000-\u206f\u3000-\u303f\u3400-\u9fff\uff00-\uffef]/g;

// 1. Subset Latin variable fonts from assets/source/
const latinGlyphs =
  Array.from({ length: 95 }, (_, i) => String.fromCharCode(i + 32)).join("") +
  "·—–‘’“”…•→↗×≤≥±©®°‑§¥μ≠";
const interBuf = await subsetFont(await fs.readFile(interSource), latinGlyphs, {
  targetFormat: "woff2",
  noHinting: true,
  variationAxes: { wght: { min: 400, max: 700 } },
});
await fs.writeFile(path.join(root, "app/fonts/inter-latin.woff2"), interBuf);

const manropeBuf = await subsetFont(await fs.readFile(manropeSource), latinGlyphs, {
  targetFormat: "woff2",
  noHinting: true,
  variationAxes: { wght: { min: 300, max: 700 } },
});
await fs.writeFile(path.join(root, "app/fonts/manrope-latin.woff2"), manropeBuf);

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;|&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)));
}

function extractHtmlTextAndAttrs(html) {
  const withoutCode = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");
  const attrs = [];
  for (const m of withoutCode.matchAll(
    /\b(?:alt|aria-label|title|placeholder|content)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi,
  )) {
    attrs.push(m[1] ?? m[2] ?? "");
  }
  const bodyMatch = withoutCode.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  const bodyRaw = bodyMatch ? bodyMatch[1] : withoutCode;
  const visible = bodyRaw.replace(/<[^>]+>/g, " ");
  return decodeEntities(visible + "\n" + attrs.join("\n"));
}

async function walkFiles(dir, predicate, out = []) {
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walkFiles(p, predicate, out);
    else if (predicate(p, e.name)) out.push(p);
  }
  return out;
}

// 2. Collect core CJK charset from built zh homepage (.next/server/app/index.html) + Home header/tabs
const appBuildDir = path.join(root, ".next/server/app");
const homeHtml = await fs.readFile(path.join(appBuildDir, "index.html"), "utf8");
let coreText = extractHtmlTextAndAttrs(homeHtml);

for (const rel of [
  "components/v3/HeaderClient.tsx",
  "components/v3/SolutionExplorerClient.tsx",
  "components/v3/ProblemTabs.tsx",
]) {
  try {
    coreText += "\n" + (await fs.readFile(path.join(root, rel), "utf8"));
  } catch {}
}

// 3. Collect /about and /technology subsets + remaining zh pages and v4/v1 JSON
let aboutText = "";
try {
  aboutText = extractHtmlTextAndAttrs(
    await fs.readFile(path.join(appBuildDir, "about.html"), "utf8"),
  );
} catch {}

let techText = "";
try {
  techText = extractHtmlTextAndAttrs(
    await fs.readFile(path.join(appBuildDir, "technology.html"), "utf8"),
  );
} catch {}

let allText = coreText + "\n" + aboutText + "\n" + techText;

const htmlFiles = await walkFiles(appBuildDir, (_p, name) => name.endsWith(".html"));
for (const f of htmlFiles) {
  const rel = path.relative(appBuildDir, f).replace(/\\/g, "/");
  if (rel === "en.html" || rel.startsWith("en/")) continue;
  const html = await fs.readFile(f, "utf8");
  allText += "\n" + extractHtmlTextAndAttrs(html);
}

for (const jsonDir of ["content/v4", "content/v1"]) {
  const jsonFiles = await walkFiles(path.join(root, jsonDir), (_p, name) =>
    name.endsWith(".json"),
  );
  for (const jf of jsonFiles) {
    allText += "\n" + (await fs.readFile(jf, "utf8"));
  }
}

for (const extraJson of ["content/legal-v1.json", "content/query-demo.json"]) {
  try {
    allText += "\n" + (await fs.readFile(path.join(root, extraJson), "utf8"));
  } catch {}
}

const tsxFiles = await walkFiles(path.join(root, "components"), (_p, name) =>
  /\.(tsx|ts)$/.test(name),
);
for (const tf of tsxFiles) {
  allText += "\n" + (await fs.readFile(tf, "utf8"));
}

const coreSet = new Set(coreText.match(CJK_RE) || []);
const aboutSet = new Set(
  [...(aboutText.match(CJK_RE) || [])].filter((ch) => !coreSet.has(ch)),
);
const techSet = new Set(
  [...(techText.match(CJK_RE) || [])].filter(
    (ch) => !coreSet.has(ch) && !aboutSet.has(ch),
  ),
);
const allSet = new Set(allText.match(CJK_RE) || []);

const coreChars = [...coreSet].sort();
const aboutChars = [...aboutSet].sort();
const techChars = [...techSet].sort();
const extChars = [...allSet]
  .filter((ch) => !coreSet.has(ch) && !aboutSet.has(ch) && !techSet.has(ch))
  .sort();

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
          : `U+${start.toString(16).toUpperCase()}-${prev.toString(16).toUpperCase()}`,
      );
      start = prev = codes[i];
    }
  }
  ranges.push(
    start === prev
      ? `U+${start.toString(16).toUpperCase()}`
      : `U+${start.toString(16).toUpperCase()}-${prev.toString(16).toUpperCase()}`,
  );
  return ranges.join(",");
}

const rawNoto = await fs.readFile(notoSource);
const cjkOpts = {
  targetFormat: "woff2",
  variationAxes: { wght: { min: 400, max: 500 } },
  keepFeatures: [],
  noLayoutClosure: true,
  noHinting: true,
};

const pubFonts = path.join(root, "public/fonts");
await fs.mkdir(pubFonts, { recursive: true });
for (const existing of await fs.readdir(pubFonts)) {
  if (existing.startsWith("noto-sc-") && existing.endsWith(".woff2")) {
    await fs.unlink(path.join(pubFonts, existing));
  }
}

const hash = (buf) => createHash("sha256").update(buf).digest("hex").slice(0, 10);

const slices = [
  { prefix: "noto-sc-core", chars: coreChars },
  { prefix: "noto-sc-about", chars: aboutChars },
  { prefix: "noto-sc-tech", chars: techChars },
  { prefix: "noto-sc-ext", chars: extChars },
];

let css = `/* Auto-generated by scripts/subset-font.mjs — DO NOT EDIT MANUALLY */\n`;
const summary = [];

for (const slice of slices) {
  if (slice.chars.length === 0) continue;
  const buf = await subsetFont(rawNoto, " " + slice.chars.join(""), cjkOpts);
  const fileName = `${slice.prefix}.${hash(buf)}.woff2`;
  await fs.writeFile(path.join(pubFonts, fileName), buf);
  css += `@font-face {
  font-family: "Noto Sans SC Subset";
  src: url("/fonts/${fileName}") format("woff2");
  font-weight: 400 500;
  font-style: normal;
  font-display: swap;
  unicode-range: ${toUnicodeRange(slice.chars)};
}
`;
  summary.push(
    `${fileName} (${slice.chars.length} chars, ${(buf.length / 1024).toFixed(1)} KB)`,
  );
}

css += `@font-face {
  font-family: "Noto Sans SC Fallback";
  src: local("Microsoft YaHei"), local("PingFang SC"), local("Noto Sans CJK SC"), local("Source Han Sans SC");
  ascent-override: 116%;
  descent-override: 29%;
  line-gap-override: 0%;
  size-adjust: 100%;
}
`;

await fs.writeFile(path.join(root, "app/styles/cjk-font.css"), css);

console.log(
  `✓ CJK subsets (wght 400–500): ${summary.join(" + ")}; Latin: inter=${(
    interBuf.length / 1024
  ).toFixed(1)} KB, manrope=${(manropeBuf.length / 1024).toFixed(1)} KB.`,
);
