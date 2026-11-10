import type { Metadata } from "next";

import ResumeEdit from "@dashboard/pages/Admin/Resume/Edit";
import { resumeProps } from "@/server/admin-data";
import { requireAdmin } from "@/server/auth";

import { renderPage } from "../../render";

export const metadata: Metadata = { title: "Resume & photo" };

export default async function ResumePage() {
  const user = await requireAdmin();
  return renderPage(user, ResumeEdit, await resumeProps());
}
