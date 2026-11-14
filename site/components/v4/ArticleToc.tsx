"use client";

import { useEffect, useState } from "react";

export function ArticleToc({
  heading,
  items,
}: {
  heading: string;
  items: { id: string; label: string }[];
}) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    sections.forEach((sec) => io.observe(sec));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className="article-toc flex flex-col [gap:var(--sp-3)]" aria-label={heading}>
      <span className="label article-toc-title">{heading}</span>
      <ul className="article-toc-list flex flex-col list-none m-0 p-0 [border-left:1px_solid_var(--line)]">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className="article-toc-link block [padding:var(--sp-2)_0_var(--sp-2)_var(--sp-4)] [margin-left:-1px] [transition:color_var(--qtf),border-color_var(--qtf)]"
              data-active={activeId === it.id ? "true" : undefined}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
