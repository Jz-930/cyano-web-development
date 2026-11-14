"use client";

import {
  ViewTransition,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Globe, Menu, X } from "lucide-react";
import { type Locale, href, t } from "@/lib/locale";
import { Logo } from "./client-shared";

type LocalCopy = Record<string, Record<string, string>>;

function isPaperRoute(localPath: string) {
  return /^\/(privacy|terms|insights\/)/.test(localPath);
}

export function Header({
  locale,
  copy,
  solutionItems,
}: {
  locale: Locale;
  copy: LocalCopy;
  solutionItems: { slug: string; name: string; promise: string }[];
}) {
  const text = (section: string, key: string, _locale: Locale) =>
    copy[section][key];
  const pathname = usePathname();
  const localPath = pathname.replace(/^\/en(?=\/|$)/, "") || "/";

  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "paper">(() =>
    isPaperRoute(localPath) ? "paper" : "dark",
  );
  const [ox, setOx] = useState("calc(100% - 36px)");

  const openTimerRef = useRef<number>(0);
  const closeTimerRef = useRef<number>(0);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const chevronRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const clearTimers = () => {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = 0;
    }
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = 0;
    }
  };

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 801px)");
    const closeOnDesktop = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdown("");
    setTheme(isPaperRoute(localPath) ? "paper" : "dark");
  }, [pathname, localPath]);

  useEffect(() => {
    let raf = 0;
    const syncHeader = () => {
      raf = 0;
      setScrolled(window.scrollY > 8);
      const sections = document.querySelectorAll<HTMLElement>("[data-header]");
      let matched: "dark" | "paper" | null = null;
      for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 72 && rect.bottom > 24) {
          const val = sec.getAttribute("data-header");
          if (val === "dark" || val === "paper") matched = val;
        }
      }
      if (!matched && sections.length > 0 && window.scrollY <= 8) {
        const first = sections[0].getAttribute("data-header");
        if (first === "dark" || first === "paper") matched = first;
      }
      if (matched) {
        setTheme(matched);
      } else {
        setTheme(isPaperRoute(localPath) ? "paper" : "dark");
      }
    };

    const scheduleSync = () => {
      if (!raf) raf = window.requestAnimationFrame(syncHeader);
    };

    const io = new IntersectionObserver(scheduleSync, {
      rootMargin: "0px 0px -90% 0px",
      threshold: 0,
    });
    document
      .querySelectorAll<HTMLElement>("[data-header]")
      .forEach((el) => io.observe(el));

    syncHeader();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync, { passive: true });

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
    };
  }, [pathname, localPath]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (open) setOpen(false);
        if (dropdown) {
          const activeDropdown = dropdown;
          setDropdown("");
          chevronRefs.current[activeDropdown]?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, dropdown]);

  useEffect(() => {
    if (!open) return;
    const regions = [
      document.getElementById("main"),
      document.querySelector("footer"),
      document.querySelector(".closing"),
    ].filter(Boolean) as HTMLElement[];
    regions.forEach((el) => (el.inert = true));
    const toggle = toggleRef.current;
    document.querySelector<HTMLAnchorElement>(".mobile-nav a")?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const nodes = [
        ...document.querySelectorAll<HTMLElement>(
          ".menu-toggle, .mobile-nav a",
        ),
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
  ] as const;

  const hasDropdown = (path: string) =>
    path === "services" || path === "about";

  const handlePointerEnter = (path: string) => {
    clearTimers();
    if (hasDropdown(path)) {
      openTimerRef.current = window.setTimeout(() => {
        setDropdown(path);
      }, 80);
    } else if (dropdown) {
      closeTimerRef.current = window.setTimeout(() => {
        setDropdown("");
      }, 150);
    }
  };

  const handlePointerLeave = () => {
    clearTimers();
    closeTimerRef.current = window.setTimeout(() => {
      setDropdown("");
    }, 150);
  };

  const handleDropdownKeyDown = (
    e: ReactKeyboardEvent<HTMLDivElement>,
    path: string,
  ) => {
    if (!hasDropdown(path) || dropdown !== path) return;
    const panel = dropdownRefs.current[path];
    if (!panel) return;
    const items = Array.from(panel.querySelectorAll<HTMLAnchorElement>("a"));
    if (!items.length) return;
    const activeIdx = items.indexOf(
      document.activeElement as HTMLAnchorElement,
    );

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setDropdown("");
      chevronRefs.current[path]?.focus();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = activeIdx < 0 ? 0 : (activeIdx + 1) % items.length;
      items[next]?.focus();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev =
        activeIdx < 0
          ? items.length - 1
          : (activeIdx - 1 + items.length) % items.length;
      items[prev]?.focus();
      return;
    }
    if (e.key === "Home" && activeIdx >= 0) {
      e.preventDefault();
      items[0]?.focus();
      return;
    }
    if (e.key === "End" && activeIdx >= 0) {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  };

  const handleNavBlur = (e: FocusEvent<HTMLDivElement>, path: string) => {
    if (
      dropdown === path &&
      !e.currentTarget.contains(e.relatedTarget as Node | null)
    ) {
      setDropdown("");
    }
  };

  const handleToggleMobileMenu = () => {
    if (!open && toggleRef.current) {
      const r = toggleRef.current.getBoundingClientRect();
      setOx(`${Math.round(r.left + r.width / 2)}px`);
    }
    setOpen((prev) => !prev);
  };

  return (
    <header
      className={`site-header fixed [inset:0_0_auto] [z-index:var(--z-header)] [transition:background-color_var(--qtb),border-color_var(--qtb),color_var(--qtb)] ${scrolled ? " is-scrolled" : ""}${open ? " menu-open" : ""}`}
      data-theme={theme}
    >
      <div className="header-inner">
        <Link
          href={href(locale)}
          aria-label={t(locale, "Cyano 首页", "Cyano home")}
        >
          <Logo />
        </Link>
        <nav
          className="desktop-nav flex [@media(max-width:800px)]:hidden items-center"
          aria-label={t(locale, "主导航", "Main navigation")}
        >
          {nav.map(([path, label]) => {
            const isCurrent =
              localPath === "/" + path || localPath.startsWith("/" + path + "/");
            const isDropdownItem = hasDropdown(path);
            const isDropdownOpen = dropdown === path;
            return (
              <div
                key={path}
                className="nav-item"
                onPointerEnter={(e) => {
                  if (e.pointerType !== "touch") handlePointerEnter(path);
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType !== "touch") handlePointerLeave();
                }}
                onKeyDown={(e) => handleDropdownKeyDown(e, path)}
                onBlur={(e) => handleNavBlur(e, path)}
              >
                <div className="nav-item-row flex items-center [gap:var(--sp-1)] [color:inherit]">
                  <Link
                    href={href(locale, "/" + path)}
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    {label}
                    {isCurrent && (
                      <ViewTransition
                        name="nav-indicator"
                        share="morph"
                        default="none"
                      >
                        <span className="nav-indicator absolute [left:0] [right:0] [bottom:-2px] [height:2px] [border-radius:var(--qr2)] pointer-events-none" />
                      </ViewTransition>
                    )}
                  </Link>
                  {isDropdownItem && (
                    <button
                      ref={(el) => {
                        chevronRefs.current[path] = el;
                      }}
                      type="button"
                      aria-label={t(locale, "展开" + label, "Expand " + label)}
                      aria-expanded={isDropdownOpen}
                      onClick={() => {
                        clearTimers();
                        setDropdown(isDropdownOpen ? "" : path);
                      }}
                    >
                      <ChevronDown size={12} />
                    </button>
                  )}
                </div>
                {isDropdownItem && (
                  <div
                    ref={(el) => {
                      dropdownRefs.current[path] = el;
                    }}
                    className="nav-dropdown absolute [top:calc(100%_+_12px)] [left:-16px] [min-width:340px] [padding:8px] [border-radius:var(--r-card)]"
                    data-open={isDropdownOpen ? "true" : "false"}
                    inert={!isDropdownOpen}
                  >
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
            );
          })}
        </nav>
        <div className="header-actions flex items-center">
          <a
            className="language-switch"
            href={
              (locale === "zh" ? "/en" : "") +
                (localPath === "/" ? "" : localPath) || "/"
            }
            onClick={(event) => {
              event.currentTarget.href =
                ((locale === "zh" ? "/en" : "") +
                  (localPath === "/" ? "" : localPath) || "/") +
                window.location.search +
                window.location.hash;
            }}
          >
            {locale === "zh" ? "EN" : "中文"}
            <Globe size={13} />
          </a>
          <Link href={href(locale, "/contact#form")} className="button">
            {text("D.1", "主按钮", locale)}
            <ArrowUpRight size={18} />
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle hidden [@media(max-width:800px)]:flex [padding:var(--sp-2)] [@media(max-width:800px)]:[padding:var(--sp-1)] [transition:background-color_var(--qtf),border-color_var(--qtf),color_var(--qtf),opacity_var(--qtf),transform_var(--qtp)]"
            aria-label={t(
              locale,
              open ? "关闭菜单" : "打开菜单",
              open ? "Close menu" : "Open menu",
            )}
            aria-expanded={open}
            onClick={handleToggleMobileMenu}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <nav
        className="mobile-nav hidden [@media(max-width:800px)]:flex [@media(max-width:800px)]:flex-col [@media(max-width:800px)]:fixed [@media(max-width:800px)]:[left:0] [@media(max-width:800px)]:w-full [@media(max-width:800px)]:[background:var(--n1)] [@media(max-width:800px)]:[overflow:auto] [color:var(--light)]"
        data-open={open ? "true" : "false"}
        inert={!open}
        style={{ "--ox": ox } as CSSProperties}
        aria-label={t(locale, "移动导航", "Mobile navigation")}
      >
        {nav.map(([p, label], i) => (
          <Link
            key={p}
            href={href(locale, "/" + p)}
            style={{ "--i": i } as CSSProperties}
          >
            <span>0{i + 1}</span>
            {label}
            <ArrowUpRight size={22} />
          </Link>
        ))}
        <Link
          href={href(locale, "/insights")}
          style={{ "--i": nav.length } as CSSProperties}
        >
          {t(locale, "洞察", "Insights")}
          <ArrowUpRight size={22} />
        </Link>
        <Link
          className="button"
          href={href(locale, "/contact#form")}
          style={{ "--i": nav.length + 1 } as CSSProperties}
        >
          {text("D.1", "主按钮", locale)}
          <ArrowUpRight size={18} />
        </Link>
      </nav>
    </header>
  );
}
