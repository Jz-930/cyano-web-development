import type { ComponentProps } from "react";
import { PageShell } from "../PageShell";
import { Services } from "@/components/v4/pages/Services";

export function ServicesOverviewView(props: ComponentProps<typeof Services>) {
  return (
    <PageShell locale={props.locale} route="services">
      <Services {...props} />
    </PageShell>
  );
}
