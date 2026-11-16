# WDD 430 Week 04 — Sacrament Meeting Planner

## GitHub Repository URL

https://github.com/kennethduron/sacrament-meetings

Week 03 was integrated into `main` through the course pull request. Week 04 is on `main` at commit `c349140`.

## Vercel Production URL

https://sacrament-meetings-ten-livid.vercel.app/

## Reflection

One challenge was connecting the new forms to the existing PostgreSQL model without disturbing the nine sample meetings. I used the existing `meetings` table, parameterized Neon queries, and a separate Development environment. I verified create, update, and delete with one temporary record on a date that was confirmed to be unused, then removed that same record and confirmed the existing sample data remained available.

I implemented the forms with Next.js Server Actions and `useActionState`. Zod `safeParse` validates the submitted fields on the server, returns field-specific messages when input is invalid, and preserves the submitted values. The database writes use parameterized SQL; successful actions revalidate the affected meeting paths and redirect. I also added loading states for submission, error and not-found pages, and labels and ARIA descriptions for validation feedback.

I used Codex as a development assistant to inspect the existing project, explain the Next.js and Neon patterns, draft and review code, and help run lint, TypeScript, tests, builds, and HTTP checks. I reviewed the changes and their results before publishing them. This work helped me understand how a Server Action receives form state and `FormData`, how Zod validation prevents invalid writes, and why database errors should be handled without exposing connection details.

This remains a coursework demo with fictional records. It does not implement authentication or authorization for the write actions, so it must not be used with real meeting information.
