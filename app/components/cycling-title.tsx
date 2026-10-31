"use client";

import { useEffect } from "react";

// TEMP: click the title to cycle its font between Weird Horses, 403 Technul, SD Cyberpunk City, Bitblast Serif Textured, and Take No Prisoners.
// Replace with a plain <h1> once a font is chosen.
const STORAGE_KEY = "title-font"; // also read by FONT_SCRIPT in layout.tsx
const SCALE_KEY = "title-font-scale"; // also read by FONT_SCRIPT in layout.tsx

// scale evens out the width of fonts that render larger or smaller at the same font-size.
// shift nudges the title right on mobile only (FONT_SCRIPT in layout.tsx mirrors it on load).
const FONTS: { value: string | null; scale: number; shift: string | null }[] = [
  { value: null, scale: 1, shift: null },
  { value: "var(--font-403)", scale: 1, shift: null },
  { value: "var(--font-cyberpunk)", scale: 1, shift: "15px" },
  { value: "var(--font-bitblast)", scale: 1, shift: "15px" },
  { value: "var(--font-take-no-prisoners)", scale: 1, shift: null },
];

// next/font only downloads a face once text uses it, so the first switch to each font used to
// flash a fallback. Loading every declared face up front (and before each switch) avoids that.
const loadFonts = () =>
  Promise.all(Array.from(document.fonts, (face) => face.load().catch(() => face)));

export function CyclingTitle({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    loadFonts();
  }, []);

  async function cycle() {
    await loadFonts();
    // .font-display reads --font-weird-horses, so point that variable at the next font
    const style = document.documentElement.style;
    const current = style.getPropertyValue("--font-weird-horses") || null;
    // A new visitor has no saved choice, so they always start on the default (Weird Horses)
    const index = FONTS.findIndex((font) => font.value === current);
    const next = FONTS[(index + 1) % FONTS.length];
    if (next.value) {
      style.setProperty("--font-weird-horses", next.value);
      style.setProperty("--title-scale", String(next.scale));
    } else {
      style.removeProperty("--font-weird-horses");
      style.removeProperty("--title-scale");
    }
    if (next.shift) style.setProperty("--title-shift", next.shift);
    else style.removeProperty("--title-shift");
    try {
      if (next.value) {
        localStorage.setItem(STORAGE_KEY, next.value);
        localStorage.setItem(SCALE_KEY, String(next.scale));
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SCALE_KEY);
      }
    } catch {}
  }

  // text-7xl / sm:text-9xl sizes (4.5rem / 8rem), multiplied by the per-font scale.
  // Line height stays at the full size so a scaled-down font keeps the same vertical space.
  // pl-4 -ml-4 puts the glyphs' left overhang (the J's tail) inside the box, so WebKit on iOS
  // cannot clip it to the layer bounds. The negative margin keeps the text where it was.
  return (
    <h1
      onClick={cycle}
      className="mt-6 relative -ml-4 left-[var(--title-shift,0px)] cursor-pointer select-none pl-4 self-start transition-transform duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] font-display text-[length:calc(4.5rem*var(--title-scale,1))] leading-[4.5rem] tracking-tight text-heading sm:left-0 sm:text-[length:calc(8rem*var(--title-scale,1))] sm:leading-[8rem]"
    >
      {children}
    </h1>
  );
}
