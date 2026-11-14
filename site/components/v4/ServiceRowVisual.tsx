"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/locale";
import { copyNew } from "@/lib/copy-new-client";
import type { SceneId } from "@/lib/mockups";
import { mkCallouts } from "@/lib/mockups-extra";
import { Callout } from "./Callout";
import { ProvenanceLines } from "./ProvenanceLines";
import { ScaledSceneMockup } from "./scenes";

export function ServiceRowMockup({
  scene,
  solutionSlug,
  locale,
}: {
  scene: SceneId;
  solutionSlug: string;
  locale: Locale;
}) {
  const [activeCallout, setActiveCallout] = useState<number | null>(null);
  const callouts = mkCallouts(solutionSlug, locale);

  return (
    <div className="service-row-art">
      <ScaledSceneMockup scene={scene} locale={locale} size="full">
        {callouts.length > 0 ? (
          <div className="service-callouts" aria-hidden="true">
            {callouts.map((c) => (
              <Callout
                key={c.n}
                n={c.n}
                x={c.x}
                y={c.y}
                label={c.label}
                showLabel
                active={activeCallout === c.n}
                onHover={setActiveCallout}
              />
            ))}
          </div>
        ) : null}
      </ScaledSceneMockup>
    </div>
  );
}

export function ServiceWorkflowBar({
  solutionSlug,
  locale,
}: {
  solutionSlug: string;
  locale: Locale;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const nodes = ([1, 2, 3, 4] as const)
    .map((n) => copyNew(`S-W.${solutionSlug}.${n}`, locale))
    .filter((v): v is string => Boolean(v));

  if (nodes.length < 4) return null;

  return (
    <div className="service-wf-bar" ref={ref}>
      <ProvenanceLines
        viewBox="0 0 900 20"
        paths={["M80 10 L 310 10", "M360 10 L 560 10", "M610 10 L 820 10"]}
        surface="paper"
        state={drawn ? "draw" : "hidden"}
        className="service-wf-lines"
      />
      <ol className="service-wf-nodes">
        {nodes.map((node, idx) => (
          <li
            key={idx}
            className={`service-wf-node${idx === 1 ? " is-core" : ""}`}
          >
            <span className="label">{`0${idx + 1}`}</span>
            <span>{node}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
