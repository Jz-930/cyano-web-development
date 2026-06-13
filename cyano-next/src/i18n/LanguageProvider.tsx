"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultLocale,
  detectBrowserLocale,
  getAlternateLocale,
  localeCookieName,
  localeStorageKey,
  localeToHtmlLang,
  normalizeLocale,
} from "./config";
import { siteContent } from "./locales";
import type { Locale, SiteContent } from "./types";

type LanguageContextValue = {
  locale: Locale;
  content: SiteContent;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const readSavedLocale = () => {
  if (typeof window === "undefined") return null;

  try {
    return normalizeLocale(window.localStorage.getItem(localeStorageKey));
  } catch {
    return null;
  }
};

const writeSavedLocale = (locale: Locale) => {
  try {
    window.localStorage.setItem(localeStorageKey, locale);
  } catch {
    // Local storage can be unavailable in private or restricted browser modes.
  }

  document.cookie = `${localeCookieName}=${locale};path=/;max-age=31536000;samesite=lax`;
};

const normalizePathname = (pathname: string | null) => {
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    writeSavedLocale(nextLocale);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(getAlternateLocale(locale));
  }, [locale, setLocale]);

  useEffect(() => {
    const preferredLocale = readSavedLocale() ?? detectBrowserLocale();
    const frame = window.requestAnimationFrame(() => setLocaleState(preferredLocale));

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const metadata = siteContent[locale].meta[normalizePathname(pathname)];
    const syncDocumentLocale = () => {
      const html = document.documentElement;
      html.lang = localeToHtmlLang[locale];
      html.dataset.locale = locale;
    };
    const syncDocumentMetadata = () => {
      if (!metadata) return;

      document.title = metadata.title;
      const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (description) {
        description.content = metadata.description;
      }
    };

    syncDocumentLocale();
    syncDocumentMetadata();

    const frame = window.requestAnimationFrame(syncDocumentMetadata);
    const interval = window.setInterval(syncDocumentMetadata, 120);
    const timeout = window.setTimeout(() => window.clearInterval(interval), 2400);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [locale, pathname]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      content: siteContent[locale],
      setLocale,
      toggleLocale,
    }),
    [locale, setLocale, toggleLocale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useI18n must be used inside LanguageProvider");
  }

  return context;
};
