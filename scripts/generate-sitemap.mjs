import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = (process.env.SITE_URL || "https://tikianaly.com").replace(/\/+$/, "");

const BLOG_API_BASE = "https://tikianaly-blog.onrender.com/api/v1";
const FOOTBALL_API_BASE = "https://tikianaly-service-backend.onrender.com";

const FIXTURE_LEAGUE_LIMIT = Number(process.env.SITEMAP_FIXTURE_LEAGUE_LIMIT ?? 20);
const FIXTURE_DAYS_PAST = Number(process.env.SITEMAP_FIXTURE_DAYS_PAST ?? 1);
const FIXTURE_DAYS_FUTURE = Number(process.env.SITEMAP_FIXTURE_DAYS_FUTURE ?? 3);
const FIXTURE_LIMIT_PER_LEAGUE_PER_DAY = Number(process.env.SITEMAP_FIXTURE_LIMIT_PER_LEAGUE_PER_DAY ?? 100);

const DEFAULT_LIMIT = 100;

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toIsoDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function makeUrlEntry({ loc, lastmod, changefreq, priority }) {
  const lines = [];
  lines.push("  <url>");
  lines.push(`    <loc>${xmlEscape(loc)}</loc>`);
  if (lastmod) lines.push(`    <lastmod>${xmlEscape(lastmod)}</lastmod>`);
  if (changefreq) lines.push(`    <changefreq>${xmlEscape(changefreq)}</changefreq>`);
  if (priority != null) lines.push(`    <priority>${Number(priority).toFixed(1)}</priority>`);
  lines.push("  </url>");
  return lines.join("\n");
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Request failed ${res.status} ${res.statusText} for ${url}${body ? `: ${body}` : ""}`);
  }
  return res.json();
}

async function fetchAllPaged({ urlBuilder, limit = DEFAULT_LIMIT, pickItems, pickTotalPages }) {
  const items = [];
  let page = 1;
  let totalPages = null;

  // Hard safety cap to avoid infinite loops if API is weird
  const MAX_PAGES = 200;

  while (page <= MAX_PAGES) {
    const url = urlBuilder(page, limit);
    const data = await fetchJson(url);

    const pageItems = pickItems(data) || [];
    items.push(...pageItems);

    if (totalPages == null) {
      const maybeTotal = pickTotalPages?.(data);
      if (typeof maybeTotal === "number" && Number.isFinite(maybeTotal) && maybeTotal > 0) {
        totalPages = maybeTotal;
      }
    }

    if (totalPages != null) {
      if (page >= totalPages) break;
      page += 1;
      continue;
    }

    if (pageItems.length < limit) break;
    page += 1;
  }

  return items;
}

async function getAllBlogPosts() {
  return fetchAllPaged({
    urlBuilder: (page, limit) => `${BLOG_API_BASE}/blogpost?page=${page}&limit=${limit}`,
    limit: 50,
    pickItems: (data) => data?.responseObject?.items,
    pickTotalPages: (data) => data?.responseObject?.totalPages,
  });
}

async function getAllPlayers() {
  return fetchAllPaged({
    urlBuilder: (page, limit) =>
      `${FOOTBALL_API_BASE}/api/v1/football/players/all-players?page=${page}&limit=${limit}`,
    limit: 100,
    pickItems: (data) => data?.responseObject?.items,
    pickTotalPages: (data) => data?.responseObject?.totalPages,
  });
}

async function getAllTeams() {
  return fetchAllPaged({
    urlBuilder: (page, limit) =>
      `${FOOTBALL_API_BASE}/api/v1/football/teams/all-teams?page=${page}&limit=${limit}`,
    limit: 100,
    pickItems: (data) => data?.responseObject?.items,
    pickTotalPages: (data) => data?.responseObject?.totalPages,
  });
}

async function getAllLeagues() {
  return fetchAllPaged({
    urlBuilder: (page, limit) =>
      `${FOOTBALL_API_BASE}/api/v1/football/leagues/all-leagues?page=${page}&limit=${limit}`,
    limit: 100,
    pickItems: (data) => data?.responseObject?.items,
    pickTotalPages: (data) => data?.responseObject?.totalPages,
  });
}

function normalizeId(value) {
  if (value == null) return null;
  const s = String(value).trim();
  return s ? s : null;
}

function formatDateYmd(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function* dateRangeYmd({ daysPast, daysFuture }) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - Math.max(0, daysPast));
  const end = new Date(now);
  end.setDate(end.getDate() + Math.max(0, daysFuture));

  const cur = new Date(start);
  while (cur <= end) {
    yield formatDateYmd(cur);
    cur.setDate(cur.getDate() + 1);
  }
}

function extractFixtureIdsFromResponse(data) {
  const ids = new Set();

  const addFromArray = (arr) => {
    if (!Array.isArray(arr)) return;
    for (const it of arr) {
      const raw = it?.fixture_id ?? it?.fixtureId ?? it?.fixture?.id;
      const id = normalizeId(raw);
      if (id) ids.add(id);
    }
  };

  const ro = data?.responseObject;
  if (Array.isArray(ro?.items)) {
    addFromArray(ro.items);
    for (const item of ro.items) {
      addFromArray(item?.fixtures);
      addFromArray(item?.responseObject?.items);
    }
  }

  addFromArray(data?.items);
  addFromArray(data?.fixtures);

  if (Array.isArray(data)) addFromArray(data);

  return [...ids];
}

async function getFixturesByLeagueAndDate(leagueId, date, limit = FIXTURE_LIMIT_PER_LEAGUE_PER_DAY) {
  const url = `${FOOTBALL_API_BASE}/api/v1/football/fixture/league?leagueId=${encodeURIComponent(
    String(leagueId)
  )}&date=${encodeURIComponent(String(date))}&page=1&limit=${encodeURIComponent(String(limit))}`;
  return fetchJson(url);
}

async function main() {
  const staticUrls = [
    { loc: `${SITE_URL}/`, changefreq: "daily", priority: 1.0 },
    { loc: `${SITE_URL}/news`, changefreq: "daily", priority: 0.8 },
    { loc: `${SITE_URL}/league`, changefreq: "daily", priority: 0.7 },
    { loc: `${SITE_URL}/league/profile`, changefreq: "weekly", priority: 0.6 },
    { loc: `${SITE_URL}/player/profile`, changefreq: "weekly", priority: 0.6 },
    { loc: `${SITE_URL}/player/compare`, changefreq: "weekly", priority: 0.6 },
    { loc: `${SITE_URL}/team/profile`, changefreq: "weekly", priority: 0.6 },
    { loc: `${SITE_URL}/football/afcon`, changefreq: "weekly", priority: 0.5 },
    { loc: `${SITE_URL}/privacy-policy`, changefreq: "yearly", priority: 0.3 },
  ];

  const [posts, players, teams, leagues] = await Promise.all([
    getAllBlogPosts().catch(() => []),
    getAllPlayers().catch(() => []),
    getAllTeams().catch(() => []),
    getAllLeagues().catch(() => []),
  ]);

  const dynamicUrls = [];

  for (const post of posts) {
    const id = normalizeId(post?.id ?? post?._id ?? post?.slug);
    if (!id) continue;
    dynamicUrls.push({
      loc: `${SITE_URL}/news/read/${encodeURIComponent(id)}`,
      lastmod: toIsoDate(post?.updatedAt ?? post?.updated_at ?? post?.createdAt ?? post?.created_at),
      changefreq: "weekly",
      priority: 0.7,
    });
  }

  for (const league of leagues) {
    const id = normalizeId(league?.id ?? league?._id);
    if (!id) continue;
    dynamicUrls.push({
      loc: `${SITE_URL}/league/profile/${encodeURIComponent(id)}`,
      lastmod: toIsoDate(league?.updatedAt ?? league?.updated_at ?? league?.createdAt ?? league?.created_at),
      changefreq: "weekly",
      priority: 0.6,
    });
  }

  for (const player of players) {
    const id = normalizeId(player?.id ?? player?.player_id ?? player?._id);
    if (!id) continue;
    dynamicUrls.push({
      loc: `${SITE_URL}/player/profile/${encodeURIComponent(id)}`,
      lastmod: toIsoDate(player?.updatedAt ?? player?.updated_at ?? player?.createdAt ?? player?.created_at),
      changefreq: "weekly",
      priority: 0.6,
    });
  }

  for (const team of teams) {
    const id = normalizeId(team?.id ?? team?._id);
    if (!id) continue;
    dynamicUrls.push({
      loc: `${SITE_URL}/team/profile/${encodeURIComponent(id)}`,
      lastmod: toIsoDate(team?.updatedAt ?? team?.updated_at ?? team?.createdAt ?? team?.created_at),
      changefreq: "weekly",
      priority: 0.6,
    });
  }

  const fixtureLeagueIds = (Array.isArray(leagues) ? leagues : [])
    .map((l) => normalizeId(l?.id ?? l?._id))
    .filter(Boolean)
    .slice(0, Number.isFinite(FIXTURE_LEAGUE_LIMIT) ? FIXTURE_LEAGUE_LIMIT : 0);

  if (fixtureLeagueIds.length > 0 && FIXTURE_DAYS_PAST + FIXTURE_DAYS_FUTURE >= 0) {
    const dates = [...dateRangeYmd({ daysPast: FIXTURE_DAYS_PAST, daysFuture: FIXTURE_DAYS_FUTURE })];
    const fixtureIds = new Set();

    for (const leagueId of fixtureLeagueIds) {
      for (const date of dates) {
        try {
          const res = await getFixturesByLeagueAndDate(leagueId, date);
          for (const id of extractFixtureIdsFromResponse(res)) {
            fixtureIds.add(id);
          }
        } catch {
        }
      }
    }

    for (const fixtureId of fixtureIds) {
      dynamicUrls.push({
        loc: `${SITE_URL}/football/gameinfo/${encodeURIComponent(fixtureId)}?fixtureId=${encodeURIComponent(
          fixtureId
        )}`,
        changefreq: "hourly",
        priority: 0.7,
      });
    }
  }

  // De-dupe by loc
  const byLoc = new Map();
  for (const u of [...staticUrls, ...dynamicUrls]) {
    byLoc.set(u.loc, u);
  }
  const allUrls = [...byLoc.values()];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    allUrls.map(makeUrlEntry).join("\n") +
    `\n</urlset>\n`;

  const outPath = resolve(__dirname, "..", "public", "sitemap.xml");
  await writeFile(outPath, xml, "utf8");
}

main().catch((err) => {
  console.error("[generate-sitemap] Failed:", err);
  process.exit(1);
});
