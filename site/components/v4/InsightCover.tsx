import { allInsights, copyIfApproved, type Locale } from "@/lib/content-v4";

export type InsightCoverProps = {
  slug: string;
  locale: Locale;
  size?: "card" | "hero";
  className?: string;
};

const COVER_OBJECT_POSITION: Record<string, string> = {
  "why-chatgpt-is-not-a-knowledge-base": "20% 40%",
  "proposal-draft-in-15-minutes": "60% 50%",
  "buy-pilot-or-managed": "85% 30%",
};

function PermissionsDiagram({ locale }: { locale: Locale }) {
  const layers = ([1, 2, 3, 4] as const).map((i) => ({
    idx: i,
    label: copyIfApproved(`cover.layers.${i}`, locale),
    y: 70 + (i - 1) * 86,
    allowed: i <= 3,
  }));

  return (
    <svg
      className="cover-art"
      viewBox="0 0 520 420"
      aria-hidden="true"
      focusable="false"
    >
      {/* Vertical query spine */}
      <line
        x1="312"
        y1="26"
        x2="312"
        y2="242"
        stroke="var(--cyan)"
        strokeWidth="1.25"
      />
      <line
        x1="312"
        y1="242"
        x2="312"
        y2="328"
        stroke="var(--frost-15)"
        strokeWidth="1.25"
        strokeDasharray="4 5"
      />
      <circle cx="312" cy="26" r="4" fill="var(--ice)" />

      {layers.map((layer) => (
        <g key={layer.idx}>
          <rect
            x="40"
            y={layer.y - 24}
            width="436"
            height="48"
            rx="8"
            fill={layer.allowed ? "var(--cyan-04)" : "none"}
            stroke={layer.allowed ? "var(--cyan-40)" : "var(--frost-15)"}
            strokeWidth="1.25"
          />
          <line
            x1="156"
            y1={layer.y}
            x2="286"
            y2={layer.y}
            stroke="var(--frost-15)"
            strokeWidth="1.25"
          />
          <line
            x1="338"
            y1={layer.y}
            x2="452"
            y2={layer.y}
            stroke={layer.allowed ? "var(--cyan-40)" : "var(--frost-15)"}
            strokeWidth="1.25"
          />
          {layer.label ? (
            <text
              x="58"
              y={layer.y + 4}
              fill={layer.allowed ? "var(--ice)" : "var(--on-dark)"}
              fontSize="13"
              fontFamily="var(--mono)"
              fontWeight="500"
            >
              {layer.label}
            </text>
          ) : null}
          {layer.allowed ? (
            <>
              <circle
                cx="312"
                cy={layer.y}
                r="11"
                fill="var(--cyan-12)"
                stroke="var(--cyan-40)"
                strokeWidth="1.25"
              />
              <circle cx="312" cy={layer.y} r="4.5" fill="var(--cyan)" />
            </>
          ) : (
            <>
              <line
                x1="302"
                y1={layer.y - 10}
                x2="322"
                y2={layer.y - 10}
                stroke="var(--frost-15)"
                strokeWidth="1.5"
              />
              <circle
                cx="312"
                cy={layer.y}
                r="5"
                fill="var(--n0)"
                stroke="var(--frost-15)"
                strokeWidth="1.25"
              />
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

function ConvergenceDiagram() {
  const cards = [54, 168, 282];
  return (
    <svg
      className="cover-art"
      viewBox="0 0 520 420"
      aria-hidden="true"
      focusable="false"
    >
      {/* 3 Source card wireframes */}
      {cards.map((y, idx) => (
        <g key={y}>
          <rect
            x="28"
            y={y}
            width="116"
            height="84"
            rx="8"
            fill="var(--white-04)"
            stroke="var(--frost-15)"
            strokeWidth="1.25"
          />
          <line
            x1="44"
            y1={y + 24}
            x2="96"
            y2={y + 24}
            stroke="var(--cyan-40)"
            strokeWidth="1.25"
          />
          <line
            x1="44"
            y1={y + 44}
            x2="126"
            y2={y + 44}
            stroke="var(--frost-15)"
            strokeWidth="1.25"
          />
          <line
            x1="44"
            y1={y + 60}
            x2={idx === 1 ? "118" : "104"}
            y2={y + 60}
            stroke="var(--frost-15)"
            strokeWidth="1.25"
          />
        </g>
      ))}

      {/* Three channels into Core & out into draft sections */}
      <path
        d="M144 96 C 182 96, 190 210, 224 210"
        fill="none"
        stroke="var(--cyan)"
        strokeWidth="1.25"
      />
      <path
        d="M144 210 L 224 210"
        fill="none"
        stroke="var(--cyan)"
        strokeWidth="1.25"
      />
      <path
        d="M144 324 C 182 324, 190 210, 224 210"
        fill="none"
        stroke="var(--cyan)"
        strokeWidth="1.25"
      />
      <path
        d="M224 210 C 254 210, 254 134, 286 134"
        fill="none"
        stroke="var(--cyan)"
        strokeWidth="1.25"
      />
      <path
        d="M224 210 L 286 210"
        fill="none"
        stroke="var(--cyan)"
        strokeWidth="1.25"
      />
      <path
        d="M224 210 C 254 210, 254 286, 286 286"
        fill="none"
        stroke="var(--cyan)"
        strokeWidth="1.25"
      />

      {/* Core node */}
      <circle
        cx="224"
        cy="210"
        r="14"
        fill="var(--n0)"
        stroke="var(--cyan)"
        strokeWidth="1.25"
      />
      <circle cx="224" cy="210" r="5" fill="var(--cyan)" />

      {/* Draft page wireframe */}
      <rect
        x="286"
        y="46"
        width="206"
        height="328"
        rx="12"
        fill="var(--cyan-04)"
        stroke="var(--cyan-40)"
        strokeWidth="1.25"
      />
      <line
        x1="310"
        y1="82"
        x2="412"
        y2="82"
        stroke="var(--ice)"
        strokeWidth="1.5"
      />
      {[134, 210, 286].map((sy) => (
        <g key={sy}>
          <line
            x1="310"
            y1={sy - 10}
            x2="464"
            y2={sy - 10}
            stroke="var(--frost-15)"
            strokeWidth="1.25"
          />
          <line
            x1="310"
            y1={sy + 8}
            x2="432"
            y2={sy + 8}
            stroke="var(--frost-15)"
            strokeWidth="1.25"
          />
          <rect
            x="442"
            y={sy + 1}
            width="22"
            height="13"
            rx="3"
            fill="var(--cyan-18)"
            stroke="var(--cyan)"
            strokeWidth="1"
          />
        </g>
      ))}
      <line
        x1="310"
        y1="334"
        x2="468"
        y2="334"
        stroke="var(--frost-15)"
        strokeWidth="1"
      />
      {[0, 1, 2, 3, 4, 5, 6].map((dot) => (
        <circle
          key={dot}
          cx={316 + dot * 14}
          cy="352"
          r="3"
          fill="var(--cyan)"
        />
      ))}
    </svg>
  );
}

function GanttThumbDiagram({ slug }: { slug: string }) {
  const hatchId = `cover-hatch-${slug}`;
  // Axis x: W0=44 .. W12=476 (36px per week)
  const wx = (w: number) => 44 + w * 36;
  const ticks = [0, 2, 6, 12];

  return (
    <svg
      className="cover-art"
      viewBox="0 0 520 420"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern
          id={hatchId}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="8"
            stroke="var(--cyan-40)"
            strokeWidth="2"
          />
        </pattern>
      </defs>

      {/* Axis & grid lines */}
      <line
        x1={wx(0)}
        y1="78"
        x2={wx(12)}
        y2="78"
        stroke="var(--frost-15)"
        strokeWidth="1.25"
      />
      {ticks.map((w) => (
        <g key={w}>
          <line
            x1={wx(w)}
            y1="72"
            x2={wx(w)}
            y2="342"
            stroke="var(--frost-15)"
            strokeWidth="1"
            strokeDasharray={w === 0 || w === 12 ? undefined : "3 5"}
          />
          <text
            x={wx(w)}
            y="60"
            textAnchor="middle"
            fill="var(--on-dark)"
            fontSize="12"
            fontFamily="var(--mono)"
            fontWeight="500"
          >
            {`W${w}`}
          </text>
        </g>
      ))}

      {/* Track 1: Custom (W0-W1 brand, W1-W6 cyan, W6-W12 hatch, diamonds W1 & W12) */}
      <g transform="translate(0, 126)">
        <line
          x1={wx(0)}
          y1="14"
          x2={wx(12)}
          y2="14"
          stroke="var(--frost-15)"
          strokeWidth="1"
        />
        <rect x={wx(0)} y="4" width="36" height="20" rx="4" fill="var(--brand)" />
        <rect x={wx(1)} y="4" width="180" height="20" rx="4" fill="var(--cyan)" />
        <rect
          x={wx(6)}
          y="4"
          width="216"
          height="20"
          rx="4"
          fill={`url(#${hatchId})`}
          stroke="var(--cyan-40)"
          strokeWidth="1.25"
        />
        {[1, 12].map((dw) => (
          <rect
            key={dw}
            x={wx(dw) - 5}
            y="-10"
            width="10"
            height="10"
            fill="var(--amber-12)"
            stroke="var(--amber)"
            strokeWidth="1.25"
            transform={`rotate(45 ${wx(dw)} -5)`}
          />
        ))}
      </g>

      {/* Track 2: Pilot (W0-W1 brand, W1-W2 cyan, W2-W6 hatch, diamonds W1 & W6) */}
      <g transform="translate(0, 210)">
        <line
          x1={wx(0)}
          y1="14"
          x2={wx(12)}
          y2="14"
          stroke="var(--frost-15)"
          strokeWidth="1"
        />
        <rect x={wx(0)} y="4" width="36" height="20" rx="4" fill="var(--brand)" />
        <rect x={wx(1)} y="4" width="36" height="20" rx="4" fill="var(--cyan)" />
        <rect
          x={wx(2)}
          y="4"
          width="144"
          height="20"
          rx="4"
          fill={`url(#${hatchId})`}
          stroke="var(--cyan-40)"
          strokeWidth="1.25"
        />
        {[1, 6].map((dw) => (
          <rect
            key={dw}
            x={wx(dw) - 5}
            y="-10"
            width="10"
            height="10"
            fill="var(--amber-12)"
            stroke="var(--amber)"
            strokeWidth="1.25"
            transform={`rotate(45 ${wx(dw)} -5)`}
          />
        ))}
      </g>

      {/* Track 3: Managed (W0-W1 brand, W1-W2 cyan, W2-W12 cadence ticks W6 & W10, diamond W2) */}
      <g transform="translate(0, 294)">
        <line
          x1={wx(0)}
          y1="14"
          x2={wx(12)}
          y2="14"
          stroke="var(--cyan-40)"
          strokeWidth="1.25"
        />
        <rect x={wx(0)} y="4" width="36" height="20" rx="4" fill="var(--brand)" />
        <rect x={wx(1)} y="4" width="36" height="20" rx="4" fill="var(--cyan)" />
        {[6, 10].map((mw) => (
          <rect
            key={mw}
            x={wx(mw) - 3}
            y="4"
            width="6"
            height="20"
            rx="2"
            fill="var(--cyan)"
          />
        ))}
        <rect
          x={wx(2) - 5}
          y="-10"
          width="10"
          height="10"
          fill="var(--amber-12)"
          stroke="var(--amber)"
          strokeWidth="1.25"
          transform={`rotate(45 ${wx(2)} -5)`}
        />
      </g>
    </svg>
  );
}

export function InsightCover({
  slug,
  locale,
  size = "card",
  className,
}: InsightCoverProps) {
  const ins = allInsights.find((i) => i.slug === slug);
  if (!ins) {
    throw new Error(`Unknown insight slug for InsightCover: "${slug}"`);
  }
  const category = ins.category[locale];
  const keyword = copyIfApproved(`cover.${slug}`, locale);
  const objPos = COVER_OBJECT_POSITION[slug] ?? "50% 50%";
  const cls = ["cover", className].filter(Boolean).join(" ");

  return (
    <div className={cls} data-size={size} data-slug={slug} data-surface="dark">
      <picture className="cover-bg" aria-hidden="true">
        <source
          type="image/avif"
          srcSet="/media/field/panel-720.avif 720w, /media/field/panel.avif 1440w"
          sizes={size === "hero" ? "1200px" : "(max-width: 800px) 92vw, 480px"}
        />
        <source
          type="image/webp"
          srcSet="/media/field/panel-720.webp 720w, /media/field/panel.webp 1440w"
          sizes={size === "hero" ? "1200px" : "(max-width: 800px) 92vw, 480px"}
        />
        <img
          src="/media/field/panel.webp"
          alt=""
          decoding="async"
          style={{ objectPosition: objPos }}
        />
      </picture>

      <div className="cover-copy">
        <span className="eyebrow on-dark cover-category">{category}</span>
        {keyword ? <strong className="cover-keyword">{keyword}</strong> : null}
      </div>

      <div className="cover-diagram" aria-hidden="true">
        {slug === "why-chatgpt-is-not-a-knowledge-base" ? (
          <PermissionsDiagram locale={locale} />
        ) : slug === "proposal-draft-in-15-minutes" ? (
          <ConvergenceDiagram />
        ) : (
          <GanttThumbDiagram slug={slug} />
        )}
      </div>
    </div>
  );
}
