"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { t, type Locale } from "@/lib/locale";
import { MockupWindow } from "./MockupWindow";
import { Picture } from "./Picture";

const Lightbox = dynamic(() => import("./Lightbox").then((m) => m.Lightbox), {
  ssr: false,
});

export type CaseGalleryProps = {
  locale: Locale;
  system: string;
  images: string[];
  main: number;
  captions: (string | null)[];
};

export function CaseGallery({
  locale,
  system,
  images,
  main,
  captions,
}: CaseGalleryProps) {
  const [current, setCurrent] = useState(main);
  const [zoom, setZoom] = useState(false);
  const [ready, setReady] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  const hasCaptions =
    captions.length === images.length &&
    captions.every((c): c is string => Boolean(c));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    if (hostRef.current) observer.observe(hostRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`case-gallery-grid${hasCaptions ? " has-captions" : ""}`}
      ref={hostRef}
    >
      {hasCaptions ? (
        <ol className="case-gallery-list">
          {captions.map((cap, i) => (
            <li key={images[i]}>
              <button
                type="button"
                className="case-gallery-item"
                data-active={current === i ? "true" : undefined}
                aria-pressed={current === i}
                onClick={() => setCurrent(i)}
              >
                <span className="label">{String(i + 1).padStart(2, "0")}</span>
                <span>{cap}</span>
              </button>
            </li>
          ))}
        </ol>
      ) : null}

      <div className="case-gallery-viewer">
        <MockupWindow
          system={system}
          status={`${String(current + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`}
          className="case-gallery-window"
        >
          <div className="gallery">
            <button
              ref={triggerRef}
              type="button"
              className="gallery-main zoomable"
              onClick={() => {
                setReady(true);
                setZoom(true);
              }}
              aria-label={t(locale, "放大查看界面", "Enlarge screenshot")}
            >
              <Picture
                src={images[current]}
                alt={`${system} — ${t(locale, "界面", "screen")} ${current + 1}`}
                sizes="(max-width: 800px) 90vw, 880px"
              />
              <span className="zoom-pill">
                <Search size={15} aria-hidden="true" />
                {t(locale, "点击放大", "Click to enlarge")}
              </span>
            </button>
            <div className="gallery-controls">
              <div className="gallery-thumbs">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className={current === i ? "selected" : ""}
                    onClick={() => setCurrent(i)}
                    aria-label={t(locale, "查看界面 ", "View screen ") + (i + 1)}
                    aria-pressed={current === i}
                  >
                    <Picture src={src} alt="" thumbnail sizes="100px" />
                  </button>
                ))}
              </div>
              <div className="gallery-count">
                {String(current + 1).padStart(2, "0")} /{" "}
                {String(images.length).padStart(2, "0")}
              </div>
            </div>
          </div>
        </MockupWindow>
      </div>

      {ready && zoom ? (
        <Lightbox
          locale={locale}
          images={images}
          label={system}
          current={current}
          onChange={setCurrent}
          onClose={() => {
            setZoom(false);
            requestAnimationFrame(() =>
              requestAnimationFrame(() => triggerRef.current?.focus()),
            );
          }}
        />
      ) : null}
    </div>
  );
}
