import type { ComponentProps } from "react";
import { PageShell } from "../PageShell";
import { Engagement } from "@/components/v4/pages/Engagement";

export function EngagementView(props: ComponentProps<typeof Engagement>) {
  return (
    <PageShell locale={props.locale} route="engagement">
      <Engagement {...props} />
    </PageShell>
  );
}
