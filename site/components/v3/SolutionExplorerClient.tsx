"use client";
import {EngineeringDiagram} from "./EngineeringDiagram";
import { useState, useEffect, useRef, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ArrowRight, ChevronDown, Menu, X, Plus, Minus, ChevronLeft, ChevronRight, Check, LoaderCircle, Send, Globe, ShieldCheck, Search, Database } from "lucide-react";
import { type Locale, t, href } from "@/lib/locale";
import type { CaseStudy, solutions } from "@/lib/v1-content";
import { Logo, solutionIcons } from "./client-shared";
type LocalCopy = Record<string,Record<string,string>>;
export function SolutionExplorer({ locale, solutionItems }: { locale: Locale; solutionItems: ReturnType<typeof solutions> }) {
  const [selected, setSelected] = useState(0);
  const items = solutionItems,
    s = items[selected],
    Icon = solutionIcons[selected];
  return (
    <div className="solution-explorer">
      <div
        className="solution-list"
        role="tablist"
        aria-label={t(locale, "解决方案", "Solutions")}
      >
        {items.map((s, i) => (
          <button
            key={s.slug}
            role="tab"
            tabIndex={selected === i ? 0 : -1}
            onKeyDown={(e) => {
              const keys = [
                "ArrowRight",
                "ArrowLeft",
                "ArrowDown",
                "ArrowUp",
                "Home",
                "End",
              ];
              if (!keys.includes(e.key)) return;
              e.preventDefault();
              const next =
                e.key === "Home"
                  ? 0
                  : e.key === "End"
                    ? 3
                    : (i +
                        (e.key === "ArrowRight" || e.key === "ArrowDown"
                          ? 1
                          : 3)) %
                      4;
              setSelected(next);
              document.getElementById("solution-tab-" + next)?.focus();
            }}
            aria-selected={selected === i}
            aria-controls="solution-panel"
            id={"solution-tab-" + i}
            
            onFocus={() => setSelected(i)}
            onClick={() => setSelected(i)}
            className={selected === i ? "selected" : ""}
          >
            <span className="solution-number">0{i + 1}</span>
            <span>{s.name}</span>
            <ArrowUpRight size={25} />
          </button>
        ))}
      </div>
      <div
        className={`solution-panel solution-panel-${selected}`}
        id="solution-panel"
        role="tabpanel"
        aria-labelledby={"solution-tab-" + selected}
      >
        <div className="solution-panel-art">
          <EngineeringDiagram variant={selected}/>
        </div>
        <div className="solution-panel-copy">
          <h3>{s.promise}</h3>
          <p>{s.intro}</p>
          <div className="outputs">{s.outputs}</div>
          <Link
            className="text-link"
            href={href(locale, "/services/" + s.slug)}
          >
            {t(locale, "探索解决方案", "Explore solution")}
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}
