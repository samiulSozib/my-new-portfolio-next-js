import { getSiteContent } from "@/server/site-data";

export const dynamic = "force-dynamic";

// The site identity, the About page content, and the CV and photo links.
export async function GET() {
  const { site, profile, cv, photoUrl } = await getSiteContent();
  return Response.json({ site, profile, cv, photoUrl });
}
