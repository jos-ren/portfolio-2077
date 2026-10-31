"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = Array.from("#▒░▓/\\<>01@%&$");
const FONTS = [
  "font-bebas",
  "font-orbitron",
  "font-vt323",
  "font-mono",
  "font-display",
];
const TICK_MS = 50;
const TICKS = 14;

type Letter = { ch: string; font: string };

const pick = <T,>(items: readonly T[]) =>
  items[Math.floor(Math.random() * items.length)];

const plain = (text: string): Letter[] =>
  Array.from(text, (ch) => ({ ch, font: "" }));

export function GlitchTitle({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [letters, setLetters] = useState<Letter[]>(() => plain(text));
  const [active, setActive] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );

  function glitch() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (timer.current) clearInterval(timer.current);

    let tick = 0;
    setActive(true);
    timer.current = setInterval(() => {
      tick++;
      if (tick >= TICKS) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        setLetters(plain(text));
        setActive(false);
        return;
      }
      // Letters settle back left to right while the rest keep scrambling
      setLetters(
        Array.from(text, (ch, i) =>
          tick > 4 + i * 1.5
            ? { ch, font: "" }
            : { ch: pick(GLYPHS), font: pick(FONTS) },
        ),
      );
    }, TICK_MS);
  }

  return (
    <h1 className={className}>
      <button
        type="button"
        onClick={glitch}
        aria-label={text}
        className="cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <span
          className="glitch"
          data-active={active}
          data-text={letters.map((l) => l.ch).join("")}
          aria-hidden="true"
        >
          {letters.map((l, i) => (
            <span key={i} className={l.font}>
              {l.ch}
            </span>
          ))}
        </span>
      </button>
    </h1>
  );
}
