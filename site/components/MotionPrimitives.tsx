"use client";

import React, { useEffect, useRef, useState } from "react";

export function Reveal({
  children,
  delayMs = 0,
  className = "",
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const clampedDelay = Math.min(Math.max(delayMs, 0), 210);

  return (
    <div
      ref={ref}
      className={`reveal-item ${visible ? "is-visible" : ""} ${className}`}
      style={
        clampedDelay > 0 && !visible
          ? { transitionDelay: `${clampedDelay}ms` }
          : clampedDelay > 0
          ? { transitionDelay: `${clampedDelay}ms` }
          : undefined
      }
    >
      {children}
    </div>
  );
}

/**
 * Real-time GPU-friendly multi-filament spectral cyan/mint optical field (G-02 / A-05).
 * Pauses automatically when off-screen or tab hidden; renders crisp static harmonics under prefers-reduced-motion.
 */
export function SpectralFlowCanvas({
  intensity = "hero",
  className = "",
}: {
  intensity?: "hero" | "band";
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;
    let inView = true;
    let t = 12.5;
    const pointer = { x: 0.65, y: 0.42, targetX: 0.65, targetY: 0.42 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = canvas.clientWidth || 1200;
      const h = canvas.clientHeight || 600;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.targetX = (e.clientX - rect.left) / rect.width;
      pointer.targetY = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    io.observe(canvas);

    const ribbonCount = intensity === "hero" ? 6 : 4;
    const photonCount = intensity === "hero" ? 26 : 14;

    const renderFrame = (timeSec: number) => {
      const w = canvas.clientWidth || 1200;
      const h = canvas.clientHeight || 600;
      ctx.clearRect(0, 0, w, h);

      pointer.x += (pointer.targetX - pointer.x) * 0.04;
      pointer.y += (pointer.targetY - pointer.y) * 0.04;

      // Ambient pointer optical aura
      const aura = ctx.createRadialGradient(
        w * pointer.x,
        h * pointer.y,
        10,
        w * pointer.x,
        h * pointer.y,
        Math.max(w, h) * 0.44
      );
      aura.addColorStop(0, "rgba(126, 245, 214, 0.11)");
      aura.addColorStop(0.45, "rgba(63, 160, 166, 0.06)");
      aura.addColorStop(1, "rgba(3, 7, 9, 0)");
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, w, h);

      // Spectral harmonic filaments
      for (let r = 0; r < ribbonCount; r++) {
        const phase = r * 0.85 + timeSec * (0.28 + r * 0.035);
        const yBase = h * (0.24 + (r / ribbonCount) * 0.56);
        const amp1 = h * (0.06 + (r % 3) * 0.028);
        const amp2 = h * 0.032;

        const grad = ctx.createLinearGradient(0, yBase - amp1, w, yBase + amp1);
        grad.addColorStop(0, "rgba(6, 47, 58, 0)");
        grad.addColorStop(0.28, r % 2 === 0 ? "rgba(63, 160, 166, 0.24)" : "rgba(34, 133, 142, 0.18)");
        grad.addColorStop(0.64, r === 1 ? "rgba(126, 245, 214, 0.38)" : "rgba(82, 199, 204, 0.24)");
        grad.addColorStop(1, "rgba(6, 47, 58, 0)");

        ctx.beginPath();
        const steps = 40;
        for (let s = 0; s <= steps; s++) {
          const u = s / steps;
          const x = u * w;
          const pull = (pointer.y - 0.5) * 26 * Math.exp(-Math.pow((u - pointer.x) * 2.6, 2));
          const y =
            yBase +
            Math.sin(u * 4.4 + phase) * amp1 +
            Math.cos(u * 8.2 - phase * 0.7) * amp2 +
            pull;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = grad;
        ctx.lineWidth = r === 1 ? 2.1 : 1.25;
        ctx.stroke();
      }

      // Data photon pulses travelling along trajectories
      for (let i = 0; i < photonCount; i++) {
        const u = ((timeSec * (0.045 + (i % 5) * 0.008) + i / photonCount) % 1);
        const r = i % ribbonCount;
        const phase = r * 0.85 + timeSec * (0.28 + r * 0.035);
        const yBase = h * (0.24 + (r / ribbonCount) * 0.56);
        const amp1 = h * (0.06 + (r % 3) * 0.028);
        const amp2 = h * 0.032;
        const x = u * w;
        const y =
          yBase +
          Math.sin(u * 4.4 + phase) * amp1 +
          Math.cos(u * 8.2 - phase * 0.7) * amp2;
        const alpha = Math.sin(u * Math.PI) * (i % 4 === 0 ? 0.85 : 0.45);

        ctx.beginPath();
        ctx.fillStyle = `rgba(126, 245, 214, ${alpha.toFixed(3)})`;
        ctx.arc(x, y, i % 5 === 0 ? 2.1 : 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (reduced) {
      renderFrame(t);
      return () => {
        io.disconnect();
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointerMove);
      };
    }

    let last = performance.now();
    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      if (!inView || document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      renderFrame(t);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
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
