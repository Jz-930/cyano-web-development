// Final v1 content, with approved v3 presentation.
import type {ComponentProps} from "react";
import {PageShell} from "./v3/PageShell";
import {Home} from "./v3/pages/Home";
export function HomeView(props:ComponentProps<typeof Home>){return <PageShell locale={props.locale} route={""}><Home {...props}/></PageShell>;}
import {Services} from "./v3/pages/Services";
export function ServicesOverviewView(props:ComponentProps<typeof Services>){return <PageShell locale={props.locale} route={"services"}><Services {...props}/></PageShell>;}
import {SolutionDetail} from "./v3/pages/SolutionDetail";
export function SolutionDetailView(props:ComponentProps<typeof SolutionDetail>){return <PageShell locale={props.locale} route={"services/"+props.slug}><SolutionDetail {...props}/></PageShell>;}
import {CasesPage} from "./v3/pages/CasesPage";
export function CasesOverviewView(props:ComponentProps<typeof CasesPage>){return <PageShell locale={props.locale} route={"cases"}><CasesPage {...props}/></PageShell>;}
import {CaseDetail} from "./v3/pages/CaseDetail";
export function CaseDetailView(props:ComponentProps<typeof CaseDetail>){return <PageShell locale={props.locale} route={"cases/"+props.slug}><CaseDetail {...props}/></PageShell>;}
import {Technology} from "./v3/pages/Technology";
export function TechnologyView(props:ComponentProps<typeof Technology>){return <PageShell locale={props.locale} route={"technology"}><Technology {...props}/></PageShell>;}
import {Engagement} from "./v3/pages/Engagement";
export function EngagementView(props:ComponentProps<typeof Engagement>){return <PageShell locale={props.locale} route={"engagement"}><Engagement {...props}/></PageShell>;}
import {About} from "./v3/pages/About";
export function AboutView(props:ComponentProps<typeof About>){return <PageShell locale={props.locale} route={"about"}><About {...props}/></PageShell>;}
import {Contact} from "./v3/pages/Contact";
export function ContactView(props:ComponentProps<typeof Contact>){return <PageShell locale={props.locale} route={"contact"}><Contact {...props}/></PageShell>;}
import {Insights} from "./v3/pages/Insights";
export function InsightsOverviewView(props:ComponentProps<typeof Insights>){return <PageShell locale={props.locale} route={"insights"}><Insights {...props}/></PageShell>;}
import {Article} from "./v3/pages/Article";
export function InsightArticleView(props:ComponentProps<typeof Article>){return <PageShell locale={props.locale} route={"insights/"+props.slug}><Article {...props}/></PageShell>;}
import {Legal} from "./v3/pages/Legal";
export function LegalView(props:ComponentProps<typeof Legal>){return <PageShell locale={props.locale} route={props.type}><Legal {...props}/></PageShell>;}
import {Missing} from "./v3/pages/Missing";
export function NotFoundView(props:ComponentProps<typeof Missing>){return <PageShell locale={props.locale} route={"404"}><Missing {...props}/></PageShell>;}
