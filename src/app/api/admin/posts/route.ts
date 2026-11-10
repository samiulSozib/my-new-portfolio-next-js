import { eq } from "drizzle-orm";

import { done } from "@/server/admin-api";
import { postSchema } from "@/server/admin-validation";
import { authorizeAdmin } from "@/server/auth";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { revalidateSite } from "@/server/revalidate";
import { validate, validationError } from "@/server/validation";

export async function POST(request: Request) {
  const auth = await authorizeAdmin();
  if (auth instanceof Response) return auth;

  const data = await validate(request, postSchema);
  if (data instanceof Response) return data;

  const [taken] = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, data.slug)).limit(1);
  if (taken) return validationError({ slug: "The slug has already been taken." });

  await db.insert(posts).values(data);
  revalidateSite();
  return done({ redirect: "/admin/posts", flash: "Post created." });
}
