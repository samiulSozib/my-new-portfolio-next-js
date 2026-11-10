import { eq, sql } from "drizzle-orm";

import { checkResetToken, deleteResetToken, passwordProblem } from "@/server/admin-passwords";
import { hashPassword } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { readJson, validationError, type FieldErrors } from "@/server/validation";

export async function POST(request: Request) {
  const input = (await readJson(request)) as { token?: unknown; email?: unknown; password?: unknown; password_confirmation?: unknown };
  const token = typeof input.token === "string" ? input.token : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";

  const errors: FieldErrors = {};
  if (token === "") errors.token = "The token field is required.";
  if (email === "") errors.email = "The email field is required.";
  const problem = passwordProblem(input.password, input.password_confirmation);
  if (problem) errors.password = problem;
  if (Object.keys(errors).length > 0) return validationError(errors);

  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (!user) return validationError({ email: "We can't find a user with that email address." });
  if (!(await checkResetToken(email, token))) return validationError({ email: "This password reset token is invalid." });

  // A new hash also signs out every existing session (see src/server/auth.ts).
  await db
    .update(users)
    .set({ password: await hashPassword(input.password as string), updatedAt: sql`now()` })
    .where(eq(users.id, user.id));
  await deleteResetToken(email);

  return Response.json({ redirect: "/login?status=reset" });
}
