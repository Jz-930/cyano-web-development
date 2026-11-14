import rawCopyNew from "@/content/v4/copy-new.json";
import type { Locale } from "./locale";

type LocalizedEntry = {
  zh: string;
  en: string;
  status: string;
};

const copyNewTable = rawCopyNew as Record<string, LocalizedEntry>;

export function copyNew(id: string, locale: Locale): string | null {
  const entry = copyNewTable[id];
  if (!entry) return null;
  if (entry.status !== "approved" && entry.status !== "class-a") return null;
  return entry[locale];
}
