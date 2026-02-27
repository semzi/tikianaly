# TikiAnaly Web

TikiAnaly is a **React + TypeScript** web app for football-first exploration (fixtures, leagues, favourites, player views) with a responsive UI built on Tailwind.

This README is written for **new contributors**: how to run the project, where things live, and the conventions we follow.

## Tech stack

- **React 19**
- **TypeScript 5**
- **Vite 6**
- **React Router**
- **Tailwind CSS**
- **Axios** for API calls
- **Framer Motion** for route/page transitions

## Quick start

### Prerequisites

- Node.js **18+** recommended (16+ may work, but modern tooling is smoother on 18+)
- npm

### Install & run

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

## Scripts

From `package.json`:

- **`npm run dev`**
  Runs the Vite dev server.
- **`npm run build`**
  Type-checks (`tsc -b`) and builds for production (`vite build`).
- **`npm run preview`**
  Serves the production build locally.
- **`npm run lint`**
  Runs ESLint.
- **`npm test`**
  Runs Jest tests.

## Project structure (high-level)

We follow a **feature-first** structure: each feature owns its pages and feature-specific components.

```text
src/
  App.tsx                  # Routing is defined here
  main.tsx                 # React entry
  ScrollToTop.tsx

  features/
    auth/
      pages/               # Login, Signup, ForgotPassword, ResetPassword
    dashboard/
      pages/               # dashboard, favourites, league, news
      components/          # Dashboard-only components (Category, AfconBanner)
    football/
      pages/               # gameInfo, teamProfile
      components/          # Football-only components (LineupBuilder, StandingsTable, etc.)
    basketball/
      pages/               # BasketballLeagueProfile, BasketballTeamProfile
      components/          # Basketball-specific components
    news/
      pages/
      components/
    community/
      pages/               # Community features
    onboarding/
      pages/               # Onboarding flow
      components/
    account/
      pages/               # Account settings
    legal/
      pages/               # Terms, Privacy
    dev/
      pages/               # Dev utilities

  components/
    layout/                # Shared layout: PageHeader, Footer, LeftBar, RightBar
    common/                # Reusable components (GetTeamLogo, GetLeagueLogo, GetVenueImage)
    ui/                    # UI primitives (SegmentedSelector, Skeleton components)

  lib/
    api/                   # axios client, cache, endpoints, livestream
    router/                # global navigate helper

  data/                    # static data lists used by UI
  context/                 # providers (ThemeContext, ToastContext, BackendStatusContext)
  animations/              # Framer Motion animations
  styles/                  # Global CSS, Tailwind config, theme variables
  hooks/                   # Custom React hooks (useFetch, usePaginatedApi, useProfileAvatar)
  visualization/           # Charts and data visualization components
```

### Import aliases

We use path aliases to keep imports stable:

- **`@/...`** resolves to `src/...`

Configured in:

- `vite.config.ts`
- `tsconfig.app.json`

Example:

```ts
import { getAllTeams } from "@/lib/api/endpoints";
```

## Routing

All routes are defined in **`src/App.tsx`**.

Notable behaviors:

- Routes are wrapped with **Framer Motion** transitions.
- Navigation is conditionally hidden on `/login` and `/signup`.

If you add a new page:

- Create it under `src/features/<feature>/pages/`
- Add the route in `src/App.tsx`

## API layer

All API calls live in `src/lib/api/`:

- `axios.ts` sets up the Axios instance
- `cache.ts` provides a lightweight client-side cache
- `endpoints.ts` exports typed functions used by UI

### Endpoint organization

`src/lib/api/endpoints.ts` is grouped in this order:

- **Authentication**
- **Players**
- **Teams**
- **Leagues**
- **Fixtures**
- **Favorites**
- **Cache utilities**

When adding a new endpoint:

- Add it to the correct section
- Keep naming consistent (`getXById`, `getAllX`, `addX`, etc.)
- Prefer `encodeURIComponent` for user-provided strings

## Local dev proxy

Vite proxies `/goalserve` to an upstream service (see `vite.config.ts`).

If you call `/goalserve/...` in dev, it will be forwarded to:

```text
http://data2.goalserve.com:8084
```

## SPA deployment (routing fallback)

This is a single-page app, so production hosting must rewrite unknown routes to `index.html`.

- **Vercel:** `vercel.json`
- **Netlify:** `public/_redirects`

## Contributing guidelines

### Branching

- Create a feature branch from `main`:
  - `feature/<short-description>`
  - `fix/<short-description>`

### Commit style

- Keep commits small and focused.
- Use clear messages, e.g.:
  - `fix: handle empty fixtures response`
  - `refactor: move dashboard components into feature folder`

### Code conventions

- Prefer `@/...` imports over deep relative imports.
- Put feature-specific components under that feature’s `components/`.
- Keep shared components under `src/components/`.

### Before opening a PR

- Run:
  - `npm run lint`
  - `npm run build`

## Troubleshooting

### “Cannot find module 'react-router-dom'”

This typically means dependencies are not installed or TS server needs a refresh:

- Run `npm install`
- In VS Code: “TypeScript: Restart TS server”

### Windows note

This repo works on Windows. If you see path or script issues, include:

- Node version (`node -v`)
- npm version (`npm -v`)

## License

MIT (unless changed later).
