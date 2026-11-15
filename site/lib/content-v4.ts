import "server-only";
import { z } from "zod";
import v1copy from "@/content/v1/copy.json";
import overrides from "@/content/v4/copy-overrides.json";
import fresh from "@/content/v4/copy-new.json";
import rawCases from "@/content/v4/cases.json";
import rawIndustries from "@/content/v4/industries.json";
import rawSolutions from "@/content/v4/solutions.json";
import rawTeam from "@/content/v4/team.json";
import rawInsights from "@/content/v4/insights.json";
import rawSite from "@/content/v4/site.json";
import { type Locale, t, href } from "./locale";

export type { Locale } from "./locale";
export { t, href };

const L = z.object({ zh: z.string().min(1), en: z.string().min(1) });

function uniqueByOrderAndKey<T extends { order: number }>(
  keyField: keyof T,
  label: string,
) {
  return (items: T[], ctx: z.RefinementCtx) => {
    const seenOrders = new Set<number>();
    const seenKeys = new Set<unknown>();
    for (const item of items) {
      if (seenOrders.has(item.order)) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate ${label} order: ${item.order}`,
        });
      }
      seenOrders.add(item.order);
      const keyVal = item[keyField];
      if (seenKeys.has(keyVal)) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate ${label} ${String(keyField)}: ${String(keyVal)}`,
        });
      }
      seenKeys.add(keyVal);
    }
  };
}

export const IndustrySchema = z.object({
  id: z.string().min(1),
  order: z.number().int().nonnegative(),
  label: L,
});

export const allIndustries = z
  .array(IndustrySchema)
  .length(6)
  .superRefine(uniqueByOrderAndKey("id", "industry"))
  .parse(rawIndustries)
  .sort((a, b) => a.order - b.order);

const industryMap = new Map(allIndustries.map((ind) => [ind.id, ind]));

export const industries = {
  zh: allIndustries.map((ind) => ind.label.zh),
  en: allIndustries.map((ind) => ind.label.en),
};

export const CaseSchema = z.object({
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
  mockup: z.enum([
    "sales",
    "proposal",
    "wiki",
    "data",
    "property",
    "writing",
  ]),
  story: z
    .object({
      background: L,
      challenges: z.array(L).length(3),
      approach: z.array(L).length(4),
    })
    .optional(),
});

export const allCases = z
  .array(CaseSchema)
  .min(6)
  .superRefine(uniqueByOrderAndKey("slug", "case"))
  .parse(rawCases)
  .sort((a, b) => a.order - b.order);

export const SolutionSchema = z.object({
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
  pains: z.array(
    z.object({ title: L, scenario: L, metricTag: L }),
  ),
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
});

export const allSolutions = z
  .array(SolutionSchema)
  .length(4)
  .superRefine(uniqueByOrderAndKey("slug", "solution"))
  .parse(rawSolutions)
  .sort((a, b) => a.order - b.order);

export const TeamMemberSchema = z.object({
  id: z.enum(["F1", "F2", "F3", "F4"]),
  order: z.number().int().nonnegative(),
  role: L,
  tags: L,
  motto: L,
  bio: L,
  stages: z.array(z.number().int().min(1).max(5)).min(1),
});

export const allTeam = z
  .array(TeamMemberSchema)
  .length(4)
  .superRefine(uniqueByOrderAndKey("id", "team"))
  .parse(rawTeam)
  .sort((a, b) => a.order - b.order);

export const InsightSchema = z.object({
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
});

export const allInsights = z
  .array(InsightSchema)
  .min(1)
  .superRefine(uniqueByOrderAndKey("slug", "insight"))
  .parse(rawInsights)
  .sort((a, b) => a.order - b.order);

export const siteCopy = rawSite;

type Entry = {
  zh: string;
  en: string;
  status: "approved" | "class-a" | "pending" | "rejected";
  ref: string;
};
const freshTable = fresh as Record<string, Entry>;
const overrideTable = overrides as Record<string, Entry>;

