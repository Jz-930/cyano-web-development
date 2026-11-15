import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const root = path.resolve(import.meta.dirname, "..");
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));

const L = z.object({ zh: z.string().min(1), en: z.string().min(1) });

function uniqueByOrderAndKey(keyField, label) {
  return (items, ctx) => {
    const seenOrders = new Set();
    const seenKeys = new Set();
    for (const item of items) {
      if (seenOrders.has(item.order)) {
        ctx.addIssue({ code: "custom", message: `Duplicate ${label} order: ${item.order}` });
      }
      seenOrders.add(item.order);
      if (seenKeys.has(item[keyField])) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate ${label} ${keyField}: ${item[keyField]}`,
        });
      }
      seenKeys.add(item[keyField]);
    }
  };
}

// 1. Validate v1 frozen baselines
z.record(z.string(), z.record(z.string(), L)).parse(readJson("content/v1/copy.json"));
const v1Cases = z
  .array(
    z
      .object({
        slug: z.string().min(1),
        images: z.array(z.string().min(1)).min(1).max(50),
        main: z.number().int().nonnegative(),
        stats: z
          .array(z.object({ value: z.string(), label: z.string(), sourceId: z.string() }))
          .min(1)
          .max(12),
      })
      .passthrough(),
  )
  .min(1)
  .parse(readJson("content/v1/cases.json"));
z.object({ email: z.boolean(), demos: z.record(z.string(), z.boolean()) })
  .passthrough()
  .parse(readJson("content/v1/availability.json"));

const sourcesMd = fs.readFileSync(path.join(root, "../content/sources.md"), "utf8");
if (!sourcesMd.includes("## v1-final-content")) {
  throw new Error("Missing ## v1-final-content in content/sources.md");
}

// 2. Validate v4 structured content files (02 §4.4 & §9.4.1)
const industries = z
  .array(z.object({ id: z.string().min(1), order: z.number().int().nonnegative(), label: L }))
  .length(6)
  .superRefine(uniqueByOrderAndKey("id", "industry"))
  .parse(readJson("content/v4/industries.json"));

const cases = z
  .array(
    z.object({
      slug: z.string().min(1),
      order: z.number().int().nonnegative(),
      industry: z.string().min(1),
      solution: z.string().min(1),
      model: L,
      duration: L,
      title: L,
      system: L,
      profile: L,
      stats: z
        .array(z.object({ value: L, label: L, sourceId: z.string().min(1) }))
        .length(3),
      before: L,
      after: L,
      outcome: L,
      images: z.array(z.string().min(1)).min(1),
      main: z.number().int().nonnegative(),
      demo: z.string().url().optional(),
      mockup: z.enum(["sales", "proposal", "wiki", "data", "property", "writing"]),
      story: z
        .object({
          background: L,
          challenges: z.array(L).length(3),
          approach: z.array(L).length(4),
        })
        .optional(),
    }),
  )
  .min(6)
  .superRefine(uniqueByOrderAndKey("slug", "case"))
  .parse(readJson("content/v4/cases.json"));

const solutions = z
  .array(
    z.object({
      slug: z.string().min(1),
      order: z.number().int().nonnegative(),
      name: L,
      shortName: L,
      promise: L,
      intro: L,
      outputs: L,
      metaDescription: L,
      deliverables: z.array(L),
      capabilities: z.array(z.object({ title: L, detail: L })),
      caseSlug: z.string().min(1),
      pains: z.array(z.object({ title: L, scenario: L, metricTag: L })),
      workflow: z.array(
        z.object({
          stage: L,
          title: L,
          detail: L,
          badge: L,
          humanReview: z.boolean().optional(),
        }),
      ),
      faqs: z.array(z.object({ q: L, a: L })),
    }),
  )
  .length(4)
  .superRefine(uniqueByOrderAndKey("slug", "solution"))
  .parse(readJson("content/v4/solutions.json"));

const team = z
  .array(
    z.object({
      id: z.enum(["F1", "F2", "F3", "F4"]),
      order: z.number().int().nonnegative(),
      role: L,
      tags: L,
      motto: L,
      bio: L,
      stages: z.array(z.number().int().min(1).max(5)).min(1),
    }),
  )
  .length(4)
  .superRefine(uniqueByOrderAndKey("id", "team"))
  .parse(readJson("content/v4/team.json"));

const insights = z
  .array(
    z.object({
      slug: z.string().min(1),
      order: z.number().int().nonnegative(),
      title: L,
      metaDescription: L,
      category: L,
      dateIso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      dateDisplay: L,
      readingTime: L,
      authorId: z.enum(["F1", "F2", "F3", "F4"]),
      relatedCaseSlug: z.string().min(1),
      relatedSolutionSlug: z.string().min(1),
      image: z.string().min(1),
      blocks: z.object({
        zh: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).min(1),
        en: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).min(1),
      }),
    }),
  )
  .length(3)
  .superRefine(uniqueByOrderAndKey("slug", "insight"))
  .parse(readJson("content/v4/insights.json"));

z.object({ seo: z.record(z.string(), z.unknown()) })
  .passthrough()
  .parse(readJson("content/v4/site.json"));

const industryIds = new Set(industries.map((i) => i.id));
const solutionSlugs = new Set(solutions.map((s) => s.slug));
const caseSlugs = new Set(cases.map((c) => c.slug));
const teamIds = new Set(team.map((t) => t.id));

for (const c of cases) {
  if (!industryIds.has(c.industry)) {
    throw new Error(`Case ${c.slug} references unknown industry ${c.industry}`);
  }
  if (c.solution !== "vertical" && !solutionSlugs.has(c.solution)) {
    throw new Error(`Case ${c.slug} references unknown solution ${c.solution}`);
  }
  if (!c.images[c.main]) {
    throw new Error(`Case ${c.slug} missing main image at index ${c.main}`);
  }
  for (const src of c.images) {
    if (!fs.existsSync(path.join(root, "public", src))) {
      throw new Error(`Missing screenshot file on disk: public${src}`);
    }
  }
  for (const stat of c.stats) {
    if (!sourcesMd.includes(`## ${stat.sourceId}`)) {
      throw new Error(`Case ${c.slug} stat references missing source ## ${stat.sourceId}`);
    }
  }
}

