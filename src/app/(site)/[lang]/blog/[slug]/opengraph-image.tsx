import { readFile } from "node:fs/promises";
import path from "node:path";

import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import { CATEGORY_LABELS } from "@/server/content";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { getSetting } from "@/server/settings";

/*
 * The 1200x630 preview card shared when a post link is posted on social media.
 * Drawn with the bundled Geist font, so it does not depend on fonts installed on the server.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Article preview";

const PADDING = 72;
const MAX_TITLE_LINES = 4;

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { slug } = await params;
  const [post] = await db
    .select({ title: posts.title, category: posts.category })
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.published, true)))
    .limit(1);
  if (!post) notFound();

  const site = await getSetting<{ name?: { en?: string }; title?: { en?: string } }>("site");
  const title = String(post.title?.en || site.title?.en || "");
  const label = CATEGORY_LABELS[post.category as keyof typeof CATEGORY_LABELS] ?? "Blog";
  const siteName = String(site.name?.en ?? "");

  // Literal paths, so Vercel's file tracing bundles the fonts with this function.
  const [regular, bold] = await Promise.all([
    readFile(path.join(process.cwd(), "src/assets/fonts/Geist-Regular.ttf")),
    readFile(path.join(process.cwd(), "src/assets/fonts/Geist-Bold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: PADDING,
          background: "#0b0d1a",
          fontFamily: "Geist",
        }}
      >
        <div style={{ fontSize: 28, color: "#a5a8c7" }}>{label}</div>
        <div
          style={{
            display: "block",
            fontSize: 68,
            fontWeight: 700,
            lineHeight: "78px",
            color: "#f4f4f8",
            lineClamp: MAX_TITLE_LINES,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 28, color: "#a5a8c7" }}>{siteName}</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: bold, weight: 700, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=3600" },
    },
  );
}
