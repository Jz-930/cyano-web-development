"use client";

import { useEffect, useRef, useState } from "react";
import { Database, ShieldCheck } from "lucide-react";
import presetQuestions from "@/content/v1/demo-questions.json";
import queryDemo from "@/content/query-demo.json";
import { t, type Locale } from "@/lib/locale";
import { mk } from "@/lib/mockups";
import { MockupWindow } from "./MockupWindow";

export type InteractiveDemoProps = {
  locale: Locale;
  data?: boolean;
  disclaimer: string;
  liveBadge?: string;
};

export function InteractiveDemo({
  locale,
  data = false,
  disclaimer,
  liveBadge,
}: InteractiveDemoProps) {
  const [selected, setSelected] = useState(-1);
  const [answer, setAnswer] = useState("");
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  const questions = presetQuestions[data ? "data" : "knowledge"][locale];
  const replies =
    locale === "zh"
      ? [
          "在企业身份门户进入“安全设置 → VPN”，通过多因素认证后设置新密码。新密码至少 12 位，不能与最近使用的密码相同。若验证设备丢失，请转交 IT 服务台核验身份。",
          "在服务门户提交“新员工设备”申请，填写部门、岗位和入职日期，由直属主管审批。设备交付前，IT 团队会完成加密、安全软件与账号配置。",
          "在软件目录查找已批准的软件并提交安装申请。未收录的软件需要补充用途与许可证信息，由安全团队审核。请勿使用个人账号下载未经审批的软件。",
          mk("wiki", "answer", "zh")!,
          "先检查企业身份门户是否正常，确认账号未锁定，再尝试重置密码。若仍无法登录，提交错误时间和截图，避免在工单中写入密码。",
          "这个问题需要人工进一步核验。请在企业服务门户提交工单，说明故障时间、影响范围和已经尝试的操作。系统会保留本次对话作为处理背景。",
        ]
      : [
          "Open Security → VPN in your identity portal and verify with MFA before setting a new password. Use at least 12 characters and do not reuse recent passwords. If your verification device is lost, contact the service desk for identity verification.",
          "Submit a New Employee Equipment request with department, role and start date. Your manager approves it; IT configures encryption, security software and accounts before delivery.",
          "Find approved software in the catalog and submit an installation request. For unlisted software, include its purpose and license details for security review.",
          mk("wiki", "answer", "en")!,
          "Check the identity portal, confirm the account is not locked, and try a password reset. If it still fails, submit the error time and a screenshot without including passwords.",
          "This needs human verification. Submit a service ticket with the time, impact and steps already attempted. Your conversation is retained as context for the support team.",
        ];

  function start(i: number) {
    if (timerRef.current) clearInterval(timerRef.current);
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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnswer(full);
      setRunning(false);
      return;
    }

    timerRef.current = setInterval(() => {
      n += 2;
      setAnswer(full.slice(0, n));
      if (n >= full.length) {
        clearInterval(timerRef.current!);
        setRunning(false);
      }
    }, 30);
  }

  return (
    <div className="v4-demo [margin-top:var(--sp-7)]" data-demo="">
      <MockupWindow
        system={data ? "SmartDoc AI" : "Enterprise Wiki"}
        status={liveBadge ?? t(locale, "在线体验", "Interactive experience")}
        statusTone="ok"
        className="v4-demo-window"
      >
        <div className="v4-demo-grid grid [grid-template-columns:minmax(220px,4fr)_minmax(0,8fr)] [@media(max-width:900px)]:[grid-template-columns:1fr] [gap:var(--sp-4)]">
          <aside className="mk-panel v4-demo-sidebar [background:var(--n1)] [border:1px_solid_var(--dark-line-soft)] [padding:var(--sp-4)] flex flex-col [gap:var(--sp-3)]">
            <span className="eyebrow v4-demo-prompt">
              {t(locale, "试着问一个问题", "TRY A QUESTION")}
            </span>
            <div className="v4-demo-chips flex flex-col [gap:var(--sp-2)]">
              {questions.map((q, i) => (
                <button
                  type="button"
                  className="chip v4-demo-chip"
                  aria-pressed={selected === i}
                  key={q}
                  onClick={() => start(i)}
                >
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="mk-panel v4-demo-stage [background:var(--n1)] [border:1px_solid_var(--dark-line-soft)] [padding:var(--sp-5)] [min-height:280px] flex flex-col justify-center">
            {selected < 0 ? (
              <div className="v4-demo-welcome flex flex-col items-center text-center [gap:var(--sp-2)] [color:var(--on-dark)]">
                <div className="v4-demo-orb [width:52px] [height:52px] [border-radius:var(--q50)] [background:var(--cyan-12)] [border:1px_solid_var(--cyan-40)] [color:var(--ice)] grid [place-items:center]" aria-hidden="true">
                  <Database size={26} />
                </div>
                <h3 className="h3">
                  {t(locale, "选择一个问题查看示例", "Choose a sample question")}
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
              <div key={selected} className="v4-demo-result flex flex-col [gap:var(--sp-4)]">
                <div className="v4-demo-q-row flex items-center justify-between [gap:var(--sp-3)] [padding-bottom:var(--sp-3)] [border-bottom:1px_solid_var(--dark-line-soft)]">
                  <p className="v4-demo-question [font-size:16px] [font-weight:500]">{questions[selected]}</p>
                  {running ? (
                    <span className="v4-demo-dots inline-flex items-center [gap:5px]" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                  ) : null}
                </div>
                <div className="v4-demo-answer [font-size:15px] [line-height:1.75] [color:var(--on-dark)]">{answer}</div>

                {!running && data ? (
                  <>
                    <div className="v4-demo-table-wrap [overflow-x:auto] [border-radius:var(--r-control)] [border:1px_solid_var(--dark-line)]" tabIndex={0}>
                      <table className="v4-demo-table w-full [border-collapse:collapse] [font-size:14px] [font-variant-numeric:tabular-nums]">
                        <thead>
                          <tr>
                            {queryDemo[selected].columns[locale].map((c) => (
                              <th key={c}>{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {queryDemo[selected].rows[locale].map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <details className="v4-demo-sql [border-radius:var(--r-control)] [border:1px_solid_var(--dark-line)] [background:var(--n2)] [padding:var(--sp-2)_var(--sp-3)]">
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
                ) : null}

                {!running && !data ? (
                  <div className="v4-demo-citation inline-flex items-center [gap:var(--sp-2)] [padding:var(--sp-2)_var(--sp-3)] [border-radius:var(--r-control)] [background:var(--n2)] [border:1px_solid_var(--dark-line)] [font-size:13px] [color:var(--ice)]">
                    <ShieldCheck size={15} aria-hidden="true" />
                    <span>
                      {selected === 5
                        ? t(
                            locale,
                            "正式系统可将问题与处理记录转交人工。",
                            "The production system can pass the question and prior steps to a support agent.",
                          )
                        : t(
                            locale,
                            `来源：IT 服务制度 · 访问权限与操作指南 §${selected + 1}`,
                            `Source: IT Service Policy · Access & Operations §${selected + 1}`,
                          )}
                    </span>
                  </div>
                ) : null}
              </div>
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
        <p className="v4-demo-disclaimer [font-size:13px] [line-height:1.5] [padding:0_var(--sp-1)]">{disclaimer}</p>
      </MockupWindow>
    </div>
  );
}
