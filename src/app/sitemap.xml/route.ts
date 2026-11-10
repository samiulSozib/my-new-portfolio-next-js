import { asc } from "drizzle-orm";

import { appUrl, LANGUAGES, tagSlugOf } from "@/server/content";
import { db } from "@/server/db";
import { projects } from "@/server/db/schema";
import { publishedPosts } from "@/server/queries";

export const dynamic = "force-dynamic";

// Every public page in both languages. Only published posts are listed.
export async function GET() {
  const base = appUrl();
  const entries: string[][] = [];

  const pages: [string, number][] = [["", 1], ["/blog", 0.6], ["/about", 0.8], ["/experience", 0.8], ["/projects", 0.7], ["/archive", 0.6]];
  for (const [path, priority] of pages) entries.push(entry(base, path, null, priority));

  const projectRows = await db
    .select({ slug: projects.slug, updatedAt: projects.updatedAt })
    .from(projects)
    .orderBy(asc(projects.sortOrder));
  for (const project of projectRows) {
    entries.push(entry(base, `/projects/${project.slug}`, project.updatedAt ? project.updatedAt.toISOString().slice(0, 10) : null, 0.6));
  }

  const postRows = await publishedPosts();
  for (const post of postRows) entries.push(entry(base, `/blog/${post.slug}`, post.date, 0.8));

  const tags = new Set<string>();
  for (const post of postRows) for (const tag of post.tags ?? []) tags.add(tagSlugOf(String(tag)));
  for (const slug of tags) if (slug !== "") entries.push(entry(base, `/tags/${slug}`, null, 0.3));

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    entries.flat().join("\n") +
    "\n</urlset>";

  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}

// One <url> per language, each linking to the other language versions.
function entry(base: string, path: string, lastModified: string | null, priority: number): string[] {
  const alternates = LANGUAGES.map((alt) => `      <xhtml:link rel="alternate" hreflang="${alt}" href="${base}/${alt}${path}" />\n`).join("");

  return LANGUAGES.map(
    (lang) =>
      "  <url>\n" +
      `    <loc>${base}/${lang}${path}</loc>\n` +
      (lastModified ? `    <lastmod>${lastModified}</lastmod>\n` : "") +
      "    <changefreq>weekly</changefreq>\n" +
      `    <priority>${priority}</priority>\n` +
      alternates +
      "  </url>",
  );
}
