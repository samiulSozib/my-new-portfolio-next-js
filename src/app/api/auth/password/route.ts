import { eq, sql } from "drizzle-orm";

import { passwordProblem } from "@/server/admin-passwords";
import { authorizeUser, hashPassword, refreshSession, verifyPassword } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { readJson, validationError, type FieldErrors } from "@/server/validation";

/** Changes the signed-in user's password. Other sessions are signed out; this one is kept. */
export async function PUT(request: Request) {
  const auth = await authorizeUser();
  if (auth instanceof Response) return auth;

  const input = (await readJson(request)) as { current_password?: unknown; password?: unknown; password_confirmation?: unknown };
  const [user] = await db.select().from(users).where(eq(users.id, auth.id)).limit(1);

  const errors: FieldErrors = {};
  if (typeof input.current_password !== "string" || input.current_password === "") {
    errors.current_password = "The current password field is required.";
  } else if (!(await verifyPassword(input.current_password, user.password))) {
    errors.current_password = "The password is incorrect.";
  }
  const problem = passwordProblem(input.password, input.password_confirmation);
  if (problem) errors.password = problem;
  if (Object.keys(errors).length > 0) return validationError(errors);

  const password = await hashPassword(input.password as string);
  await db.update(users).set({ password, updatedAt: sql`now()` }).where(eq(users.id, user.id));
  await refreshSession({ id: user.id, password });

  return Response.json({});
}
