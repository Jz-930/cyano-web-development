"use client";

import { useEffect, useRef } from "react";

export type FieldPreset =
  | "hero"
  | "converge"
  | "panel"
  | "closing"
  | "solution";

type Props = {
  preset?: FieldPreset;
  focusSelector?: string;
  textEdgeSelector?: string;
  intro?: boolean;
};

const PRESETS: Record<
  FieldPreset,
  { mode: number; strength: number; focus: [number, number] }
> = {
  hero: { mode: 0, strength: 1.0, focus: [0.55, 0.5] },
  solution: { mode: 0, strength: 0.4, focus: [0.55, 0.5] },
  converge: { mode: 1, strength: 0.7, focus: [0.7, 0.5] },
  panel: { mode: 0, strength: 0.15, focus: [0.6, 0.5] },
  closing: { mode: 1, strength: 0.22, focus: [0.78, 0.5] },
};

export const FIELD_POSTERS: Record<
  FieldPreset,
  { avif1440: string; avif720: string; webp1440: string; webp720: string }
> = {
  hero: {
    avif1440: "/media/field/hero.avif",
    avif720: "/media/field/hero-720.avif",
    webp1440: "/media/field/hero.webp",
    webp720: "/media/field/hero-720.webp",
  },
  solution: {
    avif1440: "/media/field/solution.avif",
    avif720: "/media/field/solution-720.avif",
    webp1440: "/media/field/solution.webp",
    webp720: "/media/field/solution-720.webp",
  },
  converge: {
    avif1440: "/media/field/converge.avif",
    avif720: "/media/field/converge-720.avif",
    webp1440: "/media/field/converge.webp",
    webp720: "/media/field/converge-720.webp",
  },
  panel: {
    avif1440: "/media/field/panel.avif",
    avif720: "/media/field/panel-720.avif",
    webp1440: "/media/field/panel.webp",
    webp720: "/media/field/panel-720.webp",
  },
  closing: {
    avif1440: "/media/field/closing.avif",
    avif720: "/media/field/closing-720.avif",
    webp1440: "/media/field/closing.webp",
    webp720: "/media/field/closing-720.webp",
  },
};

export function LightField({
  preset = "hero",
  focusSelector,
  textEdgeSelector,
  intro = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || cancelled) return;
        observer.disconnect();
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (matchMedia("(max-width: 800px), (pointer: coarse)").matches) return;
        const { mountField } = await import("./light-field.js");
        if (cancelled) return;
        const cfg = PRESETS[preset];
        const scope = host.closest("section") ?? host.parentElement;
        const focusEl = focusSelector
          ? (scope?.querySelector<HTMLElement>(focusSelector) ?? null)
          : null;
        const textEdgeEl = textEdgeSelector
          ? (scope?.querySelector<HTMLElement>(textEdgeSelector) ?? null)
          : null;
        dispose = mountField(host, {
          mode: cfg.mode,
          strength: cfg.strength,
          focus: [...cfg.focus],
          focusEl,
          textEdgeEl,
          intro,
        });
      },
      { rootMargin: "120px" },
    );

    observer.observe(host);
    return () => {
      cancelled = true;
      observer.disconnect();
      dispose?.();
    };
  }, [preset, focusSelector, textEdgeSelector, intro]);

  const p = FIELD_POSTERS[preset];
  const eager =
    preset === "hero" || preset === "solution" || preset === "converge";

  return (
    <div
      ref={ref}
      className={`light-field absolute inset-0 [z-index:var(--z-field)] pointer-events-none overflow-hidden [background:var(--n0)] field-${preset}`}
      data-preset={preset}
      data-intro={intro ? "true" : undefined}
      aria-hidden="true"
    >
      <picture>
        <source
          type="image/avif"
          srcSet={`${p.avif720} 720w, ${p.avif1440} 1440w`}
          sizes="(max-width: 800px) 240px, 100vw"
        />
        <source
          type="image/webp"
          srcSet={`${p.webp720} 720w, ${p.webp1440} 1440w`}
          sizes="(max-width: 800px) 240px, 100vw"
        />
        <img
          src={p.webp1440}
          width={1440}
          height={900}
          alt=""
          decoding="async"
          loading={eager ? "eager" : "lazy"}
        />
      </picture>
    </div>
  );
}
