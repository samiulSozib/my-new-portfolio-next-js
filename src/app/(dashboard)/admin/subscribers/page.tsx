import type { Metadata } from "next";

import SubscribersIndex from "@dashboard/pages/Admin/Subscribers/Index";
import { pageNumber, subscribersIndexProps } from "@/server/admin-data";
import { requireAdmin } from "@/server/auth";

import { renderPage } from "../../render";

export const metadata: Metadata = { title: "Subscribers" };

export default async function SubscribersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const user = await requireAdmin();
  return renderPage(user, SubscribersIndex, await subscribersIndexProps(pageNumber((await searchParams).page)));
}
