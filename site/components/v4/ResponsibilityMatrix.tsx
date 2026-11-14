"use client";

import { useEffect, useRef, useState } from "react";
import { ProvenanceLines } from "./ProvenanceLines";

export type MatrixFounder = {
  id: string;
  order: number;
  role: string;
  stages: number[];
};

export function ResponsibilityMatrix({
  founders,
  stageNames,
}: {
  founders: MatrixFounder[];
  stageNames: string[];
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [drawn, setDrawn] = useState(false);
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Build SVG provenance paths across responsible stage columns for each founder row
  // Grid coordinate space inside 5-stage track: x(stage s in 1..5) = (s - 0.5) * 100 on viewBox 500 x 240
  const rowPaths = founders
    .map((f, rIdx) => {
      const sorted = [...f.stages].sort((a, b) => a - b);
      if (sorted.length < 2) return null;
      const x1 = (sorted[0] - 0.5) * 100;
      const x2 = (sorted[sorted.length - 1] - 0.5) * 100;
      const y = (rIdx + 0.5) * 60;
      return `M${x1} ${y} L ${x2} ${y}`;
    })
    .filter((p): p is string => p !== null);

  return (
    <div
      className="resp-matrix card [margin-bottom:var(--sp-7)]"
      ref={ref}
      onPointerLeave={() => {
        setHoverRow(null);
        setHoverCol(null);
      }}
    >
      <div className="resp-matrix-scroll [overflow-x:auto]" tabIndex={0}>
        <div className="resp-matrix-inner [min-width:680px]">
          {/* Header row: empty corner + 5 stages */}
          <div className="resp-head-row grid [grid-template-columns:220px_repeat(5,minmax(0,1fr))] [border-bottom:1px_solid_var(--line)]">
            <div className="resp-corner" />
            {stageNames.map((st, cIdx) => (
              <div
                key={st}
                className="resp-stage-head flex flex-col items-center [gap:4px] [padding:var(--sp-3)_var(--sp-2)] text-center [font-size:13px] [font-weight:500] [color:var(--ink)] [border-radius:var(--r-control)_var(--r-control)_0_0] [transition:background-color_var(--qtf)]"
                data-highlight={hoverCol === cIdx ? "true" : undefined}
                onPointerEnter={() => setHoverCol(cIdx)}
              >
                <span className="label">{`0${cIdx + 1}`}</span>
                <span>{st}</span>
              </div>
            ))}
          </div>

          {/* Body: 4 founder rows x 5 stage cells, overlaid with ProvenanceLines */}
          <div className="resp-body relative">
            {rowPaths.length > 0 ? (
              <div className="resp-lines-wrap absolute [top:0] [bottom:0] [left:220px] [right:0] pointer-events-none [z-index:0]" aria-hidden="true">
                <ProvenanceLines
                  viewBox={`0 0 500 ${founders.length * 60}`}
                  paths={rowPaths}
                  surface="paper"
                  state={drawn ? "draw" : "hidden"}
                />
              </div>
            ) : null}

            {founders.map((f, rIdx) => (
              <div
                key={f.id}
                className="resp-row relative [z-index:1] grid [grid-template-columns:220px_repeat(5,minmax(0,1fr))] [min-height:60px] [transition:background-color_var(--qtf)]"
                data-highlight={hoverRow === rIdx ? "true" : undefined}
                onPointerEnter={() => setHoverRow(rIdx)}
              >
                <div className="resp-founder-cell flex items-center [gap:var(--sp-3)] [padding:var(--sp-2)_var(--sp-3)] [font-size:14px] [font-weight:500] [color:var(--ink)]">
                  <img
                    src={`/v3-materials/founder-${f.order + 1}.webp`}
                    alt=""
                    width={28}
                    height={28}
                    loading="lazy"
                    decoding="async"
                    className="resp-mini-avatar [width:28px] [height:28px] [border-radius:var(--r-chip)] [object-fit:cover] [background:var(--p3)] shrink-0"
                  />
                  <span>{f.role}</span>
                </div>

                {stageNames.map((st, cIdx) => {
                  const stageNo = cIdx + 1;
                  const active = f.stages.includes(stageNo);
                  const cellHi = hoverRow === rIdx || hoverCol === cIdx;
                  return (
                    <div
                      key={st}
                      className="resp-cell grid [place-items:center] [transition:background-color_var(--qtf)]"
                      data-highlight={cellHi ? "true" : undefined}
                      onPointerEnter={() => {
                        setHoverRow(rIdx);
                        setHoverCol(cIdx);
                      }}
                    >
                      {active ? (
                        <span
                          className="resp-dot [width:12px] [height:12px] [border-radius:var(--r-chip)] [background:var(--brand)] [box-shadow:0_0_0_4px_var(--p2)]"
                          role="img"
                          aria-label={`${f.role} — ${st}`}
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
