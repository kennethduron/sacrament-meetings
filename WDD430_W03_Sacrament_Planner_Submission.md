# WDD 430 W03 — Sacrament Meeting Planner

## Project Links

- GitHub repository: https://github.com/kennethduron/sacrament-meetings
- Open pull request (`peer-code-review` → `main`): https://github.com/kennethduron/sacrament-meetings/pull/1
- Vercel Preview for the Week 03 implementation: https://sacrament-meetings-nwhsbvbe5-kennethduronpaz-7247s-projects.vercel.app (Ready).

## Reflection

For Week 03, I extended my Week 02 planner by moving meeting reads from in-memory data to parameterized Neon PostgreSQL queries. I organized the pages with Next.js public and admin route groups, kept the existing URLs, and added debounced search stored in the URL plus five-record pagination. The Neon SQL setup is repeat-safe: it creates the table only when needed and inserts the nine fictional examples only for dates that are not already present.

A key challenge was verifying the database-backed application without copying a connection string into source control or chat. I ran the supplied SQL script in the Neon SQL Editor, then tested the deployed Preview API against the connected database. The API returned nine records across two pages, filtered records by speaker and date, returned no rows for a non-matching search, and handled invalid input and missing IDs with the expected HTTP errors. The Vercel CLI confirms the project variables are connected to Preview, Production, and Development; their encrypted values were not exposed. My local `.env.local` does not contain `DATABASE_URL`, and `vercel dev` could not retrieve the project configuration in this session, so I verified the live Vercel application rather than claiming a local database connection.

I used Codex to help inspect my existing Week 02 code, implement and review the database model, route groups, search, pagination, and API validation, and run lint, TypeScript, and production-build checks. I reviewed the main design choice: Neon tagged-template queries bind search terms, dates, and pagination values as parameters, avoiding SQL string concatenation. I also checked the actual API responses and kept the SQL seed operation safe to rerun. My individual pull request remains open and unmerged for review.
