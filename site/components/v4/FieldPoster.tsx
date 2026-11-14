export type FieldPosterProps = {
  preset?: "panel" | "converge";
  opacity?: number;
};

export function FieldPoster({
  preset = "panel",
  opacity = 0.35,
}: FieldPosterProps) {
  return (
    <img
      className="field"
      src={`/media/field/${preset}.webp`}
      srcSet={`/media/field/${preset}-720.webp 720w, /media/field/${preset}.webp 1440w`}
      sizes="100vw"
      alt=""
      decoding="async"
      style={{ opacity }}
    />
  );
}
