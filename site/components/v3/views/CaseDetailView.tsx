import type {ComponentProps} from "react";
import {PageShell} from "../PageShell";
import {CaseDetail} from "../pages/CaseDetail";
export function CaseDetailView(props:ComponentProps<typeof CaseDetail>){return <PageShell locale={props.locale} route={"cases/"+props.slug}><CaseDetail {...props}/></PageShell>;}
