import { appUrl } from "@/server/content";
import { publishedPosts } from "@/server/queries";
import { xml } from "@/server/seo";
import { getSetting } from "@/server/settings";

export const dynamic = "force-dynamic";

type Site = { title?: { en?: string }; description?: { en?: string } };

// RSS feed of published posts, in English.
export async function GET() {
  const base = appUrl();
  const [site, list] = await Promise.all([getSetting<Site>("site"), publishedPosts()]);

  const items = list
    .map((post) => {
      const url = `${base}/en/blog/${post.slug}`;
      const pubDate = new Date(`${post.date}T00:00:00Z`).toUTCString();
      return (
        "    <item>\n" +
        `      <title>${xml(post.title?.en ?? "")}</title>\n` +
        `      <link>${url}</link>\n` +
        `      <guid isPermaLink="true">${url}</guid>\n` +
        `      <pubDate>${pubDate}</pubDate>\n` +
        `      <description>${xml(post.excerpt?.en ?? "")}</description>\n` +
        `      <category>${xml(post.category)}</category>\n` +
        "    </item>"
      );
    })
    .join("\n");

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
    "  <channel>\n" +
    `    <title>${xml(site.title?.en ?? "")}</title>\n` +
    `    <link>${base}/en</link>\n` +
    `    <description>${xml(site.description?.en ?? "")}</description>\n` +
    "    <language>en</language>\n" +
    `    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />\n` +
    items +
    "\n" +
    "  </channel>\n" +
    "</rss>";

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
