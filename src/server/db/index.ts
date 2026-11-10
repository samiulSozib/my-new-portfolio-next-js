import "server-only";

import { createRequire } from "node:module";

import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon, type NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "./schema";

export type Database = NeonHttpDatabase<typeof schema>;

/*
 * Production (Vercel) talks to Neon over HTTP, which suits serverless functions: no pool to keep warm.
 * Without DATABASE_URL (local development only), an embedded Postgres (PGlite) stored in ./.pglite is used,
 * so the app runs without installing a database. Run `npm run db:migrate && npm run db:seed` once to fill it.
 *
 * Note: the Neon HTTP driver does not support interactive transactions, so the app does not use them.
 */
const globalForDb = globalThis as unknown as { __db?: Database };

function createDb(): Database {
  const url = process.env.DATABASE_URL;
  if (url) {
    return drizzleNeon(neon(url), { schema });
  }

  if (process.env.NODE_ENV === "production" && process.env.VERCEL) {
    throw new Error("DATABASE_URL is not set. Connect a Neon database to this Vercel project.");
  }

  // Loaded at runtime through createRequire, so the bundler and Vercel's file tracing never pull PGlite
  // (a dev dependency) into the production build.
  const load = createRequire(import.meta.url);
  const { PGlite } = load("@electric-sql/pglite") as typeof import("@electric-sql/pglite");
  const { drizzle } = load("drizzle-orm/pglite") as typeof import("drizzle-orm/pglite");
  const client = new PGlite(process.env.PGLITE_DIR ?? ".pglite");
  // Both drivers expose the same query builder; the type differs only in driver-specific extras.
  return drizzle(client, { schema }) as unknown as Database;
}

export const db: Database = globalForDb.__db ?? (globalForDb.__db = createDb());

export { schema };
