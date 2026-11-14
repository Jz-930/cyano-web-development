import {EngineeringDiagram} from "./EngineeringDiagram";
import {type Locale} from "@/lib/content-v4";
import {LightField} from "@/components/v4/LightField";
export function CoreVisual({locale: _locale}:{locale:Locale}){return <><LightField preset="converge" intro textEdgeSelector=".page-hero-inner"/><div className="hero-diagram" aria-hidden="true"><EngineeringDiagram variant={1}/></div></>;}
