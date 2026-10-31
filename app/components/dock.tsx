import { DockScroll } from "./dock-scroll";
import { ThemeToggle } from "./theme-toggle";

const iconButton =
  "flex size-10 items-center justify-center rounded-none bg-bg text-text transition-colors hover:bg-primary hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Dock() {
  return (
    <>
    <DockScroll />
    <nav
      aria-label="Social links"
      className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-none bg-heading p-2 shadow-lg transition-transform duration-300 motion-reduce:transition-none [body[data-fullscreen]_&]:hidden [html[data-dock-hidden]_&]:max-sm:translate-y-[calc(100%+2rem)]"
    >
      <a href="https://github.com/jos-ren" aria-label="GitHub Link" className={iconButton}>
        <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z" />
        </svg>
      </a>
      <a href="mailto:joshua@renema.ca" aria-label="Email" className={iconButton}>
        <svg
          className="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      </a>
      <ThemeToggle />
    </nav>
    </>
  );
}
