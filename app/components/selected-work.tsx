"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

type FrameKind = "phone" | "browser";

// A bare kind is a placeholder frame; an object is a frame showing a real screenshot
type FrameSpec = FrameKind | { kind: FrameKind; src: string; alt: string };

type LinkKind = "github" | "appstore" | "website" | "docker";

// A link without an href is shown dimmed and unclickable, as "coming soon"
type ProjectLink = { kind: LinkKind; href?: string };

type Work = {
  label: string;
  // Placeholder frames: "phone" is a tall screen, "browser" is a wide one
  frames: FrameSpec[];
  // Shown as square buttons next to the title on hover
  links?: ProjectLink[];
};

const work: Work[] = [
  {
    label: "Muvi",
    links: [{ kind: "appstore" }], // not released yet
    frames: [
      {
        kind: "phone",
        src: "/projects/muvi-1.png",
        alt: "Muvi home screen with currently watching shows, upcoming, activity and discover sections",
      },
      {
        kind: "phone",
        src: "/projects/muvi-2.png",
        alt: "Muvi show detail page for Cyberpunk: Edgerunners with personal activity stats",
      },
      {
        kind: "phone",
        src: "/projects/muvi-3.png",
        alt: "Muvi library grid of movie and show posters",
      },
    ],
  },
  {
    label: "Sors Finance",
    links: [
      { kind: "github", href: "https://github.com/jos-ren/Sors-Finance" },
      { kind: "docker", href: "https://github.com/jos-ren/Sors-Finance/pkgs/container/sors-finance" },
    ],
    frames: [
      {
        kind: "browser",
        src: "/projects/sors.png",
        alt: "Sors Finance home dashboard showing monthly spending, net worth and trends",
      },
    ],
  },
  {
    label: "ShroomScout",
    links: [{ kind: "github", href: "https://github.com/jos-ren/ShroomScout" }],
    frames: [
      {
        kind: "phone",
        src: "/projects/shroomscout-1.png",
        alt: "ShroomScout species page for the Golden Chanterelle with rarity, edibility and a safety warning",
      },
      {
        kind: "phone",
        src: "/projects/shroomscout-2.png",
        alt: "ShroomScout map of mushroom discoveries around Seattle with a list of nearby finds",
      },
    ],
  },
  {
    label: "Room Planner",
    links: [
      { kind: "github", href: "https://github.com/aj3x/room-planner" },
      { kind: "website", href: "https://alexrussell.dev/room-planner/?mode=floor" },
    ],
    frames: [
      {
        kind: "browser",
        src: "/projects/room-planner.png",
        alt: "Room Planner floor view with a plan of five rooms, furniture and a properties panel",
      },
    ],
  },
  {
    label: "Flag Guessr",
    links: [
      { kind: "github", href: "https://github.com/jos-ren/flag-guessr" },
      { kind: "website", href: "https://jos-ren.github.io/flag-guessr/" },
    ],
    frames: [
      {
        kind: "browser",
        src: "/projects/flag-guessr.png",
        alt: "Flag Guessr home page with a play button and cards for world and continent flag quizzes",
      },
    ],
  },
];

const LINK_LABELS: Record<LinkKind, string> = {
  github: "GitHub",
  appstore: "App Store",
  website: "Live website",
  docker: "Docker image",
};

