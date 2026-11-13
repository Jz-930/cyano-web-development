import React from "react";

export function BrandLogo({
  tone = "dark",
  showSub = false,
}: {
  tone?: "dark" | "light";
  showSub?: boolean;
}) {
  const isDark = tone === "dark";
  const gradId = isDark ? "cyano-mark-dark" : "cyano-mark-light";

  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <svg
        width="32"
        height="32"
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id={gradId} x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isDark ? "#7EF5D6" : "#22858E"} />
            <stop offset="55%" stopColor="#3FA0A6" />
            <stop offset="100%" stopColor={isDark ? "#257882" : "#0B4650"} />
          </linearGradient>
        </defs>
        {/* Outer isometric layered C ribbons + data nodes faithful to Cyano mark */}
        <path
          d="M32 6.5C29.8 6.5 27.6 7.1 25.7 8.2L11.8 16.1C8.8 17.8 7 21 7 24.5V43.5C7 46.2 8.2 48.7 10.2 50.3V22.8C10.2 20.1 11.7 17.6 14.1 16.3L33.5 5.6C33 6.1 32.5 6.5 32 6.5Z"
          fill={`url(#${gradId})`}
          opacity="0.9"
        />
        <path
          d="M12.5 49.5V23.4C12.5 20.8 13.9 18.4 16.2 17.1L30.2 9.4"
          stroke={`url(#${gradId})`}
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        <path
          d="M17.8 46.2V25.2C17.8 22.8 19.1 20.6 21.2 19.4L29.6 14.8"
          stroke={`url(#${gradId})`}
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        {/* Core bold C body */}
        <path
          d="M52.5 19.2C52.5 15.8 50.5 12.8 47.4 11.4L36.8 17.2C34.2 18.6 31.3 19.3 28.4 19.6L24.5 21.8C22.7 22.8 21.6 24.7 21.6 26.8V39.6C21.6 41.8 22.8 43.8 24.7 44.9L30.2 48C32.2 49.1 34.7 49.1 36.7 48L48.2 41.6C51.4 39.8 55.3 41.4 56.2 45C56.9 47.9 55.5 51 52.8 52.5L36.8 61.3C33.6 63.1 29.7 63.1 26.5 61.3L24.8 60.3"
          fill="none"
        />
        <path
          d="M49.5 12.2L35.4 19.9C33.3 21 30.8 21.4 28.5 22.4L24.8 24.4C23.1 25.3 22 27.1 22 29V39.2C22 41.3 23.1 43.2 25 44.2L30.6 47.3C32.4 48.3 34.7 48.3 36.5 47.3L48.6 40.6C51.8 38.8 55.8 41.1 55.8 44.8V46.6C55.8 49.3 54.3 51.8 51.9 53.1L36.2 61.7C33.3 63.3 29.7 63.3 26.8 61.7L25.2 60.8L27.5 57.5C29.8 58.8 32.6 58.8 34.9 57.5L50.5 48.9M22 29C22 25.4 24.9 22.5 28.5 22.5H31.8C34.2 22.5 36.5 23.4 38.4 24.8L41.2 26.8C43.2 28.2 45.9 28.4 48.1 27.2L55.5 23.1V18.8C55.5 15.8 53.7 13.1 50.9 11.9L49.5 12.2Z"
          fill={`url(#${gradId})`}
        />
        <path
          d="M27.6 53.8C30.4 55.2 33.8 55.1 36.5 53.6L52.6 44.7"
          stroke={`url(#${gradId})`}
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        {/* Characteristic data droplets */}
        <circle cx="39.5" cy="7.5" r="2.6" fill={`url(#${gradId})`} />
        <circle cx="35.2" cy="11.2" r="1.7" fill={`url(#${gradId})`} />
        <circle cx="40.8" cy="13.2" r="2.7" fill={`url(#${gradId})`} />
        <circle cx="46.6" cy="10.2" r="2.1" fill={`url(#${gradId})`} />
        <circle cx="35.6" cy="16.2" r="1.9" fill={`url(#${gradId})`} />
        <circle cx="22.4" cy="49.8" r="2.4" fill={`url(#${gradId})`} />
        <circle cx="17.2" cy="52.8" r="2.3" fill={`url(#${gradId})`} />
        <circle cx="22.8" cy="56.2" r="1.5" fill={`url(#${gradId})`} />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`font-mono-tech text-[15px] font-bold tracking-[0.18em] ${
            isDark ? "text-[#F2FAF9]" : "text-[#07161A]"
          }`}
        >
          CYANO
        </span>
        {showSub && (
          <span
            className={`mt-1 font-mono-tech text-[12px] tracking-[0.06em] ${
              isDark ? "text-[#93B5B9]" : "text-[#496269]"
            }`}
          >
            INTELLIGENCE
          </span>
        )}
      </span>
    </span>
  );
}
