import { and, eq, ne, sql } from "drizzle-orm";

import { authorizeUser, endSession, verifyPassword } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { readJson, validationError, type FieldErrors } from "@/server/validation";

/** Updates the signed-in user's name and email. */
export async function PATCH(request: Request) {
  const auth = await authorizeUser();
  if (auth instanceof Response) return auth;

  const input = (await readJson(request)) as { name?: unknown; email?: unknown };
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";

  const errors: FieldErrors = {};
  if (name === "") errors.name = "The name field is required.";
  else if (name.length > 255) errors.name = "The name field must not be greater than 255 characters.";
  if (email === "") errors.email = "The email field is required.";
  else if (!/^[^\s@]+@[^\s@]+$/.test(email)) errors.email = "The email field must be a valid email address.";
  else if (email.length > 255) errors.email = "The email field must not be greater than 255 characters.";
  else {
    const [taken] = await db.select({ id: users.id }).from(users).where(and(eq(users.email, email), ne(users.id, auth.id))).limit(1);
    if (taken) errors.email = "The email has already been taken.";
  }
  if (Object.keys(errors).length > 0) return validationError(errors);

  await db
    .update(users)
    .set({
      name,
      email,
      // A changed email is no longer verified.
      ...(email !== auth.email ? { emailVerifiedAt: null } : {}),
      updatedAt: sql`now()`,
    })
    .where(eq(users.id, auth.id));

  return Response.json({});
}

/** Deletes the signed-in user's account after checking the password. */
export async function DELETE(request: Request) {
  const auth = await authorizeUser();
  if (auth instanceof Response) return auth;

  const input = (await readJson(request)) as { password?: unknown };
  const [user] = await db.select().from(users).where(eq(users.id, auth.id)).limit(1);
  if (typeof input.password !== "string" || input.password === "") {
    return validationError({ password: "The password field is required." });
  }
  if (!(await verifyPassword(input.password, user.password))) {
    return validationError({ password: "The password is incorrect." });
  }

  await db.delete(users).where(eq(users.id, user.id));
  await endSession();
  return Response.json({ redirect: "/" });
}
