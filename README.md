# TikiAnaly Web

TikiAnaly is a **multi-sport** analytics web app built with **React + TypeScript** and Vite, featuring fixtures, live matches, league/team/player profiles, standings, and interactive statistics. It currently supports **football**, **basketball**, **cricket**, **tennis**, and **American football**.

This README is written for **new contributors**: how to run the project, how the codebase is organized, and how to add support for a brand-new sport.

---

## Tech stack

- **React 19**
- **TypeScript 5**
- **Vite 6**
- **React Router 7** (SPA, animated route transitions)
- **Tailwind CSS 4**
- **Axios** for API calls
- **TanStack Query** for server state & caching
- **Framer Motion** for page transitions
- **Zustand**, **Recharts**, **lucide-react**, **@heroicons/react**

---

## Quick start

### Prerequisites

- Node.js **18+** (modern tooling is smoothest on 18+)
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

> **Environment variables** — copy `.env.example` to `.env` before running:

```bash
cp .env.example .env
```

Never commit real secrets.

### Scripts

| Command              | Description                                     |
| -------------------- | ----------------------------------------------- |
| `npm run dev`        | Start the Vite dev server                       |
| `npm run build`      | Type-check + production build + sitemap         |
| `npm run preview`    | Serve the production build locally              |
| `npm run lint`       | Run ESLint                                      |
| `npm test`           | Run Jest tests                                  |
| `npm run test:scripts` | Run the scripts test suite                   |
| `npm run generate-sitemap` | Regenerate `public/sitemap*.xml`         |

---

## Project structure

The repo uses a **feature-first** structure. Each sport is a self-contained feature under `src/features/<sport>/`, with its own pages, components, data mappers, and types. Shared UI lives in `src/components/`, and API code is split per sport under `src/lib/api/`.

```text
src/
  main.tsx                     # React entry
  App.tsx                      # All routes are registered here
  ScrollToTop.tsx

  features/                    # One folder per feature/sport
    dashboard/                 # Home, news, favourites, league picker
      pages/
      components/
    football/
      pages/                   # gameInfo, teamProfile, playerProfile, ...
      components/
      data/                    # static/mock data
    cricket/
      pages/
      components/
      data/
      types.ts                 # API response types
      utils/mappers.ts         # raw API -> UI shapes
    basketball/
    tennis/
    american-football/
    auth/
    account/
    legal/
    news/
    community/
    onboarding/
    dev/                       # debugging tools (SSE debug, script sandbox)

  components/
    layout/     # PageHeader, Footer, Navigation, RightBar, SportLayout
    common/     # GetTeamLogo, GetLeagueLogo, GetPlayerImage, Image, Logo
    ui/         # Button, DropdownSelector, SegmentedSelector, Form/*, ...
    auth/
    player/

  lib/
    api/
      axios.ts                 # shared Axios client
      cache.ts                 # lightweight client-side cache
      endpoints.ts             # re-exports from per-sport modules (back-compat)
      livestream.ts            # SSE helpers
      <sport>/index.ts          # per-sport endpoint functions
      <sport>/livestream.ts     # per-sport SSE URLs
    router/navigate.ts         # router-agnostic navigation helper
    matchStatusUi.ts

  context/                # ThemeContext, ToastContext, BackendStatusContext
  animations/             # Framer Motion shared animations
  hooks/                  # useFetch, usePaginatedApi, useProfileAvatar
  visualization/           # Recharts-based chart components
  styles/                 # Global CSS, Tailwind theme variables
  data/                   # static lists (e.g. dashboard categories)
```

### docs/

`docs/` holds reference material that is **not** part of the runtime bundle:

- `docs/api-responses/` — captured API response structures and endpoint notes

For the step-by-step **"Adding a new sport"** guide, see the section below.

### Import aliases

We use path aliases to keep imports stable:

- **`@/...`** resolves to `src/...`

Configured in `vite.config.ts` and `tsconfig.app.json`.

```ts
import { getTeamById } from "@/lib/api/football";
```

---

## Routing

