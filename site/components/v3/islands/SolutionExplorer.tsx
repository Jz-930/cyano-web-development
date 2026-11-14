import {type Locale,solutions} from "@/lib/content-v4";
import {SolutionExplorer as SolutionExplorerClient} from "../SolutionExplorerClient";
export function SolutionExplorer({locale}:{locale:Locale}){return <SolutionExplorerClient locale={locale} solutionItems={solutions(locale)} />;}
