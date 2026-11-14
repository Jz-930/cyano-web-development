import calloutsRaw from "@/content/v4/mockups/callouts.json";
import inoutRaw from "@/content/v4/mockups/inout.json";
import type { Locale } from "./locale";

type LocalizedEntry = {
  zh: string;
  en: string;
  status: string;
};

const inoutTable = inoutRaw as Record<string, LocalizedEntry>;
const calloutsTable = calloutsRaw as Record<
  string,
  Array<{ x: number; y: number; zh: string; en: string; status: string }>
>;

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
  if (!entry) return null;
  if (entry.status !== "approved" && entry.status !== "class-a") return null;
  return entry[locale];
}
