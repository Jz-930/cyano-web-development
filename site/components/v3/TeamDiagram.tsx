import {type Locale,founders} from "@/lib/content-v4";
export function TeamDiagram({locale}:{locale:Locale}){return <div className="team-constellation">{founders(locale).map((f,i)=><div key={f.id}><span className="team-role-number" aria-hidden="true">0{i+1}</span><span>{f.role}</span></div>)}</div>;}
