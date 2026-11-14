"use client";
import { useState, useEffect, useRef, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ArrowRight, ChevronDown, Menu, X, Plus, Minus, ChevronLeft, ChevronRight, Check, LoaderCircle, Send, Globe, ShieldCheck, Search, Database } from "lucide-react";
import { type Locale, t, href } from "@/lib/locale";
import type { CaseStudy, solutions } from "@/lib/v1-content";
import { Logo, solutionIcons } from "./client-shared";
type LocalCopy = Record<string,Record<string,string>>;
export function CopyLink({ locale }: { locale: Locale }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="text-link"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? <Check size={15} /> : <ArrowUpRight size={15} />}{" "}
      {t(
        locale,
        copied ? "链接已复制" : "复制文章链接",
        copied ? "Link copied" : "Copy article link",
      )}
    </button>
  );
}
