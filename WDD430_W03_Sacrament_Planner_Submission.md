# WDD 430 W03 — Sacrament Meeting Planner

## Project Links

- GitHub repository: https://github.com/kennethduron/sacrament-meetings
- Open pull request (`peer-code-review` → `main`): https://github.com/kennethduron/sacrament-meetings/pull/1
- W03 Vercel Preview (`peer-code-review` commit `c777b6e`): https://sacrament-meetings-50rapf01a-kennethduronpaz-7247s-projects.vercel.app

The W03 Preview deployment is Ready and its pages respond, but the meetings page falls back to its safe error state because the SQL table has not yet been created. Vercel logs confirm the Preview reached Neon and received PostgreSQL error `42P01` (`relation "meetings" does not exist`). The API returns a generic HTTP 500 until the migration is run.

## Reflection

For Week 03, I extended my Week 02 planner by moving the meeting data access layer from in-memory records to parameterized Neon PostgreSQL queries, grouping public and administrative pages with Next.js route groups, and adding URL-based search and five-item pagination. I prepared a repeat-safe seed script that preserves the original five sample meetings and adds four fictional records so the second page can be tested; the script still needs to be run and verified in Neon.

One technical challenge is still unresolved: although the free Neon database is connected to the existing Vercel project for Preview and Production, Vercel marks its credentials encrypted, does not expose them to the local CLI process, and Development is not connected. The application build passes and the Preview reaches Neon, but successful reads, searches, pagination, and persistence cannot be verified until I connect Development and run `database/meetings.sql` in Neon’s SQL Editor.

I used Codex to help inspect the existing Week 02 code, implement and review the Week 03 changes, diagnose build and type-check issues, and run the checks recorded in the verification report. I reviewed the resulting architecture: user input is passed through Neon tagged-template parameters, so search terms and page offsets are not concatenated into SQL. I still need to complete the Neon setup and verify the application against the real database before submitting this reflection as final evidence.
