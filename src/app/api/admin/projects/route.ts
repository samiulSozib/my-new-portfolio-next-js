import { eq } from "drizzle-orm";

import { done } from "@/server/admin-api";
import { projectSchema } from "@/server/admin-validation";
import { authorizeAdmin } from "@/server/auth";
import { db } from "@/server/db";
import { projects } from "@/server/db/schema";
import { revalidateSite } from "@/server/revalidate";
import { validate, validationError } from "@/server/validation";

export async function POST(request: Request) {
  const auth = await authorizeAdmin();
  if (auth instanceof Response) return auth;

  const data = await validate(request, projectSchema);
  if (data instanceof Response) return data;

  const [taken] = await db.select({ id: projects.id }).from(projects).where(eq(projects.slug, data.slug)).limit(1);
  if (taken) return validationError({ slug: "The slug has already been taken." });

  const { sort_order, ...rest } = data;
  await db.insert(projects).values({ ...rest, sortOrder: sort_order });
  revalidateSite();
  return done({ redirect: "/admin/projects", flash: "Project created." });
}
