import pageCopy from "@/content/v3/pages/PageHero.json";
import Link from "next/link";
import {CoreVisual} from "../CoreVisual";
import { Locale, t, href } from "@/lib/v1-content";
import { Eyebrow } from "../ui";

export function PageHero({
  locale,
  eyebrow,
  title,
  intro,
  art = "/art/hero.webp",
  children,
  compact = false,
  paper = false,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  intro?: string;
  art?: string;
  children?: React.ReactNode;
  compact?: boolean;
  paper?: boolean;
}) {
  return (
    <section className={`page-hero ${paper ? "paper-hero" : "dark"} ${compact ? "page-hero-compact" : ""}`}>
      {!paper && <CoreVisual locale={locale} />}
      <div className="page-hero-shade" />
      <div className="container page-hero-inner">
        <div className="breadcrumb">
          <Link href={href(locale)}>{pageCopy.c76c92ba094[locale]}</Link>
          <span>/</span>
          <span>{eyebrow}</span>
        </div>
        <Eyebrow light>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
        {children && <div className="hero-buttons">{children}</div>}
      </div>
    </section>
  );
}
