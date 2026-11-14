import type {ComponentProps} from "react";
import {PageShell} from "../PageShell";
import {Home} from "@/components/v4/pages/Home";
export function HomeView(props:ComponentProps<typeof Home>){return <PageShell locale={props.locale} route={""}><Home {...props}/></PageShell>;}
