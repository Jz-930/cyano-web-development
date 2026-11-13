"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Globe,
  Menu,
  X,
} from "lucide-react";
import {
  type Locale,
  href,
  pick,
  siteCopy,
  solutionsList,
  t,
} from "@/lib/content";
import { BrandLogo } from "./BrandLogo";

const DOMAIN_DOTS = ["#0B7A8C", "#1D4ED8", "#6D28D9", "#B45309"];

export function Header({ locale }: { locale: Locale }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<"" | "services" | "about">("");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() || "/";

  const localPath = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  const isDarkHeader = localPath === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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

  const switchTargetLocale: Locale = locale === "zh" ? "en" : "zh";
  const switchHref = href(switchTargetLocale, localPath === "/" ? "" : localPath);

  const headerShellClass = isDarkHeader
    ? mobileOpen
      ? "border-b border-white/[0.1] bg-[#02080E]"
      : scrolled
        ? "border-b border-white/[0.1] bg-[#000000]/92 backdrop-blur-xl"
        : "border-b border-white/[0.06] bg-[#000000]/80 backdrop-blur-md"
    : mobileOpen
      ? "border-b border-black/[0.09] bg-white"
      : scrolled
        ? "border-b border-black/[0.09] bg-white/95 backdrop-blur-xl"
        : "border-b border-black/[0.06] bg-white/90 backdrop-blur-md";

  const linkClass = (active: boolean) =>
    isDarkHeader
      ? active
        ? "text-[#22D3EE] font-medium"
        : "text-white/80 hover:text-white"
      : active
        ? "text-[#0B7A8C] font-semibold"
        : "text-[#2C3A47] hover:text-[#0B1520]";

  return (
    <>
      <header className={`sticky top-0 z-50 transition-colors duration-200 ${headerShellClass}`}>
      <div className="site-container flex h-[76px] items-center justify-between gap-6">
        <Link
          href={href(locale)}
          className="inline-flex min-h-[42px] items-center py-1"
          aria-label={t(locale, "Cyano · 澜屿智创", "Cyano Intelligence")}
        >
          <BrandLogo variant={isDarkHeader ? "dark" : "light"} size={32} />
        </Link>

        {/* Unboxed Gallery Desktop Navigation */}
        <nav
          aria-label={t(locale, "主导航", "Main navigation")}
          className="hidden items-center gap-2 lg:flex"
        >
          {navItems.map((item) => {
            const active =
              localPath === `/${item.key}` ||
              localPath.startsWith(`/${item.key}/`);

            if (!item.hasMenu) {
              return (
                <Link
                  key={item.key}
                  href={href(locale, `/${item.key}`)}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-[42px] items-center px-3.5 text-[14px] transition-colors ${linkClass(active)}`}
                >
                  {item.label}
                </Link>
              );
            }

            const menuKey = item.key as "services" | "about";
            const isOpen = dropdown === menuKey;

            return (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => setDropdown(menuKey)}
                onMouseLeave={() => setDropdown("")}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                    setDropdown("");
                  }
                }}
              >
                <div className="inline-flex items-center">
                  <Link
                    href={href(locale, `/${item.key}`)}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-[42px] items-center pl-3.5 pr-1 text-[14px] transition-colors ${linkClass(active || isOpen)}`}
                  >
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    aria-label={
                      isOpen
                        ? t(locale, `收起${item.label}子菜单`, `Collapse ${item.label} menu`)
                        : t(locale, `展开${item.label}子菜单`, `Expand ${item.label} menu`)
                    }
                    onClick={() => setDropdown(isOpen ? "" : menuKey)}
                    className={`inline-flex min-h-[42px] min-w-[28px] items-center justify-center pr-2 transition-colors ${
                      isDarkHeader
                        ? "text-white/65 hover:text-white"
                        : "text-black/55 hover:text-black"
                    }`}
                  >
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {isOpen && menuKey === "services" && (
                  <div className="absolute left-0 top-full pt-2">
                    <div className="w-[460px] rounded-2xl border border-black/10 bg-white p-5 text-[#0B1520] shadow-[0_28px_70px_-16px_rgba(11,21,32,0.22)]">
                      <div className="divide-y divide-black/[0.07]">
                        {solutionsList.map((sol, idx) => (
                          <Link
                            key={sol.slug}
                            href={href(locale, `/services/${sol.slug}`)}
                            className="group flex items-start gap-3.5 py-3.5 first:pt-1 last:pb-1"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2 h-2 w-2 shrink-0 rounded-full"
                              style={{ backgroundColor: DOMAIN_DOTS[idx % DOMAIN_DOTS.length] }}
                            />
                            <div>
                              <div className="text-[14px] font-medium text-[#0B1520] group-hover:text-[#0B7A8C]">
                                {pick(locale, sol.name)}
                              </div>
                              <div className="mt-0.5 text-[13px] leading-snug text-[#52606D]">
                                {pick(locale, sol.promise)}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-3 border-t border-black/10 pt-3">
                        <Link
                          href={href(locale, "/services")}
                          className="inline-flex min-h-[34px] items-center gap-1.5 text-[13px] font-medium text-[#0B1520] hover:text-[#0B7A8C]"
                        >
                          <span>{t(locale, "查看全部解决方案", "Explore all solutions")}</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {isOpen && menuKey === "about" && (
                  <div className="absolute left-0 top-full pt-2">
                    <div className="w-[240px] rounded-2xl border border-black/10 bg-white p-3 text-[#0B1520] shadow-[0_28px_70px_-16px_rgba(11,21,32,0.22)]">
                      {[
                        { path: "/about", label: pick(locale, siteCopy.nav.about) },
                        { path: "/insights", label: pick(locale, siteCopy.nav.insights) },
                        { path: "/contact", label: pick(locale, siteCopy.nav.contact) },
                      ].map((sub) => (
                        <Link
                          key={sub.path}
                          href={href(locale, sub.path)}
                          className="flex min-h-[40px] items-center justify-between rounded-lg px-3 text-[14px] text-[#0B1520] transition-colors hover:bg-[#F6FAFC] hover:text-[#0B7A8C]"
                        >
                          <span>{sub.label}</span>
                          <ArrowRight size={14} className="text-black/40" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href={switchHref}
            lang={switchTargetLocale === "zh" ? "zh-CN" : "en"}
            style={{
              fontFamily:
                'system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif',
            }}
            aria-label={t(locale, "切换到英文版", "Switch language to Chinese")}
            className={`inline-flex min-h-[40px] items-center gap-1.5 px-2.5 text-[13px] font-medium transition-colors ${
              isDarkHeader
                ? "text-white/80 hover:text-white"
                : "text-[#2C3A47] hover:text-[#0B1520]"
            }`}
          >
            <Globe size={14} className="opacity-75" />
            <span>{t(locale, "EN", "中文")}</span>
          </Link>

          <Link
            href={href(locale, "/contact#form")}
            className={
              isDarkHeader
                ? "btn-primary-mint hidden md:inline-flex"
                : "btn-primary-dark hidden md:inline-flex"
            }
            style={{ minHeight: "40px", padding: "0.5rem 1.2rem", fontSize: "13px" }}
          >
            <span>{pick(locale, siteCopy.nav.primaryCta)}</span>
            <ArrowUpRight size={15} />
          </Link>

          <button
            id="mobile-menu-toggle"
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={
              mobileOpen
                ? t(locale, "关闭导航菜单", "Close navigation menu")
                : t(locale, "打开导航菜单", "Open navigation menu")
            }
            onClick={() => setMobileOpen((prev) => !prev)}
            className={`inline-flex h-[42px] w-[42px] items-center justify-center rounded-full border lg:hidden ${
              isDarkHeader
                ? "border-white/25 text-white"
                : "border-black/15 text-[#0B1520]"
            }`}
          >
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>
      </header>

      {/* Mobile Navigation Drawer rendered OUTSIDE <header> so backdrop-blur never creates a 76px fixed containing block */}
      {mobileOpen && (
        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label={t(locale, "移动导航菜单", "Mobile navigation")}
          className="fixed inset-x-0 top-[76px] bottom-0 z-50 overflow-y-auto bg-[#02080E] px-6 py-8 text-white lg:hidden"
        >
          <div className="mx-auto flex max-w-lg flex-col divide-y divide-white/12">
            <div className="pb-5">
              <Link
                href={href(locale, "/services")}
                className="flex min-h-[44px] items-center justify-between text-[18px] font-normal text-white"
              >
                <span>{pick(locale, siteCopy.nav.solutions)}</span>
                <ArrowRight size={17} className="text-[#22D3EE]" />
              </Link>
              <div className="mt-2 flex flex-col gap-1 pl-3">
                {solutionsList.map((sol, idx) => (
                  <Link
                    key={sol.slug}
                    href={href(locale, `/services/${sol.slug}`)}
                    className="flex min-h-[40px] items-center gap-2.5 text-[15px] text-white/78 hover:text-white"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: DOMAIN_DOTS[idx % DOMAIN_DOTS.length] }}
                    />
                    <span>{pick(locale, sol.name)}</span>
                  </Link>
                ))}
              </div>
            </div>

            {[
              { path: "/cases", label: pick(locale, siteCopy.nav.cases) },
              { path: "/technology", label: pick(locale, siteCopy.nav.technology) },
              { path: "/engagement", label: pick(locale, siteCopy.nav.engagement) },
              { path: "/about", label: pick(locale, siteCopy.nav.about) },
              { path: "/insights", label: pick(locale, siteCopy.nav.insights) },
              { path: "/contact", label: pick(locale, siteCopy.nav.contact) },
            ].map((lnk) => (
              <Link
                key={lnk.path}
                href={href(locale, lnk.path)}
                className="flex min-h-[52px] items-center justify-between text-[17px] font-normal text-white/90"
              >
                <span>{lnk.label}</span>
                <ArrowRight size={16} className="text-[#22D3EE]/70" />
              </Link>
            ))}

            <div className="pt-7">
              <Link
                href={href(locale, "/contact#form")}
                className="btn-primary-mint w-full"
              >
                <span>{pick(locale, siteCopy.nav.primaryCta)}</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
