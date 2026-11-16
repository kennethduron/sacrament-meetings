# Sacrament Meeting Planner

A WDD 430 Week 02-04 coursework application for browsing, searching, printing, and managing fictional Sunday meeting programs. It uses Next.js App Router, TypeScript, Tailwind CSS, Neon PostgreSQL, GET Route Handlers, and Server Actions.

> **Coursework demo:** all people, announcements, and hymn titles are fictional examples. This is not an official ward schedule.

## Features

- Landing page with links to the current Sunday and the meeting archive.
- PostgreSQL-backed records for regular, testimony, stake, general, and special meeting types.
- Meeting list and agenda detail pages with loading, empty, error, and not-found feedback.
- URL-based search across speakers, presiding leaders, conducting leaders, and meeting types, with five records per page.
- Separate public and admin route-group layouts.
- Accessible create/edit forms with server-side Zod validation, field-level errors, pending states, and safe redirects.
- Create, update, and delete Server Actions backed by parameterized Neon SQL.
- Current Sunday lookup and print-specific CSS for meeting programs.
- Visible keyboard focus, responsive layouts, reduced-motion handling, next/image illustration, and next/font fonts.

Stake and general conference Sundays are represented without a ward sacrament program; the UI does not show hymns, prayers, or speakers for those records.

**Security scope:** this is an unauthenticated coursework demo. Its Server Actions can change the sample archive. Use fictional data only; add authentication and authorization before using it with real meeting schedules.

## Database setup

The existing `sacrament-meetings` Vercel project is connected to a free Neon database. Pull Development variables into the ignored `.env.development.local` file with the Vercel CLI. Never commit environment files.

Run [`database/meetings.sql`](database/meetings.sql) in the Neon SQL Editor only when setting up a new database. It uses `CREATE TABLE IF NOT EXISTS` and `ON CONFLICT (date) DO NOTHING`; it does not replace existing meeting rows.

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
| GET | `/api/meetings?query=smith&page=2` | Returns up to five matching records; search and pagination values are SQL parameters. |
| GET | `/api/meetings?date=YYYY-MM-DD` | Returns records for a valid date, or `400` JSON for an invalid date. |
| GET | `/api/meetings/:id` | Returns `200`, `400` for an invalid ID, `404` if absent, or generic `500` JSON for a database failure. |

The archive reads PostgreSQL on the server. Database credentials are read from `DATABASE_URL`; they are not part of source code or API responses.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Project structure

```text
app/                 App Router pages, route groups, errors, and GET Route Handlers
components/          Shared UI, search, pagination, meeting forms, and action buttons
lib/types.ts         Meeting data contracts and helpers
lib/meetings-db.ts   Parameterized Neon PostgreSQL reads and writes
lib/actions.ts       Create, update, and delete Server Actions
lib/meeting-form.ts  Zod validation and form-to-database mapping
tests/               Form-validation tests
database/            Repeat-safe schema and fictional sample data
public/              Local illustration
```

Week 03 work from `peer-code-review` was merged into `main` through the course pull request. Week 04 development continues on `main` for the production submission.