function LinkIcon({ kind }: { kind: LinkKind }) {
  if (kind === "github") {
    return (
      <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z" />
      </svg>
    );
  }
  if (kind === "appstore") {
    // App Store glyph from Simple Icons
    return (
      <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8.8086 14.9194l6.1107-11.0368c.0837-.1513.1682-.302.2437-.4584.0685-.142.1267-.2854.1646-.4403.0803-.3259.0588-.6656-.066-.9767-.1238-.3095-.3417-.5678-.6201-.7355a1.4175 1.4175 0 0 0-.921-.1924c-.3207.043-.6135.1935-.8443.4288-.1094.1118-.1996.2361-.2832.369-.092.1463-.175.2979-.259.4492l-.3864.6979-.3865-.6979c-.0837-.1515-.1667-.303-.2587-.4492-.0837-.1329-.1739-.2572-.2835-.369-.2305-.2353-.5233-.3857-.844-.429a1.4181 1.4181 0 0 0-.921.1926c-.2784.1677-.4964.426-.6203.7355-.1246.311-.1461.6508-.066.9767.038.155.0962.2984.1648.4403.0753.1564.1598.307.2437.4584l1.248 2.2543-4.8625 8.7825H2.0295c-.1676 0-.3351-.0007-.5026.0092-.1522.009-.3004.0284-.448.0714-.3108.0906-.5822.2798-.7783.548-.195.2665-.3006.5929-.3006.9279 0 .3352.1057.6612.3006.9277.196.2683.4675.4575.7782.548.1477.043.296.0623.4481.0715.1675.01.335.009.5026.009h13.0974c.0171-.0357.059-.1294.1-.2697.415-1.4151-.6156-2.843-2.0347-2.843zM3.113 18.5418l-.7922 1.5008c-.0818.1553-.1644.31-.2384.4705-.067.1458-.124.293-.1611.452-.0785.3346-.0576.6834.0645 1.0029.1212.3175.3346.583.607.7549.2727.172.5891.2416.9013.1975.3139-.044.6005-.1986.8263-.4402.1072-.1148.1954-.2424.2772-.3787.0902-.1503.1714-.3059.2535-.4612L6 19.4636c-.0896-.149-.9473-1.4704-2.887-.9218m20.5861-3.0056a1.4707 1.4707 0 0 0-.779-.5407c-.1476-.0425-.2961-.0616-.4483-.0705-.1678-.0099-.3352-.0091-.503-.0091H18.648l-4.3891-7.817c-.6655.7005-.9632 1.485-1.0773 2.1976-.1655 1.0333.0367 2.0934.546 3.0004l5.2741 9.3933c.084.1494.167.299.2591.4435.0837.131.1739.2537.2836.364.231.2323.5238.3809.8449.4232.3192.0424.643-.0244.9217-.1899.2784-.1653.4968-.4204.621-.7257.1246-.3072.146-.6425.0658-.9641-.0381-.1529-.0962-.2945-.165-.4346-.0753-.1543-.1598-.303-.2438-.4524l-1.216-2.1662h1.596c.1677 0 .3351.0009.5029-.009.1522-.009.3007-.028.4483-.0705a1.4707 1.4707 0 0 0 .779-.5407A1.5386 1.5386 0 0 0 24 16.452a1.539 1.539 0 0 0-.3009-.9158Z" />
      </svg>
    );
  }
  if (kind === "docker") {
    // Docker whale glyph from Simple Icons
    return (
      <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z" />
      </svg>
    );
  }
  return (
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
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18" />
    </svg>
  );
}

// Gallery tile image sizes, also reused as the full screen preview so it comes from cache
const TILE_SIZES: Record<FrameKind, string> = { phone: "8rem", browser: "26rem" };

function Frame({ spec }: { spec: FrameSpec }) {
  const kind = typeof spec === "string" ? spec : spec.kind;
  const size =
    kind === "phone" ? "h-48 w-24 sm:h-64 sm:w-32" : "h-48 w-72 sm:h-64 sm:w-[26rem]";

  if (typeof spec !== "string") {
    // Browser shots are cropped from the bottom so the header stays in view. Phone shots are
    // cropped from the top so the tab bar stays in view. The border keeps
    // the dark screenshot distinct from the colored panel behind it.
    return (
      <div className={`${size} relative border-4 border-bg`}>
        <Image
          src={spec.src}
          alt={spec.alt}
          fill
          sizes={TILE_SIZES[kind]}
          className={`object-cover ${kind === "phone" ? "object-bottom" : "object-top"}`}
        />
      </div>
    );
  }

  return (
    <div className={`${size} flex flex-col gap-2 border border-text/15 bg-bg p-3`}>
      <div className="h-3 w-1/3 bg-text/20" />
      <div className="h-16 w-full bg-surface" />
      <div className="h-3 w-full bg-text/10" />
      <div className="h-3 w-2/3 bg-text/10" />
      <div className="mt-auto h-5 w-1/4 bg-primary" />
    </div>
  );
}

