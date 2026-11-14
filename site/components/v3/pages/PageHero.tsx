import pageCopy from "@/content/v4/pages/PageHero.json";
import Link from "next/link";
import {CoreVisual} from "../CoreVisual";
import { Locale, href } from "@/lib/content-v4";
import { Eyebrow } from "../ui";
import { Phrase } from "@/components/v4/Phrase";

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
      <div className="wrap page-hero-inner">
        <div className="breadcrumb">
          <Link href={href(locale)}>{pageCopy.home[locale]}</Link>
          <span>/</span>
          <span>{eyebrow}</span>
        </div>
        <Eyebrow light>{eyebrow}</Eyebrow>
        <h1><Phrase text={title} locale={locale} /></h1>
        {intro && <p>{intro}</p>}
        {children && <div className="hero-buttons">{children}</div>}
      </div>
    </section>
  );
}
