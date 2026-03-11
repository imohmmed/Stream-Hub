# Workspace

## Overview

pnpm workspace monorepo using TypeScript. StreamTV — موقع أفلام ومسلسلات وبث مباشر عبر IPTV.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **Video**: hls.js (HLS streaming), native HTML5 video
- **IPTV**: Xtream Codes API compatible

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server + IPTV proxy routes
│   └── streamtv/           # React frontend — Movies, Series, Live TV
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── deploy.sh               # VPS deployment script
├── ecosystem.config.cjs    # PM2 config for production
├── VPS_DEPLOY.md           # دليل النشر على VPS
└── package.json            # Root package with hoisted devDeps
```

## IPTV Config

| Setting | Value |
|---------|-------|
| Username | JVC3H3LW |
| Password | DFYXG4N1 |
| DNS 1 | http://mzbrxgwh.saifdns.com |
| DNS 2 | http://mzbrxgwh.yangsmart.com |

Backend will try DNS 1 first, then fall back to DNS 2.

## StreamTV Pages

- `/` — الرئيسية: Hero + carousels (أفلام، مسلسلات، قنوات)
- `/movies` — الأفلام: grid + filter by category + search + pagination
- `/series` — المسلسلات: grid + filter + search + pagination
- `/series/:id` — تفاصيل المسلسل: معلومات + حلقات مقسمة بالموسم
- `/live` — البث المباشر: grid قنوات مع LIVE badge
- `/play/:type/:id` — المشغل: HLS + MP4 + fullscreen (iOS + Android + Desktop)

## API Routes

All proxied through `/api/iptv/*`:
- `GET /api/iptv/channels` — قنوات البث المباشر
- `GET /api/iptv/movies` — الأفلام (دعم: category_id, search, page)
- `GET /api/iptv/series` — المسلسلات
- `GET /api/iptv/categories?type=live|movie|series` — التصنيفات
- `GET /api/iptv/stream-url?type=live|movie|series&id=...` — رابط البث
- `GET /api/iptv/series-info?series_id=...` — معلومات + حلقات المسلسل

## VPS Deployment (HTTP)

```bash
chmod +x deploy.sh && sudo ./deploy.sh
```

يشغل السيرفر على المنفذ 80 عبر HTTP مباشرة. راجع `VPS_DEPLOY.md` للتفاصيل.
