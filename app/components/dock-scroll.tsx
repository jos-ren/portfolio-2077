"use client";

import { useEffect } from "react";

const THRESHOLD = 10; // px of scrolling before the direction counts
const EDGE = 50; // px from the top or bottom where the dock always shows

// Sets data-dock-hidden on <html> while the user scrolls down. dock.tsx hides itself from
// that attribute on phones only, so desktop is unaffected.
export function DockScroll() {
  useEffect(() => {
    const root = document.documentElement;
    let lastY = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const nearTop = y < EDGE;
      const nearBottom = window.innerHeight + y >= root.scrollHeight - EDGE;
      if (nearTop || nearBottom) {
        root.removeAttribute("data-dock-hidden");
        lastY = y;
        return;
      }
      const delta = y - lastY;
      if (delta > THRESHOLD) {
        root.setAttribute("data-dock-hidden", "");
        lastY = y;
      } else if (delta < -THRESHOLD) {
        root.removeAttribute("data-dock-hidden");
        lastY = y;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      root.removeAttribute("data-dock-hidden");
    };
  }, []);

  return null;
}
