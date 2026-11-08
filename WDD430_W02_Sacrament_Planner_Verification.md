# WDD 430 W02 — Verification Checklist

Checked 2026-11-08 for repository `kennethduron/sacrament-meetings`.

## GitHub

- Repository: https://github.com/kennethduron/sacrament-meetings — public; default branch is `main`.
- `main`: `fad44b2391f25bca0cd76eae752bf3973715ad52`, the untouched create-next-app scaffold.
- `peer-code-review`: `68e3da96e960b83dfa6ca129fcd7e43811d6bd9a`, the Week 02 implementation.
- Pull Request #1: https://github.com/kennethduron/sacrament-meetings/pull/1 — OPEN; base `main`, compare `peer-code-review`; not merged.
- GitHub reports a clean PR merge state. The local checkout is on `peer-code-review` after verifying that local and remote `main` remain at the scaffold commit.
- `.env` and `.env.local` are ignored by Git. A source scan found no MongoDB URI, password, API-key, or GitHub-token pattern in tracked project files.

## Quality Checks

- `npm run lint`: PASS.
- `npm run typecheck`: PASS (`tsc --noEmit`).
- `npm run build`: PASS with the supported `next build --webpack` configuration. A clean build generated `/`, `/meetings`, `/meetings/[id]`, `/meetings/current`, and both API route handlers.
- `git diff --check`: PASS before the implementation commit.
- The Vercel cloud build for the review branch completed successfully with Next.js 16.4.5 and Webpack.

## Local Production-Mode HTTP Checks

| Request | Result | Evidence |
| --- | --- | --- |
| `GET /` | 200 | HTML response |
| `GET /meetings` | 200 | HTML response |
| `GET /meetings/1` | 200 | HTML response |
| `GET /meetings/current` | 200 | HTML response |
| `GET /api/meetings` | 200 | JSON array; 5 sample records |
| `GET /api/meetings?date=2026-11-08` | 200 | JSON array; one matching record |
| `GET /api/meetings?date=` | 400 | JSON validation message |
| `GET /api/meetings?date=2026-02-30` | 400 | JSON validation message |
| `GET /api/meetings/1` | 200 | Full typed meeting JSON |
| `GET /api/meetings/abc` | 400 | JSON invalid-ID message |
| `GET /api/meetings/999` | 404 | JSON not-found message |

## Vercel

- Existing new project: `sacrament-meetings` in `kennethduronpaz-7247s-projects`; framework preset is configured as Next.js.
- Vercel Authentication/SSO protection is disabled for this project only. This was checked with the Vercel CLI and the preview endpoints were then tested without authentication.
- Production alias: https://sacrament-meetings-ten-livid.vercel.app — points to the `main` scaffold deployment, not the Week 02 feature implementation.
- Review Preview: https://sacrament-meetings-2cdcva7gk-kennethduronpaz-7247s-projects.vercel.app — Ready; built from `peer-code-review` commit `68e3da9`.
- Public Preview checks: `/`, `/meetings`, `/meetings/1`, `/meetings/current` returned 200 HTML; `/api/meetings` returned 200 JSON with 5 records; date-filtered list returned 1 matching record; empty date and invalid ID returned 400 JSON; valid missing ID returned 404 JSON.
- The account's GitHub Login Connection is not yet linked to Vercel. The official `vercel git connect` command returned HTTP 400 requiring a GitHub Login Connection. The current Preview is a direct CLI deployment and is accessible, but future Git pushes will not trigger automatic deployments until the account connection is added.
- Production `/` returned 200 after the project framework was changed to Next.js. The deployed source on Production is the scaffold commit on `main`.

## Implementation References

- Types and union for non-sacrament Sundays: https://github.com/kennethduron/sacrament-meetings/blob/peer-code-review/lib/types.ts
- Five fictional seed meetings and query helpers: https://github.com/kennethduron/sacrament-meetings/blob/peer-code-review/lib/meetings-db.ts
- List and date-filter endpoint: https://github.com/kennethduron/sacrament-meetings/blob/peer-code-review/app/api/meetings/route.ts
- Detail endpoint and 400/404 behavior: https://github.com/kennethduron/sacrament-meetings/blob/peer-code-review/app/api/meetings/%5Bid%5D/route.ts
- Meeting program and non-sacrament Sunday presentation: https://github.com/kennethduron/sacrament-meetings/blob/peer-code-review/components/MeetingDetail.tsx
- Preview framework setting: https://github.com/kennethduron/sacrament-meetings/blob/peer-code-review/vercel.json

## Remaining Manual Verification / Collaboration

- Use a private browser window to visually check widths 320, 375, 768, 1024, and 1440 px; the prior narrow screenshot showed clipping, and the code was adjusted, but the final visual check could not be completed after the Windows browser tool stopped because it could not confirm the current URL.
- Open the browser print dialog for `/meetings/1` and confirm the printed program is legible and omits navigation and controls. The print button and `@media print` styles are implemented; the final print preview was not reverified in this session.
- Check keyboard-only navigation, active-link state, image alternative text, and contrast in the deployed Preview.
- To connect automatic Vercel Git deployments, open Vercel Account Settings → Authentication and add the GitHub login connection for the account that owns `kennethduron/sacrament-meetings`. Then retry `vercel git connect` and verify a commit/PR deployment. Do not share any credentials in chat.
- The Microsoft Teams `team-membership.docx` file was not available through a connected Teams/SharePoint document tool. Copy these verified lines under the Kenneth Duron entry after confirming the assigned reviewer from the real document:

  ```text
  Week 02: https://github.com/kennethduron/sacrament-meetings/pull/1
  Week 02: https://sacrament-meetings-2cdcva7gk-kennethduronpaz-7247s-projects.vercel.app
  ```

- Do not enter an assigned reviewer from memory unless the team membership document confirms that person.
- Canvas submission, peer approval, final visual checks, team-document edit, and student video remain the student's responsibility.
