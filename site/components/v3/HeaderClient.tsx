"use client";
import { useState, useEffect, useRef, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ArrowRight, ChevronDown, Menu, X, Plus, Minus, ChevronLeft, ChevronRight, Check, LoaderCircle, Send, Globe, ShieldCheck, Search, Database } from "lucide-react";
import { type Locale, t, href } from "@/lib/locale";
import type { CaseStudy, solutions } from "@/lib/content-v4";
import { Logo, solutionIcons } from "./client-shared";
type LocalCopy = Record<string,Record<string,string>>;
export function Header({ locale, copy,solutionItems }: { locale: Locale; copy: LocalCopy;solutionItems: {slug:string;name:string;promise:string}[] }) {
 const text = (section:string,key:string,_locale:Locale) => copy[section][key];
  const [open, setOpen] = useState(false),
    [dropdown, setDropdown] = useState(""),
    [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const media = window.matchMedia('(min-width: 801px)');
    const closeOnDesktop = () => { if (media.matches) setOpen(false); };
    media.addEventListener('change', closeOnDesktop);
    return () => media.removeEventListener('change', closeOnDesktop);
  }, []);
  const localPath = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    setOpen(false);
    setDropdown("");
  }, [pathname]);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setDropdown("");
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
  useEffect(() => {
    if (!open) return;
    const regions = [
      document.getElementById("main"),
      document.querySelector("footer"),
      document.querySelector(".closing"),
    ].filter(Boolean) as HTMLElement[];
    regions.forEach((el) => (el.inert = true));
    const toggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
    document.querySelector<HTMLAnchorElement>(".mobile-nav a")?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const nodes = [
        ...document.querySelectorAll<HTMLElement>(".menu-toggle,.mobile-nav a"),
      ];
      const index = nodes.indexOf(document.activeElement as HTMLElement);
      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        nodes.at(-1)?.focus();
      } else if (!event.shiftKey && index === nodes.length - 1) {
        event.preventDefault();
        nodes[0]?.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      regions.forEach((el) => (el.inert = false));
      document.removeEventListener("keydown", trap);
      if (toggle?.getClientRects().length) toggle.focus();
    };
  }, [open]);
  const nav = [
    ["services", t(locale, "解决方案", "Solutions")],
    ["cases", t(locale, "案例", "Case studies")],
    ["technology", t(locale, "方法与技术", "Technology")],
    ["engagement", t(locale, "合作方式", "How we work")],
    ["about", t(locale, "关于我们", "About")],
  ];
  return (
    <header
      className={`site-header ${scrolled || /^\/(privacy|terms|insights\/)/.test(localPath) ? "scrolled" : ""} ${open ? "menu-open" : ""}`}
    >
      <div className="header-inner">
        <Link
          href={href(locale)}
          aria-label={t(locale, "Cyano 首页", "Cyano home")}
        >
          <Logo />
        </Link>
        <nav
          className="desktop-nav"
          aria-label={t(locale, "主导航", "Main navigation")}
        >
          {nav.map(([path, label]) => (
            <div
              key={path}
              className="nav-item"
              onMouseEnter={() => setDropdown(path)}
              onMouseLeave={() => setDropdown("")}
            >
              <div className="nav-item-row">
                <Link
                  className={localPath.startsWith("/" + path) ? "active" : ""}
                  href={href(locale, "/" + path)}
                >
                  {label}
                </Link>
                {["services", "about"].includes(path) && (
                  <button
                    aria-label={t(locale, "展开" + label, "Expand " + label)}
                    aria-expanded={dropdown === path}
                    onClick={() => setDropdown(dropdown === path ? "" : path)}
                  >
                    <ChevronDown size={12} />
                  </button>
                )}
              </div>
              {["services", "about"].includes(path) && dropdown === path && (
                <div className="nav-dropdown">
                  {path === "services"
                    ? solutionItems.map((s) => (
                        <Link
                          href={href(locale, "/services/" + s.slug)}
                          key={s.slug}
                        >
                          <strong>{s.name}</strong>
                          <span>{s.promise}</span>
                        </Link>
                      ))
                    : ["about", "insights", "contact"].map((p, i) => (
                        <Link key={p} href={href(locale, "/" + p)}>
                          {t(
                            locale,
                            ["团队介绍", "洞察", "联系我们"][i],
                            ["Team", "Insights", "Contact"][i],
                          )}
                        </Link>
                      ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="language-switch"
            href={
              ((locale === "zh" ? "/en" : "") +
                (localPath === "/" ? "" : localPath) || "/")
            }
            onClick={event=>{event.currentTarget.href=((locale === "zh" ? "/en" : "")+(localPath === "/" ? "" : localPath)||"/")+window.location.search+window.location.hash}}
          >
            {locale === "zh" ? "EN" : "中文"}
            <Globe size={13} />
          </a>
          <Link href={href(locale, "/contact#form")} className="header-cta">
            {text("D.1", "主按钮", locale)}
            <ArrowUpRight size={15} />
          </Link>
          <button
            className="menu-toggle"
            aria-label={t(
              locale,
              open ? "关闭菜单" : "打开菜单",
              open ? "Close menu" : "Open menu",
            )}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          className="mobile-nav"
          aria-label={t(locale, "移动导航", "Mobile navigation")}
        >
          {nav.map(([p, label], i) => (
            <Link key={p} href={href(locale, "/" + p)}>
              <span>0{i + 1}</span>
              {label}
              <ArrowUpRight size={22} />
            </Link>
          ))}
          <Link href={href(locale, "/insights")}>
            {t(locale, "洞察", "Insights")}
            <ArrowUpRight />
          </Link>
          <Link className="button" href={href(locale, "/contact#form")}>
            {text("D.1", "主按钮", locale)}
            <ArrowUpRight />
          </Link>
        </nav>
      )}
    </header>
  );
}
