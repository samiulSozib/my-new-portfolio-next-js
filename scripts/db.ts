import "dotenv/config";

import { createRequire } from "node:module";

import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";

import * as schema from "../src/server/db/schema";

/**
 * Database connection for the CLI scripts (migrate, seed). Mirrors src/server/db/index.ts:
 * Neon when DATABASE_URL is set, the local PGlite database otherwise.
 */
export async function connect() {
  const url = process.env.DATABASE_URL;
  if (url) {
    const db = drizzleNeon(neon(url), { schema });
    const { migrate } = await import("drizzle-orm/neon-http/migrator");
    return { db, kind: "neon" as const, migrate: () => migrate(db, { migrationsFolder: "drizzle" }), close: async () => {} };
  }

  if (process.env.VERCEL) {
    throw new Error("DATABASE_URL is not set. Connect a Neon database to this Vercel project (Storage → Neon).");
  }

  const load = createRequire(import.meta.url);
  const { PGlite } = load("@electric-sql/pglite") as typeof import("@electric-sql/pglite");
  const { drizzle } = load("drizzle-orm/pglite") as typeof import("drizzle-orm/pglite");
  const { migrate } = load("drizzle-orm/pglite/migrator") as typeof import("drizzle-orm/pglite/migrator");
  const client = new PGlite(process.env.PGLITE_DIR ?? ".pglite");
  const db = drizzle(client, { schema });
  return {
    db: db as unknown as ReturnType<typeof drizzleNeon<typeof schema>>,
    kind: "pglite" as const,
    migrate: () => migrate(db, { migrationsFolder: "drizzle" }),
    close: () => client.close(),
  };
}
