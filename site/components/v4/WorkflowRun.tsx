"use client";

import { useEffect, useRef, useState } from "react";
import { Check, FileText, RotateCcw } from "lucide-react";
import { t, type Locale } from "@/lib/locale";
import { copyNew } from "@/lib/copy-new-client";
import { ProvenanceLines } from "./ProvenanceLines";

const STEP_TIMES = [0, 0, 900, 1800, 3300, 4200] as const;

export type WorkflowRunProps = {
  locale: Locale;
  slug?: string;
};

export function WorkflowRun({ locale, slug }: WorkflowRunProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  // SSR & no-JS default to final state 5
  const [step, setStep] = useState<number>(5);
  const stateRef = useRef({
    raf: 0,
    start: 0,
    hasAutoRun: false,
    visible: false,
  });

  const runFromStart = () => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(5);
      return;
    }
    const s = stateRef.current;
    if (s.raf) cancelAnimationFrame(s.raf);
    s.start = 0;
    setStep(0);

    const tick = (now: number) => {
      if (!s.start) s.start = now;
      const elapsed = now - s.start;
      let k = 1;
      for (let i = 1; i < STEP_TIMES.length; i++) {
        if (elapsed >= STEP_TIMES[i]) k = i;
      }
      setStep((prev) => (prev === k ? prev : k));
      if (k >= 5) {
        s.raf = 0;
        return;
      }
      s.raf = requestAnimationFrame(tick);
    };

    s.raf = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      setStep(5);
      return;
    }

    const s = stateRef.current;
    const stop = () => {
      if (s.raf) {
        cancelAnimationFrame(s.raf);
        s.raf = 0;
      }
    };

    // Prepare collapsed state before entering 40% viewport
    setStep(0);

    const io = new IntersectionObserver(
      ([entry]) => {
        s.visible = entry.isIntersecting;
        if (entry.isIntersecting && !s.hasAutoRun && !document.hidden) {
          s.hasAutoRun = true;
          runFromStart();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    const onVis = () => {
      if (document.hidden) stop();
      else if (s.visible && !s.hasAutoRun) {
        s.hasAutoRun = true;
        runFromStart();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const titles = [0, 1, 2, 3].map((i) =>
    t(
      locale,
      ["接入资料", "检索与生成", "校验与人工复核", "交付结果"][i],
      [
        "Connect sources",
        "Retrieve & generate",
        "Validate & review",
        "Deliver results",
      ][i],
    ),
  );

  const fallbackDetails = [0, 1, 2, 3].map((i) =>
    t(
      locale,
      [
        "资料、数据库与现有系统",
        "检索、编排与任务处理",
        "引用、规则与权限检查",
        "查看、编辑或导出结果",
      ][i],
      [
        "Documents, databases, systems",
        "Retrieval, orchestration, tasks",
        "Sources, rules, permissions",
        "View, edit or export results",
      ][i],
    ),
  );

  const details = [0, 1, 2, 3].map((i) =>
    slug
      ? copyNew(`S5.${slug}.${i + 1}`, locale) ?? fallbackDetails[i]
      : fallbackDetails[i],
  );

  const tokenLabel = copyNew("S5-token", locale) ?? t(locale, "任务", "Task");
  const reviewLabel =
    copyNew("S5-review", locale) ?? t(locale, "人工复核", "Human review");
  const rerunLabel =
    copyNew("S5-rerun", locale) ?? t(locale, "重新运行", "Run again");

  const lineState =
    step === 0 ? "hidden" : step < 5 ? "flow" : "rest";

  return (
    <div className="workflow-run relative flex flex-col [gap:var(--sp-3)]" data-step={step} ref={rootRef}>
      <div className="workflow-toolbar flex [justify-content:flex-end]">
        <button
          type="button"
          className="button-text workflow-rerun no-underline [min-height:36px] [padding:var(--sp-1)_var(--sp-3)] [border-radius:var(--r-chip)]"
          onClick={runFromStart}
        >
          <RotateCcw size={14} aria-hidden="true" />
          <span>{rerunLabel}</span>
        </button>
      </div>

      <div className="workflow-track-area relative flex flex-col [gap:var(--sp-3)]">
        <div className="workflow-rail relative [height:32px] flex [@media(max-width:800px)]:hidden items-center" aria-hidden="true">
          <ProvenanceLines
            viewBox="0 0 960 20"
            paths={["M16 10 L 944 10"]}
            surface="paper"
            state={lineState}
          />
          <span className="workflow-token absolute [top:2px] [left:0] [height:28px] [padding:0_var(--sp-3)] [border-radius:var(--r-chip)] [background:var(--p2)] [border:1px_solid_var(--link)] [box-shadow:var(--shadow)] [color:var(--link)] inline-flex items-center [gap:var(--sp-1)] pointer-events-none [transition:transform_var(--dur-enter)_var(--ease-in-out)]">
            <FileText size={13} aria-hidden="true" />
            <span className="label">{tokenLabel}</span>
          </span>
        </div>

        <div className="workflow-steps grid [grid-template-columns:repeat(4,minmax(0,1fr))] [@media(max-width:800px)]:[grid-template-columns:1fr] [gap:var(--sp-4)]">
          {[0, 1, 2, 3].map((i) => {
            const active = step >= i + 1;
            const current = step === i + 1;
            const showReview = i === 2 && step >= 3;

            return (
              <div
                key={i}
                className="workflow-card [border-radius:var(--r-card)] [background:var(--p2)] [padding:var(--sp-5)] flex flex-col [gap:var(--sp-2)] [transition:border-color_var(--qtb),box-shadow_var(--qtb)]"
                data-active={active ? "true" : "false"}
                data-current={current ? "true" : undefined}
              >
                <div className="workflow-card-top flex items-center justify-between [gap:var(--sp-2)] [min-height:22px]">
                  <span className="label">{`0${i + 1}`}</span>
                  {showReview ? (
                    <span className="workflow-review-badge inline-flex items-center [gap:6px] [height:22px] [padding:0_var(--sp-2)_0_3px] [border-radius:var(--r-chip)] [background:var(--amber-12)] [border:1px_solid_var(--amber)] [color:var(--ink)]">
                      <span className="workflow-review-dot [width:16px] [height:16px] [border-radius:var(--q50)] [background:var(--amber)] [color:var(--n1)] inline-grid [place-items:center]" aria-hidden="true">
                        <Check size={11} strokeWidth={2.2} />
                      </span>
                      <span className="[font-size:12px] [line-height:1] [font-weight:500] [color:var(--amber-ink)] [white-space:nowrap]">{reviewLabel}</span>
                    </span>
                  ) : null}
                </div>
                <h3 className="h3 workflow-step-title">{titles[i]}</h3>
                <div className="workflow-expand grid [transition:grid-template-rows_var(--qte)]">
                  <div className="workflow-expand-inner overflow-hidden">
                    <p className="workflow-detail [padding-top:var(--sp-2)] [margin-top:var(--sp-2)] [border-top:1px_solid_var(--line-soft)] [font-size:14px] [line-height:1.65]">{details[i]}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
