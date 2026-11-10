import type { Metadata } from "next";

import SiteEdit from "@dashboard/pages/Admin/Site/Edit";
import { requireAdmin } from "@/server/auth";
import { getSetting } from "@/server/settings";

import { renderPage } from "../../render";

export const metadata: Metadata = { title: "Site settings" };

export default async function SitePage() {
  const user = await requireAdmin();
  return renderPage(user, SiteEdit, { site: await getSetting("site") });
}
