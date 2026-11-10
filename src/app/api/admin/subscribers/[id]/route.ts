import { eq } from "drizzle-orm";

import { done, notFound } from "@/server/admin-api";
import { authorizeAdmin } from "@/server/auth";
import { db } from "@/server/db";
import { subscribers } from "@/server/db/schema";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await authorizeAdmin();
  if (auth instanceof Response) return auth;

  const id = Number((await context.params).id);
  if (!Number.isInteger(id)) return notFound("Subscriber not found.");

  const deleted = await db.delete(subscribers).where(eq(subscribers.id, id)).returning({ id: subscribers.id });
  if (deleted.length === 0) return notFound("Subscriber not found.");

  return done({ flash: "Subscriber removed." });
}
