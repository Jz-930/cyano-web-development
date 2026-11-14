import type {ComponentProps} from "react";
import {PageShell} from "../PageShell";
import {CasesPage} from "../pages/CasesPage";
export function CasesOverviewView(props:ComponentProps<typeof CasesPage>){return <PageShell locale={props.locale} route={"cases"}><CasesPage {...props}/></PageShell>;}
