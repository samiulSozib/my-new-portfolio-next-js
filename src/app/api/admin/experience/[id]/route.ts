import { eq } from "drizzle-orm";

import { done, notFound } from "@/server/admin-api";
import { experienceRow } from "@/server/admin-experience";
import { experienceSchema } from "@/server/admin-validation";
import { authorizeAdmin } from "@/server/auth";
import { db } from "@/server/db";
import { experiences } from "@/server/db/schema";
import { revalidateSite } from "@/server/revalidate";
import { validate } from "@/server/validation";

type Context = { params: Promise<{ id: string }> };

async function find(context: Context) {
  const id = Number((await context.params).id);
  if (!Number.isInteger(id)) return undefined;
  const [experience] = await db.select({ id: experiences.id }).from(experiences).where(eq(experiences.id, id)).limit(1);
  return experience;
}

export async function PUT(request: Request, context: Context) {
  const auth = await authorizeAdmin();
  if (auth instanceof Response) return auth;

  const experience = await find(context);
  if (!experience) return notFound("Role not found.");

  const data = await validate(request, experienceSchema);
  if (data instanceof Response) return data;

  await db.update(experiences).set(experienceRow(data)).where(eq(experiences.id, experience.id));
  revalidateSite();
  return done({ redirect: "/admin/experience", flash: "Role saved." });
}

export async function DELETE(_request: Request, context: Context) {
  const auth = await authorizeAdmin();
  if (auth instanceof Response) return auth;

  const experience = await find(context);
  if (!experience) return notFound("Role not found.");

  await db.delete(experiences).where(eq(experiences.id, experience.id));
  revalidateSite();
  return done({ redirect: "/admin/experience", flash: "Role deleted." });
}
