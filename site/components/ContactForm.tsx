"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  LoaderCircle,
  Minus,
  Plus,
  ShieldCheck,
} from "lucide-react";
import {
  type Bilingual,
  type Locale,
  casesList,
  href,
  pick,
  siteCopy,
  t,
} from "@/lib/content";

export function FAQList({
  items,
  locale,
}: {
  items: { q: Bilingual; a: Bilingual }[];
  locale: Locale;
}) {
  return (
    <div className="border-t border-black/12">
      {items.map((item, idx) => (
        <details key={idx} open={idx === 0} className="faq-item group">
          <summary className="flex min-h-[64px] items-center justify-between gap-6 py-5">
            <span className="flex items-start gap-4 text-left">
              <span className="font-mono-tech mt-1 text-[12px] font-medium text-[#0B7A8C]">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="text-[18px] font-normal leading-snug text-[#111111]">
                {pick(locale, item.q)}
              </span>
            </span>
            <span className="shrink-0 text-[#111111]">
              <Plus size={18} strokeWidth={1.5} className="block group-open:hidden" />
              <Minus size={18} strokeWidth={1.5} className="hidden group-open:block" />
            </span>
          </summary>
          <div className="pb-6 pl-9 pr-4 text-[15px] leading-relaxed text-[#444444]">
            {pick(locale, item.a)}
          </div>
        </details>
      ))}
    </div>
  );
}

/**
 * ContactForm (W-09 + M-04):
 * Gallery-white Swiss-modernist intake form with URL query param prefill (?inquiry= & ?case=),
 * friendly localized network/validation errors, and accessible focus management.
 */
