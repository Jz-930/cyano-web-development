import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import sharp from "sharp";
import { chromium } from "@playwright/test";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public/og");
await fs.mkdir(outDir, { recursive: true });

const insights = JSON.parse(
  await fs.readFile(path.join(root, "content/v4/insights.json"), "utf8"),
);
const copyNew = JSON.parse(
  await fs.readFile(path.join(root, "content/v4/copy-new.json"), "utf8"),
);

function copyIfApproved(key, locale) {
  const entry = copyNew[key];
  if (!entry || (entry.status !== "approved" && entry.status !== "class-a")) {
    return "";
  }
  return entry[locale] || "";
}

const COVER_OBJECT_POSITION = {
  "why-chatgpt-is-not-a-knowledge-base": "20% 40%",
  "proposal-draft-in-15-minutes": "60% 50%",
  "buy-pilot-or-managed": "85% 30%",
};

function buildDiagramSvg(slug, locale) {
  if (slug === "why-chatgpt-is-not-a-knowledge-base") {
    const layers = [1, 2, 3, 4].map((i) => ({
      idx: i,
      label: copyIfApproved(`cover.layers.${i}`, locale),
      y: 70 + (i - 1) * 86,
      allowed: i <= 3,
    }));
    return `<svg class="cover-art" viewBox="0 0 520 420" aria-hidden="true">
      <line x1="312" y1="26" x2="312" y2="242" stroke="var(--cyan)" stroke-width="1.25"/>
      <line x1="312" y1="242" x2="312" y2="328" stroke="var(--frost-15)" stroke-width="1.25" stroke-dasharray="4 5"/>
      <circle cx="312" cy="26" r="4" fill="var(--ice)"/>
      ${layers
        .map(
          (l) => `<g>
        <rect x="40" y="${l.y - 24}" width="436" height="48" rx="8" fill="${l.allowed ? "var(--cyan-04)" : "none"}" stroke="${l.allowed ? "var(--cyan-40)" : "var(--frost-15)"}" stroke-width="1.25"/>
        <line x1="156" y1="${l.y}" x2="286" y2="${l.y}" stroke="var(--frost-15)" stroke-width="1.25"/>
        <line x1="338" y1="${l.y}" x2="452" y2="${l.y}" stroke="${l.allowed ? "var(--cyan-40)" : "var(--frost-15)"}" stroke-width="1.25"/>
        ${l.label ? `<text x="58" y="${l.y + 4}" fill="${l.allowed ? "var(--ice)" : "var(--on-dark)"}" font-size="13" font-family="var(--mono)" font-weight="500">${l.label}</text>` : ""}
        ${
          l.allowed
            ? `<circle cx="312" cy="${l.y}" r="11" fill="var(--cyan-12)" stroke="var(--cyan-40)" stroke-width="1.25"/><circle cx="312" cy="${l.y}" r="4.5" fill="var(--cyan)"/>`
            : `<line x1="302" y1="${l.y - 10}" x2="322" y2="${l.y - 10}" stroke="var(--frost-15)" stroke-width="1.5"/><circle cx="312" cy="${l.y}" r="5" fill="var(--n0)" stroke="var(--frost-15)" stroke-width="1.25"/>`
        }
      </g>`,
        )
        .join("")}
    </svg>`;
  }

  if (slug === "proposal-draft-in-15-minutes") {
    const cards = [54, 168, 282];
    return `<svg class="cover-art" viewBox="0 0 520 420" aria-hidden="true">
      ${cards
        .map(
          (y, idx) => `<g>
        <rect x="28" y="${y}" width="116" height="84" rx="8" fill="var(--white-04)" stroke="var(--frost-15)" stroke-width="1.25"/>
        <line x1="44" y1="${y + 24}" x2="96" y2="${y + 24}" stroke="var(--cyan-40)" stroke-width="1.25"/>
        <line x1="44" y1="${y + 44}" x2="126" y2="${y + 44}" stroke="var(--frost-15)" stroke-width="1.25"/>
        <line x1="44" y1="${y + 60}" x2="${idx === 1 ? 118 : 104}" y2="${y + 60}" stroke="var(--frost-15)" stroke-width="1.25"/>
      </g>`,
        )
        .join("")}
      <path d="M144 96 C 182 96, 190 210, 224 210" fill="none" stroke="var(--cyan)" stroke-width="1.25"/>
      <path d="M144 210 L 224 210" fill="none" stroke="var(--cyan)" stroke-width="1.25"/>
      <path d="M144 324 C 182 324, 190 210, 224 210" fill="none" stroke="var(--cyan)" stroke-width="1.25"/>
      <path d="M224 210 C 254 210, 254 134, 286 134" fill="none" stroke="var(--cyan)" stroke-width="1.25"/>
      <path d="M224 210 L 286 210" fill="none" stroke="var(--cyan)" stroke-width="1.25"/>
      <path d="M224 210 C 254 210, 254 286, 286 286" fill="none" stroke="var(--cyan)" stroke-width="1.25"/>
      <circle cx="224" cy="210" r="14" fill="var(--n0)" stroke="var(--cyan)" stroke-width="1.25"/>
      <circle cx="224" cy="210" r="5" fill="var(--cyan)"/>
      <rect x="286" y="46" width="206" height="328" rx="12" fill="var(--cyan-04)" stroke="var(--cyan-40)" stroke-width="1.25"/>
      <line x1="310" y1="82" x2="412" y2="82" stroke="var(--ice)" stroke-width="1.5"/>
      ${[134, 210, 286]
        .map(
          (sy) => `<g>
        <line x1="310" y1="${sy - 10}" x2="464" y2="${sy - 10}" stroke="var(--frost-15)" stroke-width="1.25"/>
        <line x1="310" y1="${sy + 8}" x2="432" y2="${sy + 8}" stroke="var(--frost-15)" stroke-width="1.25"/>
        <rect x="442" y="${sy + 1}" width="22" height="13" rx="3" fill="var(--cyan-18)" stroke="var(--cyan)" stroke-width="1"/>
      </g>`,
        )
        .join("")}
      <line x1="310" y1="334" x2="468" y2="334" stroke="var(--frost-15)" stroke-width="1"/>
      ${[0, 1, 2, 3, 4, 5, 6].map((d) => `<circle cx="${316 + d * 14}" cy="352" r="3" fill="var(--cyan)"/>`).join("")}
    </svg>`;
  }

  const wx = (w) => 44 + w * 36;
  return `<svg class="cover-art" viewBox="0 0 520 420" aria-hidden="true">
    <defs>
      <pattern id="og-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="8" stroke="var(--cyan-40)" stroke-width="2"/>
      </pattern>
    </defs>
    <line x1="${wx(0)}" y1="78" x2="${wx(12)}" y2="78" stroke="var(--frost-15)" stroke-width="1.25"/>
    ${[0, 2, 6, 12]
      .map(
        (w) => `<g>
      <line x1="${wx(w)}" y1="72" x2="${wx(w)}" y2="342" stroke="var(--frost-15)" stroke-width="1" ${w === 0 || w === 12 ? "" : 'stroke-dasharray="3 5"'}/>
      <text x="${wx(w)}" y="60" text-anchor="middle" fill="var(--on-dark)" font-size="12" font-family="var(--mono)" font-weight="500">W${w}</text>
    </g>`,
      )
      .join("")}
    <g transform="translate(0, 126)">
      <line x1="${wx(0)}" y1="14" x2="${wx(12)}" y2="14" stroke="var(--frost-15)" stroke-width="1"/>
      <rect x="${wx(0)}" y="4" width="36" height="20" rx="4" fill="var(--brand)"/>
      <rect x="${wx(1)}" y="4" width="180" height="20" rx="4" fill="var(--cyan)"/>
      <rect x="${wx(6)}" y="4" width="216" height="20" rx="4" fill="url(#og-hatch)" stroke="var(--cyan-40)" stroke-width="1.25"/>
      ${[1, 12].map((dw) => `<rect x="${wx(dw) - 5}" y="-10" width="10" height="10" fill="var(--amber-12)" stroke="var(--amber)" stroke-width="1.25" transform="rotate(45 ${wx(dw)} -5)"/>`).join("")}
    </g>
    <g transform="translate(0, 210)">
      <line x1="${wx(0)}" y1="14" x2="${wx(12)}" y2="14" stroke="var(--frost-15)" stroke-width="1"/>
      <rect x="${wx(0)}" y="4" width="36" height="20" rx="4" fill="var(--brand)"/>
      <rect x="${wx(1)}" y="4" width="36" height="20" rx="4" fill="var(--cyan)"/>
      <rect x="${wx(2)}" y="4" width="144" height="20" rx="4" fill="url(#og-hatch)" stroke="var(--cyan-40)" stroke-width="1.25"/>
      ${[1, 6].map((dw) => `<rect x="${wx(dw) - 5}" y="-10" width="10" height="10" fill="var(--amber-12)" stroke="var(--amber)" stroke-width="1.25" transform="rotate(45 ${wx(dw)} -5)"/>`).join("")}
    </g>
    <g transform="translate(0, 294)">
      <line x1="${wx(0)}" y1="14" x2="${wx(12)}" y2="14" stroke="var(--cyan-40)" stroke-width="1.25"/>
      <rect x="${wx(0)}" y="4" width="36" height="20" rx="4" fill="var(--brand)"/>
      <rect x="${wx(1)}" y="4" width="36" height="20" rx="4" fill="var(--cyan)"/>
      ${[6, 10].map((mw) => `<rect x="${wx(mw) - 3}" y="4" width="6" height="20" rx="2" fill="var(--cyan)"/>`).join("")}
      <rect x="${wx(2) - 5}" y="-10" width="10" height="10" fill="var(--amber-12)" stroke="var(--amber)" stroke-width="1.25" transform="rotate(45 ${wx(2)} -5)"/>
    </g>
  </svg>`;
}

