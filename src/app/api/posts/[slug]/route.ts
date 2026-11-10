import { and, eq } from "drizzle-orm";

import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { postResource } from "@/server/resources";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.published, true)))
    .limit(1);
  if (!post) return Response.json({ message: "Not Found." }, { status: 404 });

  return Response.json({ data: postResource(post) });
}
