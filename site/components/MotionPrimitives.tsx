"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Scroll-triggered entrance wrapper (GPU transform + opacity only).
 */
export function Reveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={`reveal-block ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Polychromatic Spectral Aurora & Harmonic Ribbon Canvas:
 * Blends Electric Indigo, Luminous Cyan, Violet, and Warm Champagne Amber
 * in calm, silky optical waves. Pauses off-screen via IntersectionObserver.
 */
export function SpectralFlowCanvas({
  className = "",
  intensity = "hero",
}: {
  className?: string;
  intensity?: "hero" | "subtle";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let rafId = 0;
    let inView = true;
    let t = 14;
    let pointerX = 0.65;
    let pointerY = 0.42;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const ribbons =
      intensity === "hero"
        ? [
            { r: 34, g: 211, b: 238, alpha: 0.24, amp: 34, freq: 0.0024, yRatio: 0.34, lw: 2.2 }, // Cyano Cyan (Lead)
            { r: 59, g: 130, b: 246, alpha: 0.2, amp: 28, freq: 0.0031, yRatio: 0.52, lw: 1.8 },  // Sapphire Cobalt
            { r: 251, g: 191, b: 36, alpha: 0.14, amp: 24, freq: 0.0028, yRatio: 0.46, lw: 1.5 }, // Warm Champagne Gold
            { r: 167, g: 139, b: 250, alpha: 0.14, amp: 30, freq: 0.0021, yRatio: 0.66, lw: 1.5 }, // Iridescent Violet
          ]
        : [
            { r: 34, g: 211, b: 238, alpha: 0.16, amp: 22, freq: 0.0026, yRatio: 0.44, lw: 1.6 }, // Cyano Cyan
            { r: 59, g: 130, b: 246, alpha: 0.14, amp: 18, freq: 0.0032, yRatio: 0.58, lw: 1.3 }, // Sapphire Cobalt
            { r: 251, g: 191, b: 36, alpha: 0.1, amp: 16, freq: 0.0024, yRatio: 0.51, lw: 1.2 },  // Warm Champagne Gold
          ];

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      // Soft ambient polychromatic Cyano aura following pointer subtly
      const aura = ctx.createRadialGradient(
        width * pointerX,
        height * pointerY,
        10,
        width * pointerX,
        height * pointerY,
        Math.max(width, height) * 0.48
      );
      aura.addColorStop(0, "rgba(34, 211, 238, 0.11)");
      aura.addColorStop(0.45, "rgba(29, 78, 216, 0.07)");
      aura.addColorStop(0.75, "rgba(245, 158, 11, 0.03)");
      aura.addColorStop(1, "rgba(2, 8, 14, 0)");
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < ribbons.length; i++) {
        const rb = ribbons[i];
        const baseY = height * rb.yRatio;
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, `rgba(${rb.r}, ${rb.g}, ${rb.b}, 0)`);
        grad.addColorStop(0.28, `rgba(${rb.r}, ${rb.g}, ${rb.b}, ${rb.alpha * 0.55})`);
        grad.addColorStop(0.68, `rgba(${rb.r}, ${rb.g}, ${rb.b}, ${rb.alpha})`);
        grad.addColorStop(1, `rgba(${rb.r}, ${rb.g}, ${rb.b}, 0.03)`);

        ctx.beginPath();
        const step = 20;
        for (let x = 0; x <= width + step; x += step) {
          const progress = x / Math.max(width, 1);
          const damping = 1 - progress * 0.45;
          const wave =
            Math.sin(x * rb.freq + t * (0.35 + i * 0.07) + i * 1.4) * rb.amp * damping +
            Math.cos(x * rb.freq * 0.55 - t * 0.22 + i) * (rb.amp * 0.45) * damping;
          const y = baseY + wave + (pointerY - 0.5) * 18 * progress;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = grad;
        ctx.lineWidth = rb.lw;
        ctx.stroke();
      }
    };

    drawFrame();
    if (reducedMotion) return;

    const loop = () => {
      if (inView) {
        t += 0.014;
        drawFrame();
      }
      rafId = window.requestAnimationFrame(loop);
    };
    rafId = window.requestAnimationFrame(loop);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        pointerX = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        pointerY = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.02 }
    );
    io.observe(canvas);

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
