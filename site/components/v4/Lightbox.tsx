"use client";

import { useEffect, useRef } from "react";
import { t, type Locale } from "@/lib/locale";
import { Picture } from "./Picture";

export function Lightbox({
  locale,
  images,
  label,
  current,
  onChange,
  onClose,
}: {
  locale: Locale;
  images: string[];
  label: string;
  current: number;
  onChange: (n: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const step = (n: number) =>
    onChange((current + n + images.length) % images.length);

  useEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = before;
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className="screen-dialog"
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.currentTarget === e.target) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          step(-1);
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          step(1);
        }
      }}
    >
      <button type="button" className="dialog-close" onClick={onClose}>
        {t(locale, "关闭 ×", "Close ×")}
      </button>
      <div key={current} className="dialog-media-frame">
        <Picture src={images[current]} alt={label} sizes="90vw" />
      </div>
      <div className="dialog-controls">
        <button type="button" onClick={() => step(-1)}>
          {t(locale, "上一张", "Previous")}
        </button>
        <p aria-live="polite">
          {current + 1} / {images.length}
        </p>
        <button type="button" onClick={() => step(1)}>
          {t(locale, "下一张", "Next")}
        </button>
      </div>
    </dialog>
  );
}
