"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Database, ShieldCheck } from "lucide-react";
import queryDemo from "@/content/query-demo.json";
import { type Locale, pick, siteCopy, t } from "@/lib/content";

const KB_QUESTIONS = {
  zh: [
    "如何重置 VPN 密码？",
    "新员工如何申请办公电脑？",
    "如何申请软件安装权限？",
    "远程办公有哪些安全规范？",
    "企业邮箱无法登录如何排查？",
    "遇到制度未覆盖的特殊权限问题",
  ],
  en: [
    "How do I reset my VPN password?",
    "How do new employees request a laptop?",
    "How can I request software installation?",
    "What are the security rules for remote work?",
    "I cannot access my email—what should I check?",
    "I have an exception not covered by policy",
  ],
};

const KB_REPLIES = {
  zh: [
    "在企业身份门户进入「安全设置 → VPN」，完成多因素认证（MFA）后设置新密码。新密码须不少于 12 位且不得与近期密码重复。若验证设备遗失，请转交 IT 服务台核验身份。",
    "在内部服务门户提交「新员工设备申请」，填写所属部门、岗位与入职日期，经直属主管审批后生效。设备发放前由 IT 完成全盘加密、终端防护与域账号配置。",
    "在受控软件目录中选择已批准版本并提交申请。目录外软件需补充业务用途与许可证说明，由信息安全团队审核通过后方可安装。",
    "请使用公司配发设备连接批准的 VPN，保持磁盘加密与自动锁屏开启。禁止将内部业务文档同步至个人网盘；外发共享前须核对接收人权限等级。",
    "请先确认企业身份门户状态正常且账号未被锁定，再尝试自助重置密码。若仍无法登录，请附报错时间与截图提交工单，切勿在描述中填写明文密码。",
    "该请求涉及特殊权限或跨部门审批，系统已停止自动结论，并可将当前对话与已查制度一并写入支持工单，交由授权工程师接手处理。",
  ],
  en: [
    "Open Security → VPN in your identity portal and verify with MFA before setting a new password (minimum 12 characters, no recent reuse). If your MFA device is unavailable, escalate to the service desk for identity verification.",
    "Submit a New Employee Equipment request with department, role and start date. Once approved by your manager, IT provisions disk encryption, endpoint security and directory accounts prior to handoff.",
    "Select approved packages directly from the software catalog. Unlisted tools require business justification and license details for security team review before installation.",
    "Connect through approved corporate devices and VPN with disk encryption and auto-lock enabled. Never sync internal files to personal cloud drives, and verify recipient permissions before sharing.",
    "Verify identity portal status and check that your account is unlocked before running a password reset. If login still fails, attach the timestamp and error screenshot to a ticket—never include passwords.",
    "This request requires elevated approval or policy interpretation. Automatic answering has paused so a pre-filled support ticket can pass your conversation context directly to an authorized specialist.",
  ],
};

const SQL_QUESTIONS = {
  zh: [
    "本月各区域销售额与环比是多少？",
    "当前哪些商品库存低于安全库存线？",
    "近六个月整体销售趋势如何？",
    "华东区域销量排名前三的商品？",
    "哪些商品库存周转天数超过 60 天？",
    "11 月销售数量与 10 月基线对比？",
  ],
  en: [
    "Monthly sales and MoM change by region?",
    "Which SKUs are currently below safety stock?",
    "Six-month sales trend across all regions?",
    "Top 3 products by unit volume in the East?",
    "Which items exceed 60 inventory turnover days?",
    "November unit volume vs. October baseline?",
  ],
};

