import { z } from "zod";

export type Locale = "zh" | "en";

export const BilingualSchema = z.object({
  zh: z.string().min(1),
  en: z.string().min(1),
});

export const CaseStatSchema = z.object({
  value: BilingualSchema,
  label: BilingualSchema,
  condition: BilingualSchema,
  sourceId: z.string().min(1),
});

export const HotspotSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  title: BilingualSchema,
  detail: BilingualSchema,
});

export const CaseWorkflowStepSchema = z.object({
  stage: BilingualSchema,
  title: BilingualSchema,
  detail: BilingualSchema,
  artifact: BilingualSchema,
  humanCheckpoint: z.boolean().optional(),
});

export const CaseTimelineStepSchema = z.object({
  phase: BilingualSchema,
  duration: BilingualSchema,
  detail: BilingualSchema,
});

export const TrackSegmentSchema = z.object({
  label: BilingualSchema,
  weight: z.number().positive(),
  isHumanReview: z.boolean().optional(),
});

export const CaseImageSchema = z.object({
  src: z.string().min(1),
  caption: BilingualSchema,
});

export const CaseSchema = z.object({
  slug: z.string().min(1),
  group: z.enum(["core", "vertical"]),
  industryKey: z.enum([
    "manufacturing",
    "consulting",
    "enterprise-it",
    "retail",
    "real-estate",
    "media",
  ]),
  industry: BilingualSchema,
  title: BilingualSchema,
  metaDescription: BilingualSchema,
  system: BilingualSchema,
  solutionSlug: z.string().nullable(),
  solutionLabel: BilingualSchema,
  model: BilingualSchema,
  duration: BilingualSchema,
  profile: BilingualSchema,
  background: BilingualSchema,
  challenges: z.array(BilingualSchema).length(3),
  whyNotGeneric: BilingualSchema,
  stats: z.array(CaseStatSchema).length(3),
  beforeSummary: BilingualSchema,
  afterSummary: BilingualSchema,
  beforeTotalLabel: BilingualSchema,
  afterTotalLabel: BilingualSchema,
  afterWidthPercent: z.number().min(6).max(60),
  beforeSegments: z.array(TrackSegmentSchema).min(2),
  afterSegments: z.array(TrackSegmentSchema).min(2),
  outcome: BilingualSchema,
  techHighlights: z.array(BilingualSchema).length(3),
  images: z.array(CaseImageSchema).min(1),
  mainImageIndex: z.number().int().min(0),
  interfaceLanguage: z.enum(["zh", "en"]),
  isMobileFrame: z.boolean().optional(),
  hotspots: z.array(HotspotSchema).length(4),
  workflowSteps: z.array(CaseWorkflowStepSchema).length(4),
  timeline: z.array(CaseTimelineStepSchema).length(4),
  demoUrl: z.string().url().nullable(),
  interactiveDemo: z.enum(["kb", "sql"]).nullable(),
});

export const SolutionPainSchema = z.object({
  title: BilingualSchema,
  scenario: BilingualSchema,
  metricTag: BilingualSchema,
});

export const SolutionWorkflowNodeSchema = z.object({
  stage: BilingualSchema,
  title: BilingualSchema,
  detail: BilingualSchema,
  badge: BilingualSchema,
  humanReview: z.boolean().optional(),
});

export const FaqItemSchema = z.object({
  q: BilingualSchema,
  a: BilingualSchema,
});

export const SolutionSchema = z.object({
  slug: z.string().min(1),
  name: BilingualSchema,
  shortName: BilingualSchema,
  promise: BilingualSchema,
  intro: BilingualSchema,
  metaDescription: BilingualSchema,
  deliverables: z.array(BilingualSchema).length(4),
  capabilities: z
    .array(
      z.object({
        title: BilingualSchema,
        detail: BilingualSchema,
      })
    )
    .length(3),
  caseSlug: z.string().min(1),
  pains: z.array(SolutionPainSchema).length(3),
  workflow: z.array(SolutionWorkflowNodeSchema).length(4),
  faqs: z.array(FaqItemSchema).length(3),
});

export const FounderSchema = z.object({
  id: z.enum(["F1", "F2", "F3", "F4"]),
  role: BilingualSchema,
  tags: z.array(BilingualSchema).length(3),
  specialtyBadge: BilingualSchema,
  focusDeliverable: BilingualSchema,
  bio: BilingualSchema,
  portrait: z.string().min(1),
  avatar: z.string().optional(),
});

export const InsightDiagramSchema = z.object({
  insertAfterIndex: z.number().int().min(0),
  eyebrow: BilingualSchema,
  title: BilingualSchema,
  caption: BilingualSchema,
  nodes: z
    .array(
      z.object({
        tag: z.string().min(1),
        label: BilingualSchema,
        note: BilingualSchema,
        highlight: z.boolean().optional(),
      })
    )
    .min(3),
});

export const InsightSchema = z.object({
  slug: z.string().min(1),
  title: BilingualSchema,
  metaDescription: BilingualSchema,
  category: BilingualSchema,
  dateIso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateDisplay: BilingualSchema,
  readingTime: BilingualSchema,
  authorId: z.enum(["F1", "F2", "F3", "F4"]),
  coverCode: z.string().min(1),
  coverMetric: BilingualSchema,
  coverNodes: z.array(BilingualSchema).length(3),
  pullQuote: z.object({
    insertAfterIndex: z.number().int().min(0),
    text: BilingualSchema,
    note: BilingualSchema,
  }),
  diagrams: z.array(InsightDiagramSchema).length(2),
  relatedCaseSlug: z.string().min(1),
  relatedSolutionSlug: z.string().min(1),
});

export type Bilingual = z.infer<typeof BilingualSchema>;
export type CaseItem = z.infer<typeof CaseSchema>;
export type SolutionItem = z.infer<typeof SolutionSchema>;
export type FounderItem = z.infer<typeof FounderSchema>;
export type InsightItem = z.infer<typeof InsightSchema>;
