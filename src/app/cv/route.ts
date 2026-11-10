import { throttle } from "@/server/rate-limit";
import { cvExists, downloadName, type CvDocument } from "@/server/resume";
import { getSetting, storeSetting } from "@/server/settings";

export const dynamic = "force-dynamic";

// Sends the uploaded CV (stored in Vercel Blob) as a download and counts it.
export async function GET() {
  const limited = await throttle("cv", 30, 60);
  if (limited) return limited;

  const cv = await getSetting<CvDocument>("cv");
  if (!cvExists(cv)) return new Response("Not Found", { status: 404 });

  const file = await fetch(cv.url!, { cache: "no-store" });
  if (!file.ok || !file.body) return new Response("Not Found", { status: 404 });

  await storeSetting("cv", { ...cv, downloads: Number(cv.downloads ?? 0) + 1 });

  const name = await downloadName();
  const headers = new Headers({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${name}"`,
    "Cache-Control": "no-store",
  });
  const length = file.headers.get("content-length");
  if (length) headers.set("Content-Length", length);

  return new Response(file.body, { headers });
}
