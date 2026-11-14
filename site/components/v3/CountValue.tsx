"use client";
import {useEffect,useRef,useState} from "react";
export function CountValue({value}:{value:string}){
 const [shown,setShown]=useState(value),ref=useRef<HTMLSpanElement>(null);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');if(media.matches)return;const target=Number(value.replace(/[^\d.]/g,''));if(!Number.isFinite(target))return;const suffix=value.replace(/[\d.]/g,'');let frame=0,started=false,start=0;
  const finish=()=>{cancelAnimationFrame(frame);setShown(value);};
  const draw=(now:number)=>{if(document.hidden){finish();return;}if(!start)start=now;const p=Math.min((now-start)/700,1);setShown(String(Math.round(target*(1-(1-p)**3)))+suffix);if(p<1)frame=requestAnimationFrame(draw);};
  const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting&&!started){started=true;frame=requestAnimationFrame(draw);}else if(!entry.isIntersecting&&started)finish();},{threshold:.6});if(ref.current)observer.observe(ref.current);
  const visibility=()=>{if(document.hidden)finish();};document.addEventListener('visibilitychange',visibility);media.addEventListener('change',finish);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',finish);};
 },[value]);return <span ref={ref} className="count-value"><span aria-hidden="true">{shown}</span><span className="sr-only">{value}</span></span>;
}
