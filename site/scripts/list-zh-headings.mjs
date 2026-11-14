import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

function walkHtml(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walkHtml(f, out);
    else if (f.endsWith(".html")) out.push(f);
  }
  return out;
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)));
}

const appHtmlDir = path.join(root, ".next/server/app");
const headings = new Map();

for (const file of walkHtml(appHtmlDir)) {
  const rel = path.relative(appHtmlDir, file).replace(/\\/g, "/");
  if (rel === "en.html" || rel.startsWith("en/") || rel.startsWith("_not-found")) continue;
  const html = fs.readFileSync(file, "utf8");
  if (!html.includes('lang="zh-CN"') && !html.includes('lang="zh"')) continue;

  for (const m of html.matchAll(/<(h[12])\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
    const tag = m[1].toLowerCase();
    const attrs = m[2];
    if (/\bsr-only\b/.test(attrs)) continue;
    const text = decodeEntities(
      m[3]
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, ""),
    )
      .replace(/[ \t\r]+/g, " ")
      .trim();
    if (!text) continue;
    const key = text;
    if (!headings.has(key)) {
      headings.set(key, { tag, length: [...text].length, pages: [] });
    }
    headings.get(key).pages.push(rel);
  }
}

const rows = [...headings.entries()]
  .map(([text, info]) => ({ text, ...info }))
  .sort((a, b) => b.length - a.length);

for (const r of rows) {
  console.log(`[${r.tag}] len=${r.length} | ${JSON.stringify(r.text)} | ${r.pages.slice(0, 3).join(", ")}`);
}
console.log(`\nTotal unique zh h1/h2: ${rows.length}, >= 10 chars: ${rows.filter((r) => r.length >= 10).length}`);
