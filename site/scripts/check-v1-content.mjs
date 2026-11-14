import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));

const decodeEntities = (s) =>
  String(s)
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;|\u00a0/g, " ");

const norm = (s) => decodeEntities(s).replace(/\s+/g, " ").trim();
const compact = (s) => norm(s).replace(/\s+/g, "");

function collectStrings(obj, outSet) {
  if (typeof obj === "string") {
    const n = norm(obj);
    if (n) {
      outSet.add(n);
      for (const part of obj.split(/\n+/)) {
        const pn = norm(part);
        if (pn) outSet.add(pn);
      }
    }
  } else if (Array.isArray(obj)) {
    for (const item of obj) collectStrings(item, outSet);
  } else if (obj && typeof obj === "object") {
    for (const val of Object.values(obj)) collectStrings(val, outSet);
  }
}

// 1. Build verbatim baseline corpus (v1 + Stage-0 locked site chrome)
const baselineByRoute = readJson("content/v1/rendered-baseline.json");
const v1Copy = readJson("content/v1/copy.json");
const verbatimSet = new Set([
  "CYANO",
  "Cyano",
  "Cyano Intelligence",
  "hello@cyano.app",
  "中文",
  "EN",
  "跳转到主要内容",
  "Skip to main content",
  "Cyano 首页",
  "Cyano home",
  "主导航",
  "Main navigation",
  "展开解决方案",
  "Expand Solutions",
  "展开关于我们",
  "Expand About",
  "打开菜单",
  "Open menu",
  "关闭菜单",
  "Close menu",
  "关闭 ×",
  "Close ×",
  "上一张",
  "Previous",
  "下一张",
  "Next",
  "点击放大",
  "Click to enlarge",
  "放大查看界面",
  "Enlarge screenshot",
  "查看界面",
  "View screen",
  "界面",
  "screen",
  "放大查看：",
  "Enlarge:",
  "点击查看完整界面 ↗",
  "View full screen ↗",
  "界面示例",
  "Interface example",
  "核心诉求",
  "盈利能力评估",
  "压力测试",
  "目前的问题",
  "The problem",
  "Setup VPN on Windows",
  "VPN Troubleshooting",
  "Client information and data have been anonymised for confidentiality.",
  "启用 JavaScript 可选择问题体验；也可阅读上方的系统说明。",
  "Enable JavaScript to select a sample question, or read the system description above.",
  "按行业筛选案例",
  "Filter cases by industry",
  "合作方式比较",
  "Engagement comparison",
  "咨询合作方式",
  "Discuss engagement",
  "咨询数据安全与部署",
  "Discuss data security and deployment",
  "Implementation",
  "Qwen",
  "Lark",
  "DingTalk",
  "WeCom",
  "Cyano 首席执行官插画形象",
  "Cyano 首席技术官插画形象",
  "Cyano 工程交付负责人插画形象",
  "Cyano 产品与解决方案负责人插画形象",
  "产品与解决方案负责人插画",
  "Illustrated Cyano Chief Executive Officer",
  "Illustrated Cyano Chief Technology Officer",
  "Illustrated Cyano Head of Engineering Delivery",
  "Illustrated Cyano Head of Product & Solutions",
  "Head of Product & Solutions illustration",
]);

collectStrings(v1Copy, verbatimSet);
collectStrings(readJson("content/v1/cases.json"), verbatimSet);
collectStrings(readJson("content/v1/demo-questions.json"), verbatimSet);
collectStrings(readJson("content/query-demo.json"), verbatimSet);
collectStrings(readJson("content/legal-v1.json"), verbatimSet);
collectStrings(readJson("content/v4/site.json"), verbatimSet);
collectStrings(readJson("content/v4/solutions.json"), verbatimSet);
collectStrings(readJson("content/v4/insights.json"), verbatimSet);
for (const pageFile of fs.readdirSync(path.join(root, "content/v4/pages"))) {
  if (pageFile.endsWith(".json") && pageFile !== "_key-map.json") {
    collectStrings(readJson(`content/v4/pages/${pageFile}`), verbatimSet);
  }
}
for (const entry of Object.values(baselineByRoute)) {
  for (const f of entry.fragments) verbatimSet.add(f);
  verbatimSet.add(norm(entry.text));
}

// 2. Approved overrides (02 §9.1)
const rawOverrides = readJson("content/v4/copy-overrides.json");
const overrideSet = new Set();
const overriddenV1Fragments = new Set();

for (const [key, entry] of Object.entries(rawOverrides)) {
  if (entry.status === "approved" || entry.status === "class-a") {
    overrideSet.add(norm(entry.zh));
    overrideSet.add(norm(entry.en));
    const slash = key.indexOf("/");
    if (slash > 0) {
      const sec = key.slice(0, slash);
      const k = key.slice(slash + 1);
      const orig = v1Copy[sec]?.[k];
      if (orig) {
        overriddenV1Fragments.add(compact(orig.zh));
        overriddenV1Fragments.add(compact(orig.en));
      }
    }
  }
}

