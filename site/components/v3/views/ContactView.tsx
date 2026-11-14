import type {ComponentProps} from "react";
import {PageShell} from "../PageShell";
import {Contact} from "../pages/Contact";
export function ContactView(props:ComponentProps<typeof Contact>){return <PageShell locale={props.locale} route={"contact"} closing={false}><Contact {...props}/></PageShell>;}
