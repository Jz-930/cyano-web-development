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
    <div className="converge-window glass" data-surface="dark" aria-hidden="true">
      <div className="converge-head">
        <span className="converge-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="label">Cyano Core</span>
      </div>

      <ul className="converge-layers">
        {layers.map((name, idx) => (
          <li
            key={name}
            className="converge-layer"
            data-active={active === idx ? "true" : undefined}
          >
            <span className="converge-node" />
            <span>{name}</span>
          </li>
        ))}
      </ul>

      <div className="converge-progress">
        <span
          key={active}
          className="converge-progress-bar"
          data-motion="transform"
        />
      </div>
    </div>
  );
}
