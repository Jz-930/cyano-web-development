"use client";
import { useState, useEffect, useRef, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ArrowRight, ChevronDown, Menu, X, Plus, Minus, ChevronLeft, ChevronRight, Check, LoaderCircle, Send, Globe, ShieldCheck, Search, Database } from "lucide-react";
import { type Locale, t, href } from "@/lib/locale";
import type { CaseStudy, solutions } from "@/lib/v1-content";
import { Logo, solutionIcons } from "./client-shared";
type LocalCopy = Record<string,Record<string,string>>;
export function ContactForm({ locale, copy,caseItems }: { locale: Locale; copy: LocalCopy;caseItems: Pick<CaseStudy,"slug"|"title">[] }) {
 const text = (section:string,key:string,_locale:Locale) => copy[section][key];
  const [status, setStatus] = useState<
      "idle" | "sending" | "success" | "error"
    >("idle"),
    [error, setError] = useState(""),
    [caseName, setCaseName] = useState("");
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("case");
    const c = caseItems.find((c) => c.slug === s);
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
      <p>{t(locale,"咨询已收到。我们会在 1 个工作日内回复。","Your inquiry has been received. We will reply within one business day.")}</p>
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
