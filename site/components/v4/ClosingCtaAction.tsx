"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProvenanceLines } from "./ProvenanceLines";

const CLOSING_PATHS = [
  "M0 40 C 120 40, 180 100, 236 100",
  "M0 100 L 236 100",
  "M0 160 C 120 160, 180 100, 236 100",
];

export function ClosingCtaAction({
  ctaHref,
  ctaLabel,
}: {
  ctaHref: string;
  ctaLabel: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const lastFlowAt = useRef<number>(0);
  const flowTimer = useRef<number>(0);
  const restTimer = useRef<number>(0);
  const [provState, setProvState] = useState<"hidden" | "draw" | "flow" | "rest">(
    "hidden",
  );
  const [flowKey, setFlowKey] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProvState("rest");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setProvState("draw");
        flowTimer.current = window.setTimeout(() => {
          lastFlowAt.current = performance.now();
          setProvState("flow");
        }, 320);
        restTimer.current = window.setTimeout(() => {
          setProvState("rest");
        }, 1520);
      },
      { threshold: 0.25 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(flowTimer.current);
      window.clearTimeout(restTimer.current);
    };
  }, []);

  const triggerHoverFlow = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const now = performance.now();
    if (now - lastFlowAt.current < 1200) return;
    lastFlowAt.current = now;
    window.clearTimeout(restTimer.current);
    setFlowKey((k) => k + 1);
    setProvState("flow");
    restTimer.current = window.setTimeout(() => {
      setProvState("rest");
    }, 1220);
  };

  return (
    <div ref={wrapRef} className="closing-action relative [height:200px] [@media(max-width:1023px)]:[height:auto] flex items-center [justify-content:flex-end] [@media(max-width:1023px)]:[justify-content:flex-start]">
      <ProvenanceLines
        key={flowKey}
        viewBox="0 0 320 200"
        paths={CLOSING_PATHS}
        surface="dark"
        state={provState}
        dotOnce={false}
      />
      <span className="halo-button isolate inline-flex">
        <Link
          className="button"
          href={ctaHref}
          onPointerEnter={triggerHoverFlow}
          onFocus={triggerHoverFlow}
        >
          {ctaLabel}
          <ArrowUpRight size={18} />
        </Link>
      </span>
    </div>
  );
}
