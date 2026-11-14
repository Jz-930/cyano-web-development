import type {ComponentProps} from "react";
import {PageShell} from "../PageShell";
import {About} from "../pages/About";
export function AboutView(props:ComponentProps<typeof About>){return <PageShell locale={props.locale} route={"about"}><About {...props}/></PageShell>;}
