"use client";

import {
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/locale";

type ActiveCitation = {
  instanceKey: string;
  tooltipId: string;
  id: string;
  locale: Locale;
  note: string;
  labelText: string;
  caseHref: string | null;
  caseLabel: string | null;
  triggerEl: HTMLButtonElement;
};

let currentActive: ActiveCitation | null = null;
let openTimer: ReturnType<typeof setTimeout> | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();
const hostOwners = new Set<symbol>();
let primaryHostOwner: symbol | null = null;

function emit() {
  for (const fn of listeners) fn();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function getSnapshot() {
  return currentActive;
}

function getServerSnapshot() {
  return null;
}

function clearTimers() {
  if (openTimer) {
    clearTimeout(openTimer);
    openTimer = null;
  }
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
}

function openNow(next: ActiveCitation) {
  clearTimers();
  currentActive = next;
  emit();
}

function scheduleOpen(next: ActiveCitation, delayMs = 100) {
  clearTimers();
  openTimer = setTimeout(() => {
    openTimer = null;
    currentActive = next;
    emit();
  }, delayMs);
}

function scheduleClose(delayMs = 150) {
  if (openTimer) {
    clearTimeout(openTimer);
    openTimer = null;
  }
  if (closeTimer) clearTimeout(closeTimer);
  closeTimer = setTimeout(() => {
    closeTimer = null;
    if (currentActive) {
      currentActive = null;
      emit();
    }
  }, delayMs);
}

function closeImmediately(restoreFocus = false) {
  clearTimers();
  const prev = currentActive;
  if (prev) {
    currentActive = null;
    emit();
    if (restoreFocus && prev.triggerEl.isConnected) {
      prev.triggerEl.focus();
    }
  }
}

function SharedCitationPopover() {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    if (!active) {
      try {
        if (card.matches(":popover-open")) card.hidePopover();
      } catch {
        // Ignore if popover API not active
      }
      return;
    }

    try {
      if (!card.matches(":popover-open")) card.showPopover();
    } catch {
      // Fallback handled by [data-open="true"] styling
    }

    const updatePosition = () => {
      if (!active.triggerEl.isConnected) {
        closeImmediately(false);
        return;
      }
      const tr = active.triggerEl.getBoundingClientRect();
      const cw = card.offsetWidth || 288;
      const ch = card.offsetHeight || 104;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const triggerCenterX = tr.left + tr.width / 2;
      const left = Math.max(12, Math.min(vw - cw - 12, triggerCenterX - 28));
      let top = tr.top - ch - 12;
      let placement: "top" | "bottom" = "top";
      if (top < 12 && tr.bottom + ch + 12 <= vh - 8) {
        top = tr.bottom + 12;
        placement = "bottom";
      } else if (top < 12) {
        top = 12;
      }
      const stemX = Math.max(16, Math.min(cw - 16, Math.round(triggerCenterX - left)));

      card.style.left = `${Math.round(left)}px`;
      card.style.top = `${Math.round(top)}px`;
      card.style.setProperty("--stem-x", `${stemX}px`);
      card.dataset.placement = placement;
    };

    updatePosition();
    const raf = requestAnimationFrame(updatePosition);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeImmediately(true);
      }
    };
    const onPointerDownDoc = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (card.contains(target) || active.triggerEl.contains(target)) return;
      closeImmediately(false);
    };

    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDownDoc);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDownDoc);
    };
  }, [active]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={cardRef}
      role="tooltip"
      id={active ? active.tooltipId : undefined}
      className="cite-card glass-badge"
      data-surface="dark"
      data-open={active ? "true" : "false"}
      popover="manual"
      style={{ "--stem-x": "24px" } as CSSProperties}
      onPointerEnter={() => clearTimers()}
      onPointerLeave={(e) => {
        if (e.pointerType !== "touch") scheduleClose(150);
      }}
      onBlur={(e) => {
        const next = e.relatedTarget as Node | null;
        if (
          next &&
          (cardRef.current?.contains(next) || active?.triggerEl.contains(next))
        ) {
          return;
        }
        closeImmediately(false);
      }}
    >
      {active ? (
        <>
          <span className="label cite-card-label">{active.labelText}</span>
          <p className="cite-card-body">{active.note}</p>
          {active.caseHref && active.caseLabel ? (
            <Link
              className="text-link cite-card-link"
              href={active.caseHref}
              onClick={() => closeImmediately(false)}
            >
              {active.caseLabel}
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          ) : null}
        </>
      ) : null}
    </div>,
    document.body,
  );
}

export type CitationPeekClientProps = {
  id: string;
  locale: Locale;
  note: string;
  labelText: string;
  caseHref: string | null;
  caseLabel: string | null;
  children: ReactNode;
  className?: string;
};

export function CitationPeekClient({
  id,
  locale,
  note,
  labelText,
  caseHref,
  caseLabel,
  children,
  className,
}: CitationPeekClientProps) {
  const rawUid = useId();
  const cleanUid = rawUid.replace(/[^a-zA-Z0-9_-]/g, "");
  const instanceKey = `${id}-${cleanUid}`;
  const tooltipId = `cite-${id}-${cleanUid}`;
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const ownerSymbolRef = useRef<symbol | null>(null);
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const sym = Symbol(instanceKey);
    ownerSymbolRef.current = sym;
    hostOwners.add(sym);
    if (!primaryHostOwner) {
      primaryHostOwner = sym;
      emit();
    }
    return () => {
      hostOwners.delete(sym);
      if (currentActive?.instanceKey === instanceKey) {
        currentActive = null;
      }
      if (primaryHostOwner === sym) {
        const nextIter = hostOwners.values().next();
        primaryHostOwner = nextIter.done ? null : nextIter.value;
      }
      emit();
    };
  }, [instanceKey]);

  const isThisOpen = active?.instanceKey === instanceKey;
  const isOverlayOwner =
    ownerSymbolRef.current !== null && primaryHostOwner === ownerSymbolRef.current;

  const buildPayload = (el: HTMLButtonElement): ActiveCitation => ({
    instanceKey,
    tooltipId,
    id,
    locale,
    note,
    labelText,
    caseHref,
    caseLabel,
    triggerEl: el,
  });

  const cls = ["cite-trigger", className].filter(Boolean).join(" ");

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className={cls}
        aria-describedby={isThisOpen ? tooltipId : undefined}
        data-cite-id={id}
        data-open={isThisOpen ? "true" : undefined}
        onPointerEnter={(e) => {
          if (e.pointerType === "touch") return;
          if (btnRef.current) scheduleOpen(buildPayload(btnRef.current), 100);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "touch") return;
          scheduleClose(150);
        }}
        onFocus={() => {
          if (btnRef.current) openNow(buildPayload(btnRef.current));
        }}
        onBlur={(e) => {
          const next = e.relatedTarget as HTMLElement | null;
          if (next?.closest(".cite-card")) return;
          scheduleClose(0);
        }}
        onClick={() => {
          if (!btnRef.current) return;
          if (isThisOpen) {
            closeImmediately(false);
          } else {
            openNow(buildPayload(btnRef.current));
          }
        }}
      >
        {children}
      </button>
      {isOverlayOwner ? <SharedCitationPopover /> : null}
    </>
  );
}
