"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { Locale } from "@/lib/locale";
import { caseMetaByMockup, copyNew, mk, mkStage } from "@/lib/mockups";
import { MockupWindow } from "./MockupWindow";
import { ProvenanceLines } from "./ProvenanceLines";
import { SceneProposal } from "./scenes/SceneProposal";
import { SceneWiki } from "./scenes/SceneWiki";
import { usePointerHalo } from "./usePointerHalo";

const PROPOSAL_PATHS = [
  "M216 90 C 236 90, 232 260, 248 260",
  "M224 260 L 248 260",
  "M216 430 C 236 430, 232 260, 248 260",
  "M248 260 C 268 260, 268 176, 296 176",
  "M248 260 L 296 256",
  "M248 260 C 268 260, 268 336, 296 336",
];

const WIKI_PATHS = [
  "M216 90 C 236 90, 232 260, 248 260",
  "M224 260 L 248 260",
  "M216 430 C 236 430, 232 260, 248 260",
  "M248 260 C 268 260, 268 188, 296 188",
  "M248 260 C 268 260, 268 236, 296 236",
  "M248 260 C 268 260, 268 308, 296 308",
];

const S1_STEPS = [0, 60, 1200, 1800, 3600, 4800, 5600, 7000] as const;
const SEGMENT_DURATION = 7600;
const MAX_SEGMENTS = 6; // 3 full round-trips (proposal <-> wiki), then settles on proposal end state

