"use client";

import { useEffect, useState } from "react";

export function ConvergeWindow({ layers }: { layers: string[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = 0;
    const start = () => {
      if (id) window.clearInterval(id);
      id = window.setInterval(() => {
        if (!document.hidden) {
          setActive((prev) => (prev + 1) % layers.length);
        }
      }, 1600);
    };
    start();
    const onVis = () => {
      if (document.hidden && id) {
        window.clearInterval(id);
        id = 0;
      } else if (!document.hidden && !id) {
        start();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      if (id) window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [layers.length]);

  return (
    <div className="converge-window glass flex flex-col [gap:var(--sp-5)] [padding:var(--sp-6)] [border-radius:var(--r-window)] [max-width:440px] [margin-left:auto] [@media(max-width:1023px)]:[margin-left:0]" data-surface="dark" aria-hidden="true">
      <div className="converge-head flex items-center justify-between [padding-bottom:var(--sp-3)] [border-bottom:1px_solid_var(--dark-line-soft)]">
        <span className="converge-dots inline-flex [gap:6px]">
          <i />
          <i />
          <i />
        </span>
        <span className="label">Cyano Core</span>
      </div>

      <ul className="converge-layers flex flex-col [gap:var(--sp-2)] list-none m-0 p-0">
        {layers.map((name, idx) => (
          <li
            key={name}
            className="converge-layer flex items-center [gap:var(--sp-3)] [padding:var(--sp-3)_var(--sp-4)] [border-radius:var(--r-control)] [font-size:14px] [font-weight:500] [transition:border-color_var(--qtb),color_var(--qtb),background-color_var(--qtb)]"
            data-active={active === idx ? "true" : undefined}
          >
            <span className="converge-node [width:8px] [height:8px] [border-radius:var(--r-chip)] [transition:background-color_var(--qtb)]" />
            <span>{name}</span>
          </li>
        ))}
      </ul>

      <div className="converge-progress [height:2px] [background:var(--dark-line-soft)] [border-radius:var(--r-chip)] overflow-hidden">
        <span
          key={active}
          className="converge-progress-bar block w-full h-full [background:var(--cyan)]"
          data-motion="transform"
        />
      </div>
    </div>
  );
}
