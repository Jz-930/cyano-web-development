"use client";
import { useState, useEffect, useRef, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ArrowRight, ChevronDown, Menu, X, Plus, Minus, ChevronLeft, ChevronRight, Check, LoaderCircle, Send, Globe, ShieldCheck, Search, Database } from "lucide-react";
import { type Locale, t, href } from "@/lib/locale";
import type { CaseStudy, solutions } from "@/lib/content-v4";
import { Logo, solutionIcons } from "./client-shared";
type LocalCopy = Record<string,Record<string,string>>;
import presetQuestions from "@/content/v1/demo-questions.json";
import queryDemo from "@/content/query-demo.json";
function BookCitation() {
  return <ShieldCheck size={16} />;
}
export function InteractiveDemo({
  locale,
  data = false,
copy,
}: {
  locale: Locale;
  data?: boolean;
copy: LocalCopy;
}) {
 const text = (section:string,key:string,_locale:Locale) => copy[section][key];
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
  const questions = presetQuestions[data?"data":"knowledge"][locale];
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setAnswer(full); setRunning(false); return; }
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