for (const s of solutions) {
  if (!caseSlugs.has(s.caseSlug)) {
    throw new Error(`Solution ${s.slug} references unknown case ${s.caseSlug}`);
  }
}

for (const ins of insights) {
  if (!teamIds.has(ins.authorId)) {
    throw new Error(`Insight ${ins.slug} references unknown author ${ins.authorId}`);
  }
  if (!caseSlugs.has(ins.relatedCaseSlug)) {
    throw new Error(`Insight ${ins.slug} references unknown case ${ins.relatedCaseSlug}`);
  }
  if (!solutionSlugs.has(ins.relatedSolutionSlug)) {
    throw new Error(`Insight ${ins.slug} references unknown solution ${ins.relatedSolutionSlug}`);
  }
}

// 3. Validate copy-new.json and copy-overrides.json (02 §9.4.2)
const CopyEntrySchema = z.object({
  zh: z.string(),
  en: z.string(),
  status: z.enum(["approved", "class-a", "pending", "rejected"]),
  ref: z.string().min(1),
});
const copyNew = z.record(z.string().min(1), CopyEntrySchema).parse(readJson("content/v4/copy-new.json"));
const copyOverrides = z
  .record(z.string().min(1), CopyEntrySchema)
  .parse(readJson("content/v4/copy-overrides.json"));

// 4. Validate zh-breaks.json (02 §9.4.3)
const zhBreaks = z
  .record(z.string().min(1), z.array(z.string().min(1)).min(1))
  .parse(readJson("content/v4/zh-breaks.json"));
for (const [heading, parts] of Object.entries(zhBreaks)) {
  if (parts.join("") !== heading) {
    throw new Error(`zh-breaks mismatch for "${heading}": joined="${parts.join("")}"`);
  }
}

// 5. Validate numeric-allowlist.json keys against content/sources.md (02 §9.4.4)
const allowlist = z
  .record(z.string().min(1), z.array(z.string().min(1)).min(1))
  .parse(readJson("content/v4/numeric-allowlist.json"));
for (const sourceKey of Object.keys(allowlist)) {
  const re = new RegExp(`^##\\s+${sourceKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "m");
  if (!re.test(sourcesMd)) {
    throw new Error(
      `numeric-allowlist.json key "${sourceKey}" has no matching "## ${sourceKey}" in content/sources.md`,
    );
  }
}

// 6. Validate citations.json (05 §8.1)
if (fs.existsSync(path.join(root, "content/v4/citations.json"))) {
  const citations = z
    .record(
      z.string().min(1),
      z.object({
        sourceId: z.string().min(1),
        caseSlug: z.string().min(1).optional(),
      }),
    )
    .parse(readJson("content/v4/citations.json"));
  for (const [cid, entry] of Object.entries(citations)) {
    if (!sourcesMd.includes(`## ${entry.sourceId}`)) {
      throw new Error(
        `citations.json "${cid}" references missing source "## ${entry.sourceId}" in content/sources.md`,
      );
    }
    if (entry.caseSlug && !caseSlugs.has(entry.caseSlug)) {
      throw new Error(
        `citations.json "${cid}" references unknown case "${entry.caseSlug}"`,
      );
    }
  }
}

// 7. Validate query-demo.json table dimensions
for (const row of readJson("content/query-demo.json")) {
  for (const locale of ["zh", "en"]) {
    for (const cells of row.rows[locale]) {
      if (cells.length !== row.columns[locale].length) {
        throw new Error("Demo table column mismatch in content/query-demo.json");
      }
    }
  }
}

console.log(
  `✓ validate-v4 passed (${cases.length} cases, ${solutions.length} solutions, ${Object.keys(copyNew).length} copy-new, ${Object.keys(copyOverrides).length} copy-overrides, ${Object.keys(zhBreaks).length} zh-breaks, ${Object.keys(allowlist).length} numeric source groups, ${v1Cases.length} v1 cases).`,
);
