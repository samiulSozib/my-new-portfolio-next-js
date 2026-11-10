import type { Metadata } from "next";

import AboutEdit from "@dashboard/pages/Admin/About/Edit";
import { requireAdmin } from "@/server/auth";
import { getSetting } from "@/server/settings";

import { renderPage } from "../../render";

export const metadata: Metadata = { title: "About & skills" };

export default async function AboutPage() {
  const user = await requireAdmin();
  return renderPage(user, AboutEdit, { profile: await getSetting("profile") });
}
