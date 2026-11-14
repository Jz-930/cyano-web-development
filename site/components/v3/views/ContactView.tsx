import type { ComponentProps } from "react";
import { PageShell } from "../PageShell";
import { Contact } from "@/components/v4/pages/Contact";

export function ContactView(props: ComponentProps<typeof Contact>) {
  return (
    <PageShell locale={props.locale} route="contact" closing={false}>
      <Contact {...props} />
    </PageShell>
  );
}
