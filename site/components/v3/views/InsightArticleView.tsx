import type {ComponentProps} from "react";
import {PageShell} from "../PageShell";
import {Article} from "../pages/Article";
export function InsightArticleView(props:ComponentProps<typeof Article>){return <PageShell locale={props.locale} route={"insights/"+props.slug}><Article {...props}/></PageShell>;}
