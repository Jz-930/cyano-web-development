"use client";
import {useState,useRef} from "react";
import {type Locale,t} from "@/lib/locale";
export function ProblemTabs({locale,items}:{locale:Locale;items:{title:string;issue:string;answer:string}[]}){
 const [active,setActive]=useState(0),tabs=useRef<(HTMLButtonElement|null)[]>([]);
 return <div className="problem-explorer"><div className="problem-tabs" role="tablist" aria-label={t(locale,'实施中需要处理的问题','Implementation')}>
 {items.map((item,i)=><button key={item.title} ref={el=>{tabs.current[i]=el;}} id={`problem-tab-${i}`} role="tab" tabIndex={i===active?0:-1} aria-selected={i===active} aria-controls={`problem-panel-${i}`} onClick={()=>setActive(i)} onKeyDown={e=>{const keys=['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'];if(!keys.includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?items.length-1:(i+(['ArrowRight','ArrowDown'].includes(e.key)?1:items.length-1))%items.length;setActive(next);tabs.current[next]?.focus();}}><span>{String(i+1).padStart(2,'0')}</span>{item.title}</button>)}
 </div><div>{items.map((item,i)=><div key={item.title} id={`problem-panel-${i}`} className="problem-panel" role="tabpanel" aria-labelledby={`problem-tab-${i}`} hidden={i!==active}><h3>{item.title}</h3><div className="problem-comparison"><div className="problem-before"><span>{t(locale,'目前的问题','The problem')}</span><p>{item.issue}</p></div><div className="problem-after"><span>Cyano Core</span><p>{item.answer}</p></div></div></div>)}</div><noscript><div className="problem-nojs">{items.slice(1).map(item=><section key={item.title}><h3>{item.title}</h3><p>{item.issue}</p><p>{item.answer}</p></section>)}</div></noscript></div>;
}
