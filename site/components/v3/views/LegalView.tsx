import type {ComponentProps} from "react";
import {PageShell} from "../PageShell";
import {Legal} from "../pages/Legal";
export function LegalView(props:ComponentProps<typeof Legal>){return <PageShell locale={props.locale} route={props.type}><Legal {...props}/></PageShell>;}
