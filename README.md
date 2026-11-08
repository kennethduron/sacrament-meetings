# Sacrament Meeting Planner

A WDD 430 Week 02 coursework application for browsing, reviewing, and printing Sunday meeting program examples. It uses Next.js App Router, TypeScript, Tailwind CSS, in-memory data, and GET Route Handlers.

> **Coursework demo:** all people, announcements, and hymn titles shown by this app are fictional sample data. It is not an official ward schedule and must not be used to plan a real meeting.

## Features

- Landing page with links to the current Sunday and meeting archive.
- Five typed Sunday records for `regular`, `testimony`, `stake`, and `general` meeting types.
- Meeting list and agenda detail pages with loading, empty, error, and not-found feedback.
- Current Sunday lookup using the visitor's local calendar date, with a safe archive fallback when there is no matching sample record.
- Print Program action with print-specific CSS that removes navigation and controls.
- Accessible active-route navigation, skip link, visible keyboard focus, responsive layouts, and reduced-motion handling.
- Original local SVG illustration rendered through `next/image`; Geist fonts are loaded through `next/font/google`.

Stake and general conference Sundays are explicitly presented as Sundays without a ward sacrament meeting. The UI does not show hymns, prayers, or a sacrament program for those records.

## Run locally

Requirements: Node.js 20.9 or later and npm.

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>.

## API

| Method | Endpoint | Behavior |
| --- | --- | --- |
| GET | `/api/meetings` | Returns the five sample records, newest first. |
| GET | `/api/meetings?date=YYYY-MM-DD` | Returns records for that valid date; an invalid calendar date returns `400` JSON. |
| GET | `/api/meetings/:id` | Returns `200` JSON for a valid existing integer ID, `400` JSON for an invalid ID, or `404` JSON if the ID does not exist. |

The meeting list and detail pages fetch these endpoints from client components. This keeps the UI aligned with the HTTP API and avoids a server component trying to call its own server during the static build.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Project structure

```text
app/                 App Router pages, loading state, and GET Route Handlers
components/          Shared header, navigation, cards, list, detail, and print button
lib/types.ts         Meeting data contracts and meeting-type helpers
lib/meetings-db.ts   In-memory sample records and lookup functions
lib/date-utils.ts    Date display and ISO calendar-date validation
public/              Original local illustration
```

Week 02 implementation belongs on `peer-code-review`; `main` is retained as the generated Next.js baseline for the peer-review diff.
