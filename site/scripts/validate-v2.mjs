import fs from "node:fs";
import path from "node:path";

const siteDir = process.cwd();
const rootDir = path.resolve(siteDir, "..");

const cases = JSON.parse(fs.readFileSync(path.join(siteDir, "content/cases-v2.json"), "utf8"));
const solutions = JSON.parse(fs.readFileSync(path.join(siteDir, "content/solutions-v2.json"), "utf8"));
const founders = JSON.parse(fs.readFileSync(path.join(siteDir, "content/founders-v2.json"), "utf8"));
const insights = JSON.parse(fs.readFileSync(path.join(siteDir, "content/insights-v2.json"), "utf8"));
const siteCopy = JSON.parse(fs.readFileSync(path.join(siteDir, "content/site-copy-v2.json"), "utf8"));
const articles = JSON.parse(fs.readFileSync(path.join(siteDir, "content/articles.json"), "utf8"));
const mediaManifest = JSON.parse(fs.readFileSync(path.join(siteDir, "lib/media-manifest.json"), "utf8"));
const sourcesText = fs.readFileSync(path.join(rootDir, "content/sources.md"), "utf8");

const errors = [];

// 1. Check counts
if (cases.length !== 6) errors.push(`Expected 6 cases, got ${cases.length}`);
if (solutions.length !== 4) errors.push(`Expected 4 solutions, got ${solutions.length}`);
if (founders.length !== 4) errors.push(`Expected 4 founders, got ${founders.length}`);
if (insights.length !== 3) errors.push(`Expected 3 insights, got ${insights.length}`);

// 2. Check all 31 case screenshots exist on disk and in media-manifest.json
let totalScreenshots = 0;
for (const c of cases) {
  totalScreenshots += c.images.length;
  for (const img of c.images) {
    const diskPath = path.join(siteDir, "public", img.src);
    if (!fs.existsSync(diskPath)) {
      errors.push(`Missing screenshot on disk: ${img.src}`);
    }
    if (!mediaManifest[img.src]) {
      errors.push(`Missing media-manifest entry for: ${img.src}`);
    }
  }
  if (c.hotspots.length !== 4) {
    errors.push(`Case ${c.slug} must have 4 hotspots, got ${c.hotspots.length}`);
  }
  for (const st of c.stats) {
    if (!sourcesText.includes(`## ${st.sourceId}`)) {
      errors.push(`Case ${c.slug} stat sourceId '${st.sourceId}' not found in content/sources.md`);
    }
  }
}
if (totalScreenshots !== 31) {
  errors.push(`Expected 31 total case screenshots, got ${totalScreenshots}`);
}

// 3. Check homepage & technology benchmark sourceIds
for (const m of siteCopy.home.outcomeMetrics) {
  if (!sourcesText.includes(`## ${m.sourceId}`)) {
    errors.push(`Home outcomeMetric sourceId '${m.sourceId}' missing from content/sources.md`);
  }
}
for (const b of siteCopy.technology.benchmarks) {
  if (!sourcesText.includes(`## ${b.sourceId}`)) {
    errors.push(`Tech benchmark sourceId '${b.sourceId}' missing from content/sources.md`);
  }
}

// 4. Check articles match insights-v2 slugs
for (const ins of insights) {
  if (!articles[ins.slug]?.zh?.length || !articles[ins.slug]?.en?.length) {
    errors.push(`Missing article body for insight slug '${ins.slug}'`);
  }
}

// 5. Check forbidden placeholders, internal IDs, and §9.3 discouraged buzzwords across all v2 content
const forbiddenPatterns = [
  { label: "placeholder/meta", re: /TODO|TBD|FIXME|待定|待确认|待补充|待填写|占位|placeholder|lorem|ipsum|\bXX\b|\{\{|\}\}|示例文字|请替换|此处填写|执行者|执行 Agent|本方案|本文档|内部用|内部代号/i },
  { label: "secrecy/server", re: /出于保密|竞业|演示公司|虚构企业|服务器位于|海外部署|境外部署|境内部署/ },
  { label: "internal-plan-id", re: /\b(?:G-\d{2}|V-\d{2}|M-\d{2}|E-\d{2}|W-\d{2}|A-\d{2}|D-[1-6]|R(?:[1-9]|1[0-2]))\b/ },
  { label: "banned-superlatives-buzzwords", re: /独占鳌头|遥遥领先|天花板|颠覆|革命性|赋能|抓手|闭环|全链路|数智化|最高级|国家级|100%\s*安全|零风险|确保回本|官方合作伙伴|∞|best-in-class|world's leading|guaranteed|revolutionary|game-changing|synergy/i },
];

function walkStrings(obj, trail = "") {
  if (typeof obj === "string") {
    for (const { label, re } of forbiddenPatterns) {
      const m = obj.match(re);
      if (m) {
        errors.push(`[${label}] matched "${m[0]}" at ${trail}: "${obj.slice(0, 80)}"`);
      }
    }
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, idx) => walkStrings(item, `${trail}[${idx}]`));
    return;
  }
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      walkStrings(v, trail ? `${trail}.${k}` : k);
    }
  }
}

walkStrings(cases, "cases-v2");
walkStrings(solutions, "solutions-v2");
walkStrings(founders, "founders-v2");
walkStrings(insights, "insights-v2");
walkStrings(siteCopy, "site-copy-v2");
walkStrings(articles, "articles");

if (errors.length > 0) {
  console.error("v2 content validation failed:\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}

console.log(`✓ Validated v2 content: ${cases.length} cases (${totalScreenshots} screenshots), ${solutions.length} solutions, ${founders.length} founders, ${insights.length} insights, all sourceIds & copy rules clean.`);
