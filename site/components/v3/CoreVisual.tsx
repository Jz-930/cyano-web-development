import {EngineeringDiagram} from "./EngineeringDiagram";
import {type Locale} from "@/lib/content-v4";
import {LightField} from "./LightField";
export function CoreVisual({locale}:{locale:Locale}){return <><LightField strength="panel"/><div className="hero-diagram" aria-hidden="true"><EngineeringDiagram variant={1}/></div></>;}
