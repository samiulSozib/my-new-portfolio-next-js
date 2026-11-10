import type { Metadata } from "next";

import ExperienceIndex from "@dashboard/pages/Admin/Experience/Index";
import { experienceIndexProps } from "@/server/admin-data";
import { requireAdmin } from "@/server/auth";

import { renderPage } from "../../render";

export const metadata: Metadata = { title: "Experience" };

export default async function ExperiencePage() {
  const user = await requireAdmin();
  return renderPage(user, ExperienceIndex, await experienceIndexProps());
}
