"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type Handle = { refresh: () => void; dispose: () => void };

/**
 * Site-wide WebGL2 background for paper surfaces. Loaded after idle so it never
 * competes with first paint or the initial JS budget; see paper-field.js.
 */
export function PaperField() {
  const ref = useRef<HTMLDivElement>(null);
  const handle = useRef<Handle | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let cancelled = false;
    const start = async () => {
      const { mountPaperField } = await import("./paper-field.js");
      if (!cancelled) handle.current = mountPaperField(host);
    };
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 600);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      handle.current?.dispose();
      handle.current = null;
    };
  }, []);

  useEffect(() => {
    // New route content: re-collect sections once the transition has settled.
    const id = window.setTimeout(() => handle.current?.refresh(), 450);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return <div ref={ref} className="paper-field" aria-hidden="true" />;
}
