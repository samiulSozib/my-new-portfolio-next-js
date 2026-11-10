import type { Metadata } from "next";

import ProfileEdit from "@dashboard/pages/Profile/Edit";
import { requireUser } from "@/server/auth";

import { renderPage } from "../render";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ forbidden?: string }> }) {
  const user = await requireUser();
  const { forbidden } = await searchParams;
  return renderPage(user, ProfileEdit, { forbidden: forbidden === "1" && !user.isAdmin });
}