All routes are declared in **`src/App.tsx`**. Routes are individually wrapped with **Framer Motion** transitions and lazy-loaded via `React.lazy`.

Conventions per sport (`src/features/<sport>/pages/`):

| Route pattern                 | Typical page                    |
| --------------------------- | ------------------------------- |
| `/<sport>`                  | Dashboard / home                |
| `/<sport>/leagues`          | Leagues list                    |
| `/<sport>/league/:leagueId` | League profile                  |
| `/<sport>/match/:matchId`   | Match / game info               |
| `/<sport>/team/:teamId`     | Team profile                    |
| `/<sport>/player/:playerId` | Player profile                  |

To add a page:

1. Create the component under `src/features/<sport>/pages/`.
2. Register a lazy import at the top of `src/App.tsx`.
3. Add the `<Route>` block that wraps the element in the motion `m.div` wrapper.

---

## API layer

API calls live in `src/lib/api/`:

- `axios.ts` — the shared Axios instance
- `cache.ts` — lightweight client-side cache
- `endpoints.ts` — re-exports all per-sport endpoints for backward compatibility
- `<sport>/index.ts` — per-sport endpoint functions

Each sport folder mirrors the backend namespace. For example, cricket endpoints are at `src/lib/api/cricket/index.ts` and hit `/api/v1/cricket/...`.

When adding an endpoint:

- Put it in the correct per-sport module (not `endpoints.ts` directly, if one exists).
- Keep naming consistent (`getXById`, `getAllX`, `getLiveFixtures`, …).
- Prefer `encodeURIComponent` for user-provided strings.

### Live updates (SSE)

Real-time updates use Server-Sent Events. Per-sport SSE URLs and helpers live in
`src/lib/api/<sport>/livestream.ts`. Subscriptions are cleaned up on unmount.

```ts
import { subscribeDashboardLiveFixtures } from "@/lib/api/livestream";

const eventSource = subscribeDashboardLiveFixtures({
  onUpdate: (liveItems) => {
    // update fixtures in place
  },
});

// cleanup on unmount
closeLiveStream(eventSource);
```

---

## Adding a new sport (guide)

This is the blueprint used to add **basketball**, **cricket**, **tennis**, and **American football**.
Follow it top-to-bottom to add a sport in a way that matches the existing conventions.

### 1. Pick a route prefix

Use a lowercase, kebab-case identifier, e.g. `handball` → paths like `/handball`, `/handball/match/:matchId`.

### 2. Create the feature folder

```text
src/features/handball/
├── pages/          # Handball pages
├── components/     # Handball-specific components
├── data/           # Static / mock data (only if needed)
├── types.ts        # API response TypeScript interfaces
└── utils/
    └── mappers.ts  # raw API → UI-shaped data
```

Start with the two "leaf" pages and keep the folder self-contained:

```text
src/features/handball/
├── pages/
│   ├── Handball.tsx                  # dashboard / home (list of matches)
│   └── HandballGameInfo.tsx          # single match detail
└── components/
    └── HandballLeftBar.tsx           # nav sidebar for the sport
```

### 3. Create the per-sport API module

Create `src/lib/api/<sport>/index.ts` with endpoint functions. Keep the same
naming convention as the other sports.

```ts
// src/lib/api/handball/index.ts
import apiClient from "../axios";

const base = "/api/v1/handball";

export const getHandballHome = async () => {
  const response = await apiClient.get(`${base}/home`);
  return response.data;
};

export const getHandballMatch = async (matchId: string | number) => {
  const response = await apiClient.get(`${base}/match/${encodeURIComponent(String(matchId))}`);
  return response.data;
};
```

If the sport has an SSE stream, add `src/lib/api/<sport>/livestream.ts` too.

### 4. Wire up routing in `src/App.tsx`

```ts
import { lazy } from "react";

const HandballPage = lazy(() => import("./features/handball/pages/Handball"));
const HandballMatch = lazy(() => import("./features/handball/pages/HandballGameInfo"));

// inside <Routes>
<Route
  path="/handball"
  element={<m.div variants={motionVariants} initial="initial" animate="animate" exit="exit" transition={motionTransition}><HandballPage /></m.div>}
/>
<Route
  path="/handball/match/:matchId"
  element={<m.div variants={motionVariants} initial="initial" animate="animate" exit="exit" transition={motionTransition}><HandballMatch /></m.div>}
/>
```

