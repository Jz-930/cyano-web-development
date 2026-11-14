import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { chromium } from "@playwright/test";

const root = path.resolve(import.meta.dirname, "..");
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3010";

const cases = JSON.parse(
  await fs.readFile(path.join(root, "content/v4/cases.json"), "utf8"),
);
const solutions = JSON.parse(
  await fs.readFile(path.join(root, "content/v4/solutions.json"), "utf8"),
);
const insights = JSON.parse(
  await fs.readFile(path.join(root, "content/v4/insights.json"), "utf8"),
);

const baseRoutes = [
  "",
  "services",
  ...solutions.map((s) => `services/${s.slug}`),
  "cases",
  ...cases.map((c) => `cases/${c.slug}`),
  "technology",
  "engagement",
  "about",
  "insights",
  ...insights.map((i) => `insights/${i.slug}`),
  "contact",
  "privacy",
  "terms",
];
const routes = baseRoutes.flatMap((r) => [
  r ? `/${r}` : "/",
  r ? `/en/${r}` : "/en",
]);

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

async function measureFocusRingContrast(pngBuffer, boxInClip) {
  const { data, info } = await sharp(pngBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const x0 = Math.round(boxInClip.x);
  const y0 = Math.round(boxInClip.y);
  const x1 = Math.round(boxInClip.x + boxInClip.width);
  const y1 = Math.round(boxInClip.y + boxInClip.height);

  const ringLums = [];
  const bgLums = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Distance outside the element box
      const dx = x < x0 ? x0 - x : x >= x1 ? x - x1 + 1 : 0;
      const dy = y < y0 ? y0 - y : y >= y1 ? y - y1 + 1 : 0;
      const distOut = Math.max(dx, dy);

      // Also check 2px inside border for elements whose focus indicator is border/inset
      const dxIn = x >= x0 && x < x1 ? Math.min(x - x0, x1 - 1 - x) : -1;
      const dyIn = y >= y0 && y < y1 ? Math.min(y - y0, y1 - 1 - y) : -1;
      const distIn = dxIn >= 0 && dyIn >= 0 ? Math.min(dxIn, dyIn) : -1;

      const idx = (y * width + x) * channels;
      const lum = relLum(data[idx], data[idx + 1], data[idx + 2]);

      if ((distOut >= 1 && distOut <= 6) || (distIn >= 0 && distIn <= 2)) {
        ringLums.push(lum);
      }
      if (distOut >= 7) {
        bgLums.push(lum);
      }
    }
  }

  if (!ringLums.length || !bgLums.length) return 21;
  bgLums.sort((a, b) => a - b);
  const medianBg = bgLums[Math.floor(bgLums.length / 2)];

  let maxContrast = 1;
  for (const rl of ringLums) {
    const cr = contrastRatio(rl, medianBg);
    if (cr > maxContrast) maxContrast = cr;
  }
  return Number(maxContrast.toFixed(2));
}

const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  hasTouch: false,
});

const noFeedback = [];
const zeroMsSwitch = [];
const lowFocusContrast = [];
let totalInteractiveChecked = 0;
let totalFocusedChecked = 0;

// Header/Footer chrome is identical on every page within a locale; check header/footer chrome thoroughly on "/" and "/en" and "/privacy" (paper header), and check main content on all 46 routes so runtime stays fast (~45s) while covering 100% of unique elements!
const fullChromeRoutes = new Set(["/", "/en", "/privacy", "/en/privacy"]);

const concurrency = 4;
let routeIdx = 0;