// Only frames with a real screenshot can be opened full screen
const screenshots = (frames: FrameSpec[]) =>
  frames.filter((spec): spec is Exclude<FrameSpec, FrameKind> => typeof spec !== "string");

// Rendered widths of the full screen images. Desktop phone shots are sized from the viewport
// height (minus the 7.5rem of padding) at the iPhone screenshot ratio, desktop browser shots fill
// the width minus the side padding, and the phone gallery fills the width minus its gutters.
const FULL_SIZES: Record<FrameKind, string> = {
  phone: "(min-width: 640px) calc((100vh - 7.5rem) * 0.46), calc(100vw - 2rem)",
  browser: "(min-width: 640px) calc(100vw - 12rem), calc(100vw - 2rem)",
};

// Downloads the full screen images ahead of time so they are cached before the view opens.
// The image props match LoadingImage's, so the browser picks the same file from the srcset.
const preloaded = new Map<string, HTMLImageElement>();
function preloadFullScreen(project: Work) {
  for (const { kind, src } of screenshots(project.frames)) {
    if (preloaded.has(src)) continue;
    const { props } = getImageProps({ src, alt: "", fill: true, sizes: FULL_SIZES[kind] });
    const img = new window.Image();
    if (props.sizes) img.sizes = props.sizes;
    if (props.srcSet) img.srcset = props.srcSet;
    img.src = props.src;
    // Keeping a reference stops the request from being dropped
    preloaded.set(src, img);
  }
}

