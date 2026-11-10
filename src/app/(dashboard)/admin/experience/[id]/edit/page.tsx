import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ExperienceForm from "@dashboard/pages/Admin/Experience/Form";
import { experienceFormProps } from "@/server/admin-data";
import { requireAdmin } from "@/server/auth";
import { db } from "@/server/db";
import { experiences } from "@/server/db/schema";

import { renderPage } from "../../../../render";

export const metadata: Metadata = { title: "Edit role" };

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [experience] = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
  if (!experience) notFound();
  return renderPage(user, ExperienceForm, experienceFormProps(experience));
}
