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
    <div className="workflow-run" data-step={step} ref={rootRef}>
      <div className="workflow-toolbar">
        <button
          type="button"
          className="button-text workflow-rerun"
          onClick={runFromStart}
        >
          <RotateCcw size={14} aria-hidden="true" />
          <span>{rerunLabel}</span>
        </button>
      </div>

      <div className="workflow-track-area">
        <div className="workflow-rail" aria-hidden="true">
          <ProvenanceLines
            viewBox="0 0 960 20"
            paths={["M16 10 L 944 10"]}
            surface="paper"
            state={lineState}
          />
          <span className="workflow-token">
            <FileText size={13} aria-hidden="true" />
            <span className="label">{tokenLabel}</span>
          </span>
        </div>

        <div className="workflow-steps">
          {[0, 1, 2, 3].map((i) => {
            const active = step >= i + 1;
            const current = step === i + 1;
            const showReview = i === 2 && step >= 3;

            return (
              <div
                key={i}
                className="workflow-card"
                data-active={active ? "true" : "false"}
                data-current={current ? "true" : undefined}
              >
                <div className="workflow-card-top">
                  <span className="label">{`0${i + 1}`}</span>
                  {showReview ? (
                    <span className="workflow-review-badge">
                      <span className="workflow-review-dot" aria-hidden="true">
                        <Check size={11} strokeWidth={2.2} />
                      </span>
                      <span className="eyebrow">{reviewLabel}</span>
                    </span>
                  ) : null}
                </div>
                <h3 className="h3 workflow-step-title">{titles[i]}</h3>
                <div className="workflow-expand">
                  <div className="workflow-expand-inner">
                    <p className="workflow-detail">{details[i]}</p>
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
