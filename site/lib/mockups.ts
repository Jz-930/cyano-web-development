import proposalRaw from "@/content/v4/mockups/proposal.json";
import wikiRaw from "@/content/v4/mockups/wiki.json";
import salesRaw from "@/content/v4/mockups/sales.json";
import dataRaw from "@/content/v4/mockups/data.json";
import propertyRaw from "@/content/v4/mockups/property.json";
import writingRaw from "@/content/v4/mockups/writing.json";
import stageRaw from "@/content/v4/mockups/stage.json";
import calloutsRaw from "@/content/v4/mockups/callouts.json";
import inoutRaw from "@/content/v4/mockups/inout.json";
import rawCases from "@/content/v4/cases.json";
import rawCopyNew from "@/content/v4/copy-new.json";
import demoQuestions from "@/content/v1/demo-questions.json";
import queryDemo from "@/content/query-demo.json";
import type { Locale } from "./locale";

export type SceneId =
  | "proposal"
  | "wiki"
  | "sales"
  | "data"
  | "property"
  | "writing";

type LocalizedEntry = {
  zh: string;
  en: string;
  status: string;
};

const SCENE_TABLES: Record<SceneId, Record<string, LocalizedEntry>> = {
  proposal: proposalRaw as Record<string, LocalizedEntry>,
  wiki: wikiRaw as Record<string, LocalizedEntry>,
  sales: salesRaw as Record<string, LocalizedEntry>,
  data: dataRaw as Record<string, LocalizedEntry>,
  property: propertyRaw as Record<string, LocalizedEntry>,
  writing: writingRaw as Record<string, LocalizedEntry>,
};

const stageTable = stageRaw as Record<string, LocalizedEntry>;
const inoutTable = inoutRaw as Record<string, LocalizedEntry>;
const copyNewTable = rawCopyNew as Record<string, LocalizedEntry>;
const calloutsTable = calloutsRaw as Record<
  string,
  Array<{ x: number; y: number; zh: string; en: string; status: string }>
>;

function isApproved(entry: LocalizedEntry | undefined): entry is LocalizedEntry {
  return Boolean(
    entry && (entry.status === "approved" || entry.status === "class-a"),
  );
}

export function mk(
  sceneId: SceneId,
  key: string,
  locale: Locale,
): string | null {
  const entry = SCENE_TABLES[sceneId]?.[key];
  return isApproved(entry) ? entry[locale] : null;
}

export function mkStage(
  sceneId: "proposal" | "wiki",
  cardIndex: 1 | 2 | 3,
  locale: Locale,
): string | null {
  const entry = stageTable[`stage.${sceneId}.card${cardIndex}`];
  return isApproved(entry) ? entry[locale] : null;
}

export function mkCallouts(
  solutionSlug: string,
  locale: Locale,
): Array<{ n: number; x: number; y: number; label: string }> {
  const list = calloutsTable[solutionSlug] ?? [];
  return list
    .map((item, idx) =>
      item.status === "approved" || item.status === "class-a"
        ? { n: idx + 1, x: item.x, y: item.y, label: item[locale] }
        : null,
    )
    .filter(
      (x): x is { n: number; x: number; y: number; label: string } => x !== null,
    );
}

export function mkInout(
  solutionSlug: string,
  index: 1 | 2 | 3,
  locale: Locale,
): string | null {
  const entry = inoutTable[`inout.${solutionSlug}.src${index}`];
  return isApproved(entry) ? entry[locale] : null;
}

export function copyNew(id: string, locale: Locale): string | null {
  const entry = copyNewTable[id];
  return isApproved(entry) ? entry[locale] : null;
}

export type CaseMockupMeta = {
  slug: string;
  mockup: SceneId;
  system: string;
  title: string;
  stats: Array<{ value: string; label: string; sourceId: string }>;
};

export function caseMetaByMockup(
  sceneId: SceneId,
  locale: Locale,
): CaseMockupMeta {
  const found = rawCases.find((c) => c.mockup === sceneId);
  if (!found) {
    throw new Error(`No case registered for mockup scene "${sceneId}"`);
  }
  return {
    slug: found.slug,
    mockup: found.mockup as SceneId,
    system: found.system[locale],
    title: found.title[locale],
    stats: found.stats.map((s) => ({
      value: s.value[locale],
      label: s.label[locale],
      sourceId: s.sourceId,
    })),
  };
}

export function caseMetaBySlug(slug: string, locale: Locale): CaseMockupMeta {
  const found = rawCases.find((c) => c.slug === slug);
  if (!found) {
    throw new Error(`No case registered for slug "${slug}"`);
  }
  return {
    slug: found.slug,
    mockup: found.mockup as SceneId,
    system: found.system[locale],
    title: found.title[locale],
    stats: found.stats.map((s) => ({
      value: s.value[locale],
      label: s.label[locale],
      sourceId: s.sourceId,
    })),
  };
}

export function wikiDemoQuestion(locale: Locale): string {
  return demoQuestions.knowledge[locale][3];
}

export function dataDemoFirstGroup(locale: Locale): {
  sql: string;
  bars: Array<{ name: string; ratio: number }>;
} {
  const first = queryDemo[0];
  const rawRows = first.rows[locale];
  const parsed = rawRows.map(([name, amountStr]) => {
    const numeric = Number(String(amountStr).replace(/[^0-9.]/g, "")) || 1;
    return { name, numeric };
  });
  const maxVal = Math.max(...parsed.map((r) => r.numeric), 1);
  return {
    sql: first.sql,
    bars: parsed.map((r) => ({
      name: r.name,
      ratio: Math.max(0.18, Math.round((r.numeric / maxVal) * 100) / 100),
    })),
  };
}
