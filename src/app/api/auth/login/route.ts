import { eq } from "drizzle-orm";

import { startSession, verifyPassword } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { clear, clientIp, hit } from "@/server/rate-limit";
import { readJson, validationError, type FieldErrors } from "@/server/validation";

export async function POST(request: Request) {
  const input = (await readJson(request)) as { email?: unknown; password?: unknown; remember?: unknown };
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";

  const errors: FieldErrors = {};
  if (email === "") errors.email = "The email field is required.";
  else if (!/^[^\s@]+@[^\s@]+$/.test(email)) errors.email = "The email field must be a valid email address.";
  if (password === "") errors.password = "The password field is required.";
  if (Object.keys(errors).length > 0) return validationError(errors);

  // Five attempts per email and address per minute, like Laravel's LoginRequest.
  const key = `login:${email}|${await clientIp()}`;
  const { allowed, retryAfter } = hit(key, 5, 60);
  if (!allowed) {
    return validationError({ email: `Too many login attempts. Please try again in ${retryAfter} seconds.` });
  }

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || !(await verifyPassword(password, user.password))) {
    return validationError({ email: "These credentials do not match our records." });
  }

  clear(key);
  await startSession(user, input.remember === true);
  return Response.json({ redirect: "/admin" });
}
