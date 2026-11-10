import { appUrl } from "@/server/content";

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${appUrl()}/sitemap.xml\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
