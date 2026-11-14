import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import prettier from "prettier";

const root = path.resolve(import.meta.dirname, "..");
const fix = process.argv.includes("--fix");

function walkFiles(dir, ext, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, ext, out);
    else if (full.endsWith(ext)) out.push(full);
  }
  return out;
}

const usedClasses = new Set();

const htmlFiles = walkFiles(path.join(root, ".next/server/app"), ".html");
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  for (const m of html.matchAll(/\bclass="([^"]*)"/g)) {
    for (const token of m[1].split(/\s+/)) {
      if (token) usedClasses.add(token);
    }
  }
}

const jsFiles = walkFiles(path.join(root, ".next/static/chunks"), ".js");
for (const file of jsFiles) {
  const js = fs.readFileSync(file, "utf8");
  for (const m of js.matchAll(/className[:=]\s*["'`]([^"'`]+)/g)) {
    for (const token of m[1].split(/\s+/)) {
      if (token) usedClasses.add(token);
    }
  }
  for (const m of js.matchAll(/["'`]([a-z][a-z0-9_-]*(?:\s+[a-z][a-z0-9_-]*)*)["'`]/g)) {
    for (const token of m[1].split(/\s+/)) {
      if (token) usedClasses.add(token);
    }
  }
}

function splitTopLevelCommas(selector) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < selector.length; i++) {
    const ch = selector[i];
    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth = Math.max(0, depth - 1);
    else if (ch === "," && depth === 0) {
      parts.push(selector.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(selector.slice(start).trim());
  return parts.filter(Boolean);
}

function extractBranchClasses(branch) {
  // Strip :not(...) contents so negating an unused class doesn't mark a live rule dead
  const stripped = branch.replace(/:not\([^)]*\)/g, "");
  const classes = [];
  for (const m of stripped.matchAll(/\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g)) {
    classes.push(m[1]);
  }
  return classes;
}

function isRuleDead(selector) {
  const branches = splitTopLevelCommas(selector);
  if (branches.length === 0) return false;
  for (const branch of branches) {
    const classes = extractBranchClasses(branch);
    if (classes.length === 0) return false;
    const hasMissing = classes.some((cls) => !usedClasses.has(cls));
    if (!hasMissing) return false;
  }
  return true;
}

const legacyFiles = [
  "app/styles/v3-tokens.css",
  "app/styles/v3-foundation.css",
  "app/styles/v3.css",
];

const reportLines = [];

for (const rel of legacyFiles) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) continue;
  const css = fs.readFileSync(full, "utf8");
  const ast = postcss.parse(css, { from: full });
  let removed = 0;

  ast.walkRules((rule) => {
    if (rule.parent?.type === "atrule" && /keyframes$/i.test(rule.parent.name)) return;
    if (isRuleDead(rule.selector)) {
      const line = rule.source?.start?.line ?? 0;
      const cleanSel = rule.selector.replace(/\s+/g, " ").trim();
      reportLines.push(`${rel}:${line}\t${cleanSel}`);
      if (fix) {
        rule.remove();
        removed++;
      }
    }
  });

  if (fix && removed > 0) {
    ast.walkAtRules((at) => {
      if ((at.name === "media" || at.name === "supports") && (!at.nodes || at.nodes.length === 0)) {
        at.remove();
      }
    });
    const formatted = await prettier.format(ast.toString(), { parser: "css" });
    fs.writeFileSync(full, formatted);
  }
}

const reportDir = path.join(root, "reports");
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(path.join(reportDir, "dead-css.txt"), reportLines.join("\n") + (reportLines.length ? "\n" : ""));
console.log(`${fix ? "Removed" : "Found"} ${reportLines.length} dead CSS rules across legacy stylesheets (usedClasses=${usedClasses.size}).`);
