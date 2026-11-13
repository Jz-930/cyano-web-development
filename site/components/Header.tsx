"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ChevronDown,
  Globe,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import {
  type Locale,
  href,
  pick,
  t,
  siteCopy,
  solutionsList,
} from "@/lib/content";
import { BrandLogo } from "./BrandLogo";

export function Header({ locale }: { locale: Locale }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<"" | "services" | "about">("");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() || "/";

  const localPath = pathname.replace(/^\/en(?=\/|$)/, "") || "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onDesktop = () => {
      if (mq.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", onDesktop);
    return () => mq.removeEventListener("change", onDesktop);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdown("");
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setDropdown("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Accessible focus trap & background inert lock when mobile nav is open
  useEffect(() => {
    if (!mobileOpen) return;
    const regions = [
      document.getElementById("main"),
      document.getElementById("site-closing-cta"),
      document.getElementById("site-footer"),
    ].filter(Boolean) as HTMLElement[];
    regions.forEach((el) => {
      el.inert = true;
    });

    const toggleBtn = document.getElementById("mobile-menu-toggle");
    const firstLink = document.querySelector<HTMLElement>(
      "#mobile-navigation-drawer a"
    );
    firstLink?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = [
        ...document.querySelectorAll<HTMLElement>(
          "#mobile-menu-toggle, #mobile-navigation-drawer a"
        ),
      ];
      if (!focusables.length) return;
      const idx = focusables.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && idx <= 0) {
        e.preventDefault();
        focusables.at(-1)?.focus();
      } else if (!e.shiftKey && idx === focusables.length - 1) {
        e.preventDefault();
        focusables[0]?.focus();
      }
    };
    document.addEventListener("keydown", trap);

    return () => {
      regions.forEach((el) => {
        el.inert = false;
      });
      document.removeEventListener("keydown", trap);
      if (toggleBtn && toggleBtn.getClientRects().length > 0) {
        toggleBtn.focus();
      }
    };
  }, [mobileOpen]);

  const navItems = [
    { key: "services", label: pick(locale, siteCopy.nav.solutions), hasMenu: true as const },
    { key: "cases", label: pick(locale, siteCopy.nav.cases), hasMenu: false as const },
    { key: "technology", label: pick(locale, siteCopy.nav.technology), hasMenu: false as const },
    { key: "engagement", label: pick(locale, siteCopy.nav.engagement), hasMenu: false as const },
    { key: "about", label: pick(locale, siteCopy.nav.about), hasMenu: true as const },
  ];

  const targetLocaleHref =
    locale === "zh"
      ? localPath === "/"
        ? "/en"
        : `/en${localPath}`
      : localPath;

  return (
    <header
      className={`site-header-dark sticky top-0 z-50 transition-colors duration-200 ${
        scrolled || mobileOpen
          ? "border-b border-[#7EF5D6]/18 bg-[#030709]/92 backdrop-blur-xl"
          : "border-b border-white/8 bg-[#030709]/82 backdrop-blur-md"
      }`}
    >
      <div className="site-container flex h-[72px] items-center justify-between gap-4">
        <Link
          href={href(locale)}
          aria-label={t(locale, "Cyano 首页", "Cyano Home")}
          className="inline-flex min-h-[40px] items-center rounded-md py-1"
        >
          <BrandLogo tone="dark" />
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label={t(locale, "主导航", "Main navigation")}
          className="hidden lg:flex lg:items-center lg:gap-1"
        >
          {navItems.map((item) => {
            const isActive =
              localPath === `/${item.key}` ||
              localPath.startsWith(`/${item.key}/`) ||
              (item.key === "about" &&
                (localPath.startsWith("/insights") || localPath === "/contact"));
            const menuKey = item.key as "services" | "about";

            return (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => item.hasMenu && setDropdown(menuKey)}
                onMouseLeave={() => item.hasMenu && setDropdown("")}
              >
                <div className="flex items-center">
                  <Link
                    href={href(locale, `/${item.key}`)}
                    className={`inline-flex min-h-[40px] items-center rounded-lg px-3.5 text-[14px] font-medium transition-colors ${
                      isActive
                        ? "text-[#7EF5D6]"
                        : "text-[#D7EAEB] hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.hasMenu && (
                    <button
                      type="button"
                      aria-label={t(
                        locale,
                        `展开${item.label}子菜单`,
                        `Toggle ${item.label} menu`
                      )}
                      aria-expanded={dropdown === menuKey}
                      onClick={() =>
                        setDropdown(dropdown === menuKey ? "" : menuKey)
                      }
                      className="inline-flex h-[38px] w-[30px] items-center justify-center rounded-md text-[#93B5B9] hover:text-white"
                    >
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          dropdown === menuKey ? "rotate-180 text-[#7EF5D6]" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {item.hasMenu && dropdown === menuKey && (
                  <div className="absolute left-0 top-full pt-2">
                    {menuKey === "services" ? (
                      <div className="w-[380px] rounded-2xl border border-[#7EF5D6]/24 bg-[#061217]/98 p-3 shadow-2xl backdrop-blur-xl">
                        <div className="grid gap-1">
                          {solutionsList.map((sol, idx) => (
                            <Link
                              key={sol.slug}
                              href={href(locale, `/services/${sol.slug}`)}
                              className="group flex flex-col gap-0.5 rounded-xl px-3.5 py-2.5 transition-colors hover:bg-[#0D252E]"
                            >
                              <span className="flex items-center justify-between text-[14px] font-semibold text-[#F2FAF9] group-hover:text-[#7EF5D6]">
                                <span>
                                  <span className="font-mono-tech mr-2 text-[12px] text-[#52C7CC]">
                                    0{idx + 1}
                                  </span>
                                  {pick(locale, sol.name)}
                                </span>
                                <ArrowRight
                                  size={14}
                                  className="opacity-0 transition-opacity group-hover:opacity-100"
                                />
                              </span>
                              <span className="pl-6 text-[13px] text-[#93B5B9]">
                                {pick(locale, sol.promise)}
                              </span>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-2 border-t border-white/10 pt-2">
                          <Link
                            href={href(locale, "/services")}
                            className="flex min-h-[38px] items-center justify-between rounded-lg px-3.5 text-[13px] font-semibold text-[#7EF5D6] hover:bg-[#0D252E]"
                          >
                            <span>{pick(locale, siteCopy.nav.allSolutions)}</span>
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="w-[220px] rounded-2xl border border-[#7EF5D6]/24 bg-[#061217]/98 p-2.5 shadow-2xl backdrop-blur-xl">
                        {[
                          { path: "/about", label: pick(locale, siteCopy.nav.team) },
                          { path: "/insights", label: pick(locale, siteCopy.nav.insights) },
                          { path: "/contact", label: pick(locale, siteCopy.nav.contact) },
                        ].map((sub) => (
                          <Link
                            key={sub.path}
                            href={href(locale, sub.path)}
                            className="flex min-h-[40px] items-center justify-between rounded-xl px-3.5 text-[14px] font-medium text-[#E4F3F4] transition-colors hover:bg-[#0D252E] hover:text-[#7EF5D6]"
                          >
                            <span>{sub.label}</span>
                            <ArrowUpRight size={14} className="text-[#52C7CC]" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          <a
            href={targetLocaleHref}
            onClick={(e) => {
              e.currentTarget.href =
                targetLocaleHref + window.location.search + window.location.hash;
            }}
            style={{
              fontFamily:
                'system-ui, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
            }}
            aria-label={t(
              locale,
              "Switch language to English",
              "切换为中文页面"
            )}
            className="inline-flex min-h-[38px] min-w-[44px] items-center justify-center gap-1.5 rounded-full border border-white/16 bg-white/5 px-3 text-[13px] font-medium text-[#E4F3F4] transition-colors hover:border-[#7EF5D6]/50 hover:text-[#7EF5D6]"
          >
            <Globe size={14} className="text-[#7EF5D6]" />
            <span>{locale === "zh" ? "EN" : "中文"}</span>
          </a>

          <Link
            href={href(locale, "/contact#form")}
            className="hidden sm:inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-[#7EF5D6] px-4 py-2 text-[13px] font-bold text-[#04191E] shadow-[0_6px_20px_-4px_rgba(126,245,214,0.45)] transition-transform hover:-translate-y-0.5 hover:bg-[#95F8DF]"
          >
            <span>{pick(locale, siteCopy.nav.primaryCta)}</span>
            <ArrowUpRight size={15} />
          </Link>

          <button
            id="mobile-menu-toggle"
            type="button"
            aria-label={t(
              locale,
              mobileOpen ? "关闭导航菜单" : "打开导航菜单",
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            )}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-white/16 bg-white/5 text-[#F2FAF9] lg:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile full-height navigation drawer */}
      {mobileOpen && (
        <nav
          id="mobile-navigation-drawer"
          aria-label={t(locale, "移动端主导航", "Mobile navigation")}
          className="fixed inset-x-0 top-[72px] bottom-0 z-50 overflow-y-auto bg-[#030709]/98 px-6 py-8 backdrop-blur-2xl lg:hidden"
        >
          <div className="mx-auto flex max-w-lg flex-col gap-2">
            {[
              ...navItems.map((n) => ({ path: `/${n.key}`, label: n.label })),
              { path: "/insights", label: pick(locale, siteCopy.nav.insights) },
              { path: "/contact", label: pick(locale, siteCopy.nav.contact) },
            ].map((item, idx) => (
              <Link
                key={item.path}
                href={href(locale, item.path)}
                className="flex min-h-[52px] items-center justify-between rounded-xl border border-white/10 bg-[#08161B] px-4 py-3 text-[16px] font-semibold text-[#F2FAF9] active:border-[#7EF5D6]"
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono-tech text-[12px] text-[#7EF5D6]">
                    0{idx + 1}
                  </span>
                  <span>{item.label}</span>
                </span>
                <ArrowUpRight size={18} className="text-[#52C7CC]" />
              </Link>
            ))}

            <div className="mt-5">
              <Link
                href={href(locale, "/contact#form")}
                className="btn-primary-mint w-full"
              >
                <span>{pick(locale, siteCopy.nav.primaryCta)}</span>
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