/** v1 定稿文字；负责人批准过改写时返回改写后的文字。 */
export function text(section: string, key: string, locale: Locale): string {
  const o = overrideTable[`${section}/${key}`];
  if (o && (o.status === "approved" || o.status === "class-a")) return o[locale];
  const base = (
    v1copy as Record<string, Record<string, { zh: string; en: string }>>
  )[section]?.[key];
  if (!base) throw new Error(`Missing v1 copy ${section}/${key}`);
  return base[locale];
}

/** 新增文字：必须存在且已批准，否则构建失败。用于整块都依赖它的位置。 */
export function copy(id: string, locale: Locale): string {
  const e = freshTable[id];
  if (!e) throw new Error(`Missing copy id ${id}`);
  if (e.status !== "approved" && e.status !== "class-a") {
    throw new Error(`Copy ${id} is ${e.status}`);
  }
  return e[locale];
}

/** 新增文字：未批准时返回 null，调用方整块不渲染。 */
export function copyIfApproved(id: string, locale: Locale): string | null {
  const e = freshTable[id];
  return e && (e.status === "approved" || e.status === "class-a")
    ? e[locale]
    : null;
}

export function cases(locale: Locale) {
  return allCases.map((c) => {
    const ind = industryMap.get(c.industry);
    if (!ind) throw new Error(`Unknown industry id "${c.industry}" on case "${c.slug}"`);
    return {
      slug: c.slug,
      index: c.order,
      industryId: c.industry,
      industry: ind.label[locale],
      solution: c.solution,
      mockup: c.mockup,
      title: c.title[locale],
      system: c.system[locale],
      profile: c.profile[locale],
      stats: c.stats.map((s) => ({
        value: s.value[locale],
        label: s.label[locale],
        sourceId: s.sourceId,
      })),
      before: c.before[locale],
      after: c.after[locale],
      outcome: c.outcome[locale],
      story: c.story
        ? {
            background: c.story.background[locale],
            challenges: c.story.challenges.map((x) => x[locale]),
            approach: c.story.approach.map((x) => x[locale]),
          }
        : null,
      duration: c.duration[locale],
      model: c.model[locale],
      images: c.images,
      main: c.main,
      demo: c.demo ?? null,
    };
  });
}

export type CaseStudy = ReturnType<typeof cases>[number];

export function founders(locale: Locale) {
  return allTeam.map((f) => ({
    id: f.id,
    order: f.order,
    role: f.role[locale],
    tags: f.tags[locale],
    motto: f.motto[locale],
    bio: f.bio[locale],
    stages: f.stages,
  }));
}

export function founderForStage(stageNo: number, locale: Locale) {
  const list = founders(locale);
  const found = list.find((f) => f.stages.includes(stageNo));
  if (!found) throw new Error(`No team member assigned to stage ${stageNo}`);
  return found;
}

export function solutions(locale: Locale) {
  return allSolutions.map((s) => ({
    slug: s.slug,
    index: s.order,
    name: s.name[locale],
    shortName: s.shortName[locale],
    promise: s.promise[locale],
    intro: s.intro[locale],
    outputs: s.outputs[locale],
    caseSlug: s.caseSlug,
  }));
}

export function insights(locale: Locale) {
  const team = founders(locale);
  return allInsights.map((ins) => {
    const author = team.find((f) => f.id === ins.authorId) ?? team[0];
    return {
      slug: ins.slug,
      index: ins.order,
      title: ins.title[locale],
      date: ins.dateIso,
      author,
      category: ins.category[locale],
      image: ins.image,
      blocks: ins.blocks[locale],
    };
  });
}

export function getArticleBlocks(
  slug: string,
  locale: Locale,
): { q: string; a: string }[] {
  const found = allInsights.find((ins) => ins.slug === slug);
  return found ? found.blocks[locale] : [];
}
