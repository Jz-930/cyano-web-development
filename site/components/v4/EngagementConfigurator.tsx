"use client";

import { startTransition, useState } from "react";
import pageCopy from "@/content/v4/pages/Engagement.json";
import { t, type Locale } from "@/lib/locale";
import { copyNew } from "@/lib/copy-new-client";
import { EngagementCards } from "./EngagementCards";
import { EngagementGantt, type EngagementMode } from "./EngagementGantt";

function resolveRecommended(
  own: boolean,
  pilot: boolean,
  managed: boolean,
): EngagementMode | null {
  if (!own && !pilot && !managed) return null;
  if (own && !pilot && !managed) return "custom";
  if (own && pilot && !managed) return "pilot";
  if (!own && pilot && !managed) return "pilot";
  if (!own && !pilot && managed) return "managed";
  if (!own && pilot && managed) return "managed";
  if (own && !pilot && managed) return "custom";
  return "pilot"; // (true, true, true)
}

export function EngagementConfigurator({
  locale,
  decisionNote,
}: {
  locale: Locale;
  decisionNote: string;
}) {
  const [ans, setAns] = useState<[boolean, boolean, boolean]>([
    false,
    false,
    false,
  ]);
  const [hoverMode, setHoverMode] = useState<EngagementMode | null>(null);

  const recommended = resolveRecommended(ans[0], ans[1], ans[2]);
  const activeMode = hoverMode ?? recommended;

  const toggle = (idx: 0 | 1 | 2) => {
    startTransition(() => {
      setAns((prev) => {
        const next: [boolean, boolean, boolean] = [...prev];
        next[idx] = !next[idx];
        return next;
      });
    });
  };

  const questions = [
    copyNew("S7.q1", locale) ?? "Do you need to own the system?",
    copyNew("S7.q2", locale) ?? "Want to test it on a small scale first?",
    copyNew("S7.q3", locale) ?? "Want Cyano to run it for you?",
  ];

  const baseRows = [0, 1, 2].map((i) => ({
    label: pageCopy.what_you_get[locale][i],
    cells: [0, 1, 2].map((j) =>
      t(
        locale,
        [
          [
            "完整业务系统，归你所有",
            "关键场景可用版本，按需扩展",
            "按批次交付经过人工审核的结果",
          ],
          [
            "包含基础维护，可持续迭代",
            "包含在持续服务中",
            "Cyano 负责运行与交付",
          ],
          [
            "需要自有系统的团队",
            "需要先测试效果的团队",
            "希望委托处理任务的团队",
          ],
        ][i][j],
        [
          [
            "A complete system you own",
            "A working version, expanded as needed",
            "Batch outputs reviewed by people",
          ],
          [
            "Maintenance with ongoing iteration",
            "Included in the service",
            "Fully run by Cyano",
          ],
          [
            "Teams that need their own system",
            "Teams validating a use case",
            "Teams needing additional capacity",
          ],
        ][i][j],
      ),
    ),
  }));

  const r1Label = copyNew("E-4r1", locale);
  const r1Cells = [
    copyNew("E-4r1.1", locale),
    copyNew("E-4r1.2", locale),
    copyNew("E-4r1.3", locale),
  ];
  const r2Label = copyNew("E-4r2", locale);
  const r2Cells = [
    copyNew("E-4r2.1", locale),
    copyNew("E-4r2.2", locale),
    copyNew("E-4r2.3", locale),
  ];

  const allRows = [
    ...baseRows,
    ...(r1Label && r1Cells.every(Boolean)
      ? [{ label: r1Label, cells: r1Cells as string[] }]
      : []),
    ...(r2Label && r2Cells.every(Boolean)
      ? [{ label: r2Label, cells: r2Cells as string[] }]
      : []),
  ];

  const modeOrder: EngagementMode[] = ["custom", "pilot", "managed"];

  return (
    <div className="eng-Interactive-stack flex flex-col [gap:var(--sp-7)]">
      <div className="engagement-configurator card">
        {questions.map((q, idx) => {
          const checked = ans[idx as 0 | 1 | 2];
          return (
            <button
              key={q}
              type="button"
              role="switch"
              aria-checked={checked}
              className="eng-switch-btn flex items-center justify-between [gap:var(--sp-3)] [min-height:52px] [padding:var(--sp-3)_var(--sp-4)] [border-radius:var(--r-card)] [color:var(--ink)] [font-size:14px] [font-weight:500] text-left cursor-pointer [transition:border-color_var(--qtf),background-color_var(--qtf),opacity_var(--qtp)]"
              onClick={() => toggle(idx as 0 | 1 | 2)}
            >
              <span className="eng-switch-q">{q}</span>
              <span className="eng-switch-track relative [width:40px] [height:24px] [border-radius:var(--r-chip)] shrink-0 [transition:background-color_var(--qtf)]" aria-hidden="true">
                <span className="eng-switch-thumb absolute [top:3px] [left:3px] [width:18px] [height:18px] [border-radius:var(--r-chip)] [background:var(--p2)] [box-shadow:var(--shadow)] [transition:transform_var(--dur-base)_var(--ease-spring)]" />
              </span>
            </button>
          );
        })}
      </div>

      <EngagementCards
        locale={locale}
        recommendedMode={recommended}
        reorderOnRecommend
      />

      <p className="conclusion eng-decision-note [padding-left:var(--sp-5)] [border-left:2px_solid_var(--cyan)] [font-size:18px] [line-height:1.7] [color:var(--ink)]">{decisionNote}</p>

      <div className="eng-gantt-wrap [padding:var(--sp-5)] [border-radius:var(--r-window)] [background:var(--p2)] [border:1px_solid_var(--line)]">
        <EngagementGantt
          locale={locale}
          variant="paper"
          activeMode={activeMode}
          onHoverMode={setHoverMode}
        />
      </div>

      <div
        className="compare-scroll eng-compare-wrap [overflow-x:auto] [border-radius:var(--r-card)] [border:1px_solid_var(--line)] [background:var(--p2)]"
        role="region"
        aria-label={t(locale, "合作方式比较", "Engagement comparison")}
        tabIndex={0}
      >
        <table className="compare-table eng-compare-table w-full [min-width:760px] [border-collapse:collapse] [font-size:15px]">
          <thead>
            <tr>
              <th scope="col">{pageCopy.compare[locale]}</th>
              {modeOrder.map((m, idx) => (
                <th
                  key={m}
                  scope="col"
                  className={activeMode === m ? "is-us" : undefined}
                >
                  {pageCopy.full_custom_build[locale][idx]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allRows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {row.cells.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className={
                      activeMode === modeOrder[cIdx] ? "is-us" : undefined
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
