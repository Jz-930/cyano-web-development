import type { ComponentProps } from "react";
import { PageShell } from "../PageShell";
import { Missing } from "@/components/v4/pages/Missing";

export function NotFoundView(props: ComponentProps<typeof Missing>) {
  return (
    <PageShell locale={props.locale} route="404" closing={false}>
      <Missing {...props} />
    </PageShell>
  );
}
