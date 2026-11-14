import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { chromium } from "@playwright/test";

const root = path.resolve(import.meta.dirname, "..");
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3010";

const DESKTOP_ROUTES = [
  "/",
  "/en",
  "/services",
  "/en/services",
  "/services/document-automation",
  "/en/services/document-automation",
  "/cases",
  "/en/cases",
  "/cases/proposal-generation",
  "/en/cases/proposal-generation",
  "/en/cases/it-knowledge-assistant",
  "/technology",
  "/en/technology",
  "/engagement",
  "/en/engagement",
  "/about",
  "/en/about",
  "/en/insights",
  "/insights/proposal-draft-in-15-minutes",
  "/en/insights/proposal-draft-in-15-minutes",
  "/contact",
  "/en/contact",
  "/privacy",
  "/en/privacy",
  "/terms",
  "/en/terms",
];

const MOBILE_ROUTES = [
  "/",
  "/en",
  "/cases/proposal-generation",
  "/en/cases/proposal-generation",
  "/en/technology",
  "/en/engagement",
  "/about",
  "/en/contact",
  "/en/services",
];

function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relLum(r, g, b) {
  return (
    0.2126 * srgbToLinear(r) +
    0.7152 * srgbToLinear(g) +
    0.0722 * srgbToLinear(b)
  );
}

function contrastRatio(l1, l2) {
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

function parseColor(str) {
  if (!str) return null;
  const m = str.match(
    /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.]+))?\s*\)/i,
  );
  if (m) {
    return {
      r: Number(m[1]),
      g: Number(m[2]),
      b: Number(m[3]),
      a: m[4] !== undefined ? Number(m[4]) : 1,
    };
  }
  const srgb = str.match(
    /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/i,
  );
  if (srgb) {
    return {
      r: Number(srgb[1]) * 255,
      g: Number(srgb[2]) * 255,
      b: Number(srgb[3]) * 255,
      a: srgb[4] !== undefined ? Number(srgb[4]) : 1,
    };
  }
  return null;
}

function medianOf(arr) {
  if (!arr.length) return 0;
  arr.sort((a, b) => a - b);
  return arr[Math.floor(arr.length / 2)];
}

function sampleMedianRgb(tile, rx, ry, rw, rh) {
  const { data, width, height, channels } = tile;
  const x0 = Math.max(0, Math.floor(rx));
  const y0 = Math.max(0, Math.floor(ry));
  const x1 = Math.min(width, Math.ceil(rx + rw));
  const y1 = Math.min(height, Math.ceil(ry + rh));
  if (x1 <= x0 || y1 <= y0) return null;

  const pixels = [];
  const stepX = Math.max(1, Math.floor((x1 - x0) / 36));
  const stepY = Math.max(1, Math.floor((y1 - y0) / 24));
  for (let y = y0; y < y1; y += stepY) {
    for (let x = x0; x < x1; x += stepX) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      pixels.push({ r, g, b, lum: relLum(r, g, b) });
    }
  }
  if (!pixels.length) return null;
  pixels.sort((a, b) => a.lum - b.lum);
  return pixels[Math.floor(pixels.length / 2)];
}

function sampleAdjacentRingRgb(tile, rx, ry, rw, rh) {
  const { data, width, height, channels } = tile;
  const pad = 6;
  const x0 = Math.max(0, Math.floor(rx - pad));
  const y0 = Math.max(0, Math.floor(ry - pad));
  const x1 = Math.min(width, Math.ceil(rx + rw + pad));
  const y1 = Math.min(height, Math.ceil(ry + rh + pad));
  const ix0 = Math.floor(rx);
  const iy0 = Math.floor(ry);
  const ix1 = Math.ceil(rx + rw);
  const iy1 = Math.ceil(ry + rh);

  const pixels = [];
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      if (x >= ix0 && x < ix1 && y >= iy0 && y < iy1) continue;
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      pixels.push({ r, g, b, lum: relLum(r, g, b) });
    }
  }
  if (!pixels.length) return sampleMedianRgb(tile, rx, ry, rw, rh);
  pixels.sort((a, b) => a.lum - b.lum);
  return pixels[Math.floor(pixels.length / 2)];
}

const browser = await chromium.launch({ channel: "chrome" });
const violations = [];
let textNodesChecked = 0;
let nonTextChecked = 0;

const jobs = [
  ...DESKTOP_ROUTES.map((route) => ({
    route,
    vw: 1440,
    vh: 900,
    isMobile: false,
  })),
  ...MOBILE_ROUTES.map((route) => ({
    route,
    vw: 390,
    vh: 844,
    isMobile: true,
  })),
];

