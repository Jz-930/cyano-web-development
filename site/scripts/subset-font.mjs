import fs from "node:fs/promises";
import path from "node:path";
import subsetFont from "subset-font";
import { createHash } from "node:crypto";
import { renderedPages } from "./rendered-pages.mjs";

const root = path.resolve(import.meta.dirname, "..");

async function writeFileSafe(filePath, data) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await fs.writeFile(filePath, data);
      return;
    } catch (err) {
      if (attempt === 4) throw err;
      await new Promise((r) => setTimeout(r, 120 * (attempt + 1)));
    }
  }
}

const notoSource = path.join(root, "../assets/source/NotoSansSC-variable.ttf");
const interSource = path.join(root, "../assets/source/inter-variable.woff2");
const manropeSource = path.join(root, "../assets/source/manrope-variable.woff2");

const CJK_RE = /[\u2000-\u206f\u3000-\u303f\u3400-\u9fff\uff00-\uffef]/g;

// 1. Subset Latin variable fonts (wght 400–500 per 02 §6.1 & 03 §5)
const latinGlyphs =
  Array.from({ length: 95 }, (_, i) => String.fromCharCode(i + 32)).join("") +
  "·—–‘’“”…•→↗×≤≥±©®°‑§¥μ≠";
const latinOpts = {
  targetFormat: "woff2",
  variationAxes: { wght: { min: 400, max: 500 } },
  keepFeatures: [],
  noLayoutClosure: true,
  noHinting: true,
};
const interBuf = await subsetFont(await fs.readFile(interSource), latinGlyphs, latinOpts);
await writeFileSafe(path.join(root, "app/fonts/inter-latin.woff2"), interBuf);

const manropeBuf = await subsetFont(await fs.readFile(manropeSource), latinGlyphs, latinOpts);
await writeFileSafe(path.join(root, "app/fonts/manrope-latin.woff2"), manropeBuf);

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

// `alt: false` leaves image alt text out of the first-screen route subsets: alt text is
// only painted when an image fails, so its glyphs belong in the on-demand ext subset.
function extractHtmlTextAndAttrs(html, { alt = true } = {}) {
  const withoutCode = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");
  const attrs = [];
  const attrRe = alt
    ? /\b(?:alt|aria-label|title|placeholder|content)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi
    : /\b(?:aria-label|title|placeholder|content)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  for (const m of withoutCode.matchAll(attrRe)) {
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

// 2. Collect route-specific CJK charsets for /, /about, /technology (including client interactive states)
const pages = await renderedPages(root);
const homeHtml = await fs.readFile(pages.get("/"), "utf8");
const headerBlock = (homeHtml.match(/<header\b[\s\S]*?<\/header>/i) || [""])[0];
const headerChars = new Set(extractHtmlTextAndAttrs(headerBlock).match(CJK_RE) || []);

let fullHomeText = extractHtmlTextAndAttrs(homeHtml, { alt: false });
for (const scene of ["proposal", "wiki", "sales", "data", "stage"]) {
  try {
    const mj = JSON.parse(
      await fs.readFile(path.join(root, `content/v4/mockups/${scene}.json`), "utf8"),
    );
    for (const val of Object.values(mj)) {
      if (val?.zh) fullHomeText += "\n" + val.zh;
    }
  } catch {}
}

const copyNew = JSON.parse(
  await fs.readFile(path.join(root, "content/v4/copy-new.json"), "utf8"),
);
for (const [k, v] of Object.entries(copyNew)) {
  if (v.status !== "approved" && v.status !== "class-a") continue;
  if (
    /^(S1-|S11-|cite\.(case-proposal-15min|case-wiki-80|team-6y)$|cite-)/.test(k) &&
    v.zh
  ) {
    fullHomeText += "\n" + v.zh;
  }
}

let aboutText = "";
try {
  aboutText = extractHtmlTextAndAttrs(
    await fs.readFile(pages.get("/about"), "utf8"),
    { alt: false },
  );
} catch {}
for (const [k, v] of Object.entries(copyNew)) {
  if (
    (v.status === "approved" || v.status === "class-a") &&
    /^(cite\.team-6y$|cite-)/.test(k) &&
    v.zh
  ) {
    aboutText += "\n" + v.zh;
  }
}

let techText = "";
try {
  techText = extractHtmlTextAndAttrs(
    await fs.readFile(pages.get("/technology"), "utf8"),
    { alt: false },
  );
} catch {}
for (const [k, v] of Object.entries(copyNew)) {
  if (
    (v.status === "approved" || v.status === "class-a") &&
    /^(cite\.core-|cite-)/.test(k) &&
    v.zh
  ) {
    techText += "\n" + v.zh;
  }
}

// 3. Collect all site-wide CJK chars across HTML, JSON, and TSX
let allText = fullHomeText + "\n" + aboutText + "\n" + techText;

for (const [route, f] of pages) {
  if (route === "/en" || route.startsWith("/en/")) continue;
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

const homeAllSet = new Set(fullHomeText.match(CJK_RE) || []);
const aboutAllSet = new Set(aboutText.match(CJK_RE) || []);
const techAllSet = new Set(techText.match(CJK_RE) || []);
const allSet = new Set(allText.match(CJK_RE) || []);

// Core = header chars + any char shared by >= 2 of (Home, About, Technology) -> guarantees pairwise disjoint route slices!
const coreSet = new Set(headerChars);
for (const ch of new Set([...homeAllSet, ...aboutAllSet, ...techAllSet])) {
  const count =
    (homeAllSet.has(ch) ? 1 : 0) +
    (aboutAllSet.has(ch) ? 1 : 0) +
    (techAllSet.has(ch) ? 1 : 0);
  if (count >= 2) coreSet.add(ch);
}

const homeRestChars = [...homeAllSet].filter((ch) => !coreSet.has(ch)).sort();
const aboutChars = [...aboutAllSet].filter((ch) => !coreSet.has(ch)).sort();
const techChars = [...techAllSet].filter((ch) => !coreSet.has(ch)).sort();
const coreChars = [...coreSet].sort();

const coveredByPrimary = new Set([
  ...coreChars,
  ...homeRestChars,
  ...aboutChars,
  ...techChars,
]);
const extChars = [...allSet].filter((ch) => !coveredByPrimary.has(ch)).sort();

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
  { prefix: "noto-sc-home", chars: homeRestChars },
  { prefix: "noto-sc-about", chars: aboutChars },
  { prefix: "noto-sc-tech", chars: techChars },
  { prefix: "noto-sc-ext", chars: extChars },
];

let css = `/* Auto-generated by scripts/subset-font.mjs — DO NOT EDIT MANUALLY */\n`;
const summary = [];
let coreHref = "";

for (const slice of slices) {
  if (slice.chars.length === 0) continue;
  const buf = await subsetFont(rawNoto, " " + slice.chars.join(""), cjkOpts);
  const fileName = `${slice.prefix}.${hash(buf)}.woff2`;
  if (slice.prefix === "noto-sc-core") coreHref = `/fonts/${fileName}`;
  await writeFileSafe(path.join(pubFonts, fileName), buf);
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

await writeFileSafe(path.join(root, "app/styles/cjk-font.css"), css);
await writeFileSafe(
  path.join(root, "app/fonts/cjk-preload.json"),
  JSON.stringify({ core: coreHref }, null, 2) + "\n",
);

console.log(
  `✓ CJK subsets (wght 400–500): ${summary.join(" + ")}; Latin: inter=${(
    interBuf.length / 1024
  ).toFixed(1)} KB, manrope=${(manropeBuf.length / 1024).toFixed(1)} KB.`,
);
