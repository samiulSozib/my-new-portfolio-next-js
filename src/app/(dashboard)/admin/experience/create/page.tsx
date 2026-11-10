import type { Metadata } from "next";

import ExperienceForm from "@dashboard/pages/Admin/Experience/Form";
import { experienceFormProps } from "@/server/admin-data";
import { requireAdmin } from "@/server/auth";

import { renderPage } from "../../../render";

export const metadata: Metadata = { title: "Add role" };

export default async function CreateExperiencePage() {
  const user = await requireAdmin();
  return renderPage(user, ExperienceForm, experienceFormProps(null));
}
