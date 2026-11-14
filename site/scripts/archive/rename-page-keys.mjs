import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const srcDir = path.join(root, "content/v3/pages");
const outDir = path.join(root, "content/v4/pages");

const RESERVED = new Set([
  "break", "case", "catch", "class", "const", "continue", "debugger", "default",
  "delete", "do", "else", "enum", "export", "extends", "false", "finally", "for",
  "function", "if", "import", "in", "instanceof", "new", "null", "return", "super",
  "switch", "this", "throw", "true", "try", "typeof", "var", "void", "while", "with", "yield",
]);

function makeSemanticBase(entry) {
  let sample = "";
  if (typeof entry?.en === "string") sample = entry.en;
  else if (Array.isArray(entry?.en) && entry.en.length > 0) sample = String(entry.en[0]);
  else sample = JSON.stringify(entry);

  const words = sample
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4);

  let base = words.join("_") || "copy_item";
  if (/^\d/.test(base) || RESERVED.has(base)) {
    base = `k_${base}`;
  }
  return base;
}

fs.mkdirSync(outDir, { recursive: true });
const keyMap = {};
const globalHashMap = new Map();

for (const file of fs.readdirSync(srcDir).filter((f) => f.endsWith(".json")).sort()) {
  const data = JSON.parse(fs.readFileSync(path.join(srcDir, file), "utf8"));
  const used = new Set();
  const fileMap = {};
  const renamed = {};

  for (const [oldKey, val] of Object.entries(data)) {
    const base = makeSemanticBase(val);
    let candidate = base;
    let n = 2;
    while (used.has(candidate)) {
      candidate = `${base}_${n++}`;
    }
    used.add(candidate);
    fileMap[oldKey] = candidate;
    renamed[candidate] = val;
    if (!globalHashMap.has(oldKey)) globalHashMap.set(oldKey, new Set());
    globalHashMap.get(oldKey).add(candidate);
  }

  keyMap[file] = fileMap;
  fs.writeFileSync(path.join(outDir, file), JSON.stringify(renamed, null, 2) + "\n");
}

fs.writeFileSync(path.join(outDir, "_key-map.json"), JSON.stringify(keyMap, null, 2) + "\n");

function walkCode(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walkCode(f, out);
    else if (f.endsWith(".tsx") || f.endsWith(".ts")) out.push(f);
  }
  return out;
}

for (const file of walkCode(path.join(root, "components")).concat(walkCode(path.join(root, "app")))) {
  let code = fs.readFileSync(file, "utf8");
  const orig = code;

  const impMatch = code.match(/@\/content\/v[34]\/pages\/([A-Za-z0-9_-]+\.json)/);
  const localMap = impMatch && keyMap[impMatch[1]] ? keyMap[impMatch[1]] : null;

  code = code.replaceAll("@/content/v3/pages/", "@/content/v4/pages/");

  code = code.replace(/\b(pageCopy|copy)\.([a-f0-9]{10,12})\b/g, (full, obj, hash) => {
    if (localMap && localMap[hash]) return `${obj}.${localMap[hash]}`;
    const candidates = globalHashMap.get(hash);
    if (candidates && candidates.size === 1) return `${obj}.${[...candidates][0]}`;
    throw new Error(`Ambiguous or unknown pageCopy hash ${hash} in ${file}`);
  });

  if (code !== orig) {
    fs.writeFileSync(file, code);
    console.log("Updated imports/keys in", path.relative(root, file));
  }
}

console.log(`Renamed keys across ${Object.keys(keyMap).length} page JSON files.`);
