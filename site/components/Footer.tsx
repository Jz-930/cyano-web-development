import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import {
  type Locale,
  availability,
  getMediaMeta,
  href,
  pick,
  siteCopy,
  solutionsList,
  t,
} from "@/lib/content";
import { hasOptionalWechatQr } from "@/lib/server-inputs";
import { BrandLogo } from "./BrandLogo";
import { SpectralFlowCanvas } from "./MotionPrimitives";

export function Footer({
  locale,
  hideClosingCta = false,
}: {
  locale: Locale;
  hideClosingCta?: boolean;
}) {
  const auroraMeta = getMediaMeta("/art/v2-cta-aurora.webp");
  const showWechatQr = hasOptionalWechatQr();

  return (
    <>
      {!hideClosingCta && (
        <section
          id="site-closing-cta"
          className="surface-obsidian relative border-t border-[#7EF5D6]/18 py-20 md:py-28"
        >
          <Image
            src="/art/v2-cta-aurora.webp"
            alt=""
            aria-hidden="true"
            width={auroraMeta.width}
            height={auroraMeta.height}
            placeholder={auroraMeta.blurDataURL ? "blur" : "empty"}
            blurDataURL={auroraMeta.blurDataURL || undefined}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-55"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#030709]/92 via-[#030709]/76 to-[#030709]/88" />
          <SpectralFlowCanvas intensity="band" />

          <div className="site-container relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="eyebrow-badge eyebrow-badge-dark">
                {pick(locale, siteCopy.footer.closingEyebrow)}
              </span>
              <h2 className="mt-4 text-[length:var(--fs-2xl)] text-[#F2FAF9]">
                {pick(locale, siteCopy.footer.closingTitle)}
              </h2>
              <p className="prose-measure mt-3 text-[16px] text-[#B4CFD2]">
                {pick(locale, siteCopy.footer.closingBody)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                href={href(locale, "/contact#form")}
                className="btn-primary-mint"
              >
                <span>{pick(locale, siteCopy.nav.primaryCta)}</span>
                <ArrowUpRight size={17} />
              </Link>
              <Link
                href={href(locale, "/engagement")}
                className="btn-secondary-glass"
              >
                <span>{pick(locale, siteCopy.footer.secondaryCta)}</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      <footer
        id="site-footer"
        className="surface-obsidian border-t border-white/10 bg-[#020507] pt-16 pb-12"
      >
        <div className="site-container">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1.1fr_0.9fr_1.1fr]">
            {/* Brand column */}
            <div>
              <Link
                href={href(locale)}
                aria-label={t(locale, "Cyano 首页", "Cyano Home")}
                className="inline-flex items-center"
              >
                <BrandLogo tone="dark" showSub />
              </Link>
              <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-[#B4CFD2]">
                {pick(locale, siteCopy.footer.positioning)}
              </p>
              <p className="mt-3 inline-flex items-center gap-2 text-[13px] text-[#93B5B9]">
                <span className="h-2 w-2 rounded-full bg-[#7EF5D6] shadow-[0_0_8px_#7EF5D6]" />
                <span>{pick(locale, siteCopy.footer.region)}</span>
              </p>
            </div>

            {/* Solutions column */}
            <div>
              <h3 className="font-mono-tech text-[12px] font-semibold uppercase tracking-[0.1em] text-[#7EF5D6]">
                {pick(locale, siteCopy.nav.solutions)}
              </h3>
              <ul className="mt-4 flex list-none flex-col gap-2 p-0">
                {solutionsList.map((sol) => (
                  <li key={sol.slug}>
                    <Link
                      href={href(locale, `/services/${sol.slug}`)}
                      className="inline-flex min-h-[34px] items-center text-[14px] text-[#C6DDE0] transition-colors hover:text-[#7EF5D6]"
                    >
                      {pick(locale, sol.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company column */}
            <div>
              <h3 className="font-mono-tech text-[12px] font-semibold uppercase tracking-[0.1em] text-[#7EF5D6]">
                {t(locale, "公司与资源", "Company")}
              </h3>
              <ul className="mt-4 flex list-none flex-col gap-2 p-0">
                {[
                  { path: "/cases", label: pick(locale, siteCopy.nav.cases) },
                  { path: "/technology", label: pick(locale, siteCopy.nav.technology) },
                  { path: "/engagement", label: pick(locale, siteCopy.nav.engagement) },
                  { path: "/about", label: pick(locale, siteCopy.nav.about) },
                  { path: "/insights", label: pick(locale, siteCopy.nav.insights) },
                ].map((item) => (
                  <li key={item.path}>
                    <Link
                      href={href(locale, item.path)}
                      className="inline-flex min-h-[34px] items-center text-[14px] text-[#C6DDE0] transition-colors hover:text-[#7EF5D6]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact column */}
            <div>
              <h3 className="font-mono-tech text-[12px] font-semibold uppercase tracking-[0.1em] text-[#7EF5D6]">
                {pick(locale, siteCopy.nav.contact)}
              </h3>
              <div className="mt-4 flex flex-col gap-2.5">
                <Link
                  href={href(locale, "/contact#form")}
                  className="inline-flex min-h-[36px] items-center gap-1.5 text-[14px] font-semibold text-[#F2FAF9] hover:text-[#7EF5D6]"
                >
                  <span>{pick(locale, siteCopy.nav.primaryCta)}</span>
                  <ArrowUpRight size={15} className="text-[#7EF5D6]" />
                </Link>
                {availability.email && (
                  <a
                    href="mailto:hello@cyano.app"
                    className="inline-flex min-h-[36px] items-center gap-2 font-mono-tech text-[13px] text-[#B4CFD2] hover:text-[#7EF5D6]"
                  >
                    <Mail size={14} className="text-[#52C7CC]" />
                    <span>hello@cyano.app</span>
                  </a>
                )}
                {showWechatQr && (
                  <div className="mt-2 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <img
                      src="/media/wechat-qr.png"
                      alt={t(locale, "微信咨询二维码", "WeChat consultation QR")}
                      width={56}
                      height={56}
                      className="rounded-md"
                    />
                    <span className="text-[12px] text-[#B4CFD2]">
                      {t(locale, "扫码添加顾问微信", "Scan to connect on WeChat")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-[13px] text-[#93B5B9] sm:flex-row sm:items-center">
            <span>{pick(locale, siteCopy.footer.copyright)}</span>
            <div className="flex flex-wrap items-center gap-6">
              <Link
                href={href(locale, "/privacy")}
                className="inline-flex min-h-[34px] items-center hover:text-[#7EF5D6]"
              >
                {pick(locale, siteCopy.seo.privacy.title)}
              </Link>
              <Link
                href={href(locale, "/terms")}
                className="inline-flex min-h-[34px] items-center hover:text-[#7EF5D6]"
              >
                {pick(locale, siteCopy.seo.terms.title)}
              </Link>
              <span className="font-mono-tech text-[12px] tracking-[0.12em] text-[#52C7CC]">
                CYANO CORE v2
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
