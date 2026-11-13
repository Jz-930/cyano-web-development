"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Activity,
  CheckCircle2,
  Cpu,
  Database,
  Layers,
  ShieldCheck,
  Terminal,
  Workflow,
} from "lucide-react";
import { type Locale, getMediaMeta, pick, siteCopy, t } from "@/lib/content";

const LAYER_ICONS = [Database, Layers, Workflow, ShieldCheck];

/**
 * G-08: Interactive 4-Layer Cyano Core Request Flow & Audit Trace Inspector.
 */
export function CoreArchitectureInteractive({ locale }: { locale: Locale }) {
  const layers = siteCopy.technology.layers;
  const [selected, setSelected] = useState(0);
  const current = layers[selected];
  const latticeMeta = getMediaMeta("/art/v2-core-lattice.webp");

  return (
    <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
      {/* Left: 4 Interactive Architecture Layers */}
      <div className="flex flex-col gap-3">
        {layers.map((layer, idx) => {
          const Icon = LAYER_ICONS[idx] || Cpu;
          const active = idx === selected;
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => setSelected(idx)}
              className={`group flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-all ${
                active
                  ? "border-[#062F3A] bg-[#062F3A] text-[#F2FAF9] shadow-lg"
                  : "border-[#D3E3E6] bg-white text-[#07161A] hover:border-[#0E5961]"
              }`}
            >
              <span
                className={`mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  active
                    ? "bg-[#7EF5D6]/18 text-[#7EF5D6]"
                    : "bg-[#E7F4F5] text-[#0E5961]"
                }`}
              >
                <Icon size={20} />
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-mono-tech text-[12px] font-semibold ${
                      active ? "text-[#7EF5D6]" : "text-[#0E5961]"
                    }`}
                  >
                    {layer.code}
                  </span>
                  <span
                    className={`font-mono-tech rounded px-2 py-0.5 text-[12px] ${
                      active
                        ? "bg-[#7EF5D6]/18 text-[#7EF5D6]"
                        : "bg-[#F3FAFA] text-[#496269]"
                    }`}
                  >
                    {layer.id}
                  </span>
                </div>
                <h3 className="mt-1 text-[17px] font-semibold">
                  {pick(locale, layer.name)}
                </h3>
                <p
                  className={`mt-1.5 text-[14px] leading-relaxed ${
                    active ? "text-[#C6DFE2]" : "text-[#31494F]"
                  }`}
                >
                  {pick(locale, layer.summary)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right: Live Request Execution & Audit Telemetry Stage */}
      <div className="card-obsidian relative flex flex-col justify-between overflow-hidden rounded-[22px] bg-[#041015] p-6 text-[#F2FAF9] shadow-xl md:p-8">
        <Image
          src="/art/v2-core-lattice.webp"
          alt=""
          aria-hidden="true"
          width={latticeMeta.width}
          height={latticeMeta.height}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between border-b border-white/12 pb-3.5">
            <span className="inline-flex items-center gap-2 font-mono-tech text-[12px] font-semibold text-[#7EF5D6]">
              <Terminal size={14} />
              <span>REQUEST EXECUTION TRACE · {current.id}</span>
            </span>
            <span className="font-mono-tech rounded-full border border-[#7EF5D6]/35 bg-[#092730] px-2.5 py-0.5 text-[12px] text-[#7EF5D6]">
              0{selected + 1} / 04
            </span>
          </div>

          {/* Pipeline progress visualizer */}
          <div className="mt-5 grid grid-cols-4 gap-2">
            {layers.map((l, i) => (
              <div key={l.id} className="space-y-1.5">
                <div
                  className={`h-1.5 rounded-full transition-colors ${
                    i <= selected ? "bg-[#7EF5D6]" : "bg-white/14"
                  }`}
                />
                <div
                  className={`font-mono-tech text-[12px] ${
                    i === selected ? "font-bold text-[#7EF5D6]" : "text-[#93B5B9]"
                  }`}
                >
                  {l.id}
                </div>
              </div>
            ))}
          </div>

          <h3 className="mt-6 text-[20px] font-semibold text-[#F2FAF9]">
            {pick(locale, current.name)}
          </h3>
          <p className="mt-3 rounded-xl border border-white/12 bg-[#071A21]/90 p-4 text-[15px] leading-relaxed text-[#D8ECEE]">
            {pick(locale, current.requestAction)}
          </p>
        </div>

        <div className="relative z-10 mt-6 rounded-xl border border-[#7EF5D6]/30 bg-[#02090C]/90 p-4">
          <div className="flex items-center justify-between font-mono-tech text-[12px] text-[#93B5B9]">
            <span>{t(locale, "审计日志输出样例", "AUDIT LOG RECORD")}</span>
            <CheckCircle2 size={14} className="text-[#7EF5D6]" />
          </div>
          <pre className="font-mono-tech mt-2 overflow-x-auto text-[13px] text-[#7EF5D6]">
            {current.auditOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}

/**
 * G-09: Segmented 4-Tier Context Budget Window vs Raw Unbounded History.
 */
export function ContextBudgetBar({ locale }: { locale: Locale }) {
  const tiers = siteCopy.technology.contextTiers;
  const prismMeta = getMediaMeta("/art/v2-core-prism.webp");
  const segColors = [
    "bg-[#7EF5D6] text-[#03161B]",
    "bg-[#4CC4C9] text-[#03161B]",
    "bg-[#25858E] text-[#F2FAF9]",
    "bg-[#124B54] text-[#D8ECEE]",
  ];

  return (
    <div className="relative overflow-hidden rounded-[22px] border border-[#7EF5D6]/24 bg-[#06141A] p-6 md:p-8">
      <Image
        src="/art/v2-core-prism.webp"
        alt=""
        aria-hidden="true"
        width={prismMeta.width}
        height={prismMeta.height}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
      />

      <div className="relative z-10 space-y-6">
        {/* Raw History Overflow Warning Bar */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[13px]">
            <span className="font-semibold text-[#F7C797]">
              {t(
                locale,
                "未编排做法：每次重发完整原始历史（第 50+ 轮）",
                "Unorchestrated chat: Resending raw history every turn (Turn 50+)"
              )}
            </span>
            <span className="font-mono-tech text-[12px] text-[#F7C797]">
              {t(
                locale,
                "Token 持续膨胀 · 核心指令被夹在中间易遗漏",
                "Compounding token bloat · Core rules buried in noise"
              )}
            </span>
          </div>
          <div className="mt-2 flex h-9 w-full overflow-hidden rounded-xl border border-[#F2A663]/35 bg-[#1B130E] p-1">
            <div className="flex w-[12%] items-center justify-center rounded-l-lg bg-[#F2A663]/30 font-mono-tech text-[12px] text-[#F9D6B4]">
              Rules?
            </div>
            <div className="flex flex-1 items-center justify-center bg-[#F2A663]/14 px-3 font-mono-tech text-[12px] text-[#D9C7B8]">
              {t(
                locale,
                "冗余对话记录 + 过期文档段落 + 重复废稿 (88%)",
                "Verbose chat logs + stale chunks + discarded drafts (88%)"
              )}
            </div>
          </div>
        </div>

        {/* Cyano Core Controlled 4-Tier Budget Window */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[13px]">
            <span className="font-semibold text-[#7EF5D6]">
              {t(
                locale,
                "Cyano Core 四级受控上下文窗口（第 1 轮至第 100 轮预算恒定）",
                "Cyano Core 4-Tier Controlled Budget (Flat window from Turn 1 to Turn 100)"
              )}
            </span>
            <span className="font-mono-tech text-[12px] text-[#7EF5D6]">
              100% Core Rule Recall · &lt; 200ms* Assembly
            </span>
          </div>

          <div className="mt-2 flex h-11 w-full gap-1 overflow-hidden rounded-xl border border-[#7EF5D6]/40 bg-[#030B0E] p-1">
            {tiers.map((tier, idx) => (
              <div
                key={tier.tier}
                style={{ width: `${tier.sharePercent}%` }}
                className={`flex items-center justify-center rounded-lg px-2 font-mono-tech text-[12px] font-bold ${segColors[idx]}`}
              >
                <span className="truncate">
                  {tier.tier} ({tier.sharePercent}%)
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier) => (
              <div
                key={tier.tier}
                className="rounded-xl border border-white/10 bg-[#041015]/88 p-3.5"
              >
                <div className="flex items-center justify-between font-mono-tech text-[12px] text-[#7EF5D6]">
                  <span>{tier.tier}</span>
                  <span>{tier.sharePercent}%</span>
                </div>
                <div className="mt-1 text-[14px] font-semibold text-[#F2FAF9]">
                  {pick(locale, tier.name)}
                </div>
                <div className="mt-1 text-[12px] font-medium text-[#52C7CC]">
                  {pick(locale, tier.policy)}
                </div>
                <p className="mt-1.5 text-[12px] leading-snug text-[#A9C5C8]">
                  {pick(locale, tier.detail)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * G-10 + A-06 + D-3: Interactive Turn 1–100 Cost & Latency Curve + 4 Scoped Benchmarks.
 */
export function TurnCostLatencyChart({ locale }: { locale: Locale }) {
  const [turn, setTurn] = useState(80);
  const benchmarks = siteCopy.technology.benchmarks;

  // Normalized curve formulas for interactive inspection
  const rawLatencyMs = Math.round(240 + turn * 27.5);
  const coreLatencyMs = Math.round(145 + Math.min(turn, 20) * 1.8);
  const savedPct = turn < 8 ? 12 : Math.min(40, Math.round(14 + turn * 0.32));

  const xPos = 56 + (turn / 100) * 504;
  const rawY = 176 - (turn / 100) * 142;
  const coreY = 166 - Math.min(turn / 100, 0.25) * 20;

  return (
    <div className="space-y-8">
      <div className="rounded-[22px] border border-[#7EF5D6]/22 bg-[#061318] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 font-mono-tech text-[12px] font-semibold text-[#7EF5D6]">
              <Activity size={14} />
              <span>
                {t(
                  locale,
                  "交互基准曲线 · 拖动滑块查看第 1–100 轮表现",
                  "INTERACTIVE BENCHMARK · SCRUB TURN 1 TO TURN 100"
                )}
              </span>
            </span>
            <h3 className="mt-1 text-[19px] font-semibold text-[#F2FAF9]">
              {t(
                locale,
                "随对话轮次增长的拼装延迟与调用成本对比",
                "Context assembly latency & token spend across multi-turn tasks"
              )}
            </h3>
          </div>

          {/* Preset turn quick-jump buttons */}
          <div className="flex items-center gap-1.5">
            {[1, 25, 50, 80, 100].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTurn(preset)}
                className={`min-h-[36px] rounded-lg px-2.5 font-mono-tech text-[12px] font-semibold transition-colors ${
                  turn === preset
                    ? "bg-[#7EF5D6] text-[#03161B]"
                    : "border border-white/14 bg-white/5 text-[#B4CFD2] hover:border-[#7EF5D6]/50"
                }`}
              >
                T{preset}
              </button>
            ))}
          </div>
        </div>

        {/* Dual-curve SVG */}
        <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-[#030A0D] p-4">
          <svg
            viewBox="0 0 600 205"
            className="h-auto w-full"
            role="img"
            aria-label={t(
              locale,
              "第 1 轮至第 100 轮上下文延迟与成本趋势图",
              "Turn 1 to Turn 100 context latency and cost chart"
            )}
          >
            {/* Horizontal grid lines */}
            {[40, 88, 136, 180].map((gy) => (
              <line
                key={gy}
                x1="56"
                y1={gy}
                x2="564"
                y2={gy}
                stroke="rgba(126,245,214,0.1)"
                strokeDasharray="3 3"
              />
            ))}

            {/* Raw history rising curve */}
            <path
              d="M 56 176 Q 280 124, 560 34"
              fill="none"
              stroke="#F2A663"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />

            {/* Cyano Core flat bounded curve */}
            <path
              d="M 56 168 C 140 162, 260 160, 560 159"
              fill="none"
              stroke="#7EF5D6"
              strokeWidth="3"
            />

            {/* Active scrubber vertical line */}
            <line
              x1={xPos}
              y1="24"
              x2={xPos}
              y2="182"
              stroke="rgba(126,245,214,0.55)"
              strokeWidth="1.5"
            />
            <circle cx={xPos} cy={rawY} r="5" fill="#F2A663" />
            <circle
              cx={xPos}
              cy={coreY}
              r="6"
              fill="#7EF5D6"
              stroke="#030A0D"
              strokeWidth="2"
            />

            {/* Axis labels */}
            <text x="56" y="198" fill="#93B5B9" fontSize="12" fontFamily="monospace">
              Turn 1
            </text>
            <text x="290" y="198" fill="#93B5B9" fontSize="12" fontFamily="monospace">
              Turn 50
            </text>
            <text x="512" y="198" fill="#93B5B9" fontSize="12" fontFamily="monospace">
              Turn 100
            </text>
          </svg>

          {/* Accessible Range Slider + Readout */}
          <div className="mt-3 grid gap-4 border-t border-white/10 pt-4 md:grid-cols-[1fr_auto] md:items-center">
            <label className="flex items-center gap-3 text-[13px] text-[#B4CFD2]">
              <span className="font-mono-tech shrink-0 text-[#7EF5D6]">
                {t(locale, `当前轮次：第 ${turn} 轮`, `Active turn: Turn ${turn}`)}
              </span>
              <input
                type="range"
                min={1}
                max={100}
                value={turn}
                onChange={(e) => setTurn(Number(e.target.value))}
                aria-label={t(locale, "选择对话轮次", "Select conversation turn")}
                className="h-7 w-full cursor-pointer py-2 accent-[#7EF5D6]"
              />
            </label>

            <div className="flex flex-wrap items-center gap-3 font-mono-tech text-[12px]">
              <span className="rounded-lg border border-[#F2A663]/35 bg-[#F2A663]/10 px-3 py-1.5 text-[#F7C797]">
                {t(locale, "原始历史：", "Raw history: ")}~{rawLatencyMs}ms
              </span>
              <span className="rounded-lg border border-[#7EF5D6]/45 bg-[#7EF5D6]/14 px-3 py-1.5 font-bold text-[#7EF5D6]">
                Cyano Core: ~{coreLatencyMs}ms* (-{savedPct}% tok)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Scoped Benchmark Cards (D-3 + tight superscripts V-12) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benchmarks.map((b, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-[#7EF5D6]/22 bg-[#07161C] p-5"
          >
            <div className="font-mono-tech text-[clamp(1.75rem,2.5vw,2.25rem)] font-bold tracking-tight text-[#7EF5D6]">
              <span>{pick(locale, b.value)}</span>
              {b.hasFootnote && (
                <sup className="ml-0.5 text-[0.55em] font-semibold text-[#52C7CC]">
                  *
                </sup>
              )}
            </div>
            <div className="mt-2 text-[15px] font-semibold text-[#F2FAF9]">
              {pick(locale, b.label)}
            </div>
            <p className="mt-1.5 text-[13px] leading-snug text-[#93B5B9]">
              {pick(locale, b.condition)}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[13px] leading-relaxed text-[#93B5B9]">
        {pick(locale, siteCopy.technology.benchmarkFootnote)}
      </p>
    </div>
  );
}

/**
 * G-11 + V-14: 3 Categorized Integration Rows (with English Qwen / Lark / DingTalk / WeCom).
 */
export function SupportedStackGroups({ locale }: { locale: Locale }) {
  return (
    <div className="grid gap-5">
      {siteCopy.technology.stackGroups.map((grp, idx) => (
        <div key={idx} className="card-light p-6">
          <div className="flex items-center gap-2.5">
            <span className="font-mono-tech rounded-md bg-[#E7F4F5] px-2 py-0.5 text-[12px] font-semibold text-[#0E5961]">
              0{idx + 1}
            </span>
            <h3 className="text-[16px] font-semibold text-[#07161A]">
              {pick(locale, grp.category)}
            </h3>
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {grp.items.map((item, i) => (
              <span
                key={i}
                className="inline-flex min-h-[36px] items-center rounded-xl border border-[#C8DFE2] bg-[#F6FCFC] px-3.5 py-1.5 text-[14px] font-medium text-[#153137]"
              >
                {pick(locale, item)}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
