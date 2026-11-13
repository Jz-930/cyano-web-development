import React from "react";

/**
 * Official Cyano Brand Mark + Wordmark:
 * Uses the authentic isometric laminar-channel & data-droplet C-cube mark (`logo.png`),
 * optimized as 4x-Retina lossless WebP (`cyano-logo-dark.webp` for nocturnal surfaces,
 * `cyano-logo-light.webp` for gallery-white surfaces).
 */
export function BrandLogo({
  variant = "dark",
  showWordmark = true,
  size = 32,
  className = "",
}: {
  variant?: "dark" | "light";
  showWordmark?: boolean;
  size?: number;
  className?: string;
}) {
  const isDarkSurface = variant === "dark";
  const src = isDarkSurface
    ? "/art/cyano-logo-dark.webp"
    : "/art/cyano-logo-light.webp";
  const textFill = isDarkSurface ? "#FFFFFF" : "#0B1520";

  return (
    <span className={`inline-flex items-center gap-3 select-none ${className}`}>
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        decoding="async"
        aria-hidden="true"
        className="shrink-0 object-contain"
        style={{ width: `${size}px`, height: `${size}px` }}
      />

      {showWordmark && (
        <span
          className="text-[16px] font-semibold tracking-[0.22em]"
          style={{ color: textFill }}
        >
          CYANO
        </span>
      )}
    </span>
  );
}
