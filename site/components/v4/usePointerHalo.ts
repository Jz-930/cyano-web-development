"use client";
import { useEffect } from "react";

export function usePointerHalo(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    let tx = 75,
      ty = 0,
      x = 75,
      y = 0,
      raf = 0;
    const loop = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--hx", x.toFixed(2) + "%");
      el.style.setProperty("--hy", y.toFixed(2) + "%");
      raf =
        Math.abs(tx - x) + Math.abs(ty - y) > 0.1
          ? requestAnimationFrame(loop)
          : 0;
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 100;
      ty = ((e.clientY - r.top) / r.height) * 100;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const leave = () => {
      tx = 75;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [ref]);
}
