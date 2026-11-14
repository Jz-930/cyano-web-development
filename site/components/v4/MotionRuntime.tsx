"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MotionRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const onAnchor = (event: MouseEvent) => {
      const a = (event.target as Element | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!a || a.classList.contains("skip-link")) return;
      const id = a.getAttribute("href")?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      event.preventDefault();
      el.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
      history.pushState(null, "", "#" + id);
    };
    document.addEventListener("click", onAnchor);
    return () => document.removeEventListener("click", onAnchor);
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      "[data-reveal], .rule-dot",
    );
    let initialBatch = true;
    const resetQueue: HTMLElement[] = [];
    let resetRaf = 0;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        const vh = window.innerHeight;
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (initialBatch && entry.boundingClientRect.top < vh) {
            el.style.transition = "none";
            el.classList.add("is-in");
            resetQueue.push(el);
            revealObserver.unobserve(el);
          } else if (entry.isIntersecting) {
            el.classList.add("is-in");
            revealObserver.unobserve(el);
          }
        }
        if (initialBatch) {
          initialBatch = false;
          if (resetQueue.length > 0) {
            resetRaf = window.requestAnimationFrame(() => {
              for (const el of resetQueue) {
                el.style.removeProperty("transition");
              }
            });
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );

    targets.forEach((el) => {
      if (!el.classList.contains("is-in")) {
        revealObserver.observe(el);
      }
    });

    const stages = document.querySelectorAll<HTMLElement>(".product-stage");
    const stageObserver = new IntersectionObserver((entries) => {
      for (const e of entries) {
        (e.target as HTMLElement).dataset.playing = String(e.isIntersecting);
      }
    });
    stages.forEach((el) => stageObserver.observe(el));

    let pointerRaf = 0;
    let lastEvent: PointerEvent | null = null;
    const applyPointer = () => {
      pointerRaf = 0;
      const event = lastEvent;
      if (!event) return;
      const target = (event.target as Element | null)?.closest?.(
        ".edge-pointer",
      ) as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      target.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      lastEvent = event;
      if (!pointerRaf) pointerRaf = window.requestAnimationFrame(applyPointer);
    };

    const onVisibility = () => {
      document.documentElement.classList.toggle("motion-paused", document.hidden);
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();

    return () => {
      if (resetRaf) window.cancelAnimationFrame(resetRaf);
      if (pointerRaf) window.cancelAnimationFrame(pointerRaf);
      revealObserver.disconnect();
      stageObserver.disconnect();
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      document.documentElement.classList.remove("motion-paused");
    };
  }, [pathname]);

  return null;
}
