import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";

const root = path.resolve(import.meta.dirname, "..");
const siteCssPath = path.join(root, "app/styles/site.css");
const siteCss = fs.readFileSync(siteCssPath, "utf8");

const imports = [];
for (const m of siteCss.matchAll(/@import\s+["'](\.[^"']+)["'](?:\s+layer\(([^)]+)\))?\s*;/g)) {
  imports.push({
    rel: path.posix.normalize(path.posix.join("app/styles", m[1])),
    layer: (m[2] || "unlayered").trim(),
  });
}

const seen = new Map();
const duplicates = [];

for (const { rel, layer } of imports) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) continue;
  const css = fs.readFileSync(full, "utf8");
  const ast = postcss.parse(css, { from: full });

  ast.walkRules((rule) => {
    let p = rule.parent;
    const atChain = [];
    let inKeyframes = false;
    while (p && p.type !== "root") {
      if (p.type === "atrule") {
        if (/keyframes$/i.test(p.name)) {
          inKeyframes = true;
          break;
        }
        atChain.unshift(`@${p.name} ${p.params.replace(/\s+/g, " ").trim()}`);
      } else if (p.type === "rule") {
        atChain.unshift(p.selector.replace(/\s+/g, " ").trim());
      }
      p = p.parent;
    }
    if (inKeyframes) return;

    const normSelector = rule.selector.replace(/\s+/g, " ").trim();
    const key = `${layer} || ${atChain.join(" >> ")} || ${normSelector}`;
    const loc = `${rel}:${rule.source?.start?.line ?? 0}`;
    if (seen.has(key)) {
      seen.get(key).push(loc);
    } else {
      seen.set(key, [loc]);
    }
  });
}

for (const [key, locs] of seen.entries()) {
  if (locs.length >= 2) {
    duplicates.push({ key, locs });
  }
}

const reportDir = path.join(root, "reports");
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(
  path.join(reportDir, "duplicate-selectors.txt"),
  duplicates.map((d) => `${d.key} -> ${d.locs.join(", ")}`).join("\n") + (duplicates.length ? "\n" : ""),
);

console.log(`${duplicates.length} duplicate selectors found.`);
for (const d of duplicates) {
  console.log(`  [${d.locs.join(", ")}] ${d.key}`);
}
if (duplicates.length > 0) {
  process.exitCode = 1;
}
