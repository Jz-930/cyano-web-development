import type { ComponentProps } from "react";
import { PageShell } from "../PageShell";
import { Insights } from "@/components/v4/pages/Insights";

export function InsightsOverviewView(props: ComponentProps<typeof Insights>) {
  return (
    <PageShell locale={props.locale} route="insights">
      <Insights {...props} />
    </PageShell>
  );
}