async function waitForServer(url, timeoutMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Timed out waiting for server at ${url}`);
}

function stopChild(proc) {
  return new Promise((resolve) => {
    if (!proc || proc.exitCode !== null) {
      resolve();
      return;
    }
    if (process.platform === "win32") {
      const killer = spawn("taskkill", ["/PID", String(proc.pid), "/T", "/F"], {
        stdio: "ignore",
      });
      killer.on("close", () => resolve());
      killer.on("error", () => resolve());
    } else {
      proc.kill("SIGTERM");
      proc.on("close", () => resolve());
    }
  });
}

const port = Number(process.env.OG_PORT || 3011);
const externalUrl = process.env.OG_BASE_URL;
const baseUrl = externalUrl || `http://127.0.0.1:${port}`;
let serverProc = null;

if (!externalUrl) {
  const nextCli = path.join(root, "node_modules/next/dist/bin/next");
  serverProc = spawn(
    process.execPath,
    [nextCli, "start", "-p", String(port), "-H", "127.0.0.1"],
    { cwd: root, stdio: "ignore" },
  );
  await waitForServer(baseUrl);
}

try {
  const browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  for (const ins of insights) {
    for (const locale of ["zh", "en"]) {
      const prefix = locale === "en" ? "/en" : "";
      const url = `${baseUrl}${prefix}/insights/${ins.slug}`;
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);

      const fallbackHtml = `<div id="og-capture-target" class="cover" data-size="hero" data-slug="${ins.slug}" data-surface="dark" style="position:fixed;left:0;top:0;width:1200px;height:675px;max-width:none;border-radius:0;border:0;z-index:99999">
        <picture class="cover-bg" aria-hidden="true">
          <img src="/media/field/panel.webp" alt="" style="object-position:${COVER_OBJECT_POSITION[ins.slug] || "50% 50%"}" />
        </picture>
        <div class="cover-copy">
          <span class="eyebrow on-dark cover-category">${ins.category[locale]}</span>
          <strong class="cover-keyword">${copyIfApproved(`cover.${ins.slug}`, locale)}</strong>
        </div>
        <div class="cover-diagram" aria-hidden="true">${buildDiagramSvg(ins.slug, locale)}</div>
      </div>`;

      await page.evaluate((fallbackMarkup) => {
        const prev = document.getElementById("og-capture-target");
        if (prev) prev.remove();
        const existing = document.querySelector(".cover");
        if (existing) {
          const clone = existing.cloneNode(true);
          clone.id = "og-capture-target";
          clone.setAttribute("data-size", "hero");
          clone.style.cssText =
            "position:fixed;left:0;top:0;width:1200px;height:675px;max-width:none;border-radius:0;border:0;z-index:99999;";
          document.body.appendChild(clone);
        } else {
          document.body.insertAdjacentHTML("beforeend", fallbackMarkup);
        }
      }, fallbackHtml);

      await page.evaluate(async () => {
        const imgs = Array.from(
          document.querySelectorAll("#og-capture-target img"),
        );
        await Promise.all(
          imgs.map((img) =>
            img.complete
              ? img.decode().catch(() => {})
              : new Promise((res) => {
                  img.onload = () => res();
                  img.onerror = () => res();
                }),
          ),
        );
        await document.fonts.ready;
      });
      await page.waitForTimeout(80);

      const buf = await page.locator("#og-capture-target").screenshot({
        type: "png",
      });

      const outFile = path.join(outDir, `${ins.slug}-${locale}.png`);
      const pngOut = await sharp(buf)
        .extract({ left: 0, top: 22, width: 1200, height: 630 })
        .png({ compressionLevel: 9 })
        .toBuffer();
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          await fs.writeFile(outFile, pngOut);
          break;
        } catch (err) {
          if (attempt === 4) throw err;
          await new Promise((r) => setTimeout(r, 120 * (attempt + 1)));
        }
      }
    }
  }

  await browser.close();
  console.log(
    `✓ render-og generated ${insights.length * 2} OG images (1200×630) in public/og/.`,
  );
} finally {
  await stopChild(serverProc);
}
