"use client";
import {useEffect,useRef} from "react";

/** The approved material study's single shader, loaded only when its stage is near view. */
export function LightField({strength="hero"}:{strength?:"hero"|"panel"|"closing"}) {
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const host=ref.current!;let dispose:(()=>void)|undefined;let cancelled=false;
    const observer=new IntersectionObserver(async ([entry])=>{
      if(!entry.isIntersecting||cancelled)return;
      observer.disconnect();
      if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
      if(matchMedia("(max-width: 800px), (pointer: coarse)").matches)return;
      const {mountField}=await import("./light-field.js");
      if(!cancelled)dispose=mountField(host);
    },{rootMargin:"120px"});
    observer.observe(host);
    return ()=>{cancelled=true;observer.disconnect();dispose?.();};
  },[]);
  return <div ref={ref} className={`light-field field-${strength}`} aria-hidden="true"><img src="/v3-materials/field-poster.avif" width={1440} height={900} alt="" loading={strength==="hero"?"eager":"lazy"}/></div>;
}
