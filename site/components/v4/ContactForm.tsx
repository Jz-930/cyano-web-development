"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, LoaderCircle, ShieldCheck } from "lucide-react";
import { href, t, type Locale } from "@/lib/locale";

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

export type ContactFormProps = {
  locale: Locale;
  inquiryOptions: string[];
  placeholder: string;
  submitLabel: string;
  caseBookTitle: string;
  caseItems: { slug: string; title: string }[];
};

export function ContactForm({
  locale,
  inquiryOptions,
  placeholder,
  submitLabel,
  caseBookTitle,
  caseItems,
}: ContactFormProps) {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [prefillText, setPrefillText] = useState("");
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
    const params = new URLSearchParams(window.location.search);
    const s = params.get("case");
    const topic = params.get("topic");
    const c = caseItems.find((item) => item.slug === s);
    if (c) {
      setPrefillText(
        t(locale, "我想了解案例：", "I would like to discuss: ") + c.title,
      );
      const input = ref.current?.elements.namedItem(
        "inquiry",
      ) as HTMLSelectElement | null;
      if (input) input.value = "demo";
    } else if (topic === "casebook") {
      setPrefillText(caseBookTitle);
      const input = ref.current?.elements.namedItem(
        "inquiry",
      ) as HTMLSelectElement | null;
      if (input) input.value = "demo";
    }
  }, [locale, caseItems, caseBookTitle]);

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
    <div className="form-success card" role="status">
      <span className="success-icon [width:56px] [height:56px] [border-radius:var(--r-chip)] [background:var(--p3)] [border:1px_solid_var(--cyan-40)] [color:var(--link)] grid [place-items:center]" aria-hidden="true">
        <Check size={30} />
      </span>
      <h2 className="h2">{t(locale, "咨询已提交", "Inquiry submitted")}</h2>
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
    <form className="contact-form card" onSubmit={submit} ref={ref} noValidate>
      <h2 className="h2">
        {t(locale, "聊聊你的业务场景", "Tell us what you want to change")}
      </h2>
      <p className="form-intro [margin:calc(var(--sp-3)_*_-1)_0_0] [color:var(--muted)]">
        {t(
          locale,
          "请描述目前的工作方式和希望改进的部分。",
          "Describe how you do the work today and what you want to improve.",
        )}
      </p>
      <div className="form-grid grid [grid-template-columns:repeat(2,minmax(0,1fr))] [@media(max-width:720px)]:[grid-template-columns:minmax(0,1fr)] [gap:var(--sp-4)]">
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
              {required ? <span> *</span> : null}
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
              {required ? (
                <Check
                  className="field-valid-icon"
                  size={16}
                  aria-hidden="true"
                />
              ) : null}
              {fieldErrors[k] ? (
                <p id={`err-${k}`} className="field-error">
                  {fieldErrors[k]}
                </p>
              ) : null}
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
          {fieldErrors.start ? (
            <p id="err-start" className="field-error">
              {fieldErrors.start}
            </p>
          ) : null}
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
              {inquiryOptions[i]}
            </option>
          ))}
        </select>
        {fieldErrors.inquiry ? (
          <p id="err-inquiry" className="field-error">
            {fieldErrors.inquiry}
          </p>
        ) : null}
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
          defaultValue={prefillText}
          key={prefillText}
          placeholder={placeholder}
        />
        <Check className="field-valid-icon" size={16} aria-hidden="true" />
        {fieldErrors.message ? (
          <p id="err-message" className="field-error">
            {fieldErrors.message}
          </p>
        ) : null}
      </label>
      <div className="honey absolute [width:1px] [height:1px] overflow-hidden" aria-hidden="true">
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
      {fieldErrors.consent ? (
        <p id="err-consent" className="field-error consent-error">
          {fieldErrors.consent}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="form-error m-0 [padding:var(--sp-3)_var(--sp-4)] [border-radius:var(--r-control)] [background:var(--risk-12)] [border:1px_solid_var(--risk)] [color:var(--risk-ink)] [font-size:14px]" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        className="button form-submit [align-self:flex-start]"
        disabled={status === "sending"}
      >
        {status === "sending" ? (
          <>
            <LoaderCircle className="spin" size={18} />
            {t(locale, "正在提交…", "Sending…")}
          </>
        ) : (
          <>
            {submitLabel}
            <ArrowUpRight size={18} />
          </>
        )}
      </button>
      <p className="form-assurance inline-flex items-center [gap:var(--sp-2)] m-0 [font-size:13px] [color:var(--muted)]">
        <ShieldCheck size={14} aria-hidden="true" />
        <span>
          {t(
            locale,
            "你的信息仅用于沟通与提供服务。",
            "Your information is only used to respond and provide services.",
          )}
        </span>
      </p>
    </form>
  );
}
