"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, LoaderCircle, ShieldCheck } from "lucide-react";
import { type Locale, href, t } from "@/lib/locale";
import type { CaseStudy } from "@/lib/content-v4";

type LocalCopy = Record<string, Record<string, string>>;
type FieldError = { name: string; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isRequiredFieldValid(
  el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
): boolean {
  if (!el.required) return false;
  if (el.type === "checkbox") return (el as HTMLInputElement).checked;
  const v = el.value.trim();
  if (!v) return false;
  if (el.type === "email") return EMAIL_RE.test(v);
  if (el.tagName === "TEXTAREA") return v.length >= 10;
  return true;
}

function validate(form: HTMLFormElement, locale: Locale): FieldError[] {
  const errors: FieldError[] = [];
  const zh = locale === "zh";
  for (const el of Array.from(form.elements) as (
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement
  )[]) {
    if (!el.name || el.disabled) continue;
    if (el.type === "checkbox") {
      if (
        (el as HTMLInputElement).required &&
        !(el as HTMLInputElement).checked
      ) {
        errors.push({
          name: el.name,
          message: zh
            ? "请先阅读并同意隐私政策。"
            : "Please accept the Privacy Policy to continue.",
        });
      }
      continue;
    }
    const v = el.value.trim();
    if (el.required && !v) {
      errors.push({
        name: el.name,
        message: zh ? "请填写这一项。" : "Please fill in this field.",
      });
      continue;
    }
    if (el.type === "email" && v && !EMAIL_RE.test(v)) {
      errors.push({
        name: el.name,
        message: zh
          ? "请填写有效的邮箱地址。"
          : "Please enter a valid email address.",
      });
    }
  }
  return errors;
}

export function ContactForm({
  locale,
  copy,
  caseItems,
}: {
  locale: Locale;
  copy: LocalCopy;
  caseItems: Pick<CaseStudy, "slug" | "title">[];
}) {
  const text = (section: string, key: string, _locale: Locale) =>
    copy[section][key];
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [caseName, setCaseName] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [validFields, setValidFields] = useState<Record<string, boolean>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {},
  );

  const removeError = (key: string) =>
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const handleBlur = (
    el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  ) => {
    const key = el.name;
    if (!key) return;
    setTouchedFields((prev) => ({ ...prev, [key]: true }));
    setValidFields((prev) => ({
      ...prev,
      [key]: isRequiredFieldValid(el),
    }));
  };

  const clearIfValid = (
    el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  ) => {
    const key = el.name;
    if (touchedFields[key]) {
      setValidFields((prev) => ({
        ...prev,
        [key]: isRequiredFieldValid(el),
      }));
    }
    if (!fieldErrors[key]) return;
    if (el.type === "checkbox") {
      if ((el as HTMLInputElement).checked) removeError(key);
      return;
    }
    const v = el.value.trim();
    if (el.type === "email") {
      if (v && EMAIL_RE.test(v)) removeError(key);
      return;
    }
    if (v) removeError(key);
  };

  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("case");
    const c = caseItems.find((item) => item.slug === s);
    if (c) {
      setCaseName(c.title);
      const input = ref.current?.elements.namedItem(
        "inquiry",
      ) as HTMLSelectElement | null;
      if (input) input.value = "demo";
    }
  }, [locale, caseItems]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate(e.currentTarget, locale);
    if (errs.length) {
      setFieldErrors(Object.fromEntries(errs.map((x) => [x.name, x.message])));
      const first = e.currentTarget.elements.namedItem(
        errs[0].name,
      ) as HTMLElement | null;
      first?.focus();
      return;
    }
    setFieldErrors({});
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(form), locale }),
      });
      const data = await r.json();
      if (!r.ok) {
        throw new Error(
          data.error ||
            t(
              locale,
              "提交失败，请稍后重试。",
              "Unable to send. Please try again.",
            ),
        );
      }
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setStatus("error");
    }
  }

  return status === "success" ? (
    <div className="form-success" role="status">
      <span className="success-icon">
        <Check size={34} />
      </span>
      <h2>{t(locale, "咨询已提交", "Inquiry submitted")}</h2>
      <p>
        {t(
          locale,
          "咨询已收到。我们会在 1 个工作日内回复。",
          "Your inquiry has been received. We will reply within one business day.",
        )}
      </p>
      <button
        type="button"
        className="button"
        onClick={() => setStatus("idle")}
      >
        {t(locale, "提交另一条咨询", "Send another inquiry")}
        <ArrowUpRight size={18} />
      </button>
    </div>
  ) : (
    <form className="contact-form" onSubmit={submit} ref={ref} noValidate>
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
        {(
          [
            ["name", "姓名", "Name", "text", true],
            ["company", "公司", "Company", "text", true],
            ["role", "职位", "Job title", "text", false],
            ["email", "工作邮箱", "Work email", "email", true],
            ["phone", "电话或微信", "Phone or WeChat", "text", false],
          ] as const
        ).map(([name, zh, en, type, required]) => {
          const k = String(name);
          const isValid = Boolean(required && validFields[k] && !fieldErrors[k]);
          return (
            <label
              key={k}
              className="field"
              data-valid={isValid ? "true" : undefined}
            >
              {t(locale, String(zh), String(en))}
              {required && <span> *</span>}
              <input
                name={k}
                type={String(type)}
                required={Boolean(required)}
                aria-invalid={fieldErrors[k] ? true : undefined}
                aria-describedby={fieldErrors[k] ? `err-${k}` : undefined}
                onInput={(e) => clearIfValid(e.currentTarget)}
                onBlur={(e) => handleBlur(e.currentTarget)}
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
              {required && (
                <Check
                  className="field-valid-icon"
                  size={16}
                  aria-hidden="true"
                />
              )}
              {fieldErrors[k] && (
                <p id={`err-${k}`} className="field-error">
                  {fieldErrors[k]}
                </p>
              )}
            </label>
          );
        })}
        <label className="field">
          {t(locale, "期望启动时间", "Preferred start")}
          <select
            name="start"
            aria-invalid={fieldErrors.start ? true : undefined}
            aria-describedby={fieldErrors.start ? "err-start" : undefined}
            onChange={(e) => clearIfValid(e.currentTarget)}
          >
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
          {fieldErrors.start && (
            <p id="err-start" className="field-error">
              {fieldErrors.start}
            </p>
          )}
        </label>
      </div>
      <label className="field">
        {t(locale, "咨询类型", "Inquiry type")} <span>*</span>
        <select
          name="inquiry"
          required
          defaultValue="evaluate"
          aria-invalid={fieldErrors.inquiry ? true : undefined}
          aria-describedby={fieldErrors.inquiry ? "err-inquiry" : undefined}
          onChange={(e) => clearIfValid(e.currentTarget)}
        >
          {["custom", "pilot", "managed", "demo", "evaluate"].map((v, i) => (
            <option key={v} value={v}>
              {text("D.8", "咨询类型选项", locale).split(" · ")[i]}
            </option>
          ))}
        </select>
        {fieldErrors.inquiry && (
          <p id="err-inquiry" className="field-error">
            {fieldErrors.inquiry}
          </p>
        )}
      </label>
      <label
        className="field"
        data-valid={
          validFields.message && !fieldErrors.message ? "true" : undefined
        }
      >
        {t(locale, "业务场景描述", "Describe your use case")} <span>*</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldErrors.message ? "err-message" : undefined}
          onInput={(e) => clearIfValid(e.currentTarget)}
          onBlur={(e) => handleBlur(e.currentTarget)}
          defaultValue={
            caseName
              ? t(locale, "我想了解案例：", "I would like to discuss: ") +
                caseName
              : ""
          }
          key={caseName}
          placeholder={text("D.8", "描述框提示", locale)}
        />
        <Check className="field-valid-icon" size={16} aria-hidden="true" />
        {fieldErrors.message && (
          <p id="err-message" className="field-error">
            {fieldErrors.message}
          </p>
        )}
      </label>
      <div className="honey" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="check">
        <input
          type="checkbox"
          name="consent"
          value="yes"
          required
          aria-invalid={fieldErrors.consent ? true : undefined}
          aria-describedby={fieldErrors.consent ? "err-consent" : undefined}
          onChange={(e) => clearIfValid(e.currentTarget)}
        />
        <span className="check-box" aria-hidden="true">
          <svg viewBox="0 0 14 14">
            <path d="M2 7.5l3 3 7-7" />
          </svg>
        </span>
        <span>
          {t(locale, "我已阅读并同意", "I agree to the")}{" "}
          <Link href={href(locale, "/privacy")}>
            {t(locale, "《隐私政策》", "Privacy Policy")}
          </Link>
        </span>
      </label>
      {fieldErrors.consent && (
        <p
          id="err-consent"
          className="field-error"
          style={{ marginTop: "-12px", marginBottom: "18px" }}
        >
          {fieldErrors.consent}
        </p>
      )}
      {status === "error" && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="button form-submit"
        disabled={status === "sending"}
      >
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