### 5. Add the sport to the dashboard categories

`src/data/categoryList.tsx` drives the sport buttons on the home page:

```ts
const categories = [
  { label: "Football", variant: "", href: "/football" },
  // ...
  { label: "Handball", variant: "", href: "/handball" },
];
```

### 6. Reuse shared pieces

- **Layout** — wrap pages in `SportLayout` from `src/components/layout/SportLayout.tsx` and pass a sport-specific `<XxxLeftBar />`.
- **Logos** — use the generic `GetLeagueLogo` / `GetTeamLogo`, or add sport-specific logo getters in `src/components/common/` (follow the `GetBasketballTeamLogo` pattern).
- **Standings** — either reuse `StandingsTable` if the shape matches, or build a sport-specific one under `src/features/<sport>/components/standings/`.
- **Charts** — add sport-specific visualizations under `src/features/<sport>/components/` or the shared `src/visualization/` if reusable.

### 7. Type-check and lint

```bash
npm run lint
npm run build
```

> Prefer feature-specific component under that sport's `components/` folder. Keep genuinely shared UI under `src/components/`.

---

## Data fetching & caching

TanStack Query is the standard for server state:

```ts
const { data, isLoading, error } = useQuery({
  queryKey: ["feature", "data", id],
  queryFn: () => fetchData(id),
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000,   // 10 minutes
  refetchOnWindowFocus: true,
  placeholderData: (prev) => prev,
});
```

---

## UI components

Reusable components live in `src/components/ui/` and `src/components/common/`.

- **SegmentedSelector** — pill-style tab selector for filtering.
- **Toast Notifications** — via `ToastContext`
  ```ts
  const toast = useToast();
  toast.show({ variant: "success", message: "Saved", durationMs: 5000 });
  toast.dismiss("unique-id");
  ```
- **DropdownSelector** — dropdown selection.
- **Button / Form\*** — form primitives.

### Skeleton loaders

Shimmer loaders use the `animate-shimmer` keyframe defined in `src/styles/index.css`.

```tsx
<div className="h-3 w-full rounded bg-gray-300 dark:bg-[#1F2937]" />
```

---

## Theme & colors

Defined in `src/styles/index.css` under `@theme`:

- Brand: `--color-brand-primary` (blue), `--color-brand-secondary` (orange accent)
- UI: `--color-ui-success` / `--color-ui-negative` / `--color-ui-pending`
- Neutrals: `--color-neutral-n1` … `--color-neutral-n5`

Common Tailwind utilities defined in CSS:

```css
.block-style {
  @apply bg-white border dark:bg-[#161B22] dark:border-[#1F2937] border-snow-200 rounded p-5;
}
.theme-text {
  @apply dark:text-white text-[#23272A];
}
```

---

## Environment / deployment

**`.env`** is git-ignored. Only `.env.example` is committed. Provide every `VITE_*`
variable with a sensible placeholder.

This is a single-page app, so production hosts must rewrite unknown routes to `index.html`:

- **Vercel:** `vercel.json`
- **Netlify:** `public/_redirects`

---

## Contributing guidelines

### Branching

- Create a feature branch from `main`:
  - `feature/<short-description>`
  - `fix/<short-description>`

### Commit style

Keep commits small and focused:

```text
feat(handball): add match detail page
fix: handle empty fixtures response
```

### Before opening a PR

- Run `npm run lint`
- Run `npm run build`

---

## Troubleshooting

### “Cannot find module 'react-router-dom'”"

Dependencies may be missing or the TS server needs a refresh:

- Run `npm install`
- In VS Code: “TypeScript: Restart TS server”

### Windows

This repo works on Windows. If you hit path/script issues, include:

- `node -v`
- `npm -v`

---

## License

MIT (unless changed later).