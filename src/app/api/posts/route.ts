import { and, desc, eq } from "drizzle-orm";

import { CATEGORIES } from "@/server/content";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { postResource } from "@/server/resources";
import { validationError } from "@/server/validation";

export const dynamic = "force-dynamic";

// Published posts, newest first. Drafts never leave the server. Optional ?category= filter.
export async function GET(request: Request) {
  const category = new URL(request.url).searchParams.get("category");
  if (category && !(CATEGORIES as readonly string[]).includes(category)) {
    return validationError({ category: "The selected category is invalid." });
  }

  const rows = await db
    .select()
    .from(posts)
    .where(category ? and(eq(posts.published, true), eq(posts.category, category)) : eq(posts.published, true))
    .orderBy(desc(posts.date), desc(posts.id));

  return Response.json({ data: rows.map(postResource) });
}
