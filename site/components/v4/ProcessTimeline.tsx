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
    <div className="eng-process" ref={ref}>
      <div className="eng-process-rail" aria-hidden="true">
        <ProvenanceLines
          viewBox="0 0 24 520"
          paths={["M12 16 L 12 504"]}
          surface="paper"
          state={drawn ? "draw" : "hidden"}
        />
      </div>

      <ol className="eng-process-list">
        {steps.map((st, idx) => (
          <li
            key={st.indexLabel}
            className="card eng-process-item"
            data-reveal=""
            style={{ "--i": idx } as React.CSSProperties}
          >
            <div className="eng-process-main">
              <span className="label">{st.indexLabel}</span>
              <h3 className="h3">{st.title}</h3>
              <p>{st.desc}</p>
            </div>
            <div className="eng-process-owner">
              <img
                src={st.ownerAvatar}
                alt=""
                width={32}
                height={32}
                loading="lazy"
                decoding="async"
                className="eng-owner-avatar"
              />
              <span className="small">{st.ownerRole}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
