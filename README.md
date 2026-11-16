# Sacrament Meeting Planner

A WDD 430 Week 02–03 coursework application for browsing, searching, and printing Sunday meeting program examples. It uses Next.js App Router, TypeScript, Tailwind CSS, Neon PostgreSQL, and GET Route Handlers.

> **Coursework demo:** all people, announcements, and hymn titles shown by this app are fictional sample data. It is not an official ward schedule and must not be used to plan a real meeting.

## Features

- Landing page with links to the current Sunday and meeting archive.
- PostgreSQL-backed meeting records for `regular`, `testimony`, `stake`, `general`, and `special` meeting types.
- Meeting list and agenda detail pages with loading, empty, error, and not-found feedback.
- URL-based search across speakers, presiding leaders, conducting leaders, and meeting types, with five records per page.
- Separate public and admin route-group layouts; meeting creation remains a Week 04 placeholder.
- Current Sunday lookup using the visitor's local calendar date, with a safe archive fallback when there is no matching sample record.
- Print Program action with print-specific CSS that removes navigation and controls.
- Accessible active-route navigation, skip link, visible keyboard focus, responsive layouts, and reduced-motion handling.
- Original local SVG illustration rendered through `next/image`; Geist fonts are loaded through `next/font/google`.

Stake and general conference Sundays are explicitly presented as Sundays without a ward sacrament meeting. The UI does not show hymns, prayers, or a sacrament program for those records.

## Set up the database

Create a free Neon database through the Vercel Storage integration and connect it to the existing `sacrament-meetings` Vercel project. Pull the Development environment variables into `.env.local` with the Vercel CLI. Keep this file private and out of Git.

Run [`database/meetings.sql`](database/meetings.sql) in the Neon SQL Editor. The script creates the required table and inserts nine fictional examples without replacing records already stored for those dates.

## Run locally

Requirements: Node.js 20.9 or later and npm.

```bash
npm ci
npm run typecheck
npm run dev
```

Open <http://localhost:3000>.

## API

| Method | Endpoint | Behavior |
| --- | --- | --- |
| GET | `/api/meetings?query=smith&page=2` | Returns up to five matching records for the requested page, newest first. Search and page values are sent as SQL parameters. |
| GET | `/api/meetings?date=YYYY-MM-DD` | Returns records matching the valid date; an invalid calendar date returns `400` JSON. |
| GET | `/api/meetings/:id` | Returns `200` JSON for a valid existing integer ID, `400` JSON for an invalid ID, `404` JSON if the ID does not exist, or a generic `500` JSON response for a database failure. |

The meeting archive reads PostgreSQL on the server. The detail and current-Sunday views use the API. Database credentials are read from `DATABASE_URL`; they are never part of the source or API response.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Project structure

```text
app/                 App Router pages, route groups, loading state, and GET Route Handlers
components/          Shared header, search, pagination, cards, detail, and print button
lib/types.ts         Meeting data contracts and meeting-type helpers
lib/meetings-db.ts   Parameterized Neon PostgreSQL queries
lib/date-utils.ts    Date display and ISO calendar-date validation
database/            Repeat-safe table setup and fictional sample data
public/              Original local illustration
```

Week 02 implementation belongs on `peer-code-review`; `main` is retained as the generated Next.js baseline for the peer-review diff.
