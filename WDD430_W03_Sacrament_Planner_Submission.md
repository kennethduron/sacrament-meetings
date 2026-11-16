# WDD 430 W03 — Sacrament Meeting Planner

## Project Links

- GitHub repository: https://github.com/kennethduron/sacrament-meetings
- Open pull request (`peer-code-review` → `main`): https://github.com/kennethduron/sacrament-meetings/pull/1
- Existing peer-review Preview alias: https://sacrament-meetings-peer-review.vercel.app/

The Preview alias was reachable when checked, but it still points to the previous deployment. Vercel now lists the Neon environment variables for Preview and Production, but the Week 03 changes have not yet been deployed. The Neon credentials are marked encrypted and the authorized CLI does not expose them for local SQL access. I will replace this link with the new `peer-code-review` Preview deployment after running the migration in Neon and verifying the deployment.

## Reflection

For Week 03, I extended my Week 02 planner by moving the meeting data access layer from in-memory records to parameterized Neon PostgreSQL queries, grouping public and administrative pages with Next.js route groups, and adding URL-based search and five-item pagination. I prepared a repeat-safe seed script that preserves the original five sample meetings and adds four fictional records so the second page can be tested; the script still needs to be run and verified in Neon.

One technical challenge is still unresolved: although the free Neon database is connected to the existing Vercel project for Preview and Production, Vercel does not expose its encrypted `DATABASE_URL` to the local CLI process, and Development is not connected. The application build passes, but real database reads, searches, pagination, and persistence cannot yet be verified. The next step is to connect the Development environment in Vercel and run `database/meetings.sql` in Neon’s SQL Editor.

I used Codex to help inspect the existing Week 02 code, implement and review the Week 03 changes, diagnose build and type-check issues, and run the checks recorded in the verification report. I reviewed the resulting architecture: user input is passed through Neon tagged-template parameters, so search terms and page offsets are not concatenated into SQL. I still need to complete the Neon setup and verify the application against the real database before submitting this reflection as final evidence.
