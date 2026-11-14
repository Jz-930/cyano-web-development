"use client";
import {useEffect,useRef,useState,type ReactNode} from "react";
import dynamic from "next/dynamic";
import {type Locale} from "@/lib/locale";
const Demo=dynamic(()=>import('./InteractiveDemoClient').then(m=>m.InteractiveDemo));
function useVisible(){const ref=useRef<HTMLDivElement>(null),[ready,setReady]=useState(false);useEffect(()=>{const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setReady(true);observer.disconnect();}},{rootMargin:'200px'});if(ref.current)observer.observe(ref.current);return()=>observer.disconnect();},[]);return {ref,ready};}
export function DemoIsland({locale,data,copy,children}:{locale:Locale;data:boolean;copy:Record<string,Record<string,string>>;children:ReactNode}){const {ref,ready}=useVisible();return <div ref={ref}>{ready?<Demo locale={locale} data={data} copy={copy}/>:children}</div>;}
