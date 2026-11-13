import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
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

export function Footer({
  locale,
  hideClosingCta = false,
}: {
  locale: Locale;
  hideClosingCta?: boolean;
}) {
  const showWechatQr = hasOptionalWechatQr();
  const closingMeta = getMediaMeta("/art/cyano-closing-aurora.webp");

  return (
    <>
      {!hideClosingCta && (
        <section
          id="site-closing-cta"
          className="surface-closing relative overflow-hidden py-28 md:py-40"
        >
          {/* Full-Bleed Cyano Laminar Aurora & Droplet Sculpture on Right */}
          <Image
            src="/art/cyano-closing-aurora.webp"
            alt=""
            aria-hidden="true"
            width={closingMeta.width}
            height={closingMeta.height}
            sizes="100vw"
            className="art-on-black pointer-events-none absolute inset-0 h-full w-full object-cover object-right opacity-90"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#000000]/92 via-[#020B13]/65 to-transparent"
          />

          <div className="site-container relative z-10">
            <div className="max-w-2xl">
              <span className="eyebrow-badge eyebrow-badge-dark">
                {pick(locale, siteCopy.footer.closingEyebrow)}
              </span>
              <h2 className="mt-5 text-[clamp(2.2rem,4vw,3.5rem)] font-normal tracking-tight text-white">
                {pick(locale, siteCopy.footer.closingTitle)}
              </h2>
              <p className="prose-measure mt-5 text-[17px] leading-relaxed text-white/82 md:text-[18px]">
                {pick(locale, siteCopy.footer.closingBody)}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-7">
                <Link
                  href={href(locale, "/contact#form")}
                  className="btn-primary-mint"
                >
                  <span>{pick(locale, siteCopy.nav.primaryCta)}</span>
                  <ArrowUpRight size={17} />
                </Link>
                <Link
                  href={href(locale, "/engagement")}
                  className="link-inline-dark"
                >
                  <span>{pick(locale, siteCopy.footer.secondaryCta)}</span>
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer
        id="site-footer"
        className="surface-obsidian border-t border-white/[0.1] pt-16 pb-14 text-white/65"
      >
        <div className="site-container">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.45fr_1fr_1fr_1fr]">
            <div>
              <Link href={href(locale)} className="inline-flex items-center">
                <BrandLogo variant="dark" size={34} />
              </Link>
              <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-white/72">
                {pick(locale, siteCopy.footer.positioning)}
              </p>
              <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-white/50">
                {pick(locale, siteCopy.footer.region)}
              </p>
            </div>

            <div>
              <h3 className="font-mono-tech text-[12px] font-medium uppercase tracking-[0.12em] text-white">
                {pick(locale, siteCopy.nav.solutions)}
              </h3>
              <ul className="mt-4 flex list-none flex-col gap-2 p-0">
                {solutionsList.map((sol) => (
                  <li key={sol.slug}>
                    <Link
                      href={href(locale, `/services/${sol.slug}`)}
                      className="inline-flex min-h-[34px] items-center text-[14px] text-white/68 transition-colors hover:text-[#22D3EE]"
                    >
                      {pick(locale, sol.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-mono-tech text-[12px] font-medium uppercase tracking-[0.12em] text-white">
                {t(locale, "产品与团队", "WORK & COMPANY")}
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
                      className="inline-flex min-h-[34px] items-center text-[14px] text-white/68 transition-colors hover:text-[#22D3EE]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-mono-tech text-[12px] font-medium uppercase tracking-[0.12em] text-white">
                {pick(locale, siteCopy.nav.contact)}
              </h3>
              <div className="mt-4 flex flex-col gap-2.5">
                <Link
                  href={href(locale, "/contact#form")}
                  className="inline-flex min-h-[36px] items-center gap-1.5 text-[14px] font-medium text-white hover:text-[#22D3EE]"
                >
                  <span>{pick(locale, siteCopy.nav.primaryCta)}</span>
                  <ArrowUpRight size={15} className="text-[#22D3EE]" />
                </Link>
                {availability.email && (
                  <a
                    href="mailto:hello@cyano.app"
                    className="inline-flex min-h-[36px] items-center gap-2 font-mono-tech text-[13px] text-white/68 hover:text-white"
                  >
                    <Mail size={14} className="text-[#22D3EE]" />
                    <span>hello@cyano.app</span>
                  </a>
                )}
                {showWechatQr && (
                  <div className="mt-2 inline-flex items-center gap-3">
                    <img
                      src="/media/wechat-qr.png"
                      alt={t(locale, "微信咨询二维码", "WeChat consultation QR")}
                      width={56}
                      height={56}
                      className="rounded-md"
                    />
                    <span className="text-[12px] text-white/65">
                      {t(locale, "扫码添加顾问微信", "Scan to connect on WeChat")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/[0.08] pt-7 text-[13px] text-white/50 sm:flex-row sm:items-center">
            <span>{pick(locale, siteCopy.footer.copyright)}</span>
            <div className="flex flex-wrap items-center gap-6">
              <Link
                href={href(locale, "/privacy")}
                className="inline-flex min-h-[34px] items-center hover:text-white"
              >
                {pick(locale, siteCopy.seo.privacy.title)}
              </Link>
              <Link
                href={href(locale, "/terms")}
                className="inline-flex min-h-[34px] items-center hover:text-white"
              >
                {pick(locale, siteCopy.seo.terms.title)}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