// 3. Approved new copy + mockups (02 §9.1)
const rawNew = readJson("content/v4/copy-new.json");
const newSet = new Set();
for (const entry of Object.values(rawNew)) {
  if (entry.status === "approved" || entry.status === "class-a") {
    if (entry.zh) {
      newSet.add(norm(entry.zh));
      for (const line of entry.zh.split(/\n+/)) if (norm(line)) newSet.add(norm(line));
    }
    if (entry.en) {
      newSet.add(norm(entry.en));
      for (const line of entry.en.split(/\n+/)) if (norm(line)) newSet.add(norm(line));
    }
  }
}
const mockupsDir = path.join(root, "content/v4/mockups");
if (fs.existsSync(mockupsDir)) {
  for (const mf of fs.readdirSync(mockupsDir)) {
    if (mf.endsWith(".json")) {
      collectStrings(readJson(`content/v4/mockups/${mf}`), newSet);
    }
  }
}

const verbatimCompactList = [...verbatimSet].map(compact).filter(Boolean);
const overrideCompactList = [...overrideSet].map(compact).filter(Boolean);
const newCompactList = [...newSet].map(compact).filter(Boolean);

const verbatimExact = new Set(verbatimCompactList);
const overrideExact = new Set(overrideCompactList);
const newExact = new Set(newCompactList);

const verbatimJoined = verbatimCompactList.join("||");
const overrideJoined = overrideCompactList.join("||");
const newJoined = newCompactList.join("||");

