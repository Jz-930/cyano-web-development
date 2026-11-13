import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { type Locale, href, t } from "@/lib/content";

export type HeaderVariant =
  | "services"
  | "cases"
  | "technology"
  | "engagement"
  | "about"
  | "insights"
  | "contact"
  | "legal";

function HeaderSchematic({ variant }: { variant: HeaderVariant }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none hidden lg:flex lg:items-center lg:justify-end"
    >
      <div className="relative h-[200px] w-[320px] overflow-hidden rounded-2xl border border-[#7EF5D6]/22 bg-[#06141A]/85 p-4 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.65)] backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 font-mono-tech text-[12px] text-[#7EF5D6]">
          <span>
            {variant === "services" && "WORKFLOW.TOPOLOGY"}
            {variant === "cases" && "PRODUCTION.METRICS"}
            {variant === "technology" && "CYANO.CORE.STACK"}
            {variant === "engagement" && "TIMELINE.0_12W"}
            {variant === "about" && "TEAM.CREDENTIALS"}
            {variant === "insights" && "FIELD.NOTES"}
            {variant === "contact" && "INTAKE.ASSESSMENT"}
            {variant === "legal" && "GOVERNANCE.POLICY"}
          </span>
          <span className="h-2 w-2 rounded-full bg-[#7EF5D6] shadow-[0_0_8px_#7EF5D6]" />
        </div>

        <svg
          viewBox="0 0 280 132"
          fill="none"
          className="mt-2 h-[132px] w-full"
        >
          {variant === "technology" && (
            <>
              {[14, 44, 74, 104].map((y, idx) => (
                <g key={y}>
                  <rect
                    x="16"
                    y={y}
                    width="248"
                    height="22"
                    rx="6"
                    fill={idx === 1 ? "rgba(126,245,214,0.16)" : "rgba(63,160,166,0.09)"}
                    stroke={idx === 1 ? "#7EF5D6" : "rgba(126,245,214,0.3)"}
                    strokeWidth="1"
                  />
                  <circle
                    cx="30"
                    cy={y + 11}
                    r="3.2"
                    fill={idx === 1 ? "#7EF5D6" : "#52C7CC"}
                  />
                  <line
                    x1="44"
                    y1={y + 11}
                    x2={185 - idx * 18}
                    y2={y + 11}
                    stroke={idx === 1 ? "#7EF5D6" : "rgba(180,207,210,0.5)"}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </g>
              ))}
            </>
          )}

          {variant === "engagement" && (
            <>
              <line x1="16" y1="22" x2="264" y2="22" stroke="rgba(126,245,214,0.2)" />
              <rect x="16" y="36" width="210" height="18" rx="9" fill="rgba(63,160,166,0.28)" stroke="#52C7CC" />
              <rect x="16" y="68" width="112" height="18" rx="9" fill="rgba(126,245,214,0.24)" stroke="#7EF5D6" />
              <rect x="16" y="100" width="56" height="18" rx="9" fill="rgba(126,245,214,0.4)" stroke="#7EF5D6" />
              <line x1="78" y1="109" x2="256" y2="109" stroke="#7EF5D6" strokeDasharray="4 4" />
            </>
          )}

          {(variant === "services" || variant === "cases") && (
            <>
              <rect x="12" y="42" width="58" height="48" rx="8" fill="rgba(63,160,166,0.14)" stroke="#52C7CC" />
              <rect x="110" y="26" width="64" height="80" rx="10" fill="rgba(126,245,214,0.16)" stroke="#7EF5D6" />
              <rect x="212" y="42" width="56" height="48" rx="8" fill="rgba(63,160,166,0.2)" stroke="#7EF5D6" />
              <path d="M 70 66 L 110 66" stroke="#7EF5D6" strokeWidth="1.8" className="svg-trace-animated" />
              <path d="M 174 66 L 212 66" stroke="#7EF5D6" strokeWidth="1.8" className="svg-trace-animated" />
              <circle cx="142" cy="66" r="12" fill="rgba(126,245,214,0.22)" stroke="#7EF5D6" />
              <path d="M 137 66 L 141 70 L 148 62" stroke="#7EF5D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </>
          )}

          {(variant === "about" || variant === "insights" || variant === "contact" || variant === "legal") && (
            <>
              {[38, 106, 174, 242].map((cx, i) => (
                <g key={cx}>
                  <circle
                    cx={cx}
                    cy={66 + (i % 2 === 0 ? -12 : 12)}
                    r="18"
                    fill="rgba(126,245,214,0.1)"
                    stroke={i === 1 ? "#7EF5D6" : "rgba(82,199,204,0.5)"}
                    strokeWidth="1.4"
                  />
                  <circle
                    cx={cx}
                    cy={66 + (i % 2 === 0 ? -12 : 12)}
                    r="4"
                    fill="#7EF5D6"
                  />
                </g>
              ))}
              <path
                d="M 56 54 L 88 78 M 124 78 L 156 54 M 192 54 L 224 78"
                stroke="rgba(126,245,214,0.55)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            </>
          )}
        </svg>
      </div>
    </div>
  );
}

export function PageHeader({
  locale,
  breadcrumbs,
  eyebrow,
  title,
  intro,
  variant,
  children,
}: {
  locale: Locale;
  breadcrumbs: { label: string; path?: string }[];
  eyebrow: string;
  title: string;
  intro?: string;
  variant: HeaderVariant;
  children?: React.ReactNode;
}) {
  return (
    <section className="surface-obsidian bg-tech-grid-dark relative border-b border-[#7EF5D6]/16 pt-10 pb-14 md:pt-14 md:pb-20">
      {/* Subtle radial optical glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-1/4 h-[340px] w-[520px] rounded-full bg-[#3FA0A6]/16 blur-[110px]"
      />

      <div className="site-container relative z-10">
        {/* Semantic Breadcrumb Navigation */}
        <nav
          aria-label={t(locale, "面包屑导航", "Breadcrumb")}
          className="mb-6"
        >
          <ol className="m-0 flex flex-wrap list-none items-center gap-1.5 p-0 text-[13px] text-[#93B5B9]">
            <li>
              <Link
                href={href(locale)}
                className="inline-flex min-h-[28px] items-center hover:text-[#7EF5D6]"
              >
                {t(locale, "首页", "Home")}
              </Link>
            </li>
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <li key={crumb.label} className="inline-flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-[#52C7CC]/70" />
                  {crumb.path && !isLast ? (
                    <Link
                      href={href(locale, crumb.path)}
                      className="inline-flex min-h-[28px] items-center hover:text-[#7EF5D6]"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-[#D8ECEE]">
                      {crumb.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <span className="eyebrow-badge eyebrow-badge-dark">{eyebrow}</span>
            <h1 className="mt-4 text-[length:var(--fs-display)] text-[#F2FAF9]">
              {title}
            </h1>
            {intro && (
              <p className="prose-measure mt-4 text-[17px] leading-relaxed text-[#B4CFD2] md:text-[18px]">
                {intro}
              </p>
            )}
            {children && (
              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                {children}
              </div>
            )}
          </div>

          <HeaderSchematic variant={variant} />
        </div>
      </div>
    </section>
  );
}
