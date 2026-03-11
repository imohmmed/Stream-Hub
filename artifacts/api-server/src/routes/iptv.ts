import { Router, type IRouter } from "express";
import {
  GetChannelsResponse,
  GetMoviesResponse,
  GetSeriesResponse,
  GetCategoriesResponse,
  GetStreamUrlResponse,
  GetSeriesInfoResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

// قائمة بـ DNS servers بالترتيب — سيجرب الأول، وإذا فشل ينتقل للتالي
const IPTV_SERVERS = [
  process.env.IPTV_BASE_URL || "http://mzbrxgwh.saifdns.com",
  "http://mzbrxgwh.yangsmart.com",
];
const USERNAME = process.env.IPTV_USERNAME || "JVC3H3LW";
const PASSWORD = process.env.IPTV_PASSWORD || "DFYXG4N1";

function apiUrl(base: string, action: string, extra: Record<string, string> = {}) {
  const params = new URLSearchParams({
    username: USERNAME,
    password: PASSWORD,
    action,
    ...extra,
  });
  return `${base}/player_api.php?${params}`;
}

async function fetchIPTV(action: string, extra: Record<string, string> = {}): Promise<unknown> {
  let lastError: Error | null = null;
  for (const server of IPTV_SERVERS) {
    try {
      const url = apiUrl(server, action, extra);
      const resp = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 StreamTV/1.0" },
        signal: AbortSignal.timeout(12000),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.json();
    } catch (err) {
      lastError = err as Error;
      console.warn(`IPTV server ${IPTV_SERVERS.indexOf(IPTV_SERVERS.find(s => apiUrl(s, action, extra).startsWith(s))!)} failed:`, (err as Error).message);
    }
  }
  throw lastError ?? new Error("All IPTV servers failed");
}

function streamUrl(base: string, type: "live" | "movie" | "series", id: string, ext = "m3u8") {
  if (type === "live") return `${base}/live/${USERNAME}/${PASSWORD}/${id}.m3u8`;
  if (type === "movie") return `${base}/movie/${USERNAME}/${PASSWORD}/${id}.mp4`;
  return `${base}/series/${USERNAME}/${PASSWORD}/${id}.mp4`;
}

router.get("/channels", async (_req, res) => {
  try {
    const data = await fetchIPTV("get_live_streams") as Record<string, unknown>[];
    const channels = Array.isArray(data)
      ? data.map((ch) => ({
          stream_id: String(ch.stream_id ?? ""),
          name: String(ch.name ?? ""),
          stream_icon: String(ch.stream_icon ?? ""),
          category_id: String(ch.category_id ?? ""),
          epg_channel_id: String(ch.epg_channel_id ?? ""),
        }))
      : [];
    res.json(GetChannelsResponse.parse({ channels }));
  } catch (err) {
    console.error("channels error:", (err as Error).message);
    res.json({ channels: [] });
  }
});

router.get("/movies", async (req, res) => {
  try {
    const { category_id, search, page } = req.query as Record<string, string>;
    const extra: Record<string, string> = {};
    if (category_id) extra.category_id = category_id;
    const data = await fetchIPTV("get_vod_streams", extra) as Record<string, unknown>[];
    let movies = Array.isArray(data)
      ? data.map((m) => ({
          stream_id: String(m.stream_id ?? ""),
          name: String(m.name ?? ""),
          stream_icon: String(m.stream_icon ?? ""),
          category_id: String(m.category_id ?? ""),
          rating: String(m.rating ?? ""),
          plot: String(m.plot ?? ""),
          genre: String(m.genre ?? ""),
          release_date: String((m as any).releaseDate ?? m.release_date ?? ""),
          duration: String(m.duration ?? ""),
          added: String(m.added ?? ""),
        }))
      : [];
    if (search) {
      const q = search.toLowerCase();
      movies = movies.filter((m) => m.name.toLowerCase().includes(q));
    }
    const total = movies.length;
    const pageNum = Math.max(1, parseInt(page || "1") || 1);
    const pageSize = 60;
    const paged = movies.slice((pageNum - 1) * pageSize, pageNum * pageSize);
    res.json(GetMoviesResponse.parse({ movies: paged, total }));
  } catch (err) {
    console.error("movies error:", (err as Error).message);
    res.json({ movies: [], total: 0 });
  }
});

router.get("/series", async (req, res) => {
  try {
    const { category_id, search, page } = req.query as Record<string, string>;
    const extra: Record<string, string> = {};
    if (category_id) extra.category_id = category_id;
    const data = await fetchIPTV("get_series", extra) as Record<string, unknown>[];
    let series = Array.isArray(data)
      ? data.map((s) => ({
          series_id: String(s.series_id ?? ""),
          name: String(s.name ?? ""),
          cover: String(s.cover ?? ""),
          category_id: String(s.category_id ?? ""),
          rating: String(s.rating ?? ""),
          plot: String(s.plot ?? ""),
          genre: String(s.genre ?? ""),
          releaseDate: String((s as any).releaseDate ?? ""),
        }))
      : [];
    if (search) {
      const q = search.toLowerCase();
      series = series.filter((s) => s.name.toLowerCase().includes(q));
    }
    const total = series.length;
    const pageNum = Math.max(1, parseInt(page || "1") || 1);
    const pageSize = 60;
    const paged = series.slice((pageNum - 1) * pageSize, pageNum * pageSize);
    res.json(GetSeriesResponse.parse({ series: paged, total }));
  } catch (err) {
    console.error("series error:", (err as Error).message);
    res.json({ series: [], total: 0 });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const { type } = req.query as { type: string };
    const actionMap: Record<string, string> = {
      live: "get_live_categories",
      movie: "get_vod_categories",
      series: "get_series_categories",
    };
    const action = actionMap[type] ?? "get_live_categories";
    const data = await fetchIPTV(action) as Record<string, unknown>[];
    const categories = Array.isArray(data)
      ? data.map((c) => ({
          category_id: String(c.category_id ?? ""),
          category_name: String(c.category_name ?? ""),
        }))
      : [];
    res.json(GetCategoriesResponse.parse({ categories }));
  } catch (err) {
    console.error("categories error:", (err as Error).message);
    res.json({ categories: [] });
  }
});

router.get("/stream-url", async (req, res) => {
  try {
    const { type, id, episode_id } = req.query as Record<string, string>;
    const base = IPTV_SERVERS[0];
    let url = "";
    let streamType = "mp4";
    if (type === "live") {
      url = `${base}/live/${USERNAME}/${PASSWORD}/${id}.m3u8`;
      streamType = "hls";
    } else if (type === "movie") {
      url = `${base}/movie/${USERNAME}/${PASSWORD}/${id}.mp4`;
      streamType = "mp4";
    } else if (type === "series" && episode_id) {
      url = `${base}/series/${USERNAME}/${PASSWORD}/${episode_id}.mp4`;
      streamType = "mp4";
    }
    res.json(GetStreamUrlResponse.parse({ url, type: streamType }));
  } catch (err) {
    console.error("stream-url error:", (err as Error).message);
    res.status(500).json({ error: "Failed to get stream URL" });
  }
});

router.get("/series-info", async (req, res) => {
  try {
    const { series_id } = req.query as Record<string, string>;
    const data = await fetchIPTV("get_series_info", { series_id }) as {
      info?: Record<string, unknown>;
      episodes?: Record<string, Record<string, unknown>[]>;
    };
    const info = data?.info ?? {};
    const rawEps = data?.episodes ?? {};
    const seriesInfo = {
      series_id: String(info.series_id ?? series_id ?? ""),
      name: String(info.name ?? ""),
      cover: String(info.cover ?? (info.backdrop_path as string[])?.[0] ?? ""),
      category_id: String(info.category_id ?? ""),
      rating: String(info.rating ?? ""),
      plot: String(info.plot ?? ""),
      genre: String(info.genre ?? ""),
      releaseDate: String((info as any).releaseDate ?? info.release_date ?? ""),
    };
    const episodes: Record<string, unknown[]> = {};
    for (const season of Object.keys(rawEps)) {
      const eps = rawEps[season];
      if (Array.isArray(eps)) {
        episodes[season] = eps.map((ep) => ({
          id: String(ep.id ?? ""),
          episode_num: Number(ep.episode_num ?? 1),
          title: String(ep.title ?? `الحلقة ${ep.episode_num}`),
          season: Number(ep.season ?? season),
        }));
      }
    }
    res.json(GetSeriesInfoResponse.parse({ info: seriesInfo, episodes }));
  } catch (err) {
    console.error("series-info error:", (err as Error).message);
    res.status(500).json({ error: "Failed to get series info" });
  }
});

export default router;