// Pure numbers, ordinals, punctuation, and arrows are checked by check-numbers.mjs (02 §9.1 & §9.2)
const PURE_SYMBOL_OR_NUMBER_RE = /^[\d\s.,:×/–—%+\-↗→←↑↓×·•|[\]()<>W#]+$/;

function classifySingle(str) {
  const n = norm(str).replace(/[↗→←↑↓]+$/g, "").trim();
  if (!n || PURE_SYMBOL_OR_NUMBER_RE.test(n)) return "numeric_or_symbol";
  const c = compact(n);
  if (!c) return "numeric_or_symbol";
  if (overrideExact.has(c) || (c.length >= 2 && overrideJoined.includes(c))) {
    return "approvedOverride";
  }
  if (verbatimExact.has(c) || verbatimJoined.includes(c)) {
    return "verbatim";
  }
  if (newExact.has(c) || newJoined.includes(c)) {
    return "approvedNew";
  }
  return null;
}

function classifyTextOrAttr(rawStr) {
  const direct = classifySingle(rawStr);
  if (direct) return direct;

  // Handle composite titles/alts like "${system} — ${title}", "${system} — 界面 1", "查看界面 2", "放大查看：${system}"
  const stripped = norm(rawStr)
    .replace(/\s*\|\s*Cyano(\s+Intelligence)?$/i, "")
    .replace(/^Cyano Intelligence\s*—\s*/i, "");
  const parts = stripped
    .split(/\s*(?:—|·|\||：|:)\s*/)
    .map((p) => p.replace(/\s*\d+\s*$/, "").trim())
    .filter(Boolean);
  if (parts.length > 0 && parts.every((p) => classifySingle(p) !== null)) {
    const classes = parts.map((p) => classifySingle(p));
    if (classes.includes("approvedOverride")) return "approvedOverride";
    if (classes.includes("approvedNew")) return "approvedNew";
    return "verbatim";
  }
  return "unregistered";
}

// Enumerate all 46 static/SSG routes
const cases = readJson("content/v4/cases.json");
const solutions = readJson("content/v4/solutions.json");
const insights = readJson("content/v4/insights.json");

const baseTasks = [
  ["", "Home"],
  ["services", "Services"],
  ["cases", "CasesPage"],
  ["technology", "Technology"],
  ["engagement", "Engagement"],
  ["about", "About"],
  ["contact", "Contact"],
  ["insights", "Insights"],
  ["privacy", "Legal"],
  ["terms", "Legal"],
  ...solutions.map((s) => [`services/${s.slug}`, "SolutionDetail"]),
  ...cases.map((c) => [`cases/${c.slug}`, "CaseDetail"]),
  ...insights.map((i) => [`insights/${i.slug}`, "Article"]),
];

const pagesReport = [];
let totalVerbatim = 0;
let totalOverride = 0;
let totalNew = 0;
let totalUnregistered = 0;
let totalMissingV1 = 0;

for (const locale of ["zh", "en"]) {
  for (const [sub, pageName] of baseTasks) {
    const routeKey = "/" + (locale === "en" ? (sub ? `en/${sub}` : "en") : sub);
    const htmlRel = (locale === "en" ? (sub ? `en/${sub}` : "en") : sub) || "index";
    const htmlPath = path.join(root, ".next/server/app", `${htmlRel}.html`);
    const rawHtml = fs.readFileSync(htmlPath, "utf8");

    const counts = {
      verbatim: 0,
      approvedOverride: 0,
      approvedNew: 0,
      unregistered: 0,
      missingV1: 0,
    };
    const unregisteredItems = [];

    function recordCheck(kind, value) {
      const cls = classifyTextOrAttr(value);
      if (cls === "numeric_or_symbol") return;
      if (cls === "unregistered") {
        counts.unregistered++;
        unregisteredItems.push({ kind, value: norm(value) });
      } else {
        counts[cls]++;
      }
    }

    // 1. <title>
    const titleMatch = rawHtml.match(/<title>([\s\S]*?)<\/title>/i);
    if (titleMatch) {
      recordCheck("title", norm(titleMatch[1]).replace(/\s*\|\s*Cyano$/i, ""));
    }

    // 2. <meta name="description"> & <meta property="og:description">
    for (const metaRe of [
      /<meta\s+name="description"\s+content="([^"]*)"/i,
      /<meta\s+property="og:description"\s+content="([^"]*)"/i,
    ]) {
      const m = rawHtml.match(metaRe);
      if (m) recordCheck("meta-description", m[1]);
    }

    // 3. Body attributes & text nodes (including < 4 chars!)
    const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const cleanedBody = (bodyMatch ? bodyMatch[1] : rawHtml)
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, "")
      // Unwrap Phrase spans so Chinese headings are checked as whole phrases/sentences
      .replace(/<span\s+class="phrase">([\s\S]*?)<\/span>/gi, "$1");

    for (const attrMatch of cleanedBody.matchAll(
      /\b(alt|aria-label|placeholder|title)="([^"]*)"/gi,
    )) {
      const attrName = attrMatch[1].toLowerCase();
      const attrVal = norm(attrMatch[2]);
      if (attrVal) recordCheck(`attr:${attrName}`, attrVal);
    }

    for (const seg of cleanedBody.split(/<[^>]+>/)) {
      const textVal = norm(seg);
      if (textVal) recordCheck("text", textVal);
    }

    // 4. Verify v1 baseline fragments are not lost
    const baselineEntry = baselineByRoute[routeKey];
    const currentCompact = compact(cleanedBody.replace(/<[^>]+>/g, ""));
    const sharedRemoved = [
      "CYANO/ENTERPRISEAI",
      "01/CYANO",
      "02/CYANO",
      "03/CYANO",
      "04/CYANO",
      "05/CYANO",
      "06/CYANO",
    ];
    const routeExceptions = new Set([
      ...sharedRemoved,
      ...(pageName === "Technology"
        ? [
            "10×",
            "投入回报最高可达",
            "Returnoninvestment,upto",
            ...(locale === "en" ? ["通义千问", "企业微信"] : []),
          ]
        : []),
      ...(pageName === "Contact"
        ? [
            "项目咨询",
            "聊聊你希望改进的工作流程",
            "预约一次30–45分钟的沟通，讨论现有流程、资料和项目目标。",
            "CONTACTUS",
            "Tellusaboutyourworkflow",
            "Booka30–45minutecalltodiscussyourprocess,sourcematerialandprojectgoals.",
          ]
        : []),
    ]);

    const missingV1Items = [];
    if (baselineEntry) {
      for (const frag of baselineEntry.fragments) {
        if (currentCompact.includes(frag)) continue;
        if (routeExceptions.has(frag)) continue;
        if (overriddenV1Fragments.has(frag)) continue;
        // Check if frag was part of an overridden v1 paragraph
        let coveredByOverride = false;
        for (const ov of overriddenV1Fragments) {
          if (ov.includes(frag) || frag.includes(ov)) {
            coveredByOverride = true;
            break;
          }
        }
        if (!coveredByOverride) {
          missingV1Items.push(frag);
        }
      }
    }
    counts.missingV1 = missingV1Items.length;

    totalVerbatim += counts.verbatim;
    totalOverride += counts.approvedOverride;
    totalNew += counts.approvedNew;
    totalUnregistered += counts.unregistered;
    totalMissingV1 += counts.missingV1;

    pagesReport.push({
      route: routeKey,
      counts,
      unregisteredItems,
      missingV1Items,
    });
  }
}

const report = {
  baseline: "b9dcf94",
  checkedAt: new Date().toISOString(),
  summary: {
    routes: pagesReport.length,
    verbatim: totalVerbatim,
    approvedOverride: totalOverride,
    approvedNew: totalNew,
    unregistered: totalUnregistered,
    missingV1: totalMissingV1,
  },
  pages: pagesReport,
};

fs.mkdirSync(path.join(root, "reports"), { recursive: true });
fs.writeFileSync(
  path.join(root, "reports/content-check.json"),
  JSON.stringify(report, null, 2) + "\n",
  "utf8",
);

console.log(
  `✓ check:content (${pagesReport.length} pages): verbatim=${totalVerbatim}, approvedOverride=${totalOverride}, approvedNew=${totalNew}, unregistered=${totalUnregistered}, missingV1=${totalMissingV1}.`,
);

if (totalUnregistered > 0 || totalMissingV1 > 0) {
  const bad = pagesReport.filter(
    (p) => p.counts.unregistered > 0 || p.counts.missingV1 > 0,
  );
  console.error(JSON.stringify(bad, null, 2));
  process.exit(1);
}
