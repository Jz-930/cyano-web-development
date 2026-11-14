"use client";

import { useEffect, useRef, useState } from "react";

export function useMockupScale(
  designWidth = 560,
  designHeight = 380,
  compactWidth = 360,
  compactHeight = 225,
) {
  const ref = useRef<HTMLDivElement>(null);
  const [compactFallback, setCompactFallback] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const applyWidth = (w: number) => {
      if (!w) return;
      const fullK = Math.min(1, w / designWidth);
      if (designWidth > compactWidth && fullK < 0.62) {
        setCompactFallback((prev) => (prev ? prev : true));
        const ck = Math.min(1, w / compactWidth);
        el.style.setProperty("--mk-k", ck.toFixed(4));
        el.style.height = `${Math.round(compactHeight * ck)}px`;
      } else {
        setCompactFallback((prev) => (prev ? false : prev));
        el.style.setProperty("--mk-k", fullK.toFixed(4));
        el.style.height = `${Math.round(designHeight * fullK)}px`;
      }
    };

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width || el.clientWidth;
      applyWidth(w);
    });
    ro.observe(el);

    return () => ro.disconnect();
  }, [designWidth, designHeight, compactWidth, compactHeight]);

  return { ref, compactFallback };
}
