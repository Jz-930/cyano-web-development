"use client";

import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { t, type Locale } from "@/lib/locale";
import { copyNew } from "@/lib/copy-new-client";

export function CopyLink({ locale }: { locale: Locale }) {
  const [copied, setCopied] = useState(false);
  const copiedLabel = copyNew("copied", locale) ?? t(locale, "已复制", "Copied");

  return (
    <button
      type="button"
      className="button-secondary copy-link-btn [min-height:36px]"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? (
        <>
          <Check size={15} aria-hidden="true" />
          <span>{copiedLabel}</span>
        </>
      ) : (
        <>
          <span>{t(locale, "复制文章链接", "Copy article link")}</span>
          <ArrowUpRight size={15} aria-hidden="true" />
        </>
      )}
    </button>
  );
}
