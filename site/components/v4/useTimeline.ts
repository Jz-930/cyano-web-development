"use client";

import { useEffect, useRef, useState } from "react";

export type Step = { at: number };

export function useTimeline(
  ref: React.RefObject<HTMLElement | null>,
  steps: Step[],
  opts: {
    loopAfter?: number;
    maxLoops?: number;
    paused?: boolean;
    onLoop?: (n: number) => void;
    runKey?: number;
  } = {},
) {
  const [step, setStep] = useState(steps.length - 1);
  const state = useRef({ start: 0, raf: 0, visible: false, loops: 0 });
  const onLoopRef = useRef(opts.onLoop);

  useEffect(() => {
    onLoopRef.current = opts.onLoop;
  }, [opts.onLoop]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      setStep(steps.length - 1);
      return;
    }
    const s = state.current;
    s.loops = 0;
    s.start = 0;

    const tick = (now: number) => {
      if (!s.start) s.start = now;
      const t = now - s.start;
      let k = 0;
      for (let i = 0; i < steps.length; i++) {
        if (t >= steps[i].at) k = i;
      }
      setStep((prev) => (prev === k ? prev : k));
      if (opts.loopAfter && t >= opts.loopAfter) {
        s.loops++;
        onLoopRef.current?.(s.loops);
        if (opts.maxLoops && s.loops >= opts.maxLoops) {
          s.raf = 0;
          return;
        }
        s.start = now;
      }
      s.raf = requestAnimationFrame(tick);
    };

    const run = () => {
      if (!s.raf && s.visible && !document.hidden && !opts.paused) {
        s.start = 0;
        setStep(0);
        s.raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    };

    const io = new IntersectionObserver(
      ([e]) => {
        s.visible = e.isIntersecting;
        if (s.visible) run();
        else stop();
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    const vis = () => (document.hidden ? stop() : run());
    document.addEventListener("visibilitychange", vis);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, [ref, steps, opts.loopAfter, opts.maxLoops, opts.paused, opts.runKey]);

  return step;
}