// Full screen image. When the full quality file is already cached (usually, thanks to
// preloadFullScreen) it shows straight away with no preview or fade. Otherwise the small version
// from the gallery tile shows first, which is usually cached too, and the full image fades in
// over it once decoded. Callers key it by src so the state resets when the image changes.
function LoadingImage({
  kind,
  src,
  alt,
  className,
}: {
  kind: FrameKind;
  src: string;
  alt: string;
  className: string;
}) {
  const [state, setState] = useState<"loading" | "faded" | "instant">("loading");
  return (
    <>
      {state !== "instant" && (
        <Image
          src={src}
          alt=""
          aria-hidden="true"
          fill
          loading="eager"
          sizes={TILE_SIZES[kind]}
          className={className}
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        loading="eager"
        sizes={FULL_SIZES[kind]}
        // Runs before the first paint, so a cached image never shows the preview at all
        ref={(img) => {
          if (img?.complete && img.naturalWidth > 0) setState((s) => (s === "loading" ? "instant" : s));
        }}
        // Next fires this after the image has decoded, so the fade starts from real pixels
        onLoad={() => setState((s) => (s === "loading" ? "faded" : s))}
        className={`${className} ${
          state === "loading"
            ? "opacity-0"
            : state === "faded"
              ? "opacity-100 transition-opacity duration-500 ease-out"
              : "opacity-100"
        }`}
      />
    </>
  );
}

const controlButton =
  "flex size-10 cursor-pointer items-center justify-center rounded-none bg-bg text-text transition-colors hover:bg-primary hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function ProjectLinks({ project }: { project: Work }) {
  return project.links?.map(({ kind, href }) =>
    href ? (
      <a
        key={kind}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.label} on ${LINK_LABELS[kind]}`}
        title={LINK_LABELS[kind]}
        className={controlButton}
      >
        <LinkIcon kind={kind} />
      </a>
    ) : (
      <span
        key={kind}
        title={`${LINK_LABELS[kind]} (coming soon)`}
        className="flex h-10 items-center bg-bg px-4 font-mono text-sm tracking-widest whitespace-nowrap text-text/50 uppercase"
      >
        <span className="sr-only">{LINK_LABELS[kind]}: </span>
        Coming soon
      </span>
    ),
  );
}

// Every screenshot across all projects, in order, for the phone gallery
const slides = work.flatMap((project) =>
  screenshots(project.frames).map((shot) => ({ project, ...shot })),
);

// Phone layout: one screenshot per screen, swiping continues from project to project
function MobileGallery({
  project,
  onSelect,
  onClose,
}: {
  project: Work;
  onSelect: (project: Work) => void;
  onClose: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(() =>
    Math.max(
      0,
      slides.findIndex((slide) => slide.project === project),
    ),
  );
  const current = slides[index];

  // Jump to the tapped project once the dialog is open and laid out
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const el = scroller.current;
      if (el) el.scrollLeft = index * el.clientWidth;
    });
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleScroll() {
    const el = scroller.current;
    if (!el || el.clientWidth === 0) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next === index || !slides[next]) return;
    setIndex(next);
    if (slides[next].project !== current.project) onSelect(slides[next].project);
  }

  return (
    <div data-gallery className="sm:hidden">
      <div
        ref={scroller}
        onScroll={handleScroll}
        className="absolute inset-0 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map(({ kind, src, alt }) => (
          <div key={src} className="h-full w-full shrink-0 snap-center snap-always px-4 pt-20 pb-28">
            <div className="relative h-full w-full">
              <LoadingImage kind={kind} src={src} alt={alt} className="object-contain" />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-10 bg-heading p-2 shadow-lg">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close full screen view"
          className={controlButton}
        >
          <svg
            className="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <div className="absolute inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-10 flex items-center gap-2 bg-heading p-2 shadow-lg">
        <p className="flex h-10 min-w-0 items-center bg-bg px-4 font-mono text-sm tracking-widest uppercase">
          <span className="truncate">{current.project.label}</span>
        </p>
        <ProjectLinks project={current.project} />
        <span
          aria-label={`Screenshot ${index + 1} of ${slides.length}`}
          className="ml-auto shrink-0 px-2 font-mono text-sm tracking-widest whitespace-nowrap text-bg"
        >
          {index + 1} / {slides.length}
        </span>
      </div>
    </div>
  );
}

function FullScreenView({
  project,
  canStep,
  position,
  onStep,
  onSelect,
  onClose,
}: {
  project: Work | null;
  canStep: boolean;
  position: { index: number; total: number };
  onStep: (direction: 1 | -1) => void;
  onSelect: (project: Work) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Native modal dialog handles Escape, focus trapping and inerting the page behind it
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (project) {
      if (!dialog.open) dialog.showModal();
      document.body.style.overflow = "hidden";
      // Lets the page dock hide itself so it does not show through the faded backdrop
      document.body.dataset.fullscreen = "";
    } else if (dialog.open) {
      dialog.close();
    }
    return () => {
      document.body.style.overflow = "";
      delete document.body.dataset.fullscreen;
    };
  }, [project]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // Clicks on the faded backdrop or the empty gallery area (not the images) close the view
      onClick={(event) => {
        const { target, currentTarget } = event;
        if (target === currentTarget || target === currentTarget.firstElementChild) onClose();
      }}
      // Horizontal swipes step between projects
      onTouchStart={({ target, touches }) => {
        // The phone gallery handles its own swipes
        if ((target as Element).closest("[data-gallery]")) return;
        touchStart.current = { x: touches[0].clientX, y: touches[0].clientY };
      }}
      onTouchEnd={({ changedTouches }) => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start || !canStep) return;
        const dx = changedTouches[0].clientX - start.x;
        const dy = changedTouches[0].clientY - start.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) onStep(dx < 0 ? 1 : -1);
      }}
      onKeyDown={(event) => {
        if (!canStep) return;
        if (event.key === "ArrowLeft") onStep(-1);
        if (event.key === "ArrowRight") onStep(1);
      }}
      aria-label={project ? `${project.label} full screen view` : undefined}
      // On phones the dialog is only as tall as the dynamic viewport, so iOS Safari can leave the
      // page showing in a strip under its bottom toolbar. A wide shadow in the same color as the
      // background covers everything outside the dialog.
      className="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none bg-bg/95 p-0 max-sm:shadow-[0_0_0_100vmax_color-mix(in_srgb,var(--bg)_95%,transparent)] sm:bg-bg/80 text-text backdrop:bg-transparent"
    >
      {project && (
        <>
          {/* Desktop layout; phones get MobileGallery below */}
          <div className="hidden h-full justify-center px-24 pt-6 pb-24 sm:flex">
            <div className="relative flex h-full gap-4">
              {screenshots(project.frames).map(({ kind, src, alt }) => (
                // Phone shots are sized from their height (iPhone screenshot ratio) so they sit
                // close together; browser shots share Room Planner's 2880:1572 ratio, as large as fits
                <div
                  key={src}
                  className={`relative min-w-0 border-4 border-heading ${
                    kind === "phone"
                      ? "aspect-[1206/2622] h-full"
                      : "aspect-[2880/1572] w-[min(calc(100dvw-12rem),calc((100dvh-7.5rem)*2880/1572))] self-center"
                  }`}
                >
                  <LoadingImage
                    kind={kind}
                    src={src}
                    alt={alt}
                    // Cover, not contain: the border shrinks the box slightly off the screenshot's
                    // ratio, and contain would leave thin gaps above and below phone shots
                    className={kind === "phone" ? "object-cover" : "object-cover object-top"}
                  />
                </div>
              ))}
              {/* Sits in the bottom margin, flush with the leftmost screenshot's edge and level
                  with the nav menu (both are 3.5rem tall and 1.5rem from the bottom) */}
              <div className="absolute top-full left-0 z-10 mt-4 flex items-center gap-2 bg-heading p-2 shadow-lg">
                <p className="flex h-10 items-center bg-bg px-4 font-mono text-sm tracking-widest whitespace-nowrap uppercase">
                  {project.label}
                </p>
                <ProjectLinks project={project} />
              </div>
            </div>
            {/* Nav menu is centered on the screen, positioned against the dialog rather than
                the screenshots, level with the title menu */}
              <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 bg-heading p-2 shadow-lg">
              {canStep && (
                <>
                  <button
                    type="button"
                    onClick={() => onStep(-1)}
                    aria-label="Previous project"
                    className={controlButton}
                  >
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
                      <path d="m15 5-7 7 7 7" />
                    </svg>
                  </button>
                  {position && (
                    <span
                      aria-label={`Project ${position.index + 1} of ${position.total}`}
                      className="px-2 font-mono text-sm tracking-widest whitespace-nowrap text-bg"
                    >
                      {position.index + 1} / {position.total}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onStep(1)}
                    aria-label="Next project"
                    className={controlButton}
                  >
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
                      <path d="m9 5 7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close full screen view"
                className={controlButton}
              >
                <svg
                  className="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
              </div>
          </div>
          <MobileGallery project={project} onSelect={onSelect} onClose={onClose} />
        </>
      )}
    </dialog>
  );
}

export function SelectedWork() {
  const [active, setActive] = useState<Work | null>(null);
  const drag = useRef({ pressed: false, moved: false, startX: 0, startScroll: 0 });

  // Mouse users can drag the gallery sideways. Touch and trackpads already scroll natively.
  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    drag.current = {
      pressed: true,
      moved: false,
      startX: event.clientX,
      startScroll: event.currentTarget.scrollLeft,
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    const el = event.currentTarget;
    if (!state.pressed) return;
    const dx = event.clientX - state.startX;
    if (!state.moved) {
      if (Math.abs(dx) < 5) return;
      state.moved = true;
      // Capture only once dragging starts so plain clicks still reach the tile buttons.
      // Snapping is paused so the scroll follows the cursor, then resumes on release.
      el.setPointerCapture(event.pointerId);
      el.style.scrollSnapType = "none";
      el.style.cursor = "grabbing";
      el.style.userSelect = "none";
    }
    el.scrollLeft = state.startScroll - dx;
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state.pressed) return;
    state.pressed = false;
    const el = event.currentTarget;
    if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
    el.style.scrollSnapType = "";
    el.style.cursor = "";
    el.style.userSelect = "";
  }

  // The arrows move between projects that have screenshots, wrapping at either end
  const viewable = work.filter(({ frames }) => screenshots(frames).length > 0);
  function step(direction: 1 | -1) {
    if (!active) return;
    const index = viewable.indexOf(active);
    setActive(viewable[(index + direction + viewable.length) % viewable.length]);
  }

  return (
    <section
      id="selected-work"
      aria-labelledby="selected-work-title"
      // Container units (cqw) exclude the page scrollbar, unlike vw, so the left edge lines up
      // with the max-w-xl content column above and below
      className="@container"
    >
      <h2
        id="selected-work-title"
        className="mb-8 pl-[max(1.5rem,calc(50cqw-16.5rem))] text-sm text-label"
      >
        Selected Work
      </h2>
      <div
        role="region"
        aria-label="Selected work gallery"
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onDragStart={(event) => event.preventDefault()}
        // A drag should not open the tile it ends on
        onClickCapture={(event) => {
          if (!drag.current.moved) return;
          drag.current.moved = false;
          event.preventDefault();
          event.stopPropagation();
        }}
        className="flex snap-x snap-mandatory gap-1 overflow-x-auto scroll-pl-[max(1.5rem,calc(50cqw-16.5rem))] pr-6 pl-[max(1.5rem,calc(50cqw-16.5rem))] [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-accent [&::-webkit-scrollbar]:hidden"
      >
        {work.map((project, index) => {
          const { label, frames, links } = project;
          return (
          <figure
            key={label}
            className={`group relative flex h-80 shrink-0 snap-start items-center justify-center overflow-hidden px-6 sm:h-[26rem] sm:px-16 ${
              index % 2 === 0 ? "bg-surface" : "bg-primary"
            }`}
          >
            <div className="flex items-center gap-3 transition-transform sm:gap-6 duration-500 ease-out group-hover:scale-[1.04]">
              {frames.map((spec, i) => (
                <Frame key={i} spec={spec} />
              ))}
            </div>
            {/* z-10 keeps the links above the full-screen button that covers the tile */}
            <div className="absolute bottom-4 left-4 z-10 flex translate-y-1 items-stretch gap-1 opacity-0 transition duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
              <figcaption className="bg-bg px-4 py-2 font-mono text-sm tracking-widest text-text uppercase">
                {label}
              </figcaption>
              {links?.map(({ kind, href }) =>
                href ? (
                <a
                  key={kind}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} on ${LINK_LABELS[kind]}`}
                  title={LINK_LABELS[kind]}
                  className="flex size-9 shrink-0 items-center justify-center rounded-none bg-bg text-text transition-colors hover:bg-heading hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <LinkIcon kind={kind} />
                </a>
                ) : (
                  <span
                    key={kind}
                    title={`${LINK_LABELS[kind]} (coming soon)`}
                    className="flex shrink-0 items-center rounded-none bg-bg px-4 font-mono text-sm tracking-widest whitespace-nowrap text-text/50 uppercase"
                  >
                    <span className="sr-only">{LINK_LABELS[kind]}: </span>
                    Coming soon
                  </span>
                ),
              )}
            </div>
            {screenshots(frames).length > 0 && (
              <button
                type="button"
                // Hovering or focusing a tile starts loading its full screen images, and opening
                // one loads the rest so stepping between projects never waits on the network
                onPointerEnter={() => preloadFullScreen(project)}
                onFocus={() => preloadFullScreen(project)}
                onClick={() => {
                  viewable.forEach(preloadFullScreen);
                  setActive(project);
                }}
                aria-label={`View ${label} full screen`}
                className="absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent"
              />
            )}
          </figure>
          );
        })}
      </div>
      <FullScreenView
        project={active}
        canStep={viewable.length > 1}
        position={{ index: active ? viewable.indexOf(active) : 0, total: viewable.length }}
        onStep={step}
        onSelect={setActive}
        onClose={() => setActive(null)}
      />
    </section>
  );
}
