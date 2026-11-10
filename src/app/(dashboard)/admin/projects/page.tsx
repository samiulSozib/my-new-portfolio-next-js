import type { Metadata } from "next";

import ProjectsIndex from "@dashboard/pages/Admin/Projects/Index";
import { projectsIndexProps } from "@/server/admin-data";
import { requireAdmin } from "@/server/auth";

import { renderPage } from "../../render";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const user = await requireAdmin();
  return renderPage(user, ProjectsIndex, await projectsIndexProps());
}
