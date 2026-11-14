import type {ComponentProps} from "react";
import {PageShell} from "../PageShell";
import {Missing} from "../pages/Missing";
export function NotFoundView(props:ComponentProps<typeof Missing>){return <PageShell locale={props.locale} route={"404"}><Missing {...props}/></PageShell>;}
