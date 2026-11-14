import {EngineeringDiagram} from "./EngineeringDiagram";
import {type Locale} from "@/lib/v1-content";
import {LightField} from "./LightField";
export function CoreVisual({locale}:{locale:Locale}){return <><LightField strength="panel"/><div className="hero-diagram" aria-hidden="true"><EngineeringDiagram variant={1}/></div></>;}
