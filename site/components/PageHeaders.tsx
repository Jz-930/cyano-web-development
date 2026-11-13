import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { type Locale, getMediaMeta, href, t } from "@/lib/content";

export type HeaderVariant =
  | "services"
  | "cases"
  | "technology"
  | "engagement"
  | "about"
  | "insights"
  | "contact"
  | "legal";

const VARIANT_WHITE_ART: Record<HeaderVariant, string> = {
  services: "/art/cyano-sol-docs.webp",
  cases: "/art/cyano-white-prisms.webp",
  technology: "/art/cyano-white-tech-astrolabe.webp",
  engagement: "/art/cyano-white-engagement.webp",
  about: "/art/cyano-white-c-monolith.webp",
  insights: "/art/cyano-sol-kb.webp",
  contact: "/art/cyano-white-c-monolith.webp",
  legal: "/art/cyano-white-prisms.webp",
};

/**
 * Pure Gallery-White PageHeader:
 * - Solid #FFFFFF background with monumental #0B1520 typography on left;
 * - Seamless pure-white-edge Cyano 3D optical sculpture on right (`mix-blend-mode: multiply`),
 *   creating zero box borders and generous gallery breathing room.
 */
export function PageHeader({
  locale,
  variant,
  artOverride,
  breadcrumbs,
  eyebrow,
  title,
  intro,
  children,
}: {
  locale: Locale;
  variant: HeaderVariant;
  artOverride?: string;
  breadcrumbs: { label: string; path?: string }[];
  eyebrow: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  const artSrc = artOverride || VARIANT_WHITE_ART[variant];
  const artMeta = getMediaMeta(artSrc);

  return (
    <section className="surface-light relative overflow-hidden border-b border-black/[0.08] pt-10 pb-18 md:pt-16 md:pb-26">
      <div className="site-container relative z-10">
        {/* Clean Semantic Breadcrumb */}
        <nav
          aria-label={t(locale, "面包屑导航", "Breadcrumb")}
          className="mb-8 md:mb-10"
        >
          <ol className="m-0 flex flex-wrap list-none items-center gap-1.5 p-0 text-[13px] text-[#52606D]">
            <li>
              <Link
                href={href(locale)}
                className="inline-flex min-h-[28px] items-center transition-colors hover:text-[#0B1520]"
              >
                {t(locale, "首页", "Home")}
              </Link>
            </li>
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <li key={crumb.label} className="inline-flex items-center gap-1.5">
                  <ChevronRight size={13} className="text-black/35" />
                  {crumb.path && !isLast ? (
                    <Link
                      href={href(locale, crumb.path)}
                      className="inline-flex min-h-[28px] items-center transition-colors hover:text-[#0B1520]"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="font-medium text-[#0B1520]">
                      {crumb.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Left: Monumental Light/Regular Gallery Typography */}
          <div className="lg:col-span-6">
            <span className="eyebrow-badge">{eyebrow}</span>
            <h1 className="mt-4 text-[length:var(--fs-display)] text-[#0B1520]">
              {title}
            </h1>
            {intro && (
              <p className="prose-measure mt-6 text-[17px] leading-relaxed text-[#2C3A47] md:text-[18px]">
                {intro}
              </p>
            )}
            {children && (
              <div className="mt-9 flex flex-wrap items-center gap-5">
                {children}
              </div>
            )}
          </div>

          {/* Right: Generous Seamless Polychromatic Cyano Sculpture on Pure White */}
          <div
            aria-hidden="true"
            className="pointer-events-none flex items-center justify-center lg:col-span-6"
          >
            <Image
              src={artSrc}
              alt=""
              width={artMeta.width}
              height={artMeta.height}
              priority
              sizes="(max-width: 1024px) 94vw, 600px"
              className="art-on-white h-auto w-full max-w-[580px] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
