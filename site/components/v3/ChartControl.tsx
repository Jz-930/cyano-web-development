"use client";
import {useState} from "react";
import {type Locale} from "@/lib/locale";
import {ChartFigure} from "./ChartFigure";
export function ChartControl({locale}:{locale:Locale}){const [turn,setTurn]=useState(50);return <ChartFigure locale={locale} turn={turn} onChange={setTurn}/>;}