let jobIdx = 0;
const concurrency = 4;

async function checkPageJob({ route, vw, vh, isMobile }) {
  const ctx = await browser.newContext({
    viewport: { width: vw, height: vh },
    deviceScaleFactor: 1,
    isMobile,
    hasTouch: isMobile,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  try {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts?.ready);

    // Force content-visibility: visible so off-screen intrinsic sizes don't shift docY during tile scroll
    await page.addStyleTag({
      content:
        "main > section, .closing, .footer { content-visibility: visible !important; contain-intrinsic-size: none !important; }",
    });

    // Scroll bottom and back to top to trigger lazy components & reveals
    const docHeight = await page.evaluate(async (stepH) => {
      let h = document.documentElement.scrollHeight;
      for (let y = 0; y < h; y += stepH) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 80));
        h = document.documentElement.scrollHeight;
      }
      document
        .querySelectorAll("[data-reveal]")
        .forEach((el) => el.classList.add("is-in"));
      window.scrollTo({ top: 0, behavior: "instant" });
      return document.documentElement.scrollHeight;
    }, vh);
    await page.waitForTimeout(200);

    // Collect text items & non-text items in document coordinates (with header pinned only at y=0)
    const items = await page.evaluate(
      ({ vw, docH }) => {
        function selectorOf(el) {
          const parts = [];
          let cur = el;
          for (let d = 0; d < 3 && cur && cur.nodeType === 1; d++) {
            let s = cur.tagName.toLowerCase();
            if (cur.id) {
              s += `#${cur.id}`;
              parts.unshift(s);
              break;
            }
            if (typeof cur.className === "string" && cur.className.trim()) {
              s +=
                "." +
                cur.className
                  .trim()
                  .split(/\s+/)
                  .slice(0, 2)
                  .join(".");
            }
            parts.unshift(s);
            cur = cur.parentElement;
          }
          return parts.join(" > ");
        }

        function effectiveOpacity(el) {
          let op = 1;
          let cur = el;
          while (cur && cur.nodeType === 1) {
            const st = getComputedStyle(cur);
            if (st.display === "none" || st.visibility === "hidden") return 0;
            const o = parseFloat(st.opacity);
            if (!Number.isNaN(o)) op *= o;
            if (op === 0) return 0;
            cur = cur.parentElement;
          }
          return op;
        }

        function clampToOverflow(rect, el) {
          let x0 = rect.left;
          let y0 = rect.top;
          let x1 = rect.right;
          let y1 = rect.bottom;
          let cur = el.parentElement;
          while (cur && cur !== document.body && cur !== document.documentElement) {
            const st = getComputedStyle(cur);
            if (
              st.overflowX === "hidden" ||
              st.overflowX === "clip" ||
              st.overflowY === "hidden" ||
              st.overflowY === "clip"
            ) {
              const cr = cur.getBoundingClientRect();
              if (st.overflowX === "hidden" || st.overflowX === "clip") {
                x0 = Math.max(x0, cr.left);
                x1 = Math.min(x1, cr.right);
              }
              if (st.overflowY === "hidden" || st.overflowY === "clip") {
                y0 = Math.max(y0, cr.top);
                y1 = Math.min(y1, cr.bottom);
              }
            }
            cur = cur.parentElement;
          }
          return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
        }

        const textItems = [];
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
        );
        let node;
        while ((node = walker.nextNode())) {
          const raw = (node.nodeValue || "").replace(/\s+/g, " ").trim();
          if (!raw) continue;
          const parent = node.parentElement;
          if (!parent) continue;
          if (
            parent.closest(
              ".sr-only, .skip-link, .honey, [aria-hidden='true'], [inert], [hidden], script, style, noscript, svg",
            )
          ) {
            continue;
          }
          const closedDetails = parent.closest("details:not([open])");
          if (closedDetails && !parent.closest("summary")) {
            continue;
          }
          const op = effectiveOpacity(parent);
          if (op <= 0.02) continue;

          const range = document.createRange();
          range.selectNodeContents(node);
          const rr = range.getBoundingClientRect();
          if (rr.width < 2 || rr.height < 2) continue;
          const clamped = clampToOverflow(rr, parent);
          if (clamped.w < 2 || clamped.h < 2) continue;

          const pr = parent.getBoundingClientRect();
          const cpr = clampToOverflow(pr, parent);
          if (cpr.w < 2 || cpr.h < 2) continue;
          const cprRight = cpr.x + cpr.w;
          const cprBottom = cpr.y + cpr.h;
          const isSmallPill = pr.width <= 48 && pr.height <= 32 && cpr.h >= 8;
          // Use clamped parent pill box (inset 1px) on small inline badges; otherwise expand glyph rect by 3px
          const sx0 = Math.max(
            0,
            isSmallPill ? cpr.x + 1 : Math.max(cpr.x, clamped.x - 3),
          );
          const sy0 = Math.max(
            0,
            (isSmallPill ? cpr.y + 1 : Math.max(cpr.y, clamped.y - 3)) +
              window.scrollY,
          );
          const sx1 = Math.min(
            vw,
            isSmallPill
              ? cprRight - 1
              : Math.min(cprRight, clamped.x + clamped.w + 3),
          );
          const sy1 = Math.min(
            docH,
            (isSmallPill
              ? cprBottom - 1
              : Math.min(cprBottom, clamped.y + clamped.h + 3)) + window.scrollY,
          );
          if (sx1 - sx0 < 2 || sy1 - sy0 < 2) continue;

          const st = getComputedStyle(parent);
          const fontSize = parseFloat(st.fontSize) || 16;
          const fontWeight = parseInt(st.fontWeight, 10) || 400;
          const isLarge =
            fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
          const isNameStoryH2 = Boolean(parent.matches(".name-story h2"));
          const inHeader = Boolean(parent.closest(".site-header"));

          textItems.push({
            kind: "text",
            selector: selectorOf(parent),
            text: raw.slice(0, 20),
            color: st.color,
            opacity: op,
            fontSize,
            fontWeight,
            threshold: isNameStoryH2 ? 7.0 : isLarge ? 3.0 : 4.5,
            inHeader,
            docX: sx0,
            docY: sy0,
            w: sx1 - sx0,
            h: sy1 - sy0,
          });
        }

        // Non-text elements: input borders, switch/radio/tab/nav active indicators
        const nonTextItems = [];
        const borderTargets = document.querySelectorAll(
          '.contact-form input:not([type="checkbox"]):not([type="hidden"]), .contact-form select, .contact-form textarea, .check-box',
        );
        for (const el of borderTargets) {
          if (el.closest(".honey, [inert], [hidden], [aria-hidden='true']") && !el.classList.contains("check-box")) {
            continue;
          }
          const op = effectiveOpacity(el);
          if (op <= 0.02) continue;
          const r = el.getBoundingClientRect();
          if (r.width < 4 || r.height < 4) continue;
          const st = getComputedStyle(el);
          nonTextItems.push({
            kind: "border",
            selector: selectorOf(el),
            text: "[input-border]",
            color: st.borderTopColor,
            opacity: op,
            threshold: 3.0,
            inHeader: false,
            docX: Math.max(0, r.left),
            docY: Math.max(0, r.top + window.scrollY),
            w: Math.min(vw, r.right) - Math.max(0, r.left),
            h: Math.min(docH, r.bottom + window.scrollY) - Math.max(0, r.top + window.scrollY),
          });
        }

        const indicatorTargets = document.querySelectorAll(
          '.nav-indicator, .tab-indicator, .chip-indicator, .eng-switch-btn[aria-checked="true"] .eng-switch-track, .packer-radio[aria-checked="true"]',
        );
        for (const el of indicatorTargets) {
          const op = effectiveOpacity(el);
          if (op <= 0.02) continue;
          const r = el.getBoundingClientRect();
          if (r.width < 2 || r.height < 2) continue;
          const st = getComputedStyle(el);
          const isBorder = el.classList.contains("packer-radio");
          nonTextItems.push({
            kind: "indicator",
            selector: selectorOf(el),
            text: "[active-indicator]",
            color: isBorder ? st.borderTopColor : st.backgroundColor,
            opacity: op,
            threshold: 3.0,
            inHeader: Boolean(el.closest(".site-header")),
            docX: Math.max(0, r.left),
            docY: Math.max(0, r.top + window.scrollY),
            w: Math.min(vw, r.right) - Math.max(0, r.left),
            h: Math.min(docH, r.bottom + window.scrollY) - Math.max(0, r.top + window.scrollY),
          });
        }

        return { textItems, nonTextItems };
      },
      { vw, docH: docHeight },
    );

    // Capture viewport tiles (with sticky header unpinned after tile 0)
    const maxScroll = Math.max(0, docHeight - vh);
    const stops = [0];
    const stepY = Math.max(200, vh - 120); // 120px overlap so every element fits wholly inside at least 1 tile!
    for (let y = stepY; y < maxScroll; y += stepY) stops.push(y);
    if (maxScroll > 0 && stops[stops.length - 1] !== maxScroll) {
      stops.push(maxScroll);
    }

    const tiles = [];
    for (let i = 0; i < stops.length; i++) {
      const sy = stops[i];
      const actualScrollY = await page.evaluate(
        ({ pos, unpin }) => {
          const hdr = document.querySelector(".site-header");
          if (hdr instanceof HTMLElement) {
            if (unpin) hdr.style.setProperty("position", "absolute", "important");
            else hdr.style.removeProperty("position");
          }
          window.scrollTo({ top: pos, behavior: "instant" });
          return window.scrollY;
        },
        { pos: sy, unpin: i > 0 },
      );
      await page.waitForTimeout(80);
      const png = await page.screenshot({ type: "png" });
      const { data, info } = await sharp(png)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      tiles.push({
        scrollY: actualScrollY,
        unpinned: i > 0,
        data,
        width: info.width,
        height: info.height,
        channels: info.channels,
      });
    }

    function pickTile(item) {
      if (item.inHeader) return tiles[0];
      // Prefer a tile where header is unpinned if docY >= 80, and item fits wholly
      let best = null;
      let bestCover = -1;
      for (const t of tiles) {
        if (item.docY < 80 && t.unpinned) continue;
        const topInTile = item.docY - t.scrollY;
        const botInTile = topInTile + item.h;
        const visTop = Math.max(t.unpinned ? 0 : 72, topInTile);
        const visBot = Math.min(vh, botInTile);
        const cover = visBot - visTop;
        if (cover > bestCover) {
          bestCover = cover;
          best = t;
        }
      }
      return best || tiles[0];
    }

    for (const item of [...items.textItems, ...items.nonTextItems]) {
      const fgParsed = parseColor(item.color);
      if (!fgParsed) continue;
      const tile = pickTile(item);
      const ry = item.docY - tile.scrollY;
      const bgSample =
        item.kind === "indicator"
          ? sampleAdjacentRingRgb(tile, item.docX, ry, item.w, item.h)
          : sampleMedianRgb(tile, item.docX, ry, item.w, item.h);
      if (!bgSample) continue;

      const effA = Math.max(0, Math.min(1, fgParsed.a * item.opacity));
      const effR = fgParsed.r * effA + bgSample.r * (1 - effA);
      const effG = fgParsed.g * effA + bgSample.g * (1 - effA);
      const effB = fgParsed.b * effA + bgSample.b * (1 - effA);
      const fgLum = relLum(effR, effG, effB);
      const ratio = Number(contrastRatio(fgLum, bgSample.lum).toFixed(2));

      if (item.kind === "text") textNodesChecked++;
      else nonTextChecked++;

      if (ratio < item.threshold) {
        violations.push({
          route,
          viewport: `${vw}x${vh}`,
          kind: item.kind,
          selector: item.selector,
          text: item.text,
          ratio,
          threshold: item.threshold,
          fg: item.color,
          bgRgb: [bgSample.r, bgSample.g, bgSample.b],
        });
      }
    }
  } finally {
    await ctx.close();
  }
}

async function worker() {
  while (jobIdx < jobs.length) {
    const job = jobs[jobIdx++];
    await checkPageJob(job);
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
await browser.close();

const report = {
  checkedAt: new Date().toISOString(),
  jobsChecked: jobs.length,
  textNodesChecked,
  nonTextChecked,
  violationCount: violations.length,
  violations,
};

const reportsDir = path.join(root, "reports");
await fs.mkdir(reportsDir, { recursive: true });
await fs.writeFile(
  path.join(reportsDir, "contrast.json"),
  JSON.stringify(report, null, 2) + "\n",
  "utf8",
);

if (violations.length > 0) {
  console.error(
    `✗ check-contrast found ${violations.length} violation(s) across ${jobs.length} page/viewports:`,
  );
  for (const v of violations.slice(0, 25)) {
    console.error(
      `  [${v.viewport}] ${v.route} | ${v.selector} | "${v.text}" | ${v.ratio}:1 < ${v.threshold}:1`,
    );
  }
  process.exit(1);
}

console.log(
  `✓ check-contrast passed (${jobs.length} page/viewports, ${textNodesChecked} text nodes, ${nonTextChecked} non-text controls, 0 violations).`,
);
