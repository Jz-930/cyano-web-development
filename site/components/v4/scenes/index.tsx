"use client";

import type { Locale } from "@/lib/locale";
import {
  type SceneId,
  caseMetaByMockup,
  mk,
} from "@/lib/mockups";
import { MockupWindow } from "../MockupWindow";
import { useMockupScale } from "../useMockupScale";
import { SceneProposal } from "./SceneProposal";
import { SceneWiki } from "./SceneWiki";
import { SceneSales } from "./SceneSales";
import { SceneData } from "./SceneData";
import { SceneProperty } from "./SceneProperty";
import { SceneWriting } from "./SceneWriting";

export {
  SceneProposal,
  SceneWiki,
  SceneSales,
  SceneData,
  SceneProperty,
  SceneWriting,
};

export function SceneContent({
  scene,
  locale,
  size,
  step,
  focusCite,
  onCite,
  showRail = true,
  interactiveCites = false,
}: {
  scene: SceneId;
  locale: Locale;
  size: "full" | "compact";
  step?: number;
  focusCite?: number | null;
  onCite?: (n: number | null) => void;
  showRail?: boolean;
  interactiveCites?: boolean;
}) {
  switch (scene) {
    case "proposal":
      return (
        <SceneProposal
          locale={locale}
          size={size}
          step={step}
          focusCite={focusCite}
          onCite={onCite}
          showRail={showRail}
          interactiveCites={interactiveCites}
        />
      );
    case "wiki":
      return (
        <SceneWiki
          locale={locale}
          size={size}
          step={step}
          focusCite={focusCite}
          onCite={onCite}
          showRail={showRail}
          interactiveCites={interactiveCites}
        />
      );
    case "sales":
      return <SceneSales locale={locale} size={size} />;
    case "data":
      return <SceneData locale={locale} size={size} />;
    case "property":
      return <SceneProperty locale={locale} size={size} />;
    case "writing":
      return <SceneWriting locale={locale} size={size} />;
  }
}

export function ScaledSceneMockup({
  scene,
  locale,
  size = "full",
  step = 6,
  showRail = true,
  className,
  children,
}: {
  scene: SceneId;
  locale: Locale;
  size?: "full" | "compact";
  step?: number;
  showRail?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const designW = size === "full" ? 560 : 360;
  const designH = size === "full" ? 380 : 225;
  const { ref, compactFallback } = useMockupScale(designW, designH, 360, 225);
  const effectiveSize: "full" | "compact" =
    size === "compact" || compactFallback ? "compact" : "full";
  const meta = caseMetaByMockup(scene, locale);
  const caption = mk(scene, "caption", locale);

  let status: string | null = null;
  let statusTone: "default" | "ok" | "review" = "default";
  if (scene === "proposal") {
    status =
      step >= 5
        ? mk("proposal", "statusReviewed", locale)
        : mk("proposal", "statusDraft", locale);
    statusTone = step >= 5 ? "review" : "default";
  } else if (scene === "wiki") {
    status = step >= 5 ? mk("wiki", "statusDone", locale) : null;
    statusTone = step >= 5 ? "ok" : "default";
  } else {
    status = meta.stats[0]?.value ?? null;
    statusTone = "ok";
  }

  return (
    <div
      ref={ref}
      className={`mk-scale mk-scale-${effectiveSize}${className ? ` ${className}` : ""}`}
    >
      <div className="mk-scale-inner">
        <MockupWindow
          system={meta.system}
          status={status}
          statusTone={statusTone}
          size={effectiveSize}
          caption={caption}
        >
          <SceneContent
            scene={scene}
            locale={locale}
            size={effectiveSize}
            step={step}
            showRail={showRail}
          />
        </MockupWindow>
        {children}
      </div>
    </div>
  );
}
