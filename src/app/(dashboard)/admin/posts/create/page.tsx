import type { Metadata } from "next";

import PostForm from "@dashboard/pages/Admin/Posts/Form";
import { postFormProps } from "@/server/admin-data";
import { requireAdmin } from "@/server/auth";

import { renderPage } from "../../../render";

export const metadata: Metadata = { title: "New post" };

export default async function CreatePostPage() {
  const user = await requireAdmin();
  return renderPage(user, PostForm, postFormProps(null));
}
