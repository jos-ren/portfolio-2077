import Image from "next/image";
import { CyclingTitle } from "./components/cycling-title";
import { Dock } from "./components/dock";
// import { EyePile } from "./components/eye-pile";
// import { GlitchTitle } from "./components/glitch-title";
import { SelectedWork } from "./components/selected-work";

type Entry = { title: string; meta: string; href?: string };

const projects: Entry[] = [
  { title: "Sors Finance", meta: "January 2026", href: "https://github.com/jos-ren/Sors-Finance" },
  { title: "Flag Guessr", meta: "June 2026", href: "https://jos-ren.github.io/flag-guessr/" },
  { title: "Room Planner", meta: "September 2026", href: "https://alexrussell.dev/room-planner/?mode=floor" },
  { title: "Muvi", meta: "Coming Soon" },
];

// Playground hidden for now
// const playground: Entry[] = [
//   { title: "Experiment One", meta: "March 2026", href: "#" },
//   { title: "Experiment Two", meta: "July 2026", href: "#" },
// ];

// Notes hidden for now
// const notes: Entry[] = [
//   { title: "Things I learned this year", meta: "10 min read", href: "#" },
//   { title: "On writing maintainable code", meta: "6 min read", href: "#" },
//   { title: "A short note on tooling", meta: "5 min read", href: "#" },
// ];

const link =
  "border-b border-text/25 transition-colors hover:border-hover hover:text-hover";

// Section dividers hidden for now. Restore with "border-t border-surface pt-4"
const divider = "";

function Section({ title, entries }: { title: string; entries: Entry[] }) {
  return (
    <section className={divider}>
      <h2 className="text-sm text-label">{title}</h2>
      <ul className="mt-6 flex flex-col gap-3">
        {entries.map(({ title, meta, href }) => (
          <li key={title} className="flex items-baseline justify-between gap-4">
            {href ? (
              <a href={href} className={link}>
                {title}
              </a>
            ) : (
              <span className="border-b border-text/25 text-text/50">{title}</span>
            )}
            <span className="shrink-0 text-sm text-text/50">{meta}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const whatsUp = [
  {
    label: "Working on",
    value: (
      <>
        Software development at{" "}
        <a
          href="https://territorial.ca/"
          target="_blank"
          rel="noopener noreferrer"
          className={`${link} text-text`}
        >
          Territorial
        </a>
      </>
    ),
  },
  { label: "Currently learning", value: "Frontend architecture" },
  { label: "Tinkering with", value: "3D printed cityscapes" },
];

function WhatsUp() {
  return (
    <section className={divider}>
      <h2 className="text-sm text-label">What&apos;s Up?</h2>
      <dl className="mt-6 flex flex-col gap-5">
        {whatsUp.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1">
            <dt className="text-text">{label}</dt>
            <dd className="text-text/50">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function About() {
  return (
    <section
      id="about"
      className="flex min-h-[80vh] flex-col items-center justify-center gap-16 px-6 pt-24 pb-8 text-center"
    >
      <p className="max-w-2xl font-[family-name:var(--font-rusty)] text-3xl leading-tight text-heading sm:text-4xl">
        Josh is a developer and designer based in Vancouver.
      </p>
      <div className="flex flex-col items-center gap-3 text-text/70">
        <a href="mailto:joshua@renema.ca" className={`${link} inline-flex items-center gap-2`}>
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m22 2-7 20-4-9-9-4 20-7z" />
            <path d="M22 2 11 13" />
          </svg>
          joshua@renema.ca
        </a>
        <p>Currently open to new projects</p>
        <p>Thank you for stopping by.</p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col gap-12 pt-10 pb-32">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-12 px-6">
        <div className="relative size-10 overflow-hidden rounded-none">
          {/* The logo has transparent padding around the bird, so scale it up to fill the square */}
          <Image
            src="/branding/wren-logo.png"
            alt="Wren logo"
            fill
            sizes="40px"
            className="scale-[1.35] object-contain dark:hidden"
            priority
          />
          <Image
            src="/branding/wren-logo-dark.png"
            alt="Wren logo"
            fill
            sizes="40px"
            className="hidden scale-[1.35] object-contain dark:block"
            priority
          />
        </div>

        <div className="flex flex-col gap-4">
          {/* Glitch effect disabled for now
          <GlitchTitle
            text="JOSREN"
            className="mt-6 font-display text-7xl leading-none tracking-tight text-heading sm:text-9xl"
          />
          */}
          <CyclingTitle>JOSREN</CyclingTitle>
          <p className="text-text/50">hello, こんにちは, bonjour</p>
          <p>
            I’m Josh, a full stack developer with a soft spot for design, living in beautiful
            Vancouver. I ship with effort, care and taste.
          </p>
          {/* Hidden for now
          <p>
            I work at{" "}
            <a
              href="https://territorial.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              Territorial
            </a>
            , where I build software for real people with real problems. Off the clock, you’ll
            find me shooting photos around Vancouver or spending way too much time making my own
            apps.
          </p>
          */}
          <p>
            If you have a project that mixes solid code with good design,{" "}
            <a href="mailto:joshua@renema.ca" className={link}>
              send me a message
            </a>
            . I’m always up for something new.
          </p>
          <p>
            Or have a look at some of my{" "}
            <a href="#selected-work" className={link}>
              projects
            </a>
            .
          </p>
        </div>
        </div>

        <SelectedWork />

        <div className="mx-auto flex w-full max-w-xl flex-col gap-12 px-6">
          <Section title="Projects" entries={projects} />
          <WhatsUp />
          {/* Playground hidden for now
          <Section title="Playground" entries={playground} />
          */}
          {/* Notes hidden for now
          <Section title="Notes" entries={notes} />
          */}
        </div>

        <About />
        {/* Eye pile is a work in progress, disabled for now
        <EyePile />
        */}
      </main>
      <Dock />
    </>
  );
}
