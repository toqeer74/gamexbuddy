import { useEffect, useRef } from "react";
import { awardPointsAndRefresh } from "@/lib/points";

/**
 * Awards points once when:
 *  - user scrolls past content by `scrollPct` OR
 *  - user stays `dwellMs` on the page
 * Idempotent via DB unique index on (user,event_type,event_ref).
 */
export function useEarnOnRead(
  postId: string,
  {
    contentSelector = "article",
    dwellMs = 40_000,
    scrollPct = 0.7,
    points = 10,
  }: { contentSelector?: string; dwellMs?: number; scrollPct?: number; points?: number } = {}
) {
  const awarded = useRef(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!postId) return;

    function maybeAward() {
      if (awarded.current) return;
      awarded.current = true;
      awardPointsAndRefresh("read_article", postId, points).catch(() => {
        // allow retry on transient failure
        awarded.current = false;
      });
      cleanup();
    }

    function onScroll() {
      const el = document.querySelector(contentSelector) as HTMLElement | null;
      const doc = document.documentElement;
      const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const progress = (window.scrollY || window.pageYOffset) / max;
      const pastContent = el
        ? window.scrollY + window.innerHeight >= el.offsetTop + el.offsetHeight * scrollPct
        : false;
      if (progress >= scrollPct || pastContent) maybeAward();
    }

    function onDwell() {
      maybeAward();
    }

    function cleanup() {
      window.removeEventListener("scroll", onScroll as any, { capture: false } as any);
      if (timer.current) window.clearTimeout(timer.current);
    }

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    window.addEventListener("scroll", onScroll, { passive: true });
    timer.current = window.setTimeout(onDwell, prefersReduced ? Math.min(dwellMs, 20_000) : dwellMs);

    return cleanup;
  }, [postId, contentSelector, dwellMs, scrollPct, points]);
}

