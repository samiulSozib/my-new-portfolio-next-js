import "server-only";

import { createHash } from "node:crypto";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { db } from "@/server/db";
import { users, type UserRow } from "@/server/db/schema";

/*
 * Login sessions are a signed JWT in an httpOnly cookie. Nothing is stored server-side.
 * The token carries a fingerprint of the password hash, so changing or resetting the password
 * signs out every other session.
 */
const COOKIE = "session";
const REMEMBER_SECONDS = 60 * 60 * 24 * 30;
const SESSION_SECONDS = 60 * 60 * 2;

export type SessionUser = { id: number; name: string; email: string; isAdmin: boolean; emailVerifiedAt: string | null };

function secret(): Uint8Array {
  const value = process.env.AUTH_SECRET;
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET is not set. Generate one with `openssl rand -base64 32`.");
    }
    return new TextEncoder().encode("dev-only-secret-change-me-dev-only-secret");
  }
  return new TextEncoder().encode(value);
}

function fingerprint(passwordHash: string): string {
  return createHash("sha256").update(passwordHash).digest("hex").slice(0, 16);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Hashes copied from the old Laravel app start with $2y$, which is the same algorithm as $2b$.
  return bcrypt.compare(password, hash.replace(/^\$2y\$/, "$2b$"));
}

/** Starts a session for the user. Call from a route handler or server action. */
export async function startSession(user: Pick<UserRow, "id" | "password">, remember = false): Promise<void> {
  const ttl = remember ? REMEMBER_SECONDS : SESSION_SECONDS;
  const token = await new SignJWT({ pw: fingerprint(user.password), remember })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${ttl}s`)
    .sign(secret());

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // A "remember me" login survives closing the browser; otherwise it is a browser-session cookie.
    ...(remember ? { maxAge: ttl } : {}),
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

/** The signed-in user, or null. Cached per request. */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    const id = Number(payload.sub);
    if (!Number.isInteger(id)) return null;

    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user || payload.pw !== fingerprint(user.password)) return null;

    return toSessionUser(user);
  } catch {
    return null;
  }
});

/** Re-issues the cookie after the password changes, keeping the current browser signed in. */
export async function refreshSession(user: Pick<UserRow, "id" | "password">): Promise<void> {
  const token = (await cookies()).get(COOKIE)?.value;
  let remember = false;
  if (token) {
    try {
      remember = Boolean((await jwtVerify(token, secret())).payload.remember);
    } catch {}
  }
  await startSession(user, remember);
}

export function toSessionUser(user: UserRow): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    emailVerifiedAt: user.emailVerifiedAt ? user.emailVerifiedAt.toISOString() : null,
  };
}

// --- Guards ---------------------------------------------------------------------------------

/** For pages: signed-in users only. Others go to the login page. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** For pages: admins only. Signed-in non-admins are sent to their account page. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (!user.isAdmin) redirect("/account?forbidden=1");
  return user;
}

/** For pages only guests should see (login, password reset). */
export async function redirectIfAuthenticated(): Promise<void> {
  if (await getCurrentUser()) redirect("/admin");
}

/**
 * For route handlers: returns the user, or a JSON error response to return as-is.
 *   const auth = await authorizeAdmin(); if (auth instanceof Response) return auth;
 */
export async function authorizeAdmin(): Promise<SessionUser | Response> {
  const user = await getCurrentUser();
  if (!user) return Response.json({ message: "Unauthenticated." }, { status: 401 });
  if (!user.isAdmin) return Response.json({ message: "Only site admins can open the dashboard." }, { status: 403 });
  return user;
}

export async function authorizeUser(): Promise<SessionUser | Response> {
  const user = await getCurrentUser();
  if (!user) return Response.json({ message: "Unauthenticated." }, { status: 401 });
  return user;
}
