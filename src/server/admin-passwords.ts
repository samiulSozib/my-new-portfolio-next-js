import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

import { eq } from "drizzle-orm";

import { db } from "@/server/db";
import { passwordResetTokens } from "@/server/db/schema";

// Password reset tokens: the email gets the plain token, the database keeps its SHA-256 hash.
export const RESET_TOKEN_MINUTES = 60;

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

export async function createResetToken(email: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const hashed = sha256(token);
  await db
    .insert(passwordResetTokens)
    .values({ email, token: hashed, createdAt: new Date() })
    .onConflictDoUpdate({ target: passwordResetTokens.email, set: { token: hashed, createdAt: new Date() } });
  return token;
}

/** True when the token matches the email's pending reset and has not expired. */
export async function checkResetToken(email: string, token: string): Promise<boolean> {
  const [row] = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.email, email)).limit(1);
  if (!row) return false;
  if (Date.now() - row.createdAt.getTime() > RESET_TOKEN_MINUTES * 60 * 1000) return false;
  const expected = Buffer.from(row.token, "hex");
  const given = Buffer.from(sha256(token), "hex");
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export async function deleteResetToken(email: string): Promise<void> {
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.email, email));
}

/** Laravel's Password::defaults(): at least 8 characters. */
export function passwordProblem(password: unknown, confirmation: unknown): string | null {
  if (typeof password !== "string" || password === "") return "The password field is required.";
  if (password.length < 8) return "The password field must be at least 8 characters.";
  if (password.length > 255) return "The password field must not be greater than 255 characters.";
  if (password !== confirmation) return "The password field confirmation does not match.";
  return null;
}
