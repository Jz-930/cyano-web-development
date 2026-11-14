export function FAQ({
  items,
  openCount = 0,
}: {
  items: { q: string; a: string }[];
  openCount?: number;
}) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="faq [border-top:1px_solid_var(--line)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
      {items.map((it, i) => (
        <details key={it.q} open={i < openCount} className="faq-item [border-bottom:1px_solid_var(--line)] [interpolate-size:allow-keywords]">
          <summary>
            <span className="faq-q">{it.q}</span>
            <span className="faq-icon" aria-hidden="true" />
          </summary>
          <div className="faq-a [padding:0_0_24px_16px] [border-left:1px_solid_var(--line)] [margin-left:2px]">
            <p>{it.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
