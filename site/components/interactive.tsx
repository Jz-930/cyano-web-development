"use client";
import { useState, useEffect, useRef, FormEvent } from "react";
import queryDemo from "@/content/query-demo.json";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Check,
  LoaderCircle,
  Send,
  Globe,
  ShieldCheck,
  Search,
  Database,
} from "lucide-react";
import {
  Locale,
  t,
  href,
  text,
  solutions,
  cases,
  CaseStudy,
} from "@/lib/content";
import { Logo, CaseCard, solutionIcons } from "./ui";
export function Header({ locale }: { locale: Locale }) {
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
      className={`site-header ${scrolled ? "scrolled" : ""} ${open ? "menu-open" : ""}`}
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
                    ? solutions(locale).map((s) => (
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
export function AmbientFlow() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let id = 0,
      active = true,
      frame = 0;
    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
    });
    observer.observe(canvas);
    const draw = () => {
      id = requestAnimationFrame(draw);
      if (!active || document.hidden) return;
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 22; i++) {
        const p = (frame * 0.00055 + i / 22) % 1,
          x = canvas.width * (0.36 + p * 0.62),
          y = canvas.height * (0.88 - 0.5 * p + Math.sin(p * 5 + i) * 0.035);
        ctx.beginPath();
        ctx.fillStyle = `rgba(126,245,214,${Math.sin(p * Math.PI) * 0.5})`;
        ctx.arc(x, y, i % 4 === 0 ? 1.5 : 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    draw();
    return () => {
      cancelAnimationFrame(id);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas className="ambient-canvas" ref={ref} aria-hidden="true" />;
}
export function SolutionExplorer({ locale }: { locale: Locale }) {
  const [selected, setSelected] = useState(0);
  const items = solutions(locale),
    s = items[selected],
    Icon = solutionIcons[selected];
  return (
    <div className="solution-explorer">
      <div
        className="solution-list"
        role="tablist"
        aria-label={t(locale, "解决方案", "Solutions")}
      >
        {items.map((s, i) => (
          <button
            key={s.slug}
            role="tab"
            tabIndex={selected === i ? 0 : -1}
            onKeyDown={(e) => {
              const keys = [
                "ArrowRight",
                "ArrowLeft",
                "ArrowDown",
                "ArrowUp",
                "Home",
                "End",
              ];
              if (!keys.includes(e.key)) return;
              e.preventDefault();
              const next =
                e.key === "Home"
                  ? 0
                  : e.key === "End"
                    ? 3
                    : (i +
                        (e.key === "ArrowRight" || e.key === "ArrowDown"
                          ? 1
                          : 3)) %
                      4;
              setSelected(next);
              document.getElementById("solution-tab-" + next)?.focus();
            }}
            aria-selected={selected === i}
            aria-controls="solution-panel"
            id={"solution-tab-" + i}
            onMouseEnter={() => setSelected(i)}
            onFocus={() => setSelected(i)}
            onClick={() => setSelected(i)}
            className={selected === i ? "selected" : ""}
          >
            <span className="solution-number">0{i + 1}</span>
            <span>{s.name}</span>
            <ArrowUpRight size={25} />
          </button>
        ))}
      </div>
      <div
        className={`solution-panel solution-panel-${selected}`}
        id="solution-panel"
        role="tabpanel"
        aria-labelledby={"solution-tab-" + selected}
      >
        <div className="solution-panel-art">
          <img
            src={cases(locale)[selected].images[cases(locale)[selected].main]}
            alt={cases(locale)[selected].system}
            width="1600"
            height="1000"
            loading="lazy"
          />
        </div>
        <div className="solution-panel-copy">
          <h3>{s.promise}</h3>
          <p>{s.intro}</p>
          <div className="outputs">{s.outputs}</div>
          <Link
            className="text-link"
            href={href(locale, "/services/" + s.slug)}
          >
            {t(locale, "探索解决方案", "Explore solution")}
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}
export function CaseFilters({ locale }: { locale: Locale }) {
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("industry");
    if (p) setFilter(p);
  }, []);
  const all = cases(locale);
  const select = (v: string) => {
    setFilter(v);
    const url = new URL(window.location.href);
    v === "all"
      ? url.searchParams.delete("industry")
      : url.searchParams.set("industry", v);
    window.history.replaceState(null, "", url);
  };
  const visible = filter === "all" ? all : all.filter((c) => c.slug === filter);
  return (
    <>
      <div
        className="filter-row"
        aria-label={t(locale, "按行业筛选案例", "Filter cases by industry")}
      >
        <button onClick={() => select("all")} aria-pressed={filter === "all"}>
          {t(locale, "全部案例", "All cases")} <small>06</small>
        </button>
        {all.map((c) => (
          <button
            key={c.slug}
            aria-pressed={filter === c.slug}
            onClick={() => select(c.slug)}
          >
            {c.industry}
          </button>
        ))}
      </div>
      <div className="case-grid">
        {visible.map((c) => (
          <CaseCard key={c.slug} item={c} locale={locale} />
        ))}
      </div>
      {visible.length === 0 && (
        <div className="empty-state">
          <p>
            {t(locale, "没有符合筛选的案例。", "No cases match this filter.")}
          </p>
          <button className="button" onClick={() => select("all")}>
            {t(locale, "查看全部案例", "View all cases")}
          </button>
        </div>
      )}
    </>
  );
}
export function Gallery({ item, locale }: { item: CaseStudy; locale: Locale }) {
  const [current, setCurrent] = useState(item.main),
    [zoom, setZoom] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const launchRef = useRef<HTMLButtonElement>(null);
  const step = (d: number) =>
    setCurrent((v) => (v + d + item.images.length) % item.images.length);
  useEffect(() => {
    if (!zoom) return;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const f = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      if (e.key === "ArrowRight")
        setCurrent((v) => (v + 1) % item.images.length);
      if (e.key === "ArrowLeft")
        setCurrent((v) => (v - 1 + item.images.length) % item.images.length);
      if (e.key === "Tab") {
        const nodes =
          document.querySelectorAll<HTMLButtonElement>(".lightbox button");
        const a = [...nodes];
        const idx = a.indexOf(document.activeElement as HTMLButtonElement);
        e.preventDefault();
        a[(idx + (e.shiftKey ? -1 : 1) + a.length) % a.length]?.focus();
      }
    };
    window.addEventListener("keydown", f);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", f);
      launchRef.current?.focus();
    };
  }, [zoom, item.images.length]);
  return (
    <div className="gallery">
      <button
        ref={launchRef}
        className="gallery-main"
        onClick={() => setZoom(true)}
        aria-label={t(locale, "放大查看界面", "Enlarge screenshot")}
      >
        <img
          src={item.images[current]}
          alt={
            item.system +
            " — " +
            t(locale, "界面", "screen") +
            " " +
            (current + 1)
          }
          width="1440"
          height="900"
          loading="lazy"
        />
        <span>
          <Search size={17} />
          {t(locale, "点击放大", "Click to enlarge")}
        </span>
      </button>
      <div className="gallery-controls">
        <div className="gallery-thumbs">
          {item.images.map((im, i) => (
            <button
              key={im}
              className={current === i ? "selected" : ""}
              onClick={() => setCurrent(i)}
              aria-label={t(locale, "查看界面 ", "View screen ") + (i + 1)}
              aria-pressed={current === i}
            >
              <img src={im} alt="" width="160" height="100" loading="lazy" />
            </button>
          ))}
        </div>
        <div className="gallery-count">
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(item.images.length).padStart(2, "0")}
        </div>
      </div>
      {zoom && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={item.system}
          onClick={() => setZoom(false)}
        >
          <button
            ref={closeRef}
            className="lightbox-close"
            onClick={() => setZoom(false)}
            aria-label={t(locale, "关闭", "Close")}
          >
            <X />
          </button>
          <button
            className="lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label={t(locale, "上一张", "Previous")}
          >
            <ChevronLeft />
          </button>
          <img
            onClick={(e) => e.stopPropagation()}
            src={item.images[current]}
            alt={item.system}
          />
          <button
            className="lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label={t(locale, "下一张", "Next")}
          >
            <ChevronRight />
          </button>
          <p>
            {current + 1} / {item.images.length}
          </p>
        </div>
      )}
    </div>
  );
}
export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq-list">
      {items.map((f, i) => (
        <details key={i}>
          <summary>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {f.q}
            <Plus className="faq-plus" size={19} />
            <Minus className="faq-minus" size={19} />
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
export function ContactForm({ locale }: { locale: Locale }) {
  const [status, setStatus] = useState<
      "idle" | "sending" | "success" | "error"
    >("idle"),
    [error, setError] = useState(""),
    [caseName, setCaseName] = useState("");
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("case");
    const c = cases(locale).find((c) => c.slug === s);
    if (c) {
      setCaseName(c.title);
      const input = ref.current?.elements.namedItem(
        "inquiry",
      ) as HTMLSelectElement;
      input.value = "demo";
    }
  }, [locale]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(form), locale }),
      });
      const data = await r.json();
      if (!r.ok)
        throw new Error(
          data.error ||
            t(
              locale,
              "提交失败，请稍后重试。",
              "Unable to send. Please try again.",
            ),
        );
      setStatus("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setStatus("error");
    }
  }
  return status === "success" ? (
    <div className="form-success" role="status">
      <span className="success-icon">
        <Check size={34} />
      </span>
      <h2>
        {t(locale, "咨询已提交", "Inquiry submitted")}
      </h2>
      <p>{text("D.8", "提交成功", locale)}</p>
      <button className="button" onClick={() => setStatus("idle")}>
        {t(locale, "提交另一条咨询", "Send another inquiry")}
        <ArrowUpRight size={17} />
      </button>
    </div>
  ) : (
    <form className="contact-form" onSubmit={submit} ref={ref}>
      <h2>
        {t(locale, "聊聊你的业务场景", "Tell us what you want to change")}
      </h2>
      <p className="form-intro">
        {t(
          locale,
          "请描述目前的工作方式和希望改进的部分。",
          "Describe how you do the work today and what you want to improve.",
        )}
      </p>
      <div className="form-grid">
        {[
          ["name", "姓名", "Name", "text", true],
          ["company", "公司", "Company", "text", true],
          ["role", "职位", "Job title", "text", false],
          ["email", "工作邮箱", "Work email", "email", true],
          ["phone", "电话或微信", "Phone or WeChat", "text", false],
        ].map(([name, zh, en, type, required]) => (
          <label key={String(name)}>
            {t(locale, String(zh), String(en))}
            {required && <span> *</span>}
            <input
              name={String(name)}
              type={String(type)}
              required={Boolean(required)}
              autoComplete={
                name === "name"
                  ? "name"
                  : name === "email"
                    ? "email"
                    : name === "company"
                      ? "organization"
                      : name === "phone"
                        ? "tel"
                        : "organization-title"
              }
              maxLength={160}
            />
          </label>
        ))}
        <label>
          {t(locale, "期望启动时间", "Preferred start")}
          <select name="start">
            <option value="unsure">
              {t(locale, "还不确定", "Not sure yet")}
            </option>
            <option value="month">
              {t(locale, "1 个月内", "Within 1 month")}
            </option>
            <option value="quarter">
              {t(locale, "1–3 个月", "1–3 months")}
            </option>
            <option value="later">
              {t(locale, "3 个月以后", "Later than 3 months")}
            </option>
          </select>
        </label>
      </div>
      <label>
        {t(locale, "咨询类型", "Inquiry type")} <span>*</span>
        <select name="inquiry" required defaultValue="evaluate">
          {["custom", "pilot", "managed", "demo", "evaluate"].map((v, i) => (
            <option key={v} value={v}>
              {text("D.8", "咨询类型选项", locale).split(" · ")[i]}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t(locale, "业务场景描述", "Describe your use case")} <span>*</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          defaultValue={
            caseName
              ? t(locale, "我想了解案例：", "I would like to discuss: ") +
                caseName
              : ""
          }
          key={caseName}
          placeholder={text("D.8", "描述框提示", locale)}
        />
      </label>
      <div className="honey" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent">
        <input type="checkbox" name="consent" value="yes" required />
        <span>
          {t(locale, "我已阅读并同意", "I agree to the")}{" "}
          <Link href={href(locale, "/privacy")}>
            {t(locale, "《隐私政策》", "Privacy Policy")}
          </Link>
        </span>
      </label>
      {status === "error" && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button form-submit" disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <LoaderCircle className="spin" size={18} />
            {t(locale, "正在提交…", "Sending…")}
          </>
        ) : (
          <>
            {text("D.8", "提交按钮", locale)}
            <ArrowUpRight size={18} />
          </>
        )}
      </button>
      <p className="form-assurance">
        <ShieldCheck size={14} />
        {t(
          locale,
          "你的信息仅用于沟通与提供服务。",
          "Your information is only used to respond and provide services.",
        )}
      </p>
    </form>
  );
}
const demoQuestions = {
  zh: [
    "如何重置 VPN 密码？",
    "新员工如何申请电脑？",
    "如何申请软件安装权限？",
    "远程办公有哪些安全要求？",
    "邮箱无法登录怎么办？",
    "我遇到了其他问题",
  ],
  en: [
    "How do I reset my VPN password?",
    "How do new employees request a laptop?",
    "How can I request software installation?",
    "What are the security rules for remote work?",
    "I cannot access my email. What should I do?",
    "I need help with something else",
  ],
};
export function InteractiveDemo({
  locale,
  data = false,
}: {
  locale: Locale;
  data?: boolean;
}) {
  const [selected, setSelected] = useState(-1),
    [answer, setAnswer] = useState(""),
    [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );
  const questions = data
    ? locale === "zh"
      ? [
          "本月各区域销售额是多少？",
          "哪些商品库存低于安全线？",
          "近六个月销售趋势如何？",
          "华东地区最畅销的商品？",
          "哪些库存周转较慢？",
          "本月销量与上月相比？",
        ]
      : [
          "Sales by region this month?",
          "Which items are below safety stock?",
          "Sales trend over six months?",
          "Top products in the East region?",
          "Which inventory moves slowly?",
          "Sales compared with last month?",
        ]
    : demoQuestions[locale];
  const replies =
    locale === "zh"
      ? [
          "在企业身份门户进入“安全设置 → VPN”，通过多因素认证后设置新密码。新密码至少 12 位，不能与最近使用的密码相同。若验证设备丢失，请转交 IT 服务台核验身份。",
          "在服务门户提交“新员工设备”申请，填写部门、岗位和入职日期，由直属主管审批。设备交付前，IT 团队会完成加密、安全软件与账号配置。",
          "在软件目录查找已批准的软件并提交安装申请。未收录的软件需要补充用途与许可证信息，由安全团队审核。请勿使用个人账号下载未经审批的软件。",
          "使用公司批准的 VPN 和设备，开启磁盘加密与自动锁屏。不要把业务资料同步到个人云盘；共享文件前核对接收人的访问权限。",
          "先检查企业身份门户是否正常，确认账号未锁定，再尝试重置密码。若仍无法登录，提交错误时间和截图，避免在工单中写入密码。",
          "这个问题需要人工进一步核验。请在企业服务门户提交工单，说明故障时间、影响范围和已经尝试的操作。系统会保留本次对话作为处理背景。",
        ]
      : [
          "Open Security → VPN in your identity portal and verify with MFA before setting a new password. Use at least 12 characters and do not reuse recent passwords. If your verification device is lost, contact the service desk for identity verification.",
          "Submit a New Employee Equipment request with department, role and start date. Your manager approves it; IT configures encryption, security software and accounts before delivery.",
          "Find approved software in the catalog and submit an installation request. For unlisted software, include its purpose and license details for security review.",
          "Use approved devices and VPN, enable disk encryption and auto-lock. Keep company files out of personal cloud drives and verify sharing permissions.",
          "Check the identity portal, confirm the account is not locked, and try a password reset. If it still fails, submit the error time and a screenshot without including passwords.",
          "This needs human verification. Submit a service ticket with the time, impact and steps already attempted. Your conversation is retained as context for the support team.",
        ];
  function start(i: number) {
    if (timer.current) clearInterval(timer.current);
    setSelected(i);
    setAnswer("");
    setRunning(true);
    let n = 0;
    const full = data
      ? t(
          locale,
          "以下为该问题对应的示例数据与只读查询语句，可选择其他问题查看不同结果。",
          "Below are sample data and a read-only query for this question. Choose another question to see a different result.",
        )
      : replies[i];
    timer.current = setInterval(() => {
      n += 2;
      setAnswer(full.slice(0, n));
      if (n >= full.length) {
        clearInterval(timer.current!);
        setRunning(false);
      }
    }, 30);
  }
  return (
    <div className="interactive-demo">
      <div className="demo-top">
        <span className="demo-brand">
          <Database size={19} />
          {data ? "SmartDoc AI" : "Enterprise Wiki"}
        </span>
        <span className="demo-status">
          <i />
          {t(locale, "在线体验", "Interactive experience")}
        </span>
      </div>
      <div className="demo-body">
        <aside>
          <small>{t(locale, "试着问一个问题", "TRY A QUESTION")}</small>
          {questions.map((q, i) => (
            <button
              className={selected === i ? "selected" : ""}
              key={q}
              onClick={() => start(i)}
            >
              {q}
              <ArrowUpRight size={14} />
            </button>
          ))}
        </aside>
        <div className="demo-answer">
          {selected < 0 ? (
            <div className="demo-welcome">
              <div className="demo-orb">
                <Database size={32} />
              </div>
              <h3>
                {t(
                  locale,
                  "选择一个问题查看示例",
                  "Choose a sample question",
                )}
              </h3>
              <p>
                {t(
                  locale,
                  "下方展示预设回答、查询结果与来源说明。",
                  "See a preset answer, query result and source information.",
                )}
              </p>
            </div>
          ) : (
            <>
              <p className="demo-question">{questions[selected]}</p>
              <div className="answer-text">
                {answer}
                {running && <span className="typing-cursor" />}
              </div>
              {!running && data ? (
                <>
                  <table className="demo-table">
                    <thead>
                      <tr>
                        {queryDemo[selected].columns[locale].map((c) => (
                          <th key={c}>{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryDemo[selected].rows[locale].map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <details className="demo-sql">
                    <summary>
                      {t(
                        locale,
                        "查看生成的只读查询",
                        "View the generated read-only query",
                      )}
                    </summary>
                    <pre>{queryDemo[selected].sql}</pre>
                  </details>
                </>
              ) : (
                !running && (
                  <div className="citation">
                    <BookCitation />
                    {selected === 5
                      ? t(
                          locale,
                          "正式系统可将问题与处理记录转交人工。",
                          "The production system can pass the question and prior steps to a support agent.",
                        )
                      : t(
                          locale,
                          "来源：IT 服务制度 · 访问权限与操作指南 §" +
                            (selected + 1),
                          "Source: IT Service Policy · Access & Operations §" +
                            (selected + 1),
                        )}
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
      <p className="sr-only" role="status">
        {selected >= 0 && !running
          ? t(
              locale,
              "示例已显示，可以查看结果与来源。",
              "Example loaded. Review the result and sources.",
            )
          : ""}
      </p>
      <div className="demo-disclaimer">
        {text("D.1", "交互 Demo 说明小字", locale)}
      </div>
    </div>
  );
}
function BookCitation() {
  return <ShieldCheck size={16} />;
}
export function CopyLink({ locale }: { locale: Locale }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="text-link"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? <Check size={15} /> : <ArrowUpRight size={15} />}{" "}
      {t(
        locale,
        copied ? "链接已复制" : "复制文章链接",
        copied ? "Link copied" : "Copy article link",
      )}
    </button>
  );
}
