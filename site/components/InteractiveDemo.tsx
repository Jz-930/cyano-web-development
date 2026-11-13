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
    <div className="overflow-hidden rounded-[22px] border border-[#062F3A]/25 bg-[#051217] text-[#F2FAF9] shadow-xl">
      {/* Top Console Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#030B0E] px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <Database size={17} className="text-[#7EF5D6]" />
          <span className="font-mono-tech text-[13px] font-bold text-[#F2FAF9]">
            {isSql
              ? "SmartDoc AI · Read-Only SQL Sandbox"
              : "Enterprise Wiki · Permissioned RAG Sandbox"}
          </span>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#7EF5D6]/35 bg-[#092730] px-3 py-1 font-mono-tech text-[12px] text-[#7EF5D6]">
          <span className="h-2 w-2 rounded-full bg-[#7EF5D6]" />
          <span>{t(locale, "交互流程预览", "Interactive Walkthrough")}</span>
        </span>
      </div>

      {/* Main Split Body */}
      <div className="grid lg:grid-cols-[310px_1fr]">
        {/* Left Preset Prompts */}
        <div className="border-b border-white/10 bg-[#040E12] p-4 lg:border-r lg:border-b-0">
          <div className="mb-2.5 font-mono-tech text-[12px] font-semibold uppercase tracking-[0.06em] text-[#93B5B9]">
            {t(locale, "点击预设问题体验", "SELECT A SAMPLE PROMPT")}
          </div>
          <div className="flex flex-col gap-1.5">
            {questions.map((q, idx) => {
              const active = selected === idx;
              return (
                <button
                  key={q}
                  type="button"
                  onClick={() => runPrompt(idx)}
                  className={`flex min-h-[42px] items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                    active
                      ? "border-[#7EF5D6]/60 bg-[#0B2A34] text-[#7EF5D6]"
                      : "border-white/8 bg-white/[0.03] text-[#C6DFE2] hover:border-white/25"
                  }`}
                >
                  <span>{q}</span>
                  <ArrowUpRight size={14} className="shrink-0 opacity-75" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Output & Provenance Pane */}
        <div className="flex flex-col justify-between p-5 md:p-6">
          <div>
            <div className="inline-block rounded-xl border border-[#7EF5D6]/25 bg-[#09232C] px-3.5 py-2 text-[14px] font-semibold text-[#7EF5D6]">
              {questions[selected]}
            </div>

            <p className="mt-4 min-h-[48px] text-[15px] leading-relaxed text-[#E4F3F4]">
              {answer}
              {running && (
                <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-[#7EF5D6]" />
              )}
            </p>

            {!running && isSql && (
              <div className="mt-4 space-y-3">
                <div className="overflow-x-auto rounded-xl border border-white/12 bg-[#030A0D]">
                  <table className="w-full border-collapse text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-white/12 bg-[#081C24] text-[#7EF5D6]">
                        {currentSqlRecord.columns[locale].map((col) => (
                          <th key={col} className="px-4 py-2.5 font-semibold">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/8 text-[#D8ECEE]">
                      {currentSqlRecord.rows[locale].map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`px-4 py-2 ${
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

                <details className="rounded-xl border border-white/12 bg-[#030A0D] p-3">
                  <summary className="cursor-pointer font-mono-tech text-[12px] font-semibold text-[#52C7CC]">
                    {t(
                      locale,
                      "展开查看只读策略校验后的 SQL 语句",
                      "Inspect validated read-only SQL statement"
                    )}
                  </summary>
                  <pre className="font-mono-tech mt-2 overflow-x-auto text-[12px] text-[#7EF5D6]">
                    {currentSqlRecord.sql}
                  </pre>
                </details>
              </div>
            )}

            {!running && !isSql && (
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#7EF5D6]/30 bg-[#082028] p-3.5 text-[13px] text-[#C6DFE2]">
                <ShieldCheck
                  size={16}
                  className="mt-0.5 shrink-0 text-[#7EF5D6]"
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
      <div className="border-t border-white/10 bg-[#030A0D] px-5 py-2.5 text-[12px] text-[#93B5B9]">
        {pick(locale, siteCopy.demo.interactiveDisclaimer)}
      </div>
    </div>
  );
}
