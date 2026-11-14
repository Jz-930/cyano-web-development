import type { ComponentProps } from "react";
import { PageShell } from "../PageShell";
import { Article } from "@/components/v4/pages/Article";

export function InsightArticleView(props: ComponentProps<typeof Article>) {
  return (
    <PageShell locale={props.locale} route={`insights/${props.slug}`}>
      <Article {...props} />
    </PageShell>
  );
}
