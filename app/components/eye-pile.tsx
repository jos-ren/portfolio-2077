"use client";

import { useEffect, useRef } from "react";
import type Matter from "matter-js";
import { EYE_SHAPES, pupilPath } from "./eye-shapes";

const EYE_COUNT = 20;

// Deterministic so the server markup and first client render match
const eyes = Array.from({ length: EYE_COUNT }, (_, i) => {
  const shape = EYE_SHAPES[i % EYE_SHAPES.length];
  const size = 0.75 + ((i * 37) % 10) / 20; // 0.75 to 1.2
  return { shape, size };
});

// The page is a tall document, so the physics world is the whole document:
// the layer sits at its top-left and the floor is the bottom of <body>.
export function EyePile() {
  const layerRef = useRef<HTMLDivElement>(null);
  const eyeRefs = useRef<(SVGSVGElement | null)[]>([]);
  const pupilRefs = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    let stopped = false;
    let cleanup = () => {};

    import("matter-js").then((M) => {
      if (stopped) return;
      const { Engine, Bodies, Body, Composite, Constraint } = M.default ?? M;

      const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const engine = Engine.create({ gravity: { x: 0, y: 1.2 } });
      const world = engine.world;

      let width = document.documentElement.clientWidth;
      let height = document.body.getBoundingClientRect().height;
      const WALL = 400;
      let walls: Matter.Body[] = [];

      function buildWalls() {
        Composite.remove(world, walls);
        walls = [
          Bodies.rectangle(width / 2, height + WALL / 2, width + WALL * 2, WALL, { isStatic: true }),
          Bodies.rectangle(-WALL / 2, height / 2, WALL, height * 2, { isStatic: true }),
          Bodies.rectangle(width + WALL / 2, height / 2, WALL, height * 2, { isStatic: true }),
        ];
        Composite.add(world, walls);
      }
      buildWalls();

      // One body per eye. Collision is a circle covering the eye's core; the spikes
      // overlap neighbours, which keeps the pile tight.
      const base = width < 640 ? 110 : 170;
      const items = eyes.map(({ shape, size }, i) => {
        const w = base * size;
        const h = (w * shape.height) / shape.width;
        const radius = Math.min(w, h) * 0.38;
        const x = ((i * 0.618) % 1) * (width - w) + w / 2;
        const y = height - 160 - i * 70; // staggered above the floor, they fall into a pile
        const body = Bodies.circle(x, y, radius, {
          restitution: 0.25,
          friction: 0.4,
          frictionAir: 0.01,
          angle: i * 2.1,
        });
        Composite.add(world, body);
        const el = eyeRefs.current[i];
        if (el) {
          el.style.width = `${w}px`;
          el.style.height = `${h}px`;
        }
        // Where the eye opening sits relative to the middle of the eye's box, in px
        const k = w / shape.width;
        const [bx, by, bw, bh] = shape.viewBox.split(" ").map(Number);
        const sx = (shape.socket.cx - (bx + bw / 2)) * k;
        const sy = (shape.socket.cy - (by + bh / 2)) * k;
        return { body, shape, w, h, sx, sy, px: 0, py: 0 };
      });

      // Settle the pile before the first paint so the page starts as a finished valley of eyes
      for (let i = 0; i < 600; i++) Engine.update(engine, 1000 / 60);

      // Cursor, kept in client coordinates so scrolling still moves the gaze
      const pointer = { x: -9999, y: -9999 };
      const onMove = (e: PointerEvent) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
      };
      window.addEventListener("pointermove", onMove);

      // Dragging: a spring from the cursor to the grabbed point on the eye
      let drag: { index: number; constraint: Matter.Constraint; pointerId: number } | null = null;
      const cleanups: (() => void)[] = [];
      items.forEach(({ body }, index) => {
        const el = eyeRefs.current[index];
        if (!el) return;
        const onDown = (e: PointerEvent) => {
          if (drag) return;
          e.preventDefault();
          el.setPointerCapture(e.pointerId);
          pointer.x = e.clientX;
          pointer.y = e.clientY;
          const gx = e.clientX + scrollX;
          const gy = e.clientY + scrollY;
          const dx = gx - body.position.x;
          const dy = gy - body.position.y;
          const cos = Math.cos(-body.angle);
          const sin = Math.sin(-body.angle);
          const constraint = Constraint.create({
            pointA: { x: gx, y: gy },
            bodyB: body,
            pointB: { x: dx * cos - dy * sin, y: dx * sin + dy * cos },
            stiffness: 0.12,
            damping: 0.15,
            length: 0,
          });
          Composite.add(world, constraint);
          drag = { index, constraint, pointerId: e.pointerId };
          el.style.cursor = "grabbing";
          document.body.style.userSelect = "none";
        };
        const onUp = (e: PointerEvent) => {
          if (!drag || drag.pointerId !== e.pointerId) return;
          Composite.remove(world, drag.constraint);
          drag = null;
          el.style.cursor = "";
          document.body.style.userSelect = "";
        };
        el.addEventListener("pointerdown", onDown);
        el.addEventListener("pointerup", onUp);
        el.addEventListener("pointercancel", onUp);
        cleanups.push(() => {
          el.removeEventListener("pointerdown", onDown);
          el.removeEventListener("pointerup", onUp);
          el.removeEventListener("pointercancel", onUp);
        });
      });

      // Keep the floor on the bottom of the document as content loads or the window resizes
      const resize = new ResizeObserver(() => {
        const nextWidth = document.documentElement.clientWidth;
        const nextHeight = document.body.getBoundingClientRect().height;
        if (nextWidth === width && nextHeight === height) return;
        width = nextWidth;
        height = nextHeight;
        layer.style.height = `${height}px`;
        buildWalls();
        // Pull anything stranded outside the new bounds back in
        for (const { body } of items) {
          const r = body.circleRadius ?? 0;
          Body.setPosition(body, {
            x: Math.min(Math.max(body.position.x, r), width - r),
            y: Math.min(body.position.y, height - r),
          });
        }
      });
      resize.observe(document.body);
      layer.style.height = `${height}px`;

      function render() {
        items.forEach((item, i) => {
          const el = eyeRefs.current[i];
          if (!el) return;
          const { body, shape, w, h } = item;
          el.style.transform = `translate(${body.position.x - w / 2}px, ${body.position.y - h / 2}px) rotate(${body.angle}rad)`;

          // The pupil looks at the cursor, measured from the eye opening in the eye's own frame.
          // With no cursor yet it rests where the art draws the iris.
          const pupil = pupilRefs.current[i];
          if (!pupil) return;
          const { socket, pupil: home } = shape;
          let tx = 0;
          let ty = 0;
          if (!reduceMotion && pointer.x > -9999) {
            const cos = Math.cos(body.angle);
            const sin = Math.sin(body.angle);
            const dx = pointer.x + scrollX - (body.position.x + item.sx * cos - item.sy * sin);
            const dy = pointer.y + scrollY - (body.position.y + item.sx * sin + item.sy * cos);
            const lx = dx * cos + dy * sin;
            const ly = -dx * sin + dy * cos;
            const dist = Math.hypot(lx, ly) || 1;
            const pull = Math.min(1, dist / 250);
            // Offset from the middle of the opening, kept inside it
            // The pupil is taller than the opening, so it mostly slides sideways with a slight rise and fall
            tx = socket.cx + (lx / dist) * (socket.rx - home.r * 1.15 - 3) * pull - home.cx;
            ty = socket.cy + (ly / dist) * 6 * pull - home.cy;
          }
          // Ease toward the target so the gaze glides instead of snapping
          item.px += (tx - item.px) * 0.18;
          item.py += (ty - item.py) * 0.18;
          pupil.setAttribute("transform", `translate(${item.px.toFixed(2)} ${item.py.toFixed(2)})`);
        });
      }

      let raf = 0;
      let last = performance.now();
      function tick(now: number) {
        const dt = Math.min(now - last, 1000 / 30);
        last = now;
        if (drag) {
          drag.constraint.pointA = { x: pointer.x + scrollX, y: pointer.y + scrollY };
          // Scroll the page when an eye is carried toward the top or bottom edge
          const edge = 90;
          if (pointer.y < edge) scrollBy(0, -((edge - pointer.y) / edge) * 18);
          else if (pointer.y > innerHeight - edge) scrollBy(0, ((pointer.y - (innerHeight - edge)) / edge) * 18);
        }
        Engine.update(engine, dt);
        render();
        raf = requestAnimationFrame(tick);
      }
      render();
      layer.style.visibility = "visible";
      raf = requestAnimationFrame(tick);

      cleanup = () => {
        cancelAnimationFrame(raf);
        resize.disconnect();
        window.removeEventListener("pointermove", onMove);
        cleanups.forEach((fn) => fn());
        Composite.clear(world, false);
        Engine.clear(engine);
        document.body.style.userSelect = "";
      };
    });

    return () => {
      stopped = true;
      cleanup();
    };
  }, []);

  return (
    <>
      {/* Space in the page flow so the pile rests below the About section */}
      <div aria-hidden className="h-[45vh]" />
      <div
        ref={layerRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-10 w-full overflow-hidden"
        style={{ visibility: "hidden" }}
      >
        {eyes.map(({ shape }, i) => (
          <svg
            key={i}
            ref={(el) => {
              eyeRefs.current[i] = el;
            }}
            viewBox={shape.viewBox}
            className="pointer-events-none absolute top-0 left-0 cursor-grab text-heading will-change-transform"
            style={{ touchAction: "none" }}
            fill="currentColor"
          >
            {/* Only the painted parts are grabbable, not the empty corners of the box */}
            <g className="pointer-events-auto cursor-[inherit]">
              <path d={shape.d} fillRule="evenodd" />
              {/* Clears the eye opening so the iris can move through it */}
              <ellipse {...shape.socket} className="fill-bg" />
              {/* A hair larger than the opening, so the pupil overlaps the lids with no seam */}
              <clipPath id={`eye-socket-${i}`}>
                <ellipse {...shape.socket} rx={shape.socket.rx + 2} ry={shape.socket.ry + 2} />
              </clipPath>
              <g clipPath={`url(#eye-socket-${i})`}>
                <g
                  ref={(el) => {
                    pupilRefs.current[i] = el;
                  }}
                >
                  <path d={pupilPath(shape.pupil, i)} fillRule="evenodd" />
                </g>
              </g>
            </g>
          </svg>
        ))}
      </div>
    </>
  );
}