async function worker() {
  const page = await context.newPage();
  while (routeIdx < routes.length) {
    const route = routes[routeIdx++];
    const includeChrome = fullChromeRoutes.has(route);
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });

    // Scroll once to trigger reveals so no element is mid-reveal
    await page.evaluate(async () => {
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y <= h; y += 700) {
        window.scrollTo(0, y);
      }
      window.scrollTo(0, 0);
      document
        .querySelectorAll("[data-reveal]")
        .forEach((el) => el.classList.add("is-in"));
    });
    await page.waitForTimeout(120);

    // Tag candidate interactive elements with data-ci-idx
    const count = await page.evaluate((checkChrome) => {
      const selector =
        'a[href], button, [role="tab"], summary, input, select, textarea, label:has(input)';
      const candidates = Array.from(document.querySelectorAll(selector));
      let idx = 0;

      function isVisible(el) {
        if (el.classList.contains("skip-link")) return false;
        if (el.closest("[inert], .honey, [aria-hidden='true'], [hidden]")) {
          return false;
        }
        // Hidden checkbox input inside .check is represented by label.check
        if (
          el.tagName === "INPUT" &&
          el.getAttribute("type") === "checkbox" &&
          el.closest("label.check")
        ) {
          return false;
        }
        // Plain field labels wrapping text inputs/selects/textareas: the input/select/textarea itself is tested; keep label.check!
        if (
          el.tagName === "LABEL" &&
          !el.classList.contains("check") &&
          !el.querySelector('input[type="checkbox"], input[type="radio"]')
        ) {
          return false;
        }
        if (!checkChrome && el.closest("header, footer, .closing")) {
          return false;
        }
        let cur = el;
        while (cur && cur.nodeType === 1) {
          const st = getComputedStyle(cur);
          if (st.display === "none" || st.visibility === "hidden") return false;
          if (parseFloat(st.opacity) === 0) return false;
          cur = cur.parentElement;
        }
        const r = el.getBoundingClientRect();
        return r.width > 2 && r.height > 2;
      }

      for (const el of candidates) {
        el.removeAttribute("data-ci-idx");
        if (isVisible(el)) {
          el.setAttribute("data-ci-idx", String(idx++));
        }
      }
      return idx;
    }, includeChrome);

    for (let i = 0; i < count; i++) {
      const stillVisible = await page.evaluate((idx) => {
        const el = document.querySelector(`[data-ci-idx="${idx}"]`);
        if (!el || !el.isConnected) return false;
        const st = getComputedStyle(el);
        if (
          st.display === "none" ||
          st.visibility === "hidden" ||
          el.closest("[inert], [hidden]")
        ) {
          return false;
        }
        const r = el.getBoundingClientRect();
        return r.width > 2 && r.height > 2;
      }, i);
      if (!stillVisible) continue;

      await page.evaluate((idx) => {
        const el = document.querySelector(`[data-ci-idx="${idx}"]`);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top < 96 || r.bottom > window.innerHeight - 24) {
          window.scrollBy(0, r.top - 240);
        }
      }, i);
      await page.mouse.move(2, 2);
      await page.waitForTimeout(200);

      const readSnap = async () =>
        page.evaluate((idx) => {
          const el = document.querySelector(`[data-ci-idx="${idx}"]`);
          if (!el) return null;
          function parseDurMs(st) {
            const raw = `${st.transitionDuration || ""},${st.animationDuration || ""}`;
            let maxMs = 0;
            for (const part of raw.split(",")) {
              const s = part.trim();
              if (!s) continue;
              const n = s.endsWith("ms")
                ? parseFloat(s)
                : s.endsWith("s")
                  ? parseFloat(s) * 1000
                  : 0;
              if (n > maxMs) maxMs = n;
            }
            return maxMs;
          }

          function propsOf(node, pseudo) {
            if (!node) return null;
            const st = getComputedStyle(node, pseudo || undefined);
            return {
              color: st.color,
              backgroundColor: st.backgroundColor,
              borderColor: `${st.borderTopColor}|${st.borderRightColor}|${st.borderBottomColor}|${st.borderLeftColor}`,
              boxShadow: st.boxShadow,
              transform: st.transform,
              opacity: st.opacity,
              backgroundSize: st.backgroundSize,
              textDecorationColor: st.textDecorationColor,
              filter: st.filter,
              durMs: parseDurMs(st),
            };
          }

          const svg = el.querySelector("svg");
          const auxChild = el.querySelector(
            ".faq-icon, .check-box, .zoom-pill, img",
          );
          const card = el.closest(
            ".card, .case-card, .insight-card, .engagement-card",
          );
          const cls =
            typeof el.className === "string" && el.className.trim()
              ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
              : "";
          const r = el.getBoundingClientRect();
          return {
            box: { x: r.x, y: r.y, width: r.width, height: r.height },
            desc: `${el.tagName.toLowerCase()}${cls}`,
            text: (el.textContent || el.getAttribute("aria-label") || "")
              .replace(/\s+/g, " ")
              .trim()
              .slice(0, 32),
            self: propsOf(el),
            after: propsOf(el, "::after"),
            before: propsOf(el, "::before"),
            svg: propsOf(svg),
            aux: propsOf(auxChild),
            card: card && card !== el ? propsOf(card) : null,
          };
        }, i);

      const base = await readSnap();
      if (!base || base.box.width < 2 || base.box.height < 2) continue;

      const cx = Math.max(
        4,
        Math.min(1436, base.box.x + Math.min(base.box.width / 2, 24)),
      );
      const cy = Math.max(4, Math.min(896, base.box.y + base.box.height / 2));
      await page.mouse.move(cx, cy);
      await page.waitForTimeout(400);
      const hovered = await readSnap();

      await page.mouse.down();
      await page.waitForTimeout(120);
      const pressed = await readSnap();
      // Move pointer away BEFORE mouse.up() so we do not trigger click/navigation!
      await page.mouse.move(2, 2);
      await page.mouse.up();
      if (!hovered || !pressed) continue;

      totalInteractiveChecked++;

      const targets = ["self", "after", "before", "svg", "aux", "card"];
      const propKeys = [
        "color",
        "backgroundColor",
        "borderColor",
        "boxShadow",
        "transform",
        "opacity",
        "backgroundSize",
        "textDecorationColor",
        "filter",
      ];

      let anyChanged = false;
      let anyTimed = false;
      const changedDetails = [];

      for (const tKey of targets) {
        const b = base[tKey];
        if (!b) continue;
        for (const stateSnap of [hovered[tKey], pressed[tKey]]) {
          if (!stateSnap) continue;
          for (const pk of propKeys) {
            if (b[pk] !== stateSnap[pk]) {
              anyChanged = true;
              const dur = Math.max(
                b.durMs || 0,
                stateSnap.durMs || 0,
                base.self.durMs || 0,
              );
              changedDetails.push(`${tKey}.${pk}(${dur}ms)`);
              if (dur > 0) anyTimed = true;
            }
          }
        }
      }

      if (!anyChanged) {
        noFeedback.push({
          route,
          element: base.desc,
          text: base.text,
        });
      } else if (!anyTimed) {
        zeroMsSwitch.push({
          route,
          element: base.desc,
          text: base.text,
          changed: changedDetails,
        });
      }
    }

    // Step 6: Keyboard Tab focus ring contrast >= 3:1
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
    await page.mouse.move(2, 2);
    await page.waitForTimeout(80);

    const seenFocus = new Set();
    const maxTabs = includeChrome ? 80 : 50;
    for (let step = 0; step < maxTabs; step++) {
      await page.keyboard.press("Tab");
      const info = await page.evaluate((checkChrome) => {
        const el = document.activeElement;
        if (!el || el === document.body || el === document.documentElement) {
          return null;
        }
        const isSkip = el.classList.contains("skip-link");
        const inChrome = Boolean(el.closest("header, footer, .closing"));
        // For hidden checkbox inside label.check, visual focus ring is on .check-box!
        const visualEl =
          el.tagName === "INPUT" &&
          el.getAttribute("type") === "checkbox" &&
          el.nextElementSibling?.classList.contains("check-box")
            ? el.nextElementSibling
            : el.classList.contains("card-link") &&
                el.closest(".card.is-clickable")
              ? el.closest(".card.is-clickable")
              : el;

        visualEl.scrollIntoView({ block: "nearest" });
        const r = visualEl.getBoundingClientRect();
        // If covered by fixed header, scroll down slightly
        if (!el.closest("header") && r.top < 96) {
          window.scrollBy(0, r.top - 140);
        }
        const r2 = visualEl.getBoundingClientRect();
        const cls =
          typeof el.className === "string" && el.className.trim()
            ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
            : "";
        return {
          key: `${el.tagName}:${cls}:${Math.round(r2.top + window.scrollY)}:${Math.round(r2.left)}`,
          isSkip,
          inChrome,
          skipCheck: isSkip || (!checkChrome && inChrome),
          desc: `${el.tagName.toLowerCase()}${cls}`,
          text: (el.textContent || el.getAttribute("aria-label") || "")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 32),
          rect: {
            x: r2.x,
            y: r2.y,
            width: r2.width,
            height: r2.height,
          },
        };
      }, includeChrome);

      if (!info) break;
      if (seenFocus.has(info.key)) break;
      seenFocus.add(info.key);
      if (info.skipCheck) continue;
      if (info.rect.width < 2 || info.rect.height < 2) continue;

      const pad = 12;
      const clipX = Math.max(0, Math.floor(info.rect.x - pad));
      const clipY = Math.max(0, Math.floor(info.rect.y - pad));
      const clipRight = Math.min(
        1440,
        Math.ceil(info.rect.x + info.rect.width + pad),
      );
      const clipBottom = Math.min(
        900,
        Math.ceil(info.rect.y + info.rect.height + pad),
      );
      const clipW = clipRight - clipX;
      const clipH = clipBottom - clipY;
      if (clipW <= 4 || clipH <= 4) continue;

      await page.waitForTimeout(30);
      const png = await page.screenshot({
        type: "png",
        clip: { x: clipX, y: clipY, width: clipW, height: clipH },
      });
      const cr = await measureFocusRingContrast(png, {
        x: info.rect.x - clipX,
        y: info.rect.y - clipY,
        width: info.rect.width,
        height: info.rect.height,
      });
      totalFocusedChecked++;
      if (cr < 3.0) {
        lowFocusContrast.push({
          route,
          element: info.desc,
          text: info.text,
          contrast: cr,
        });
      }
    }
  }
  await page.close();
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
await browser.close();

