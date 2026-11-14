"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { Locale } from "@/lib/locale";
import { copyNew } from "@/lib/copy-new-client";

type Mode = "full" | "select";
type Stage = "early" | "long";

type BlockDef = {
  id: number;
  kind: 1 | 2 | 3 | 4; // 1=User, 2=Assistant, 3=Source excerpt, 4=Core instruction
  inEarly: boolean;
  keepInLongSelect: boolean;
};

const BLOCKS: BlockDef[] = [
  { id: 0, kind: 4, inEarly: true, keepInLongSelect: true },
  { id: 1, kind: 1, inEarly: true, keepInLongSelect: false },
  { id: 2, kind: 2, inEarly: true, keepInLongSelect: false },
  { id: 3, kind: 3, inEarly: true, keepInLongSelect: true },
  { id: 4, kind: 1, inEarly: false, keepInLongSelect: false },
  { id: 5, kind: 2, inEarly: false, keepInLongSelect: false },
  { id: 6, kind: 3, inEarly: false, keepInLongSelect: false },
  { id: 7, kind: 1, inEarly: false, keepInLongSelect: false },
  { id: 8, kind: 2, inEarly: false, keepInLongSelect: false },
  { id: 9, kind: 3, inEarly: false, keepInLongSelect: true },
  { id: 10, kind: 1, inEarly: false, keepInLongSelect: true },
  { id: 11, kind: 2, inEarly: false, keepInLongSelect: true },
];

