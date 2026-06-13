import type { Locale } from "./types";

export const defaultLocale: Locale = "cn";
export const localeStorageKey = "cyano.locale";
export const localeCookieName = "cyano-locale";

export const localeToHtmlLang: Record<Locale, string> = {
  cn: "zh-CN",
  en: "en",
};

export const normalizeLocale = (value?: string | null): Locale | null => {
  if (!value) return null;

  const normalized = value.toLowerCase();

  if (normalized === "cn" || normalized.startsWith("zh")) {
    return "cn";
  }

  if (normalized === "en" || normalized.startsWith("en")) {
    return "en";
  }

  return null;
};

export const detectBrowserLocale = (): Locale => {
  if (typeof navigator === "undefined") {
    return defaultLocale;
  }

  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];

  for (const language of languages) {
    const locale = normalizeLocale(language);
    if (locale) return locale;
  }

  return defaultLocale;
};

export const getAlternateLocale = (locale: Locale): Locale => (locale === "cn" ? "en" : "cn");
