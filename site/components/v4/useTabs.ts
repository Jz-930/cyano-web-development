"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useTabs(count: number, initial = 0) {
  const [selected, setSelected] = useState(initial);
  const [leaving, setLeaving] = useState<number | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const tablistRef = useRef<HTMLDivElement | null>(null);
  const panelsRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number>(0);

  const select = useCallback((i: number) => {
    setSelected((prev) => {
      if (prev !== i) {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        setLeaving(prev);
        timerRef.current = window.setTimeout(() => setLeaving(null), 154);
      }
      return i;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  useIsoLayoutEffect(() => {
    const list = tablistRef.current;
    const active = tabs.current[selected];
    if (!list || !active) return;

    const updateIndicator = () => {
      const btn = tabs.current[selected];
      if (!btn || !tablistRef.current) return;
      tablistRef.current.style.setProperty("--ty", `${btn.offsetTop}px`);
      tablistRef.current.style.setProperty("--th", `${btn.offsetHeight}px`);
      tablistRef.current.style.setProperty("--tx", `${btn.offsetLeft}px`);
      tablistRef.current.style.setProperty("--tw", `${btn.offsetWidth}px`);
    };

    updateIndicator();
    const ro = new ResizeObserver(() => updateIndicator());
    ro.observe(list);
    return () => ro.disconnect();
  }, [selected, count]);

  useIsoLayoutEffect(() => {
    const container = panelsRef.current;
    if (!container) return;

    const measureMaxHeight = () => {
      const panels = Array.from(
        container.querySelectorAll<HTMLElement>('[role="tabpanel"]'),
      );
      if (!panels.length) return;
      let maxH = 0;
      for (const panel of panels) {
        const wasHidden = panel.hidden;
        const prevStyle = panel.getAttribute("style");
        if (wasHidden) {
          panel.hidden = false;
          panel.style.visibility = "hidden";
          panel.style.position = "absolute";
          panel.style.insetInline = "0";
          panel.style.pointerEvents = "none";
        }
        const h = panel.offsetHeight;
        if (h > maxH) maxH = h;
        if (wasHidden) {
          panel.hidden = true;
          if (prevStyle === null) panel.removeAttribute("style");
          else panel.setAttribute("style", prevStyle);
        }
      }
      if (maxH > 0) {
        container.style.minHeight = `${maxH}px`;
      }
    };

    measureMaxHeight();
    window.addEventListener("resize", measureMaxHeight, { passive: true });
    return () => window.removeEventListener("resize", measureMaxHeight);
  }, [count]);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const map: Record<string, number> = {
      ArrowRight: i + 1,
      ArrowDown: i + 1,
      ArrowLeft: i - 1,
      ArrowUp: i - 1,
      Home: 0,
      End: count - 1,
    };
    if (e.key in map) {
      e.preventDefault();
      const n = (map[e.key] + count) % count;
      tabs.current[n]?.focus();
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(i);
    }
  };

  const tabProps = (i: number) => ({
    ref: (el: HTMLButtonElement | null) => {
      tabs.current[i] = el;
    },
    role: "tab" as const,
    "aria-selected": selected === i,
    tabIndex: selected === i ? 0 : -1,
    onClick: () => select(i),
    onKeyDown: (e: React.KeyboardEvent) => onKeyDown(e, i),
  });

  const panelProps = (i: number) => ({
    role: "tabpanel" as const,
    hidden: selected !== i && leaving !== i,
    "data-state": selected === i ? "enter" : leaving === i ? "exit" : "idle",
  });

  return { selected, select, tabProps, panelProps, tablistRef, panelsRef };
}
