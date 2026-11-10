import type { Metadata } from "next";

import Dashboard from "@dashboard/pages/Admin/Dashboard";
import { dashboardProps } from "@/server/admin-data";
import { requireAdmin } from "@/server/auth";

import { renderPage } from "../render";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireAdmin();
  return renderPage(user, Dashboard, await dashboardProps());
}
