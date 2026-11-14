import type { ComponentProps } from "react";
import { PageShell } from "../PageShell";
import { CaseDetail } from "@/components/v4/pages/CaseDetail";

export function CaseDetailView(props: ComponentProps<typeof CaseDetail>) {
  return (
    <PageShell locale={props.locale} route={`cases/${props.slug}`}>
      <CaseDetail {...props} />
    </PageShell>
  );
}
