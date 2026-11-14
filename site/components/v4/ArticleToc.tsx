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
    <nav className="article-toc" aria-label={heading}>
      <span className="label article-toc-title">{heading}</span>
      <ul className="article-toc-list">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className="article-toc-link"
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
