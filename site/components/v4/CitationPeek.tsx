import type { ReactNode } from "react";
import citationsRaw from "@/content/v4/citations.json";
import { copyIfApproved, href, type Locale } from "@/lib/content-v4";
import { CitationPeekClient } from "./CitationPeekClient";

type CitationMeta = {
  sourceId: string;
  caseSlug?: string;
};

const citationsTable = citationsRaw as Record<string, CitationMeta>;

export type CitationPeekProps = {
  id: string;
  locale: Locale;
  children: ReactNode;
  className?: string;
};

export function CitationPeek({
  id,
  locale,
  children,
  className,
}: CitationPeekProps) {
  const meta = citationsTable[id];
  const note = copyIfApproved(`cite.${id}`, locale);

  if (!meta || !note) {
    return className ? <span className={className}>{children}</span> : <>{children}</>;
  }

  const labelText =
    copyIfApproved("cite-label", locale) ?? (locale === "zh" ? "依据" : "Source");
  const caseLabel = copyIfApproved("cite-case", locale);
  const caseHref = meta.caseSlug ? href(locale, `/cases/${meta.caseSlug}`) : null;

  return (
    <CitationPeekClient
      id={id}
      locale={locale}
      note={note}
      labelText={labelText}
      caseHref={caseHref}
      caseLabel={caseLabel}
      className={className}
    >
      {children}
    </CitationPeekClient>
  );
}
