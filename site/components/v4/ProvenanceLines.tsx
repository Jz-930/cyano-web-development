"use client";

import { useEffect, useId, useRef } from "react";

export type ProvenanceLinesProps = {
  viewBox: string;
  paths: string[];
  surface: "dark" | "paper";
  state: "hidden" | "draw" | "flow" | "rest";
  focus?: number | number[] | null;
  dotOnce?: boolean;
  className?: string;
};

export function ProvenanceLines({
  viewBox,
  paths,
  surface,
  state,
  focus = null,
  dotOnce = true,
  className,
}: ProvenanceLinesProps) {
  const rawId = useId();
  const cleanId = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (state !== "flow") return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timers: number[] = [];
    let intervalId = 0;

    const triggerOnce = () => {
      const svg = svgRef.current;
      if (!svg) return;
      const motions = svg.querySelectorAll<SVGAnimationElement>("animateMotion");
      motions.forEach((m, idx) => {
        const t = window.setTimeout(() => {
          try {
            m.beginElement();
          } catch {
            // Ignore in environments without SMIL support
          }
        }, idx * 150);
        timers.push(t);
      });
    };

    triggerOnce();
    if (!dotOnce) {
      intervalId = window.setInterval(triggerOnce, 4000);
    }

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [state, dotOnce, paths.length]);

  const focusSet =
    focus == null
      ? null
      : Array.isArray(focus)
        ? new Set(focus)
        : new Set([focus]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={`prov${className ? ` ${className}` : ""}`}
      data-surface={surface}
      data-state={state}
      data-focus={focusSet ? "true" : undefined}
    >
      {paths.map((d, i) => {
        const pathId = `p-${cleanId}-${i}`;
        const isFocused = focusSet ? focusSet.has(i) : false;
        return (
          <g key={pathId} className={isFocused ? "is-focus" : undefined}>
            <path id={pathId} className="prov-base [fill:none] [stroke-width:1.25] [vector-effect:non-scaling-stroke] [stroke-dasharray:1]" d={d} pathLength={1} />
            <path className="prov-flow [fill:none] [stroke-width:1.5] [vector-effect:non-scaling-stroke] [stroke-linecap:round] [stroke-dasharray:0.06_1] [stroke-dashoffset:0.06]" d={d} pathLength={1} />
            <circle className="prov-dot [fill:var(--cyan)]" r={2.5}>
              <animateMotion
                dur="900ms"
                begin="indefinite"
                fill="freeze"
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="spline"
                keySplines=".65 0 .35 1"
              >
                <mpath href={`#${pathId}`} />
              </animateMotion>
            </circle>
          </g>
        );
      })}
    </svg>
  );
}
