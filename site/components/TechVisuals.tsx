"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Cpu,
  Database,
  Layers,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { type Locale, getMediaMeta, pick, siteCopy, t } from "@/lib/content";

const LAYER_ICONS = [Database, Layers, Workflow, ShieldCheck];
const LAYER_LIGHT_COLORS = ["#0B7A8C", "#1D4ED8", "#6D28D9", "#B45309"];
const LAYER_DARK_COLORS = ["#22D3EE", "#60A5FA", "#A78BFA", "#FBBF24"];

/**
 * CoreArchitectureInteractive:
 * Minimalist stacked hairline blocks on left +
 * crisp 4-layer crystal strata 3D artwork (`cyano-core-strata.webp`) & open trace on right.
 */
export function CoreArchitectureInteractive({ locale }: { locale: Locale }) {
  const layers = siteCopy.technology.layers;
  const [selected, setSelected] = useState(0);
  const current = layers[selected];
  const strataMeta = getMediaMeta("/art/cyano-core-strata.webp");
  const activeColor = LAYER_DARK_COLORS[selected % LAYER_DARK_COLORS.length];

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
      {/* Left: Clean Minimalist Architectural Stack */}
      <div className="divide-y divide-slate-900/15 border-t border-b border-slate-900/15 lg:col-span-6">
        {layers.map((layer, idx) => {
          const Icon = LAYER_ICONS[idx] || Cpu;
          const active = idx === selected;
          const color = LAYER_LIGHT_COLORS[idx % LAYER_LIGHT_COLORS.length];
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => setSelected(idx)}
              className="group relative flex w-full flex-col items-start py-7 pl-5 pr-2 text-left transition-colors"
            >
              <span
                aria-hidden="true"
                className="absolute top-6 bottom-6 left-0 w-[3px] transition-opacity"
                style={{
                  backgroundColor: color,
                  opacity: active ? 1 : 0,
                }}
              />
              <div className="flex w-full items-center justify-between gap-4">
                <div>
                  <span
                    className="font-mono-tech text-[12px] font-semibold uppercase tracking-[0.1em]"
                    style={{ color: active ? color : "#64748B" }}
                  >
                    {layer.code} · {layer.id}
                  </span>
                  <h3 className="mt-1 text-[22px] font-normal tracking-tight text-[#0B1520]">
                    {pick(locale, layer.name)}
                  </h3>
                </div>
                <Icon
                  size={24}
                  strokeWidth={1.4}
                  className="shrink-0 transition-colors"
                  style={{ color: active ? color : "#94A3B8" }}
                />
              </div>

              <p className="mt-3 text-[15px] leading-relaxed text-[#475569]">
                {pick(locale, layer.summary)}
              </p>
            </button>
          );
        })}
      </div>

      {/* Right: 4-Layer Crystal Strata Artwork + Clean Execution Trace */}
      <div className="overflow-hidden rounded-2xl bg-[#02080E] text-white ring-1 ring-white/[0.08] lg:col-span-6">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src="/art/cyano-core-strata.webp"
            alt={t(locale, "Cyano Core 四层光学架构示意", "Cyano Core four-layer optical architecture")}
            width={strataMeta.width}
            height={strataMeta.height}
            sizes="(max-width: 1024px) 95vw, 600px"
            placeholder={strataMeta.blurDataURL ? "blur" : "empty"}
            blurDataURL={strataMeta.blurDataURL || undefined}
            className="h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#02080E] to-transparent"
          />
        </div>

        <div className="p-7 sm:p-9">
          <div
            className="font-mono-tech text-[12px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: activeColor }}
          >
            0{selected + 1} / 04 · {current.id}
          </div>
          <h3 className="mt-2 text-[24px] font-normal text-white">
            {pick(locale, current.name)}
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-white/75">
            {pick(locale, current.requestAction)}
          </p>

          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="font-mono-tech text-[12px] uppercase tracking-[0.1em] text-white/50">
              {t(locale, "审计日志记录样例", "AUDIT TRACE RECORD")}
            </div>
            <pre
              className="font-mono-tech mt-2 overflow-x-auto text-[13px]"
              style={{ color: activeColor }}
            >
              {current.auditOutput}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ContextBudgetBar:
 * Clean Polychromatic Spectrum Window on Pure Black (#000000), ZERO nested card boxes!
 */
export function ContextBudgetBar({ locale }: { locale: Locale }) {
  const tiers = siteCopy.technology.contextTiers;
  const barColors = ["#22D3EE", "#60A5FA", "#A78BFA", "#FBBF24"];

  return (
    <div className="space-y-12">
      {/* Unbounded Raw History vs Structured Budget Spectrum */}
      <div className="space-y-8">
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 text-[13px]">
            <span className="text-white/70">
              {t(
                locale,
                "未处理的完整历史拼接（超出窗口，关键指令易被稀释）",
                "Unprocessed full chat history (exceeds context budget, dilutes instructions)"
              )}
            </span>
            <span className="font-mono-tech font-semibold text-[#FBBF24]">
              100% + {t(locale, "溢出截断风险", "Truncation risk")}
            </span>
          </div>
          <div className="mt-3 h-2.5 w-full rounded-full bg-gradient-to-r from-white/25 via-[#F59E0B]/65 to-[#FB7185]" />
        </div>

        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 text-[13px]">
            <span className="text-white">
              {t(
                locale,
                "经 Cyano Core 四级估值压缩后的有效窗口",
                "Active context window after 4-tier valuation & compression"
              )}
            </span>
            <span className="font-mono-tech font-semibold text-[#22D3EE]">
              ~62% {t(locale, "预算占用 · 关键指令 100% 保留", "budget used · 100% instruction retention")}
            </span>
          </div>

          <div className="mt-3 h-3 w-full rounded-full bg-white/10">
            <div className="flex h-full w-[62%] gap-1 overflow-hidden rounded-full">
              {tiers.map((tier, idx) => (
                <div
                  key={idx}
                  style={{
                    width: `${tier.sharePercent}%`,
                    backgroundColor: barColors[idx % barColors.length],
                  }}
                  className="h-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Open Hairline Columns */}
      <div className="grid gap-8 border-t border-white/12 pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier, idx) => (
          <div key={idx}>
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: barColors[idx % barColors.length] }}
              />
              <span className="font-mono-tech text-[13px] font-semibold text-white">
                {tier.tier} · {tier.sharePercent}%
              </span>
            </div>
            <h3 className="mt-2.5 text-[17px] font-medium text-white">
              {pick(locale, tier.name)}
            </h3>
            <div className="mt-1 text-[12px] font-medium text-[#00C2FF]">
              {pick(locale, tier.policy)}
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-white/65">
              {pick(locale, tier.detail)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * TurnCostLatencyChart:
 * Clean Polychromatic Curve + jrvs.ca-inspired 2x2 Minimalist Metric Grid!
 */
export function TurnCostLatencyChart({ locale }: { locale: Locale }) {
  const [turn, setTurn] = useState(80);
  const benchmarks = siteCopy.technology.benchmarks;

  const rawLatencyMs = Math.round(240 + turn * 27.5);
  const coreLatencyMs = Math.round(145 + Math.min(turn, 20) * 1.8);
  const savedPct = turn < 8 ? 12 : Math.min(40, Math.round(14 + turn * 0.32));

  const xPos = 56 + (turn / 100) * 504;
  const rawY = 176 - (turn / 100) * 142;
  const coreY = 166 - Math.min(turn / 100, 0.25) * 20;

  return (
    <div className="space-y-16">
      {/* Interactive Curve Canvas */}
      <div className="border-t border-b border-white/12 py-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="font-mono-tech text-[12px] uppercase tracking-[0.12em] text-[#00C2FF]">
              {t(
                locale,
                "交互推演 · 第 1 轮至第 100 轮对话",
                "INTERACTIVE CURVE · TURN 1 TO TURN 100"
              )}
            </div>
            <h3 className="mt-2 text-[24px] font-normal text-white">
              {t(
                locale,
                "随对话轮次增长的拼装延迟与调用成本对比",
                "Context assembly latency & token spend across multi-turn tasks"
              )}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {[1, 25, 50, 80, 100].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTurn(preset)}
                className={`min-h-[36px] rounded-full px-3.5 font-mono-tech text-[12px] transition-colors ${
                  turn === preset
                    ? "bg-white font-semibold text-black"
                    : "border border-white/15 text-white/75 hover:border-white/40 hover:text-white"
                }`}
              >
                T{preset}
              </button>
            ))}
          </div>
        </div>

        <svg
          viewBox="0 0 600 210"
          fill="none"
          aria-hidden="true"
          className="mt-8 h-auto w-full"
        >
          {[45, 90, 135, 180].map((y) => (
            <line
              key={y}
              x1="56"
              y1={y}
              x2="560"
              y2={y}
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="4 4"
            />
          ))}

          {/* Raw Unbounded Curve (Warm Amber-Coral Signal) */}
          <path
            d="M 56 176 Q 280 120, 560 34"
            stroke="#F59E0B"
            strokeWidth="2.4"
          />

          {/* Cyano Core Curve (Cyano Cyan) */}
          <path
            d="M 56 166 Q 160 150, 560 146"
            stroke="#22D3EE"
            strokeWidth="2.8"
          />

          {/* Active Turn Scrub Line */}
          <line
            x1={xPos}
            y1="24"
            x2={xPos}
            y2="182"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.2"
          />
          <circle cx={xPos} cy={rawY} r="5" fill="#F59E0B" />
          <circle cx={xPos} cy={coreY} r="5.5" fill="#22D3EE" />

          <text x="56" y="200" fill="rgba(255,255,255,0.5)" fontSize="12" fontFamily="monospace">
            Turn 1
          </text>
          <text x="290" y="200" fill="rgba(255,255,255,0.5)" fontSize="12" fontFamily="monospace">
            Turn 50
          </text>
          <text x="510" y="200" fill="rgba(255,255,255,0.5)" fontSize="12" fontFamily="monospace">
            Turn 100
          </text>
        </svg>

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <label className="flex items-center gap-4 text-[14px] text-white/80">
            <span className="font-mono-tech shrink-0 text-white">
              {t(locale, `第 ${turn} 轮`, `Turn ${turn}`)}
            </span>
            <input
              type="range"
              min={1}
              max={100}
              value={turn}
              onChange={(e) => setTurn(Number(e.target.value))}
              aria-label={t(locale, "选择对话轮次", "Select conversation turn")}
              className="h-7 w-full cursor-pointer py-2 accent-[#00C2FF]"
            />
          </label>

          <div className="flex flex-wrap items-center gap-6 font-mono-tech text-[13px]">
            <span className="text-[#FDA4AF]">
              {t(locale, "原始历史：", "Raw history: ")}~{rawLatencyMs}ms
            </span>
            <span className="font-semibold text-[#00C2FF]">
              Cyano Core: ~{coreLatencyMs}ms* (-{savedPct}% tok)
            </span>
          </div>
        </div>
      </div>

      {/* jrvs.ca-inspired Architectural 2x2 / 4-Cell Hairline Metric Grid */}
      <div className="grid border-t border-l border-white/15 sm:grid-cols-2 lg:grid-cols-4">
        {benchmarks.map((b, idx) => (
          <div
            key={idx}
            className="border-r border-b border-white/15 p-7 sm:p-8"
          >
            <div className="text-[clamp(2.2rem,3.2vw,3rem)] font-light tracking-tight text-white tabular-nums">
              <span>{pick(locale, b.value)}</span>
              {b.hasFootnote && (
                <sup className="ml-0.5 text-[0.5em] text-[#00C2FF]">*</sup>
              )}
            </div>
            <div className="mt-3 text-[16px] font-medium text-white">
              {pick(locale, b.label)}
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-white/60">
              {pick(locale, b.condition)}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[13px] leading-relaxed text-white/55">
        {pick(locale, siteCopy.technology.benchmarkFootnote)}
      </p>
    </div>
  );
}

/**
 * SupportedStackGroups:
 * Clean 3-Row Open Editorial Hairline Table (ZERO pill-box clutter!).
 */
export function SupportedStackGroups({ locale }: { locale: Locale }) {
  const accents = ["#0B7A8C", "#1D4ED8", "#B45309"];

  return (
    <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
      {siteCopy.technology.stackGroups.map((grp, idx) => (
        <div
          key={idx}
          className="grid gap-4 py-8 md:grid-cols-[260px_1fr] md:items-baseline md:gap-10"
        >
          <div className="flex items-center gap-3">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: accents[idx % accents.length] }}
            />
            <h3 className="text-[19px] font-medium text-[#111111]">
              {pick(locale, grp.category)}
            </h3>
          </div>

          <p className="text-[16px] leading-loose text-[#334155]">
            {grp.items.map((item) => pick(locale, item)).join("   ·   ")}
          </p>
        </div>
      ))}
    </div>
  );
}
