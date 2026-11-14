import type { ComponentProps } from "react";
import { PageShell } from "../PageShell";
import { SolutionDetail } from "@/components/v4/pages/SolutionDetail";

export function SolutionDetailView(
  props: ComponentProps<typeof SolutionDetail>,
) {
  return (
    <PageShell locale={props.locale} route={`services/${props.slug}`}>
      <SolutionDetail {...props} />
    </PageShell>
  );
}
