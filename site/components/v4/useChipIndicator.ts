"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useChipIndicator(activeKey: string | number) {
  const groupRef = useRef<HTMLDivElement | null>(null);
  const readyRef = useRef(false);

  useIsoLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const update = () => {
      const active = group.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (!active) return;
      group.style.setProperty("--ix", `${active.offsetLeft}px`);
      group.style.setProperty("--iy", `${active.offsetTop}px`);
      group.style.setProperty("--iw", `${active.offsetWidth}px`);
      group.style.setProperty("--ih", `${active.offsetHeight}px`);
    };

    update();

    let raf = 0;
    if (!readyRef.current) {
      raf = window.requestAnimationFrame(() => {
        readyRef.current = true;
        group.setAttribute("data-ready", "true");
      });
    }

    const ro = new ResizeObserver(() => update());
    ro.observe(group);
    window.addEventListener("resize", update, { passive: true });

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [activeKey]);

  return groupRef;
}
