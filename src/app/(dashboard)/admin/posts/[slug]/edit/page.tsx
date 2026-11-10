import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PostForm from "@dashboard/pages/Admin/Posts/Form";
import { postFormProps } from "@/server/admin-data";
import { requireAdmin } from "@/server/auth";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";

import { renderPage } from "../../../../render";

export const metadata: Metadata = { title: "Edit post" };

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await requireAdmin();
  const { slug } = await params;
  const [post] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  if (!post) notFound();
  return renderPage(user, PostForm, postFormProps(post));
}