export function ContextPacker({ locale }: { locale: Locale }) {
  const [mode, setMode] = useState<Mode>("select");
  const [stage, setStage] = useState<Stage>("long");
  const [shakeKey, setShakeKey] = useState(0);

  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());
  const prevRectsRef = useRef<Map<number, DOMRect>>(new Map());
  const modeBtnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const stageBtnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const capturePositions = () => {
    const map = new Map<number, DOMRect>();
    itemRefs.current.forEach((el, id) => {
      if (el.isConnected) {
        map.set(id, el.getBoundingClientRect());
      }
    });
    prevRectsRef.current = map;
  };

  const changeMode = (next: Mode) => {
    if (next === mode) return;
    capturePositions();
    setMode(next);
    if (next === "full" && stage === "long") {
      setShakeKey((k) => k + 1);
    }
  };

  const changeStage = (next: Stage) => {
    if (next === stage) return;
    capturePositions();
    setStage(next);
    if (mode === "full" && next === "long") {
      setShakeKey((k) => k + 1);
    }
  };

  useLayoutEffect(() => {
    const prev = prevRectsRef.current;
    if (prev.size === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      prevRectsRef.current = new Map();
      return;
    }

    itemRefs.current.forEach((el, id) => {
      const first = prev.get(id);
      if (!first || !el.isConnected) return;
      const last = el.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;

      el.style.transition = "none";
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      requestAnimationFrame(() => {
        el.style.transition =
          "transform var(--dur-enter) var(--ease-out), opacity var(--dur-base) var(--ease-out)";
        el.style.transform = "translate3d(0, 0, 0)";
      });
    });

    prevRectsRef.current = new Map();
  }, [mode, stage]);

  const m1 = copyNew("S3-m1", locale) ?? "Send full history";
  const m2 = copyNew("S3-m2", locale) ?? "Select context per task";
  const t1 = copyNew("S3-t1", locale) ?? "Early in the conversation";
  const t2 = copyNew("S3-t2", locale) ?? "Long conversation";
  const idxLabel = copyNew("S3-idx", locale) ?? "Indexed";
  const illNote = copyNew("S3-ill", locale);

  const kindLabel = (k: 1 | 2 | 3 | 4): string =>
    copyNew(`S3-l${k}`, locale) ?? "";

  const activeBlocks = BLOCKS.filter((b) => {
    if (stage === "early") return b.inEarly;
    if (mode === "full") return true;
    return b.keepInLongSelect;
  });

  const indexedBlocks =
    stage === "long" && mode === "select"
      ? BLOCKS.filter((b) => !b.keepInLongSelect)
      : [];

  const isOverflow = stage === "long" && mode === "full";

  const onRadioKey = <T extends string>(
    e: KeyboardEvent<HTMLButtonElement>,
    options: T[],
    current: T,
    setter: (val: T) => void,
    refs: Array<HTMLButtonElement | null>,
  ) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const curIdx = options.indexOf(current);
    const nextIdx =
      e.key === "ArrowRight"
        ? (curIdx + 1) % options.length
        : (curIdx - 1 + options.length) % options.length;
    setter(options[nextIdx]);
    refs[nextIdx]?.focus();
  };

  return (
    <div className="context-packer flex flex-col [gap:var(--sp-4)] [padding:var(--sp-6)] [border-radius:var(--r-window)] [background:var(--n1)] [border:1px_solid_var(--dark-line)] [margin-bottom:var(--sp-7)]" data-surface="dark">
      <div className="packer-controls flex flex-wrap items-center justify-between [gap:var(--sp-3)]">
        <div
          className="packer-modes inline-flex flex-wrap [gap:4px] [padding:4px] [border-radius:var(--r-chip)] [background:var(--n2)] [border:1px_solid_var(--dark-line-soft)]"
          role="radiogroup"
          aria-label={m2}
        >
          {(
            [
              ["full", m1],
              ["select", m2],
            ] as const
          ).map(([val, lbl], idx) => (
            <button
              key={val}
              ref={(el) => {
                modeBtnRefs.current[idx] = el;
              }}
              type="button"
              role="radio"
              aria-checked={mode === val}
              tabIndex={mode === val ? 0 : -1}
              className="packer-radio [min-height:34px] [padding:0_var(--sp-4)] [border-radius:var(--r-chip)] [font-size:13px] [font-weight:500] cursor-pointer [transition:color_var(--qtf),background-color_var(--qtf),border-color_var(--qtf),opacity_var(--qtp)]"
              onClick={() => changeMode(val)}
              onKeyDown={(e) =>
                onRadioKey(
                  e,
                  ["full", "select"],
                  mode,
                  changeMode,
                  modeBtnRefs.current,
                )
              }
            >
              {lbl}
            </button>
          ))}
        </div>

        <div
          className="packer-stages inline-flex flex-wrap [gap:4px] [padding:4px] [border-radius:var(--r-chip)] [background:var(--n2)] [border:1px_solid_var(--dark-line-soft)]"
          role="radiogroup"
          aria-label={t2}
        >
          {(
            [
              ["early", t1],
              ["long", t2],
            ] as const
          ).map(([val, lbl], idx) => (
            <button
              key={val}
              ref={(el) => {
                stageBtnRefs.current[idx] = el;
              }}
              type="button"
              role="radio"
              aria-checked={stage === val}
              tabIndex={stage === val ? 0 : -1}
              className="packer-radio [min-height:34px] [padding:0_var(--sp-4)] [border-radius:var(--r-chip)] [font-size:13px] [font-weight:500] cursor-pointer [transition:color_var(--qtf),background-color_var(--qtf),border-color_var(--qtf),opacity_var(--qtp)]"
              onClick={() => changeStage(val)}
              onKeyDown={(e) =>
                onRadioKey(
                  e,
                  ["early", "long"],
                  stage,
                  changeStage,
                  stageBtnRefs.current,
                )
              }
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>

      <div
        key={shakeKey}
        className={`packer-window flex flex-col [gap:var(--sp-4)] [padding:var(--sp-5)] [border-radius:var(--r-card)] [min-height:128px] [transition:border-color_var(--qtb)] ${isOverflow ? " is-overflow" : ""}`}
      >
        <div className="packer-tokens flex flex-wrap [gap:var(--sp-2)]">
          {activeBlocks.map((b) => {
            const buried = isOverflow && b.kind === 4;
            return (
              <span
                key={b.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(b.id, el);
                  else itemRefs.current.delete(b.id);
                }}
                className="packer-block inline-flex items-center [padding:6px_12px] [border-radius:var(--r-control)] [font-size:13px] [font-weight:500]"
                data-kind={b.kind}
                data-buried={buried ? "true" : undefined}
              >
                {kindLabel(b.kind)}
              </span>
            );
          })}
        </div>

        {indexedBlocks.length > 0 ? (
          <div className="packer-index flex items-center [gap:var(--sp-3)] [padding-top:var(--sp-3)] [border-top:1px_solid_var(--dark-line-soft)]" aria-hidden="true">
            <span className="label">{idxLabel}</span>
            <div className="packer-dots inline-flex items-center [gap:8px]">
              {indexedBlocks.map((b) => (
                <span
                  key={b.id}
                  ref={(el) => {
                    if (el) itemRefs.current.set(b.id, el);
                    else itemRefs.current.delete(b.id);
                  }}
                  className="packer-dot [width:6px] [height:6px] [border-radius:var(--r-chip)] [background:var(--cyan)]"
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {illNote ? <p className="small packer-note m-0 [color:var(--on-dark)]">{illNote}</p> : null}
    </div>
  );
}
