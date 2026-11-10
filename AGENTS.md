# Agent notes

This is a Next.js 16 (App Router) app backed by Neon Postgres (Drizzle ORM) and Vercel Blob, deployed on Vercel.
See README.md for the layout, setup and deployment steps.

- Next.js 16 differs from older versions (`params`/`searchParams`/`cookies()`/`headers()` are async, `middleware` is now `proxy`).
  Check `node_modules/next/dist/docs/` before relying on memory.
- Server-only code lives in `src/server/`. Import the database from `@/server/db`; never import it into client components.
- The Neon HTTP driver has no interactive transactions. Do not use `db.transaction()`.
- Schema changes: edit `src/server/db/schema.ts`, run `npm run db:generate`, commit the new file in `drizzle/`.
- After any admin write to content, call `revalidateSite()` from `@/server/revalidate`.
- Admin JSON endpoints return `422 {errors}` with dotted keys (`title.en`, `content.en.2.text`) or `{redirect, flash}`;
  the dashboard's `useForm` shim in `src/dashboard/lib/` relies on that contract.
- Local dev without `DATABASE_URL` uses PGlite in `./.pglite`. Delete that folder to reset the local database.
- Checks: `npm run typecheck` and `npm run build`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
