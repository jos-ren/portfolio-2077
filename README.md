# JOSREN

My personal portfolio. A single page with an intro, a gallery of selected work, a project list and contact links.

Live at [portfolio-2077.vercel.app](https://portfolio-2077.vercel.app).

## Stack

- Next.js 16.4 (App Router) with React 19.3
- Tailwind CSS 4
- TypeScript 5
- Vercel Web Analytics and Speed Insights

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` starts the dev server
- `npm run build` creates a production build
- `npm run start` serves the production build
- `npm run lint` runs ESLint

## Structure

- `app/page.tsx` holds the page content (intro, projects, What's Up, about)
- `app/components/` holds the gallery, dock, title and theme toggle
- `public/projects/` holds the project screenshots
- `public/fonts/` holds the local display fonts

## Deployment

Deploys to Vercel on every push to `main`.