export function InteractiveDemo({
  locale,
  mode = "kb",
}: {
  locale: Locale;
  mode?: "kb" | "sql";
}) {
  const isSql = mode === "sql";
  const [selected, setSelected] = useState(0);
  const [answer, setAnswer] = useState("");
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const questions = isSql ? SQL_QUESTIONS[locale] : KB_QUESTIONS[locale];

  const runPrompt = (index: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(index);
    const fullText = isSql
      ? t(
          locale,
          "已完成语义指标对齐与五重只读 SQL 策略校验，以下为返回的数据表及可核查查询语句：",
          "Metric definitions matched and 5-gate read-only SQL check passed. Inspect results and generated SQL below:"
        )
      : KB_REPLIES[locale][index];

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setAnswer(fullText);
      setRunning(false);
      return;
    }

    setAnswer("");
    setRunning(true);
    let pos = 0;
    timerRef.current = setInterval(() => {
      pos += 4;
      setAnswer(fullText.slice(0, pos));
      if (pos >= fullText.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setRunning(false);
      }
    }, 18);
  };

  useEffect(() => {
    runPrompt(0);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, mode]);

  const currentSqlRecord = queryDemo[selected] ?? queryDemo[0];

  return (
    <div className="overflow-hidden rounded-2xl bg-[#000000] text-white shadow-[0_32px_80px_-24px_rgba(0,0,0,0.45)]">
      {/* Top Minimalist Console Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/12 px-6 py-4">
        <div className="flex items-center gap-3">
          <Database size={16} className="text-[#00C2FF]" />
          <span className="font-mono-tech text-[13px] font-medium text-white">
            {isSql
              ? "SmartDoc AI · Read-Only SQL Sandbox"
              : "Enterprise Wiki · Permissioned RAG Sandbox"}
          </span>
        </div>
        <span className="inline-flex items-center gap-2 font-mono-tech text-[12px] text-[#00C2FF]">
          <span className="h-2 w-2 rounded-full bg-[#00C2FF]" />
          <span>{t(locale, "交互流程预览", "INTERACTIVE WALKTHROUGH")}</span>
        </span>
      </div>

      {/* Main Split Body */}
      <div className="grid lg:grid-cols-[330px_1fr]">
        {/* Left Unboxed Hairline Prompt List */}
        <div className="border-b border-white/12 p-5 lg:border-r lg:border-b-0">
          <div className="mb-3 font-mono-tech text-[12px] uppercase tracking-[0.1em] text-white/50">
            {t(locale, "选择预设问题体验", "SELECT A SAMPLE PROMPT")}
          </div>
          <div className="divide-y divide-white/[0.08]">
            {questions.map((q, idx) => {
              const active = selected === idx;
              return (
                <button
                  key={q}
                  type="button"
                  onClick={() => runPrompt(idx)}
                  className="group relative flex min-h-[46px] w-full items-center justify-between gap-3 py-3 pl-4 text-left text-[13px] transition-colors"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-2.5 bottom-2.5 left-0 w-[2px]"
                    style={{
                      backgroundColor: active ? "#00C2FF" : "transparent",
                    }}
                  />
                  <span
                    className={
                      active
                        ? "font-medium text-white"
                        : "text-white/65 group-hover:text-white"
                    }
                  >
                    {q}
                  </span>
                  <ArrowUpRight
                    size={14}
                    className={`shrink-0 ${
                      active ? "text-[#00C2FF]" : "text-white/35"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Output & Provenance Pane */}
        <div className="flex flex-col justify-between p-6 md:p-8">
          <div>
            <div className="font-mono-tech text-[12px] uppercase tracking-[0.1em] text-[#FBBF24]">
              {t(locale, "当前提问", "ACTIVE QUERY")}
            </div>
            <div className="mt-1.5 text-[18px] font-normal text-white">
              {questions[selected]}
            </div>

            <p className="mt-5 min-h-[48px] text-[15px] leading-relaxed text-white/85">
              {answer}
              {running && (
                <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-[#00C2FF]" />
              )}
            </p>

            {!running && isSql && (
              <div className="mt-6 space-y-4">
                <div className="overflow-x-auto border-t border-b border-white/15">
                  <table className="w-full border-collapse text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-white/15 text-[#00C2FF]">
                        {currentSqlRecord.columns[locale].map((col) => (
                          <th key={col} className="py-3 pr-5 font-medium">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.08] text-white/85">
                      {currentSqlRecord.rows[locale].map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`py-2.5 pr-5 ${
                                cIdx > 0 ? "font-mono-tech" : ""
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <details className="pt-2">
                  <summary className="cursor-pointer font-mono-tech text-[12px] font-medium text-[#00C2FF] hover:text-white">
                    {t(
                      locale,
                      "展开查看只读策略校验后的 SQL 语句",
                      "Inspect validated read-only SQL statement"
                    )}
                  </summary>
                  <pre className="font-mono-tech mt-3 overflow-x-auto border-l-2 border-[#00C2FF] pl-4 text-[12px] text-white/80">
                    {currentSqlRecord.sql}
                  </pre>
                </details>
              </div>
            )}

            {!running && !isSql && (
              <div className="mt-6 flex items-start gap-3 border-t border-white/12 pt-5 text-[13px] text-white/75">
                <ShieldCheck
                  size={16}
                  className="mt-0.5 shrink-0 text-[#00C2FF]"
                />
                <span>
                  {selected === 5
                    ? t(
                        locale,
                        "分流动作：触发人工审批门禁 · 已打包提问历史与部门身份生成待接手工单。",
                        "Routing gate: Escalated to human support with caller role & prior steps pre-attached."
                      )
                    : t(
                        locale,
                        `绑定出处：《企业 IT 服务与信息安全制度 v3.4》第 ${selected + 1} 节 · 已通过员工角色鉴权`,
                        `Bound source: Enterprise IT Security & Access SOP v3.4 §${selected + 1} · Caller ACL verified`
                      )}
                </span>
              </div>
            )}
          </div>

          <p className="sr-only" role="status">
            {!running
              ? t(
                  locale,
                  "交互演示结果与出处已更新。",
                  "Interactive example response and citation updated."
                )
              : ""}
          </p>
        </div>
      </div>

      {/* Anonymized Sandbox Disclaimer */}
      <div className="border-t border-white/10 px-6 py-3 text-[12px] text-white/45">
        {pick(locale, siteCopy.demo.interactiveDisclaimer)}
      </div>
    </div>
  );
}
