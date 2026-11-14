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

    const update = () => {
      const w = el.clientWidth;
      if (!w) return;
      const fullK = Math.min(1, w / designWidth);
      if (designWidth > compactWidth && fullK < 0.62) {
        setCompactFallback(true);
        const ck = Math.min(1, w / compactWidth);
        el.style.setProperty("--mk-k", ck.toFixed(4));
        el.style.height = `${Math.round(compactHeight * ck)}px`;
      } else {
        setCompactFallback(false);
        el.style.setProperty("--mk-k", fullK.toFixed(4));
        el.style.height = `${Math.round(designHeight * fullK)}px`;
      }
    };

    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();

    return () => ro.disconnect();
  }, [designWidth, designHeight, compactWidth, compactHeight]);

  return { ref, compactFallback };
}
