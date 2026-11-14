"use client";

import { useEffect, useRef, useState } from "react";
import { ProvenanceLines } from "./ProvenanceLines";

export type ProcessStepItem = {
  indexLabel: string;
  title: string;
  desc: string;
  ownerRole: string;
  ownerAvatar: string;
};

export function ProcessTimeline({ steps }: { steps: ProcessStepItem[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [drawn, setDrawn] = useState(false);

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
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="eng-process relative [padding-left:var(--sp-7)] [@media(max-width:720px)]:[padding-left:0]" ref={ref}>
      <div className="eng-process-rail absolute [top:var(--sp-4)] [bottom:var(--sp-4)] [left:8px] [width:24px] pointer-events-none [@media(max-width:720px)]:hidden" aria-hidden="true">
        <ProvenanceLines
          viewBox="0 0 24 520"
          paths={["M12 16 L 12 504"]}
          surface="paper"
          state={drawn ? "draw" : "hidden"}
        />
      </div>

      <ol className="eng-process-list flex flex-col [gap:var(--sp-4)] list-none m-0 p-0">
        {steps.map((st, idx) => (
          <li
            key={st.indexLabel}
            className="card eng-process-item"
            data-reveal=""
            style={{ "--i": idx } as React.CSSProperties}
          >
            <div className="eng-process-main flex flex-col [gap:var(--sp-1)]">
              <span className="label">{st.indexLabel}</span>
              <h3 className="h3">{st.title}</h3>
              <p>{st.desc}</p>
            </div>
            <div className="eng-process-owner inline-flex items-center [gap:var(--sp-2)] [padding:6px_12px_6px_6px] [border-radius:var(--r-chip)] [background:var(--p1)] [border:1px_solid_var(--line-soft)] shrink-0">
              <img
                src={st.ownerAvatar}
                alt=""
                width={32}
                height={32}
                loading="lazy"
                decoding="async"
                className="eng-owner-avatar [width:32px] [height:32px] [border-radius:var(--r-chip)] [object-fit:cover] [background:var(--p3)]"
              />
              <span className="small">{st.ownerRole}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
