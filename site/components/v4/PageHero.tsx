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
      <div className="page-hero-grid wrap relative [z-index:var(--z-content)] grid [gap:var(--sp-7)] items-center">
        <div className="page-hero-copy relative [z-index:var(--z-stage)] min-w-0">
          <nav className="breadcrumb flex flex-wrap items-center [gap:var(--sp-2)] [font-size:14px]" aria-label={eyebrow}>
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
          {footNote ? <p className="small page-hero-note [margin-top:var(--sp-4)] [color:var(--on-dark)]">{footNote}</p> : null}
        </div>
        {visual ? <div className="page-hero-visual relative min-w-0 [justify-self:end] [@media(max-width:1023px)]:[justify-self:start] w-full [max-width:600px] [@media(max-width:1023px)]:[max-width:560px]">{visual}</div> : null}
      </div>
    </section>
  );
}
