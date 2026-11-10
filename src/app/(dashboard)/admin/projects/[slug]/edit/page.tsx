import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectForm from "@dashboard/pages/Admin/Projects/Form";
import { projectFormProps } from "@/server/admin-data";
import { requireAdmin } from "@/server/auth";
import { db } from "@/server/db";
import { projects } from "@/server/db/schema";

import { renderPage } from "../../../../render";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await requireAdmin();
  const { slug } = await params;
  const [project] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  if (!project) notFound();
  return renderPage(user, ProjectForm, projectFormProps(project));
}
