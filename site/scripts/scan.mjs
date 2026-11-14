import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

const forbidden =
  /TODO|TBD|FIXME|待定|待确认|待补充|待填写|占位|placeholder|lorem|ipsum|\bXX\b|\{\{|\}\}|示例文字|请替换|此处填写|执行者|执行 Agent|本方案|本文档|内部用|内部代号|出于保密|竞业|演示公司|虚构企业|服务器位于|海外部署|境外部署|境内部署|独占鳌头|遥遥领先|天花板|颠覆|革命性|赋能|抓手|闭环|全链路|数智化|最高级|国家级|100%\s*安全|零风险|确保回本|官方合作伙伴|∞|best-in-class|world's leading|guaranteed|revolutionary|game-changing|synergy|\b(?:G-\d{2}|V-\d{2}|M-\d{2}|E-\d{2}|W-\d{2}|A-\d{2}|D-[1-6])\b/i;

async function walk(dir) {
  const all = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) all.push(...(await walk(p)));
    else all.push(p);
  }
  return all;
}

const htmlFiles = (await walk(path.join(root, ".next/server/app"))).filter((f) =>
  f.endsWith(".html")
);

const fails = [];
for (const file of htmlFiles) {
  let html = await fs.readFile(file, "utf8");
  html = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  // Preserve exact approved copy (v1 FAQ prior to D-20 migration & 09#mk.proposal.s1 tender sentence) while rejecting leaked doc prose or jargon.
  const match = html
    .replaceAll("支持私有化部署，数据不出你的环境；系统内置权限控制、全链路日志审计与敏感信息拦截。", "")
    .replaceAll("本方案依据招标文件的技术要求，结合同类项目经验编写。", "")
    .match(forbidden);
  if (match) {
    fails.push({ file: path.relative(root, file), match: match[0] });
  }
}

if (fails.length > 0) {
  console.error("Public HTML copy scan failed:", fails);
  process.exit(1);
}

// Verify CJK font subset glyph coverage across all rendered HTML pages (W-04)
const cjkCss = await fs.readFile(path.join(root, "app/styles/cjk-font.css"), "utf8");
const covered = new Set();
for (const m of cjkCss.matchAll(/U\+([0-9A-F]+)(?:-([0-9A-F]+))?/gi)) {
  const start = parseInt(m[1], 16);
  const end = m[2] ? parseInt(m[2], 16) : start;
  for (let cp = start; cp <= end; cp++) covered.add(cp);
}

// Verify Chinese homepage (index.html) only uses core/home subset glyphs so it never downloads noto-sc-ext.woff2
const homeBlocks = cjkCss
  .split("@font-face")
  .filter((b) => /noto-sc-(?:core|home)\./.test(b));
const coreCovered = new Set();
for (const block of homeBlocks) {
  for (const m of block.matchAll(/U\+([0-9A-F]+)(?:-([0-9A-F]+))?/gi)) {
    const start = parseInt(m[1], 16);
    const end = m[2] ? parseInt(m[2], 16) : start;
    for (let cp = start; cp <= end; cp++) coreCovered.add(cp);
  }
}
const homeHtmlPath = path.join(root, ".next/server/app/index.html");
let homeHtml = await fs.readFile(homeHtmlPath, "utf8");
homeHtml = homeHtml
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");
const homeSpill = new Set();
for (const ch of homeHtml.match(/[\u3000-\u303f\u3400-\u9fff\uff00-\uffef]/g) || []) {
  if (!coreCovered.has(ch.codePointAt(0))) homeSpill.add(ch);
}
if (homeSpill.size > 0) {
  console.error("Homepage CJK glyphs spilled into ext subset:", [...homeSpill]);
  process.exit(1);
}
const missingGlyphs = new Set();
for (const file of htmlFiles) {
  let html = await fs.readFile(file, "utf8");
  html = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");
  for (const ch of html.match(/[\u3000-\u303f\u3400-\u9fff\uff00-\uffef]/g) || []) {
    if (!covered.has(ch.codePointAt(0))) missingGlyphs.add(ch);
  }
}
if (missingGlyphs.size > 0) {
  console.error("Missing CJK glyphs in subset font:", [...missingGlyphs]);
  process.exit(1);
}

console.log(
  `✓ Public copy & CJK glyph coverage scan passed across ${htmlFiles.length} rendered HTML pages (${covered.size} CJK glyphs covered).`
);
