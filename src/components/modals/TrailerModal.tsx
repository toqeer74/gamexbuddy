import React, { useEffect, useRef } from "react";
import LiteYouTube from "@/components/media/LiteYouTube";

export default function TrailerModal({
  open,
  onClose,
  id,
  title,
}: {
  open: boolean;
  onClose: () => void;
  id: string;
  title: string;
}) {
  if (!open) return null;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    prevFocus.current = (document.activeElement as HTMLElement) || null;
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab") {
        const root = dialogRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prevFocus.current?.focus();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="trailer-modal-title"
      className="nl-backdrop"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="card-glass"
        style={{ width: "min(920px, 94vw)", height: "min(520px, 56vw)", padding: 10 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", padding: "4px 6px 8px" }}>
          <strong id="trailer-modal-title" style={{ marginRight: "auto" }}>
            {title}
          </strong>
          <button
            ref={closeBtnRef}
            className="navlink"
            aria-label="Close trailer modal"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div style={{ width: "100%", height: "calc(100% - 40px)" }}>
          <LiteYouTube id={id} title={title} />
        </div>
      </div>
    </div>
  );
}

