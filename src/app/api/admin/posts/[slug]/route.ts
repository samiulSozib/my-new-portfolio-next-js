import { and, eq, ne } from "drizzle-orm";

import { done, notFound } from "@/server/admin-api";
import { postSchema } from "@/server/admin-validation";
import { authorizeAdmin } from "@/server/auth";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { revalidateSite } from "@/server/revalidate";
import { validate, validationError } from "@/server/validation";

type Context = { params: Promise<{ slug: string }> };

async function find(context: Context) {
  const { slug } = await context.params;
  const [post] = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug)).limit(1);
  return post;
}

export async function PUT(request: Request, context: Context) {
  const auth = await authorizeAdmin();
  if (auth instanceof Response) return auth;

  const post = await find(context);
  if (!post) return notFound("Post not found.");

  const data = await validate(request, postSchema);
  if (data instanceof Response) return data;

  const [taken] = await db
    .select({ id: posts.id })
    .from(posts)
    .where(and(eq(posts.slug, data.slug), ne(posts.id, post.id)))
    .limit(1);
  if (taken) return validationError({ slug: "The slug has already been taken." });

  await db.update(posts).set(data).where(eq(posts.id, post.id));
  revalidateSite();
  return done({ redirect: "/admin/posts", flash: "Post saved." });
}

export async function DELETE(_request: Request, context: Context) {
  const auth = await authorizeAdmin();
  if (auth instanceof Response) return auth;

  const post = await find(context);
  if (!post) return notFound("Post not found.");

  await db.delete(posts).where(eq(posts.id, post.id));
  revalidateSite();
  return done({ redirect: "/admin/posts", flash: "Post deleted." });
}
