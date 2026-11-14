import { Fragment } from "react";
import breaks from "@/content/v4/zh-breaks.json";

export function Phrase({
  text,
  locale,
}: {
  text: string;
  locale?: "zh" | "en";
}) {
  if (locale && locale !== "zh") return <>{text}</>;
  const parts = (breaks as Record<string, string[]>)[text];
  if (!parts) return <>{text}</>;
  if (parts.join("") !== text) {
    throw new Error(`zh-breaks mismatch: ${text}`);
  }
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^([ \t]*)([\s\S]*?)([ \t]*)$/);
        const lead = m?.[1] ?? "";
        const core = m?.[2] ?? p;
        const trail = m?.[3] ?? "";
        return (
          <Fragment key={i}>
            {lead}
            {core ? <span className="phrase">{core}</span> : null}
            {trail}
          </Fragment>
        );
      })}
    </>
  );
}
