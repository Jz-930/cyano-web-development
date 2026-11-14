import {Plus,Minus} from "lucide-react";
import {StructuredData} from "../PageShell";
export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq-list">
      <StructuredData value={{"@context":"https://schema.org","@type":"FAQPage",mainEntity:items.map(f=>({"@type":"Question",name:f.q,acceptedAnswer:{"@type":"Answer",text:f.a}}))}} />
      {items.map((f, i) => (
        <details key={i}>
          <summary>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {f.q}
            <Plus className="faq-plus" size={19} />
            <Minus className="faq-minus" size={19} />
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