export function ProvenanceStage({ locale }: { locale: Locale }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  usePointerHalo(stageRef);

  const [scene, setScene] = useState<"proposal" | "wiki">("proposal");
  const [step, setStep] = useState<number>(6);
  const [userPaused, setUserPaused] = useState(false);
  const [focusCite, setFocusCite] = useState<number | null>(null);

  const hoverInTimer = useRef<number>(0);
  const hoverOutTimer = useRef<number>(0);
  const runtimeRef = useRef({
    raf: 0,
    segStart: 0,
    segmentsDone: 0,
    visible: false,
    reduced: false,
    citeActive: false,
    resumeAtStep6: false,
  });

  // Dynamic container scaling for 801–1023px tablet stacked layout
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const syncScale = () => {
      const vw = window.innerWidth;
      if (vw > 800 && vw < 1024) {
        const w = shell.clientWidth;
        const k = Math.min(1, w / 760);
        shell.style.setProperty("--stage-k", k.toFixed(4));
        shell.style.height = `${Math.round(520 * k)}px`;
      } else {
        shell.style.removeProperty("--stage-k");
        shell.style.removeProperty("height");
      }
    };
    const ro = new ResizeObserver(syncScale);
    ro.observe(shell);
    window.addEventListener("resize", syncScale, { passive: true });
    syncScale();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncScale);
    };
  }, []);

  // S1 narrative engine (7600ms per segment, max 6 segments = 3 round-trips)
  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    const reduceMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rt = runtimeRef.current;
    rt.reduced = reduceMedia.matches;

    if (rt.reduced) {
      setScene("proposal");
      setStep(6);
      return;
    }

    const stop = () => {
      if (rt.raf) {
        cancelAnimationFrame(rt.raf);
        rt.raf = 0;
      }
    };

    const tick = (now: number) => {
      if (
        !rt.visible ||
        document.hidden ||
        userPaused ||
        rt.citeActive ||
        rt.reduced
      ) {
        rt.raf = 0;
        return;
      }
      if (!rt.segStart) {
        rt.segStart = rt.resumeAtStep6 ? now - 5600 : now;
        rt.resumeAtStep6 = false;
      }
      const elapsed = now - rt.segStart;
      let k = 0;
      for (let i = 0; i < S1_STEPS.length; i++) {
        if (elapsed >= S1_STEPS[i]) k = i;
      }
      setStep((prev) => (prev === k ? prev : k));

      if (elapsed >= SEGMENT_DURATION) {
        rt.segmentsDone += 1;
        if (rt.segmentsDone >= MAX_SEGMENTS) {
          setScene("proposal");
          setStep(6);
          setUserPaused(true);
          rt.raf = 0;
          return;
        }
        const nextScene = rt.segmentsDone % 2 === 1 ? "wiki" : "proposal";
        setScene(nextScene);
        setStep(0);
        rt.segStart = now;
      }
      rt.raf = requestAnimationFrame(tick);
    };

    const startIfAllowed = (resetSegment: boolean) => {
      if (
        !rt.raf &&
        rt.visible &&
        !document.hidden &&
        !userPaused &&
        !rt.citeActive &&
        !rt.reduced
      ) {
        if (resetSegment && !rt.resumeAtStep6) {
          rt.segStart = 0;
          setStep(0);
        }
        rt.raf = requestAnimationFrame(tick);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = rt.visible;
        rt.visible = entry.isIntersecting;
        if (rt.visible && !wasVisible) {
          startIfAllowed(true);
        } else if (!rt.visible) {
          stop();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    const onVis = () => {
      if (document.hidden) stop();
      else startIfAllowed(true);
    };
    const onReduce = () => {
      rt.reduced = reduceMedia.matches;
      if (rt.reduced) {
        stop();
        setScene("proposal");
        setStep(6);
      }
    };

    document.addEventListener("visibilitychange", onVis);
    reduceMedia.addEventListener("change", onReduce);

    if (userPaused) {
      stop();
      setStep(6);
    } else if (rt.visible) {
      startIfAllowed(!rt.resumeAtStep6);
    }

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      reduceMedia.removeEventListener("change", onReduce);
    };
  }, [userPaused]);

  const handleCite = useCallback((n: number | null) => {
    window.clearTimeout(hoverInTimer.current);
    window.clearTimeout(hoverOutTimer.current);

    if (n !== null) {
      hoverInTimer.current = window.setTimeout(() => {
        runtimeRef.current.citeActive = true;
        if (runtimeRef.current.raf) {
          cancelAnimationFrame(runtimeRef.current.raf);
          runtimeRef.current.raf = 0;
        }
        setFocusCite(n);
      }, 100);
    } else {
      setFocusCite(null);
      hoverOutTimer.current = window.setTimeout(() => {
        const rt = runtimeRef.current;
        if (!rt.citeActive) return;
        rt.citeActive = false;
        rt.resumeAtStep6 = true;
        setStep(6);
        // Trigger effect re-check if not userPaused
        setUserPaused((p) => {
          if (!p && rt.visible && !document.hidden && !rt.reduced) {
            rt.segStart = performance.now() - 5600;
            const resumeTick = () => {
              // Handled smoothly via state kick if needed
            };
            void resumeTick;
          }
          return p;
        });
      }, 1500);
    }
  }, []);

  // Resume rAF loop right when focusCite clears and 1.5s grace expires
  const [resumeKick, setResumeKick] = useState(0);
  const onCiteEvent = useCallback(
    (n: number | null) => {
      window.clearTimeout(hoverInTimer.current);
      window.clearTimeout(hoverOutTimer.current);
      if (n !== null) {
        hoverInTimer.current = window.setTimeout(() => {
          runtimeRef.current.citeActive = true;
          if (runtimeRef.current.raf) {
            cancelAnimationFrame(runtimeRef.current.raf);
            runtimeRef.current.raf = 0;
          }
          setFocusCite(n);
        }, 100);
      } else {
        setFocusCite(null);
        hoverOutTimer.current = window.setTimeout(() => {
          runtimeRef.current.citeActive = false;
          runtimeRef.current.resumeAtStep6 = true;
          setStep(6);
          setResumeKick((x) => x + 1);
        }, 1500);
      }
    },
    [],
  );
  void handleCite;

  useEffect(() => {
    if (resumeKick === 0 || userPaused) return;
    const rt = runtimeRef.current;
    if (rt.reduced || !rt.visible || document.hidden || rt.citeActive || rt.raf) {
      return;
    }
    rt.segStart = performance.now() - 5600;
    rt.resumeAtStep6 = false;
    const tick = (now: number) => {
      if (!rt.visible || document.hidden || userPaused || rt.citeActive || rt.reduced) {
        rt.raf = 0;
        return;
      }
      const elapsed = now - rt.segStart;
      let k = 0;
      for (let i = 0; i < S1_STEPS.length; i++) {
        if (elapsed >= S1_STEPS[i]) k = i;
      }
      setStep((prev) => (prev === k ? prev : k));
      if (elapsed >= SEGMENT_DURATION) {
        rt.segmentsDone += 1;
        if (rt.segmentsDone >= MAX_SEGMENTS) {
          setScene("proposal");
          setStep(6);
          setUserPaused(true);
          rt.raf = 0;
          return;
        }
        const nextScene = rt.segmentsDone % 2 === 1 ? "wiki" : "proposal";
        setScene(nextScene);
        setStep(0);
        rt.segStart = now;
      }
      rt.raf = requestAnimationFrame(tick);
    };
    rt.raf = requestAnimationFrame(tick);
  }, [resumeKick, userPaused]);

  useEffect(
    () => () => {
      window.clearTimeout(hoverInTimer.current);
      window.clearTimeout(hoverOutTimer.current);
    },
    [],
  );

  const handleTogglePause = () => {
    setUserPaused((prev) => {
      const next = !prev;
      if (!next && runtimeRef.current.segmentsDone >= MAX_SEGMENTS) {
        runtimeRef.current.segmentsDone = 0;
        setScene("proposal");
      }
      return next;
    });
  };

  const effectiveStep = focusCite != null ? Math.max(step, 5) : step;
  const provState =
    effectiveStep < 2
      ? "hidden"
      : effectiveStep === 2
        ? "draw"
        : effectiveStep === 3
          ? "flow"
          : "rest";

  const meta = caseMetaByMockup(scene, locale);
  const caption = mk(scene, "caption", locale);
  const status =
    scene === "proposal"
      ? effectiveStep >= 5
        ? mk("proposal", "statusReviewed", locale)
        : mk("proposal", "statusDraft", locale)
      : effectiveStep >= 5
        ? mk("wiki", "statusDone", locale)
        : null;
  const statusTone: "default" | "ok" | "review" =
    scene === "proposal"
      ? effectiveStep >= 5
        ? "review"
        : "default"
      : effectiveStep >= 5
        ? "ok"
        : "default";

  const card1Label = mkStage(scene, 1, locale);
  const card2Label = mkStage(scene, 2, locale);
  const card3Label = mkStage(scene, 3, locale);

  const pauseLabel = copyNew("S1-pause", locale) ?? "Pause demo";
  const playLabel = copyNew("S1-play", locale) ?? "Play demo";

  const focusPaths =
    focusCite != null ? [focusCite - 1, focusCite + 2] : null;

  return (
    <div ref={shellRef} className="mk-stage-shell">
      <div className="mk-stage-frame">
        <div
          ref={stageRef}
          className="mk-stage glass edge-hero halo-host halo-stage"
          data-scene={scene}
          data-step={effectiveStep}
          data-surface="dark"
          style={
            {
              "--breath": effectiveStep === 5 ? 1.03 : 1,
            } as React.CSSProperties
          }
        >
          {/* Back layer: 3 source cards */}
          <div
            className={`mk-source mk-source-1${focusCite === 1 ? " is-cite-focus" : " depth-back"}`}
            aria-hidden="true"
          >
            <span className="label mk-source-tag">
              {card1Label ?? <span className="mk-skel mk-w-64" />}
            </span>
            <span className="mk-skel mk-w-72 mk-h-10" />
            <span className="mk-skel mk-w-92 mk-source-hl" />
            <span className="mk-skel mk-w-80" />
            <span className="mk-skel mk-w-64" />
          </div>

          <div
            className={`mk-source mk-source-2${focusCite === 2 ? " is-cite-focus" : " depth-back"}`}
            aria-hidden="true"
          >
            <span className="label mk-source-tag">
              {card2Label ?? <span className="mk-skel mk-w-64" />}
            </span>
            <div className="mk-sheet-grid">
              {[0, 1, 2, 3].map((r) => (
                <div
                  key={r}
                  className={`mk-sheet-row${r === 0 ? " is-head" : ""}${r === 1 ? " mk-source-hl" : ""}`}
                >
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              ))}
            </div>
          </div>

          <div
            className={`mk-source mk-source-3${focusCite === 3 ? " is-cite-focus" : " depth-back"}`}
            aria-hidden="true"
          >
            <span className="label mk-source-tag">
              {card3Label ?? <span className="mk-skel mk-w-64" />}
            </span>
            <span className="mk-skel mk-w-64 mk-h-10" />
            <span className="mk-skel mk-w-92 mk-source-hl" />
            <span className="mk-skel mk-w-72" />
            <span className="mk-source-chip" />
          </div>

          {/* Provenance 6-path overlay */}
          <ProvenanceLines
            viewBox="0 0 760 520"
            paths={scene === "proposal" ? PROPOSAL_PATHS : WIKI_PATHS}
            surface="dark"
            state={provState}
            focus={focusPaths}
          />

          {/* Middle layer: Core ring */}
          <span className="mk-core mk-stage-core" aria-hidden="true" />

          {/* Middle layer: Main mockup window */}
          <div className="mk-stage-win">
            <MockupWindow
              system={meta.system}
              status={status}
              statusTone={statusTone}
              size="full"
              caption={caption}
            >
              {scene === "proposal" ? (
                <SceneProposal
                  locale={locale}
                  size="full"
                  step={effectiveStep}
                  focusCite={focusCite}
                  onCite={onCiteEvent}
                  showRail={false}
                  interactiveCites
                />
              ) : (
                <SceneWiki
                  locale={locale}
                  size="full"
                  step={effectiveStep}
                  focusCite={focusCite}
                  onCite={onCiteEvent}
                  showRail={false}
                  interactiveCites
                />
              )}
            </MockupWindow>
          </div>
        </div>

        {/* Front layer: sibling glass badge (avoids nested backdrop-filter) */}
        <div
          className="stage-badge glass-badge"
          data-ready={effectiveStep >= 5 ? "true" : "false"}
        >
          <strong className="figure glow-number">{meta.stats[0].value}</strong>
          <span>
            {meta.stats[1].label} <b>{meta.stats[1].value}</b>
          </span>
        </div>

        {/* S1 Pause / Play control */}
        <button
          type="button"
          className="stage-toggle"
          aria-label={userPaused ? playLabel : pauseLabel}
          aria-pressed={userPaused}
          data-motion="transform"
          onClick={handleTogglePause}
        >
          {userPaused ? (
            <Play size={16} aria-hidden="true" />
          ) : (
            <Pause size={16} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
