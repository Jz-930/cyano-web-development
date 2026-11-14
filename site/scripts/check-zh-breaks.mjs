import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const root = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const urlIdx = args.indexOf("--url");
const baseURL = urlIdx >= 0 && args[urlIdx + 1] ? args[urlIdx + 1] : "http://127.0.0.1:3010";

const breaksPath = path.join(root, "content/v4/zh-breaks.json");
const zhBreaks = fs.existsSync(breaksPath)
  ? JSON.parse(fs.readFileSync(breaksPath, "utf8"))
  : {};

const casesPath = path.join(root, "content/v4/cases.json");
const caseSlugs = fs.existsSync(casesPath)
  ? JSON.parse(fs.readFileSync(casesPath, "utf8")).map((c) => c.slug)
  : [
      "sales-consultant-ai",
      "proposal-generation",
      "it-knowledge-assistant",
      "nl-data-query",
      "property-management",
      "writing-memory-engine",
    ];

const ZH_ROUTES = [
  "/",
  "/services",
  "/services/sales-ai",
  "/services/document-automation",
  "/services/knowledge-assistant",
  "/services/data-query",
  "/cases",
  ...caseSlugs.map((s) => `/cases/${s}`),
  "/technology",
  "/engagement",
  "/about",
  "/insights",
  "/insights/why-chatgpt-is-not-a-knowledge-base",
  "/insights/proposal-draft-in-15-minutes",
  "/insights/buy-pilot-or-managed",
  "/contact",
  "/privacy",
  "/terms",
];

const WIDTHS = [1440, 1024, 390];
const violations = [];

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
    });
    for (const route of ZH_ROUTES) {
      const page = await ctx.newPage();
      await page.goto(baseURL + route, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => document.fonts?.ready);

      const headingData = await page.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll("h1, h2")) {
          if (el.classList.contains("sr-only")) continue;
          const cs = getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden") continue;
          const box = el.getBoundingClientRect();
          if (box.width <= 2 || box.height <= 2) continue;

          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          const chars = [];
          let rawText = "";
          let node;
          while ((node = walker.nextNode())) {
            const val = node.nodeValue || "";
            const range = document.createRange();
            for (let i = 0; i < val.length; i++) {
              const ch = val[i];
              if (ch === "\r") continue;
              const textIdx = rawText.length;
              rawText += ch;
              range.setStart(node, i);
              range.setEnd(node, i + 1);
              const rects = range.getClientRects();
              if (rects.length === 0) continue;
              const r = rects[0];
              if (r.width === 0 && /\s/.test(ch)) continue;
              chars.push({ ch, top: r.top, left: r.left, height: r.height, textIdx });
            }
          }
          if (chars.length === 0) continue;

          const lines = [];
          for (const c of chars) {
            const prev = lines[lines.length - 1];
            if (!prev || Math.abs(c.top - prev.top) > Math.max(6, c.height * 0.45)) {
              lines.push({ top: c.top, chars: [c] });
            } else {
              prev.chars.push(c);
            }
          }

          out.push({
            tag: el.tagName.toLowerCase(),
            rawText,
            lines: lines.map((l) => ({
              text: l.chars.map((x) => x.ch).join(""),
              startIdx: l.chars[0].textIdx,
              endIdx: l.chars[l.chars.length - 1].textIdx + 1,
            })),
          });
        }
        return out;
      });

      await page.close();

      for (const h of headingData) {
        if (h.lines.length <= 1) continue;
        const full = h.rawText;
        const normKey = full.replace(/\s+/g, " ").trim();
        const registered = zhBreaks[full] || zhBreaks[normKey];

        const allowed = new Set();
        if (registered && registered.join("") === full) {
          let acc = 0;
          for (let i = 0; i < registered.length - 1; i++) {
            acc += registered[i].length;
            allowed.add(acc);
          }
        } else if (registered && registered.join("").replace(/\s+/g, " ").trim() === normKey) {
          let pos = 0;
          for (let i = 0; i < registered.length - 1; i++) {
            const part = registered[i];
            let pIdx = 0;
            while (pos < full.length && pIdx < part.length) {
              if (/\s/.test(full[pos]) && /\s/.test(part[pIdx])) {
                while (pos < full.length && /\s/.test(full[pos])) pos++;
                while (pIdx < part.length && /\s/.test(part[pIdx])) pIdx++;
              } else {
                pos++;
                pIdx++;
              }
            }
            allowed.add(pos);
          }
        } else {
          for (let i = 0; i < full.length; i++) {
            if (/[，。！？、；：）》”’·—,.!?;:)\s-]/.test(full[i])) {
              allowed.add(i + 1);
            }
          }
        }

        for (let i = 0; i < h.lines.length - 1; i++) {
          const fromIdx = h.lines[i].endIdx;
          const toIdx = h.lines[i + 1].startIdx;
          let ok = false;
          for (let b = fromIdx; b <= toIdx; b++) {
            if (allowed.has(b)) {
              ok = true;
              break;
            }
          }
          if (!ok) {
            violations.push({
              route,
              width,
              tag: h.tag,
              reason: "mid-word-break",
              fullText: full,
              lines: h.lines.map((l) => l.text),
              breakRange: [fromIdx, toIdx],
            });
          }
        }

        for (let i = 0; i < h.lines.length; i++) {
          const clean = h.lines[i].text.trim();
          const charLen = [...clean].length;
          if (charLen === 1) {
            violations.push({
              route,
              width,
              tag: h.tag,
              reason: "single-char-line",
              fullText: full,
              lines: h.lines.map((l) => l.text),
            });
          } else if (i === h.lines.length - 1 && charLen <= 3) {
            violations.push({
              route,
              width,
              tag: h.tag,
              reason: "short-tail-line",
              fullText: full,
              lines: h.lines.map((l) => l.text),
            });
          }
        }
      }
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}

const reportDir = path.join(root, "reports");
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(
  path.join(reportDir, "zh-breaks.json"),
  JSON.stringify({ violationCount: violations.length, violations }, null, 2) + "\n",
);

console.log(`Checked zh h1/h2 line breaks across ${ZH_ROUTES.length} routes × ${WIDTHS.length} widths: ${violations.length} issues.`);
if (violations.length > 0) {
  console.error(JSON.stringify(violations, null, 2));
  process.exitCode = 1;
}
