import {type Locale,solutions} from "@/lib/v1-content";
import {SolutionExplorer as SolutionExplorerClient} from "../SolutionExplorerClient";
export function SolutionExplorer({locale}:{locale:Locale}){return <SolutionExplorerClient locale={locale} solutionItems={solutions(locale)} />;}
