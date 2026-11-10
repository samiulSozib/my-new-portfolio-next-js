import type { Metadata } from "next";

import ProjectForm from "@dashboard/pages/Admin/Projects/Form";
import { projectFormProps } from "@/server/admin-data";
import { requireAdmin } from "@/server/auth";

import { renderPage } from "../../../render";

export const metadata: Metadata = { title: "New project" };

export default async function CreateProjectPage() {
  const user = await requireAdmin();
  return renderPage(user, ProjectForm, projectFormProps(null));
}
