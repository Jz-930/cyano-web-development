import type { ComponentProps } from "react";
import { PageShell } from "../PageShell";
import { Legal } from "@/components/v4/pages/Legal";

export function LegalView(props: ComponentProps<typeof Legal>) {
  return (
    <PageShell locale={props.locale} route={props.type} closing={false}>
      <Legal {...props} />
    </PageShell>
  );
}
