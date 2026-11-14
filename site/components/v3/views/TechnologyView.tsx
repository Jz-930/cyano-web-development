import type { ComponentProps } from "react";
import { PageShell } from "../PageShell";
import { Technology } from "@/components/v4/pages/Technology";

export function TechnologyView(props: ComponentProps<typeof Technology>) {
  return (
    <PageShell locale={props.locale} route="technology">
      <Technology {...props} />
    </PageShell>
  );
}
