import type { ReactNode } from "react";
import Link from "next/link";
import heroCopy from "@/content/v4/pages/PageHero.json";
import { href, type Locale } from "@/lib/locale";
import { LightField, type FieldPreset } from "./LightField";
import { FieldPoster } from "./FieldPoster";
import { Phrase } from "./Phrase";

export type PageHeroProps = {
  locale: Locale;
  eyebrow: string;
  title?: string;
  titleNode?: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  visual?: ReactNode;
  children?: ReactNode;
  footNote?: string | null;
  live?: boolean;
  preset?: FieldPreset;
  focusSelector?: string;
  intro?: boolean;
  posterPreset?: "panel" | "converge";
  posterOpacity?: number;
  overlay?: ReactNode;
  parentCrumb?: { label: string; href: string };
  crumbLabel?: string;
  className?: string;
};

export function PageHero({
  locale,
  eyebrow,
  title,
  titleNode,
  lede,
  actions,
  visual,
  children,
  footNote,
  live = false,
  preset = "solution",
  focusSelector,
  intro = false,
  posterPreset = "panel",
  posterOpacity = 0.35,
  overlay,
  parentCrumb,
  crumbLabel,
  className,
}: PageHeroProps) {
  return (
    <section
      className={`page-hero dark${className ? ` ${className}` : ""}`}
      data-header="dark"
    >
      {live ? (
        <LightField
          preset={preset}
          focusSelector={focusSelector}
          textEdgeSelector=".page-hero-copy"
          intro={intro}
        />
      ) : (
        <FieldPoster preset={posterPreset} opacity={posterOpacity} />
      )}
      {overlay}
      <div className="page-hero-grid wrap">
        <div className="page-hero-copy">
          <nav className="breadcrumb" aria-label={eyebrow}>
            <Link href={href(locale)}>{heroCopy.home[locale]}</Link>
            <span aria-hidden="true">/</span>
            {parentCrumb ? (
              <>
                <Link href={parentCrumb.href}>{parentCrumb.label}</Link>
                <span aria-hidden="true">/</span>
              </>
            ) : null}
            <span>{crumbLabel ?? eyebrow}</span>
          </nav>
          <p className="eyebrow on-dark">{eyebrow}</p>
          {titleNode ??
            (title ? (
              <h1 className="h1-page">
                <Phrase text={title} locale={locale} />
              </h1>
            ) : null)}
          {lede ? <p className="lede">{lede}</p> : null}
          {children}
          {actions ? <div className="hero-actions">{actions}</div> : null}
          {footNote ? <p className="small page-hero-note">{footNote}</p> : null}
        </div>
        {visual ? <div className="page-hero-visual">{visual}</div> : null}
      </div>
    </section>
  );
}
