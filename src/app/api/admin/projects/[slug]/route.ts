import { and, eq, ne } from "drizzle-orm";

import { done, notFound } from "@/server/admin-api";
import { projectSchema } from "@/server/admin-validation";
import { authorizeAdmin } from "@/server/auth";
import { db } from "@/server/db";
import { projects } from "@/server/db/schema";
import { revalidateSite } from "@/server/revalidate";
import { validate, validationError } from "@/server/validation";

type Context = { params: Promise<{ slug: string }> };

async function find(context: Context) {
  const { slug } = await context.params;
  const [project] = await db.select({ id: projects.id }).from(projects).where(eq(projects.slug, slug)).limit(1);
  return project;
}

export async function PUT(request: Request, context: Context) {
  const auth = await authorizeAdmin();
  if (auth instanceof Response) return auth;

  const project = await find(context);
  if (!project) return notFound("Project not found.");

  const data = await validate(request, projectSchema);
  if (data instanceof Response) return data;

  const [taken] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.slug, data.slug), ne(projects.id, project.id)))
    .limit(1);
  if (taken) return validationError({ slug: "The slug has already been taken." });

  const { sort_order, ...rest } = data;
  await db.update(projects).set({ ...rest, sortOrder: sort_order }).where(eq(projects.id, project.id));
  revalidateSite();
  return done({ redirect: "/admin/projects", flash: "Project saved." });
}

export async function DELETE(_request: Request, context: Context) {
  const auth = await authorizeAdmin();
  if (auth instanceof Response) return auth;

  const project = await find(context);
  if (!project) return notFound("Project not found.");

  await db.delete(projects).where(eq(projects.id, project.id));
  revalidateSite();
  return done({ redirect: "/admin/projects", flash: "Project deleted." });
}
