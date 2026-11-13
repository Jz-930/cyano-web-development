"use client";
import { NextIntlClientProvider } from "next-intl";
export function LocaleProvider({
  locale,
  children,
}: {
  locale: "zh" | "en";
  children: React.ReactNode;
}) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={{}}
      timeZone="America/Toronto"
    >
      {children}
    </NextIntlClientProvider>
  );
}