const report = {
  checkedAt: new Date().toISOString(),
  routesChecked: routes.length,
  interactiveChecked: totalInteractiveChecked,
  focusedChecked: totalFocusedChecked,
  noFeedbackCount: noFeedback.length,
  zeroMsSwitchCount: zeroMsSwitch.length,
  lowFocusContrastCount: lowFocusContrast.length,
  noFeedback,
  zeroMsSwitch,
  lowFocusContrast,
};

const reportsDir = path.join(root, "reports");
await fs.mkdir(reportsDir, { recursive: true });
await fs.writeFile(
  path.join(reportsDir, "interactions.json"),
  JSON.stringify(report, null, 2) + "\n",
  "utf8",
);

console.log(
  `✓ check-interactions (${routes.length} routes, ${totalInteractiveChecked} interactive, ${totalFocusedChecked} focus checks): noFeedback=${noFeedback.length}, zeroMs=${zeroMsSwitch.length}, lowFocusContrast=${lowFocusContrast.length}.`,
);

if (
  noFeedback.length > 0 ||
  zeroMsSwitch.length > 0 ||
  lowFocusContrast.length > 0
) {
  console.error(
    JSON.stringify(
      {
        noFeedback: noFeedback.slice(0, 15),
        zeroMsSwitch: zeroMsSwitch.slice(0, 15),
        lowFocusContrast: lowFocusContrast.slice(0, 15),
      },
      null,
      2,
    ),
  );
  process.exit(1);
}
