"use client";

import { useLayoutEffect } from "react";

const STORAGE_KEY = "theme";

// The wren logo in each theme's title color. The metadata in layout.tsx covers the OS-based default.
function setFavicon(theme: string | null) {
  const links = document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]');
  if (!links.length) return;
  // Next renders one link per media query. Point them all at the same file so the OS setting no longer matters.
  links.forEach((link) => {
    link.removeAttribute("media");
    link.type = "image/png";
    link.href = theme === "dark" ? "/branding/favicon-dark.png" : "/branding/favicon-light.png";
  });
}

export function ThemeToggle() {
  // React Strict Mode clears data-theme on the dev remount. No-op in production.
  useLayoutEffect(() => {
    try {
      const theme = localStorage.getItem(STORAGE_KEY);
      if (theme) document.documentElement.setAttribute("data-theme", theme);
    } catch {}
    setFavicon(document.documentElement.getAttribute("data-theme"));
  }, []);

  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    setFavicon(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }

  // Icons are swapped with CSS so the server and client markup always match
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="flex size-10 cursor-pointer items-center justify-center rounded-none bg-bg text-text transition-colors hover:bg-primary hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {/* Both icons stay mounted and cross-fade with a spin, so the swap animates */}
      <span className="relative size-5">
        {/* Moon (visible in light mode) */}
        <svg
          className="absolute inset-0 size-5 rotate-0 scale-100 opacity-100 transition duration-500 ease-out motion-reduce:transition-none dark:-rotate-90 dark:scale-0 dark:opacity-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
        {/* Sun (visible in dark mode) */}
        <svg
          className="absolute inset-0 size-5 rotate-90 scale-0 opacity-0 transition duration-500 ease-out motion-reduce:transition-none dark:rotate-0 dark:scale-100 dark:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      </span>
    </button>
  );
}
