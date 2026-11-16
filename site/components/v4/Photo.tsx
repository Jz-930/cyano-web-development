import manifestData from "@/lib/photo-media.json";
import type { Locale } from "@/lib/locale";

type PhotoAsset = {
  width: number;
  height: number;
  alt: Record<Locale, string>;
  variants: { width: number; webp: string; avif: string }[];
};

const manifest = manifestData as Record<string, PhotoAsset>;

export type PhotoId = keyof typeof manifestData;

/**
 * Editorial photography (v5). Purely atmospheric: callers decide whether the
 * photo carries meaning (pass `locale` for alt text) or is decorative
 * (`decorative` → empty alt, hidden from assistive tech).
 */
export function Photo({
  id,
  locale,
  sizes = "(max-width: 800px) calc(100vw - 32px), 640px",
  decorative = false,
  priority = false,
  className,
}: {
  id: PhotoId;
  locale: Locale;
  sizes?: string;
  decorative?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const asset = manifest[id];
  if (!asset) throw new Error(`Photo missing: ${id}`);
  const { variants } = asset;
  const fallback = variants.find((v) => v.width >= 800) ?? variants.at(-1)!;
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={variants.map((v) => `${v.avif} ${v.width}w`).join(", ")} sizes={sizes} />
      <img
        src={fallback.webp}
        srcSet={variants.map((v) => `${v.webp} ${v.width}w`).join(", ")}
        sizes={sizes}
        alt={decorative ? "" : asset.alt[locale]}
        aria-hidden={decorative || undefined}
        width={asset.width}
        height={asset.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}
