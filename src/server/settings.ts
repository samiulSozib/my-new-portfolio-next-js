import "server-only";

import { eq, sql } from "drizzle-orm";

import { db } from "@/server/db";
import { settings } from "@/server/db/schema";

export type SettingKey = "site" | "profile" | "cv" | "photo";

/** Reads one settings document. Missing documents read as {}. */
export async function getSetting<T extends Record<string, unknown> = Record<string, unknown>>(key: SettingKey): Promise<T> {
  const [row] = await db.select({ value: settings.value }).from(settings).where(eq(settings.key, key)).limit(1);
  return (row?.value ?? {}) as T;
}

/** Replaces one settings document, creating it when missing. */
export async function storeSetting(key: SettingKey, value: Record<string, unknown>): Promise<void> {
  await db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: sql`now()` } });
}
