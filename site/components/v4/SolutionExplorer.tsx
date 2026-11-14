import {
  copyIfApproved,
  solutions,
  type Locale,
} from "@/lib/content-v4";
import type { SceneId } from "@/lib/mockups";
import {
  SolutionExplorerClient,
  type SolutionTabItem,
} from "./SolutionExplorerClient";

const SOLUTION_META: Record<string, { scene: SceneId; h3: string }> = {
  "sales-ai": { scene: "sales", h3: "04" },
  "document-automation": { scene: "proposal", h3: "01" },
  "knowledge-assistant": { scene: "wiki", h3: "02" },
  "data-query": { scene: "data", h3: "03" },
};

export function SolutionExplorer({ locale }: { locale: Locale }) {
  const list = solutions(locale);
  const items: SolutionTabItem[] = list.map((s) => {
    const meta = SOLUTION_META[s.slug] ?? { scene: "proposal", h3: "01" };
    return {
      slug: s.slug,
      name: s.name,
      promise: s.promise,
      intro: s.intro,
      outputs: s.outputs,
      scene: meta.scene,
      dept: copyIfApproved(`H-3d${meta.h3}`, locale),
      before: copyIfApproved(`H-3b${meta.h3}`, locale),
      after: copyIfApproved(`H-3a${meta.h3}`, locale),
    };
  });

  return <SolutionExplorerClient locale={locale} items={items} />;
}
