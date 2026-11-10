import type { Metadata } from "next";

import { getSiteContent } from "@/server/site-data";
import NotFound from "@frontend/pages/NotFound";

export const metadata: Metadata = { title: "404" };

// Shown for unknown posts, projects, tags and pages under /en and /bn (with a 404 status).
export default async function SiteNotFound() {
  const { site, cv } = await getSiteContent();
  return <NotFound site={site} cv={cv} />;
}
