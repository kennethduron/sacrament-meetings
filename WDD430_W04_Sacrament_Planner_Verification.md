# WDD 430 Week 04 — Verification Record

## Source and deployment

- Repository: https://github.com/kennethduron/sacrament-meetings
- Week 03 PR #1: https://github.com/kennethduron/sacrament-meetings/pull/1 — merged on November 16, 2026.
- Week 04 branch: `main`.
- Week 04 code commit: `c349140` (`feat: add meeting management actions and forms`).
- Vercel deployment: `READY`, target `production`, deployment `dpl_42mqN5qAXYqZaSdqpYFqUgC8W4Sa`.
- Stable Production alias: https://sacrament-meetings-ten-livid.vercel.app/
- Vercel project environment listing showed `DATABASE_URL` encrypted for Development, Preview, and Production. The Development variables were pulled into `.env.development.local`, which is ignored by Git. No environment file is tracked.

## Week 04 implementation

- Implemented `createMeeting`, `updateMeeting`, and `deleteMeeting` Server Actions in `lib/actions.ts`.
- Replaced the Week 04 database stubs with parameterized Neon INSERT, UPDATE, and DELETE queries in `lib/meetings-db.ts`.
- Added Zod server-side `safeParse` validation, parsing and mapping for the existing table fields in `lib/meeting-form.ts`.
- Added create and edit forms using `useActionState`, field-level messages, accessible labels and descriptions, pending states, and retained submitted values after validation errors.
- Added a confirmation before the sample-record delete action, revalidation and redirects after successful writes, and friendly error/not-found routes.
- Updated the README to document Week 04 and the demo's security scope.
- The project remains an unauthenticated coursework demo. The write actions are reachable without login; only fictional data should be used. Authentication and authorization are required before using real schedules.

## Automated checks

| Check | Result |
|---|---|
| `npm test` | PASS — 5 form-schema and data-mapping tests. Node emitted a non-fatal typeless-package warning for the TypeScript test import. |
| `npm run lint` | PASS — exit 0. |
| `npm run typecheck` | PASS — exit 0. |
| `npm run build` | PASS — Next.js 16.4.5 production build completed and generated the route groups. |
| `git diff --check` | PASS. |
| Environment-file scan | PASS — `.env.development.local` is ignored; no `.env*` file is tracked. |
| Secret-pattern scan of staged changes | No PostgreSQL URI or Vercel token assignment found. |

`npm install` reported seven moderate dependency advisories. No forced or major dependency upgrades were applied as part of this assignment.

## Development Neon and CRUD verification

- Vercel Development environment variables were loaded locally without printing their values.
- Before the CRUD check, the API returned 5 meetings on page 1 and 4 on page 2 (9 existing sample rows total).
- A unique test date, `2099-12-31`, was checked to be unused before any write.
- The existing Neon model functions inserted one fictional test row, read it back, updated it, and deleted that same row. The verification script confirmed it was absent after deletion.
- No original sample row was deleted or replaced; the SQL table has a unique date constraint and write failures are returned as safe messages.
- The SQL operations were exercised directly against Development. A browser-driven form submission was not run because no browser automation surface was available in this session.

## Local HTTP checks

The local Next.js development server used the linked Development environment:

| Request | Result |
|---|---|
| `GET /api/meetings` | 200; 5 rows. |
| `GET /api/meetings?page=2` | 200; 4 rows. |
| `GET /api/meetings/1` | 200. |
| `GET /api/meetings/abc` | 400. |
| `GET /api/meetings/999999` | 404. |
| `GET /meetings` | 200. |
| `GET /meetings/new` | 200. |
| `GET /meetings/1/edit` | 200. |
| `GET /meetings/999999/edit` | 404 locally. |

## Production HTTP checks

The Production alias was checked after the deployment reached `READY`:

| Request | Result |
|---|---|
| `GET /` | 200. |
| `GET /meetings` | 200. |
| `GET /meetings/new` | 200; create form marker present. |
| `GET /meetings/1/edit` | 200; edit form marker present. |
| `GET /meetings/999999/edit` | 200; not-found UI marker present. Next's streamed response retained 200, so this route does not currently prove an HTTP 404 in Production. |
| `GET /api/meetings` | 200; 5 rows. |
| `GET /api/meetings?page=2` | 200; 4 rows (9 total). |
| `GET /api/meetings/1` | 200. |
| `GET /api/meetings/abc` | 400. |
| `GET /api/meetings/999999` | 404. |

The production API's successful reads confirm the production application can connect to Neon. No write or delete was performed against Production.

## Checks not performed

- No browser automation was available; responsive visual review, keyboard interaction, browser-console review, live client-side validation feedback, and Lighthouse were not run.
- The form schema and model CRUD were tested, but the Server Action submission cycle was not exercised through a browser.
- Production write operations were intentionally not used for tests; the CRUD test used the Development database.
- Authentication/authorization has not been implemented. This limits the application to fictional coursework data.
