import manifestData from "@/lib/responsive-media.json";

type Asset = {
  width: number;
  height: number;
  variants: { width: number; webp: string; avif: string }[];
};

const manifest = manifestData as Record<string, Asset>;

export function Picture({
  src,
  alt,
  sizes,
  priority = false,
  thumbnail = false,
  className,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  thumbnail?: boolean;
  className?: string;
}) {
  const asset = manifest[src];
  if (!asset) throw new Error(`Responsive image missing: ${src}`);
  const maxDisplayWidth = Math.floor(asset.width / 1.25);
  const resolvedSizes =
    sizes === "90vw"
      ? `(max-width: ${Math.ceil(maxDisplayWidth / 0.9)}px) 90vw, ${maxDisplayWidth}px`
      : (sizes ??
        `(max-width: 800px) calc(100vw - 40px), ${Math.min(600, maxDisplayWidth)}px`);
  const variants = thumbnail
    ? asset.variants.filter((v) => v.width <= 320)
    : asset.variants;
  const fallback = variants.find((v) => v.width >= 640) || variants.at(-1)!;
  return (
    <picture className={className}>
      <source
        type="image/avif"
        srcSet={variants.map((v) => `${v.avif} ${v.width}w`).join(", ")}
        sizes={resolvedSizes}
      />
      <img
        src={fallback.webp}
        srcSet={variants.map((v) => `${v.webp} ${v.width}w`).join(", ")}
        sizes={resolvedSizes}
        alt={alt}
        width={asset.width}
        height={asset.height}
        style={
          sizes === "90vw" ? { maxWidth: `${maxDisplayWidth}px` } : undefined
        }
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}
