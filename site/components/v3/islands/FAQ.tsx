import { StructuredData } from "../PageShell";

export function FAQ({
  items,
  openCount = 0,
}: {
  items: { q: string; a: string }[];
  openCount?: number;
}) {
  return (
    <div className="faq">
      <StructuredData
        value={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      {items.map((it, i) => (
        <details key={it.q} open={i < openCount} className="faq-item">
          <summary>
            <span className="faq-q">{it.q}</span>
            <span className="faq-icon" aria-hidden="true" />
          </summary>
          <div className="faq-a">
            <p>{it.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
