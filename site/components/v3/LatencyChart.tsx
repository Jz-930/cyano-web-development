import {type Locale} from "@/lib/locale";
import {ChartFigure} from "./ChartFigure";
import {ChartIsland} from "./VisibleIslands";
export function LatencyChart({locale}:{locale:Locale}){return <ChartIsland locale={locale}><ChartFigure locale={locale}/></ChartIsland>;}
