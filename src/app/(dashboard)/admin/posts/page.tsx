import type { Metadata } from "next";

import PostsIndex from "@dashboard/pages/Admin/Posts/Index";
import { pageNumber, postsIndexProps } from "@/server/admin-data";
import { requireAdmin } from "@/server/auth";

import { renderPage } from "../../render";

export const metadata: Metadata = { title: "Posts" };

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const user = await requireAdmin();
  return renderPage(user, PostsIndex, await postsIndexProps(pageNumber((await searchParams).page)));
}
