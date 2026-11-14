"use client";

import { useEffect, useRef, useState } from "react";
import { Database, FileText, Plug, ShieldCheck } from "lucide-react";
import { ProvenanceLines } from "./ProvenanceLines";

export type CoreLayerItem = {
  indexLabel: string;
  name: string;
  desc: string;
};

export function CoreArch({ layers }: { layers: CoreLayerItem[] }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const maxPRef = useRef<number>(0);
  const [maxP, setMaxP] = useState<number>(1);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      maxPRef.current = 1;
      setMaxP(1);
      return;
    }

    maxPRef.current = 0;
    setMaxP(0);

    let raf = 0;
    const measure = () => {
      raf = 0;
      const node = rootRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || 900;
      const raw = (vh - rect.top) / (vh * 0.65);
      const clamped = Math.max(0, Math.min(1, raw));
      if (clamped > maxPRef.current) {
        maxPRef.current = clamped;
        setMaxP(clamped);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const thresholds = [0.15, 0.4, 0.65, 0.85];
  const lineState: "hidden" | "draw" | "flow" | "rest" =
    maxP < 0.35 ? "hidden" : maxP < 0.85 ? "draw" : "rest";

  return (
    <div
      ref={rootRef}
      className="core-arch dot-grid"
      data-hovering={hovered !== null ? "true" : undefined}
      onPointerLeave={() => setHovered(null)}
    >
      <ProvenanceLines
        viewBox="0 0 1120 120"
        paths={[
          "M250 60 L 304 60",
          "M534 60 L 588 60",
          "M818 60 L 872 60",
        ]}
        surface="paper"
        state={lineState}
        focus={hovered !== null && hovered < 3 ? hovered : null}
        className="core-arch-lines"
      />

      <div className="core-arch-grid">
        {layers.map((layer, idx) => {
          const lit = maxP >= thresholds[idx];
          const dimmed = hovered !== null && hovered !== idx;
          return (
            <article
              key={layer.indexLabel}
              className="card core-arch-col"
              data-lit={lit ? "true" : "false"}
              data-dimmed={dimmed ? "true" : undefined}
              onPointerEnter={() => setHovered(idx)}
            >
              <div className="core-arch-top">
                <span className="label">{layer.indexLabel}</span>
                <span className="core-arch-lamp" aria-hidden="true" />
              </div>

              <div className="core-arch-diagram" aria-hidden="true">
                {idx === 0 ? (
                  <div className="arch-d-sources">
                    <span className="arch-chip">
                      <FileText size={16} />
                      <i>PDF</i>
                    </span>
                    <span className="arch-chip">
                      <Database size={16} />
                      <i>SQL</i>
                    </span>
                    <span className="arch-chip">
                      <Plug size={16} />
                      <i>API</i>
                    </span>
                  </div>
                ) : idx === 1 ? (
                  <svg
                    viewBox="0 0 180 76"
                    className="arch-d-funnel"
                    focusable="false"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((b) => (
                      <rect
                        key={b}
                        x={10 + b * 20}
                        y="8"
                        width="14"
                        height="12"
                        rx="3"
                        fill={b % 3 === 0 ? "var(--cyan-40)" : "var(--ink-12)"}
                      />
                    ))}
                    <path
                      d="M12 28 L 168 28 L 128 48 L 52 48 Z"
                      fill="var(--p3)"
                      stroke="var(--cyan-40)"
                      strokeWidth="1.25"
                    />
                    {[0, 1, 2].map((s) => (
                      <rect
                        key={s}
                        x={56 + s * 24}
                        y="56"
                        width="18"
                        height="12"
                        rx="3"
                        fill="var(--brand)"
                      />
                    ))}
                  </svg>
                ) : idx === 2 ? (
                  <div className="arch-d-sop">
                    <span className="arch-sop-node">SOP</span>
                    <span className="arch-sop-connector" />
                    <span className="arch-sop-node is-active">Playbook</span>
                    <span className="arch-sop-connector" />
                    <span className="arch-sop-node is-amber" />
                  </div>
                ) : (
                  <div className="arch-d-audit">
                    <div className="arch-log-bars">
                      <i />
                      <i />
                      <i />
                    </div>
                    <span className="arch-shield">
                      <ShieldCheck size={20} />
                    </span>
                  </div>
                )}
              </div>

              <h3 className="h3">{layer.name}</h3>
              <p className="core-arch-desc">{layer.desc}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