export function ContactForm({ locale }: { locale: Locale }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [inquiry, setInquiry] = useState<string>("evaluate");
  const [defaultMsg, setDefaultMsg] = useState<string>("");

  const formRef = useRef<HTMLFormElement>(null);
  const statusBannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inq = params.get("inquiry");
    if (inq && ["custom", "pilot", "managed", "demo", "evaluate"].includes(inq)) {
      setInquiry(inq);
    }
    const caseSlug = params.get("case");
    if (caseSlug) {
      const matched = casesList.find((c) => c.slug === caseSlug);
      if (matched) {
        setInquiry("demo");
        setDefaultMsg(
          t(
            locale,
            `我希望预约相似场景的保密演示或评估：${pick(locale, matched.system)}（${pick(locale, matched.title)}）。`,
            `I would like to discuss or book an NDA walkthrough related to: ${pick(locale, matched.system)}.`
          )
        );
      }
    }
  }, [locale]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      ...Object.fromEntries(formData),
      locale,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        setErrorMessage(
          data.error ||
            t(
              locale,
              "提交暂时未能完成，请检查必填内容后稍后重试。",
              "Unable to complete submission right now. Please verify the required fields and try again."
            )
        );
        setStatus("error");
        setTimeout(() => statusBannerRef.current?.focus(), 50);
        return;
      }

      setStatus("success");
      setTimeout(() => statusBannerRef.current?.focus(), 50);
    } catch {
      setErrorMessage(
        t(
          locale,
          "网络连接似乎中断，你的信息尚未发送。请检查网络连接后重试。",
          "Network connection interrupted—your message has not been sent yet. Please check your connection and try again."
        )
      );
      setStatus("error");
      setTimeout(() => statusBannerRef.current?.focus(), 50);
    }
  }

  if (status === "success") {
    return (
      <div
        ref={statusBannerRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border border-black/12 bg-white p-8 md:p-10"
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#111111] text-white">
          <Check size={22} />
        </span>
        <h2 className="mt-5 text-[26px] font-normal text-[#111111]">
          {t(locale, "项目咨询已收到", "Inquiry received")}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[#444444]">
          {t(
            locale,
            "确认邮件已发送至你填写的工作邮箱。我们的资深顾问与技术负责人会在 1 个工作日内与你联系。",
            "A confirmation email has been sent to your inbox. A senior consultant will reply within one business day."
          )}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-primary-dark mt-7"
        >
          <span>{t(locale, "提交另一条咨询", "Send another inquiry")}</span>
          <ArrowUpRight size={16} />
        </button>
      </div>
    );
  }

  const inquiryOptions = [
    { value: "evaluate", zh: "先做需求与投入产出评估", en: "Requirements & ROI assessment" },
    { value: "pilot", zh: "2–6 周低启动试点", en: "2–6 week scoped pilot" },
    { value: "custom", zh: "完整定制 AI 系统开发", en: "Full custom AI system build" },
    { value: "managed", zh: "托管式 AI 服务（按批次交付）", en: "Managed AI workflow service" },
    { value: "demo", zh: "预约保密生产系统演示（NDA）", en: "Book an NDA system walkthrough" },
  ];

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-2xl border border-black/12 bg-white p-7 sm:p-10"
      noValidate={false}
    >
      <div className="border-b border-black/10 pb-5">
        <span className="eyebrow-badge">
          {t(locale, "项目评估登记表", "PROJECT INTAKE")}
        </span>
        <h2 className="mt-2 text-[26px] font-normal text-[#111111] md:text-[30px]">
          {t(locale, "描述你希望改进的业务环节", "Tell us about your workflow")}
        </h2>
        <p className="mt-2 text-[14px] text-[#666666]">
          {t(
            locale,
            "带 * 为必填项。首次沟通无需准备完整技术规格书。",
            "Fields marked * are required. No formal spec document needed."
          )}
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block text-[14px] font-medium text-[#111111]">
          <span>
            {t(locale, "姓名", "Name")}{" "}
            <span className="text-[#0B7A8C]">*</span>
          </span>
          <input
            name="name"
            type="text"
            required
            maxLength={160}
            autoComplete="name"
            className="field-input mt-2"
          />
        </label>

        <label className="block text-[14px] font-medium text-[#111111]">
          <span>
            {t(locale, "公司或机构", "Company")}{" "}
            <span className="text-[#0B7A8C]">*</span>
          </span>
          <input
            name="company"
            type="text"
            required
            maxLength={160}
            autoComplete="organization"
            className="field-input mt-2"
          />
        </label>

        <label className="block text-[14px] font-medium text-[#111111]">
          <span>
            {t(locale, "工作邮箱", "Work email")}{" "}
            <span className="text-[#0B7A8C]">*</span>
          </span>
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            className="field-input mt-2"
          />
        </label>

        <label className="block text-[14px] font-medium text-[#111111]">
          <span>{t(locale, "职位 / 部门", "Role / Department")}</span>
          <input
            name="role"
            type="text"
            maxLength={160}
            autoComplete="organization-title"
            className="field-input mt-2"
          />
        </label>

        <label className="block text-[14px] font-medium text-[#111111]">
          <span>{t(locale, "电话或微信号", "Phone or WeChat")}</span>
          <input
            name="phone"
            type="text"
            maxLength={160}
            autoComplete="tel"
            className="field-input mt-2"
          />
        </label>

        <label className="block text-[14px] font-medium text-[#111111]">
          <span>{t(locale, "期望启动时间", "Preferred timeline")}</span>
          <select name="start" defaultValue="unsure" className="field-select mt-2">
            <option value="month">
              {t(locale, "1 个月内", "Within 1 month")}
            </option>
            <option value="quarter">
              {t(locale, "1–3 个月", "1–3 months")}
            </option>
            <option value="later">
              {t(locale, "3 个月以后", "Later than 3 months")}
            </option>
            <option value="unsure">
              {t(locale, "先评估再定", "Not sure yet")}
            </option>
          </select>
        </label>
      </div>

      <label className="mt-5 block text-[14px] font-medium text-[#111111]">
        <span>
          {t(locale, "咨询类型", "Inquiry type")}{" "}
          <span className="text-[#0B7A8C]">*</span>
        </span>
        <select
          name="inquiry"
          required
          value={inquiry}
          onChange={(e) => setInquiry(e.target.value)}
          className="field-select mt-2"
        >
          {inquiryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(locale, opt.zh, opt.en)}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-5 block text-[14px] font-medium text-[#111111]">
        <span>
          {t(
            locale,
            "当前工作流程与希望改进的问题（至少 10 个字）",
            "Current workflow & what you want to improve (min 10 chars)"
          )}{" "}
          <span className="text-[#0B7A8C]">*</span>
        </span>
        <textarea
          key={defaultMsg}
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          defaultValue={defaultMsg}
          placeholder={t(
            locale,
            "例如：我们团队每月撰写约 20 份技术投标方案，目前每份初稿需要 2 天并人工核对大量历史参数，希望缩短起草耗时并减少漏项。",
            "e.g. Our team drafts ~20 technical proposals a month, spending two days assembling specs and checking past records by hand."
          )}
          className="field-textarea mt-2"
        />
      </label>

      {/* Honeypot anti-bot field */}
      <div className="sr-only" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="mt-5 flex min-h-[40px] cursor-pointer items-center gap-3 text-[14px] text-[#444444]">
        <input
          type="checkbox"
          name="consent"
          value="yes"
          required
          className="h-5 w-5 min-h-[20px] min-w-[20px] shrink-0 accent-[#111111]"
        />
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>{t(locale, "我已阅读并同意", "I have read and agree to the")}</span>
          <Link
            href={href(locale, "/privacy")}
            className="inline-flex min-h-[26px] items-center font-medium text-[#111111] underline"
          >
            {pick(locale, siteCopy.seo.privacy.title)}
          </Link>
        </span>
      </label>

      {status === "error" && (
        <div
          ref={statusBannerRef}
          tabIndex={-1}
          role="alert"
          className="mt-5 rounded-xl border border-[#E11D48]/40 bg-[#FFF5F7] p-4 text-[14px] font-medium text-[#9F1239]"
        >
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary-dark mt-6 w-full disabled:opacity-65"
      >
        {status === "sending" ? (
          <>
            <LoaderCircle size={18} className="animate-spin" />
            <span>{t(locale, "正在发送咨询…", "Sending inquiry…")}</span>
          </>
        ) : (
          <>
            <span>{t(locale, "提交项目咨询", "Send project inquiry")}</span>
            <ArrowUpRight size={17} />
          </>
        )}
      </button>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[12px] text-[#666666]">
        <ShieldCheck size={14} className="shrink-0 text-[#4F46E5]" />
        <span>
          {t(
            locale,
            "信息仅用于评估与沟通项目需求，可签署双方保密协议（NDA）。",
            "Used strictly to respond to your inquiry. Mutual NDA available prior to sharing sensitive files."
          )}
        </span>
      </p>
    </form>
  );
}
