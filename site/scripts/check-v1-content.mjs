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
  "移动导航",
  "Mobile navigation",
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
collectStrings(readJson("content/v4/team.json"), verbatimSet);
collectStrings(readJson("content/v4/cases.json"), verbatimSet);
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
const stripMdBold = (s) => String(s).replace(/\*\*/g, "");
for (const entry of Object.values(rawNew)) {
  if (entry.status === "approved" || entry.status === "class-a") {
    if (entry.zh) {
      const z = stripMdBold(entry.zh);
      newSet.add(norm(z));
      for (const line of z.split(/\n+/)) if (norm(line)) newSet.add(norm(line));
    }
    if (entry.en) {
      const e = stripMdBold(entry.en);
      newSet.add(norm(e));
      for (const line of e.split(/\n+/)) if (norm(line)) newSet.add(norm(line));
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
const team = readJson("content/v4/team.json");
const legal = readJson("content/legal-v1.json");

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

    // 4. Verify required v1 copy per 06-首页.md & 07-内页.md is not lost
    const currentCompact = compact(cleanedBody.replace(/<[^>]+>/g, ""));
    const missingV1Items = [];

    const isNewApproved = (id) => {
      const e = rawNew[id];
      return Boolean(e && (e.status === "approved" || e.status === "class-a"));
    };
    const v1Text = (sec, k) => {
      const ov = rawOverrides[`${sec}/${k}`];
      if (ov && (ov.status === "approved" || ov.status === "class-a")) {
        return ov[locale];
      }
      return v1Copy[sec][k][locale];
    };
    const requireSubstring = (label, rawExpected) => {
      const cleanExp = compact(String(rawExpected).replace(/\s*[→↗]\s*$/g, ""));
      if (cleanExp && !currentCompact.includes(cleanExp)) {
        missingV1Items.push(`${label}: ${rawExpected}`);
      }
    };
    const dashSep = locale === "zh" ? " —— " : " — ";

    // Global SiteFooter v1 copy on every route
    requireSubstring("D.1/页脚定位句", v1Text("D.1", "页脚定位句"));
    requireSubstring("D.1/页脚服务地区", v1Text("D.1", "页脚服务地区"));
    for (const lnk of v1Text("D.1", "页脚法律链接").split(" · ")) {
      requireSubstring("D.1/页脚法律链接", lnk);
    }

    if (pageName === "Home") {
      requireSubstring("D.1/主按钮", v1Text("D.1", "主按钮"));
      if (!isNewApproved("H-0")) {
        requireSubstring("D.2/Eyebrow", v1Text("D.2", "Eyebrow"));
      }
      requireSubstring("D.2/主标题", v1Text("D.2", "主标题"));
      requireSubstring("D.2/副标题", v1Text("D.2", "副标题"));
      const btnParts = v1Text("D.2", "按钮").split(" · ");
      if (btnParts[1]) requireSubstring("D.2/按钮[1]", btnParts[1]);

      for (const n of [1, 2, 3, 4]) {
        const [left = "", ...rest] = v1Text("D.2", `信任条数字 ${n}`).split(dashSep);
        requireSubstring(`D.2/信任条数字 ${n}[val]`, left);
        requireSubstring(`D.2/信任条数字 ${n}[desc]`, rest.join(dashSep));
      }
      for (const ind of v1Text("D.2", "行业名").split(" · ")) {
        requireSubstring("D.2/行业名", ind);
      }
      requireSubstring("D.2/宣言句", v1Text("D.2", "宣言句"));
      requireSubstring("D.2/宣言段 1", v1Text("D.2", "宣言段 1"));
      requireSubstring("D.2/宣言段 2", v1Text("D.2", "宣言段 2"));
      requireSubstring("D.2/解决方案区标题", v1Text("D.2", "解决方案区标题"));
      requireSubstring("D.2/精选案例标题", v1Text("D.2", "精选案例标题"));
      requireSubstring("D.2/精选案例导语", v1Text("D.2", "精选案例导语"));

      if (!isNewApproved("H-2t")) {
        requireSubstring("D.2/痛点区标题", v1Text("D.2", "痛点区标题"));
      }
      for (const n of [1, 2, 3, 4]) {
        const [before = "", answer = ""] = v1Text("D.2", `痛点 ${n}`).split("→");
        const [title = "", ...issueParts] = before.split(dashSep);
        requireSubstring(`D.2/痛点 ${n}[title]`, title);
        requireSubstring(`D.2/痛点 ${n}[issue]`, issueParts.join(dashSep));
        requireSubstring(`D.2/痛点 ${n}[answer]`, answer);
      }
      requireSubstring("D.2/痛点区链接", v1Text("D.2", "痛点区链接"));
      requireSubstring("D.2/合作区标题", v1Text("D.2", "合作区标题"));
      requireSubstring("D.2/合作区链接", v1Text("D.2", "合作区链接"));
      requireSubstring("D.2/团队区标题", v1Text("D.2", "团队区标题"));
      requireSubstring("D.2/团队区导语", v1Text("D.2", "团队区导语"));
      requireSubstring("D.2/团队区链接", v1Text("D.2", "团队区链接"));
      requireSubstring("D.3/销售 Hero", v1Text("D.3", "销售 Hero"));
      requireSubstring("D.3/文档 Hero", v1Text("D.3", "文档 Hero"));
      requireSubstring("D.3/知识库 Hero", v1Text("D.3", "知识库 Hero"));
      requireSubstring("D.3/数据 Hero", v1Text("D.3", "数据 Hero"));
      if (!isNewApproved("H-8t")) {
        requireSubstring("D.1/收尾 CTA 口号", v1Text("D.1", "收尾 CTA 口号"));
      }
      if (!isNewApproved("H-8s")) {
        requireSubstring("D.1/收尾 CTA 副句", v1Text("D.1", "收尾 CTA 副句"));
      }
    } else if (pageName === "Services") {
      if (!isNewApproved("S-1")) {
        requireSubstring("D.3/总览 Hero 标题", v1Text("D.3", "总览 Hero 标题"));
      }
      requireSubstring("D.3/总览 Hero 导语", v1Text("D.3", "总览 Hero 导语"));
      requireSubstring("D.3/不在清单上？", v1Text("D.3", "不在清单上？"));
      for (const sol of solutions) {
        requireSubstring(`sol/${sol.slug}/name`, sol.name[locale]);
        requireSubstring(`sol/${sol.slug}/promise`, sol.promise[locale]);
        requireSubstring(`sol/${sol.slug}/intro`, sol.intro[locale]);
      }
      requireSubstring("D.1/收尾 CTA 口号", v1Text("D.1", "收尾 CTA 口号"));
      requireSubstring("D.1/收尾 CTA 副句", v1Text("D.1", "收尾 CTA 副句"));
    } else if (pageName === "SolutionDetail") {
      const slug = sub.split("/")[1];
      const sol = solutions.find((s) => s.slug === slug);
      if (sol) {
        requireSubstring(`sol/${slug}/name`, sol.name[locale]);
        requireSubstring(`sol/${slug}/promise`, sol.promise[locale]);
        requireSubstring(`sol/${slug}/intro`, sol.intro[locale]);
      }
      requireSubstring("D.3/合作提示（T9）", v1Text("D.3", "合作提示（T9）"));
      requireSubstring("D.1/收尾 CTA 口号", v1Text("D.1", "收尾 CTA 口号"));
      requireSubstring("D.1/收尾 CTA 副句", v1Text("D.1", "收尾 CTA 副句"));
    } else if (pageName === "CasesPage") {
      requireSubstring("D.5/列表 Hero 标题", v1Text("D.5", "列表 Hero 标题"));
      requireSubstring("D.5/汇总一行", v1Text("D.5", "汇总一行"));
      requireSubstring("D.5/案例集按钮", v1Text("D.5", "案例集按钮"));
      requireSubstring("D.1/保密说明（案例）", v1Text("D.1", "保密说明（案例）"));
      requireSubstring("D.5/列表收尾", v1Text("D.5", "列表收尾"));
      for (const c of cases) {
        requireSubstring(`case/${c.slug}/title`, c.title[locale]);
      }
      requireSubstring("D.1/收尾 CTA 口号", v1Text("D.1", "收尾 CTA 口号"));
      requireSubstring("D.1/收尾 CTA 副句", v1Text("D.1", "收尾 CTA 副句"));
    } else if (pageName === "CaseDetail") {
      const slug = sub.split("/")[1];
      const c = cases.find((x) => x.slug === slug);
      if (c) {
        requireSubstring(`case/${slug}/title`, c.title[locale]);
        requireSubstring(`case/${slug}/profile`, c.profile[locale]);
        requireSubstring(`case/${slug}/system`, c.system[locale]);
        requireSubstring(`case/${slug}/before`, c.before[locale]);
        requireSubstring(`case/${slug}/after`, c.after[locale]);
        requireSubstring(`case/${slug}/outcome`, c.outcome[locale]);
      }
      requireSubstring("D.1/保密说明（案例）", v1Text("D.1", "保密说明（案例）"));
      requireSubstring("D.1/收尾 CTA 口号", v1Text("D.1", "收尾 CTA 口号"));
      requireSubstring("D.1/收尾 CTA 副句", v1Text("D.1", "收尾 CTA 副句"));
    } else if (pageName === "Technology") {
      if (!isNewApproved("T-1")) {
        requireSubstring("D.6/Hero 标题", v1Text("D.6", "Hero 标题"));
      }
      if (!isNewApproved("T-1s")) {
        requireSubstring("D.6/Hero 导语", v1Text("D.6", "Hero 导语"));
      }
      requireSubstring("D.6/Cyano Core 定义", v1Text("D.6", "Cyano Core 定义"));
      for (const n of [1, 2, 3, 4]) {
        const [name = "", ...rest] = v1Text("D.6", `第 ${n} 层`).split(dashSep);
        requireSubstring(`D.6/第 ${n} 层[name]`, name);
        requireSubstring(`D.6/第 ${n} 层[desc]`, rest.join(dashSep));
      }
      for (const n of [1, 2, 3]) {
        const [title = "", ...rest] = v1Text("D.6", `难题 ${n}`).split(dashSep);
        requireSubstring(`D.6/难题 ${n}[title]`, title);
        requireSubstring(`D.6/难题 ${n}[desc]`, rest.join(dashSep));
      }
      requireSubstring("D.6/估值引擎标题", v1Text("D.6", "估值引擎标题"));
      for (const n of [1, 2, 3]) {
        const [val = "", ...rest] = v1Text("D.6", `指标 ${n}`).split(dashSep);
        requireSubstring(`D.6/指标 ${n}[val]`, val);
        requireSubstring(`D.6/指标 ${n}[desc]`, rest.join(dashSep));
      }
      requireSubstring("D.1/技术页脚注", v1Text("D.1", "技术页脚注"));
      requireSubstring("D.6/对比表标题", v1Text("D.6", "对比表标题"));
      requireSubstring("D.6/兼容区标题", v1Text("D.6", "兼容区标题"));
      requireSubstring("D.6/安全区标题", v1Text("D.6", "安全区标题"));
      requireSubstring("D.6/收尾", v1Text("D.6", "收尾"));
      requireSubstring("D.1/收尾 CTA 口号", v1Text("D.1", "收尾 CTA 口号"));
      requireSubstring("D.1/收尾 CTA 副句", v1Text("D.1", "收尾 CTA 副句"));
    } else if (pageName === "Engagement") {
      if (!isNewApproved("E-1")) {
        requireSubstring("D.4/Hero 标题", v1Text("D.4", "Hero 标题"));
      }
      requireSubstring("D.4/Hero 导语", v1Text("D.4", "Hero 导语"));
      requireSubstring("D.4/怎么选", v1Text("D.4", "怎么选"));
      requireSubstring("D.4/SaaS 托管", v1Text("D.4", "SaaS 托管"));
      requireSubstring("D.4/私有化部署", v1Text("D.4", "私有化部署"));
      for (const fqKey of [
        "应该完整定制，还是从试点开始？ / Full build or pilot first?",
        "什么时候适合托管式 AI 服务？ / When does managed service make sense?",
        "需求评估会提供什么？ / What does the assessment provide?",
        "如何获得适合自己的方案？ / How do we get a tailored proposal?",
        "数据安全如何保障？ / How is our data protected?",
        "上线之后谁来维护？ / Who maintains it after launch?",
        "如果效果不达预期怎么办？ / What if results fall short?",
      ]) {
        requireSubstring(`D.4/${fqKey}`, v1Text("D.4", fqKey));
      }
      requireSubstring("D.1/收尾 CTA 口号", v1Text("D.1", "收尾 CTA 口号"));
      requireSubstring("D.1/收尾 CTA 副句", v1Text("D.1", "收尾 CTA 副句"));
    } else if (pageName === "About") {
      requireSubstring("D.7/使命句", v1Text("D.7", "使命句"));
      requireSubstring("D.7/我们是谁 1", v1Text("D.7", "我们是谁 1"));
      requireSubstring("D.7/我们是谁 2", v1Text("D.7", "我们是谁 2"));
      requireSubstring("D.7/名字的由来标题", v1Text("D.7", "名字的由来标题"));
      requireSubstring("D.7/名字的由来正文", v1Text("D.7", "名字的由来正文"));
      requireSubstring("D.7/创始团队标题", v1Text("D.7", "创始团队标题"));
      for (const f of team) {
        requireSubstring(`team/${f.id}/role`, f.role[locale]);
        requireSubstring(`team/${f.id}/motto`, f.motto[locale]);
        requireSubstring(`team/${f.id}/bio`, f.bio[locale]);
      }
      requireSubstring("D.7/原则标题", v1Text("D.7", "原则标题"));
      for (const n of [1, 2, 3, 4]) {
        const [, ...rest] = v1Text("D.7", `原则 ${n}`).split(dashSep);
        requireSubstring(`D.7/原则 ${n}[desc]`, rest.join(dashSep));
      }
      requireSubstring("D.1/收尾 CTA 口号", v1Text("D.1", "收尾 CTA 口号"));
      requireSubstring("D.1/收尾 CTA 副句", v1Text("D.1", "收尾 CTA 副句"));
    } else if (pageName === "Contact") {
      requireSubstring("D.8/Hero 标题", v1Text("D.8", "Hero 标题"));
      if (!isNewApproved("K-1")) {
        requireSubstring("D.8/Hero 导语", v1Text("D.8", "Hero 导语"));
      }
      for (const n of [1, 2, 3]) {
        const [title = "", ...rest] = v1Text("D.8", `起点 ${n}`).split(dashSep);
        requireSubstring(`D.8/起点 ${n}[title]`, title);
        requireSubstring(`D.8/起点 ${n}[body]`, rest.join(dashSep));
      }
      requireSubstring("D.8/隐私同意", v1Text("D.8", "隐私同意"));
      requireSubstring("D.8/提交按钮", v1Text("D.8", "提交按钮"));
      requireSubstring("D.8/谁会回复你", v1Text("D.8", "谁会回复你"));
      for (const n of [1, 2, 3]) {
        const [title = "", ...rest] = v1Text("D.8", `接下来 ${n}`).split(dashSep);
        requireSubstring(`D.8/接下来 ${n}[title]`, title);
        requireSubstring(`D.8/接下来 ${n}[body]`, rest.join(dashSep));
      }
    } else if (pageName === "Insights") {
      for (const ins of insights) {
        requireSubstring(`insight/${ins.slug}/title`, ins.title[locale]);
        requireSubstring(`insight/${ins.slug}/meta`, ins.metaDescription[locale]);
      }
      requireSubstring("D.1/收尾 CTA 口号", v1Text("D.1", "收尾 CTA 口号"));
      requireSubstring("D.1/收尾 CTA 副句", v1Text("D.1", "收尾 CTA 副句"));
    } else if (pageName === "Article") {
      const slug = sub.split("/")[1];
      const ins = insights.find((i) => i.slug === slug);
      if (ins) {
        requireSubstring(`article/${slug}/title`, ins.title[locale]);
        for (const blk of ins.blocks[locale]) {
          requireSubstring(`article/${slug}/q`, blk.q);
          for (const p of blk.a.split(/\n\n+/).map((s) => s.trim()).filter(Boolean)) {
            requireSubstring(`article/${slug}/p`, p);
          }
        }
      }
      requireSubstring("D.1/收尾 CTA 口号", v1Text("D.1", "收尾 CTA 口号"));
      requireSubstring("D.1/收尾 CTA 副句", v1Text("D.1", "收尾 CTA 副句"));
    } else if (pageName === "Legal") {
      const doc = legal[sub];
      if (doc && Array.isArray(doc[locale])) {
        for (const [heading, body] of doc[locale]) {
          requireSubstring(`legal/${sub}/h`, heading);
          requireSubstring(`legal/${sub}/p`, body);
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
