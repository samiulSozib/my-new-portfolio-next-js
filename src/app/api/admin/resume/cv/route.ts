import { done } from "@/server/admin-api";
import { blobMissing, deleteBlob, verifyBlob } from "@/server/admin-blob";
import { authorizeAdmin } from "@/server/auth";
import type { CvDocument } from "@/server/resume";
import { revalidateSite } from "@/server/revalidate";
import { getSetting, storeSetting } from "@/server/settings";
import { readJson, validationError } from "@/server/validation";

/** Records a CV the browser has uploaded to Vercel Blob, replacing the previous one. */
export async function POST(request: Request) {
  const auth = await authorizeAdmin();
  if (auth instanceof Response) return auth;
  const missing = blobMissing();
  if (missing) return missing;

  const input = (await readJson(request)) as { url?: unknown; name?: unknown };
  const blob = await verifyBlob("cv", input.url);
  if (typeof blob === "string") return validationError({ cv: blob });

  const previous = await getSetting<CvDocument>("cv");
  const name = typeof input.name === "string" && input.name.trim() !== "" ? input.name.trim().slice(0, 255) : "cv.pdf";

  await storeSetting("cv", {
    url: blob.url,
    pathname: blob.pathname,
    name,
    size: blob.size,
    uploaded_at: new Date().toISOString(),
    // Keep counting across replacements, so the dashboard shows lifetime downloads.
    downloads: Number(previous.downloads ?? 0),
  });
  await deleteBlob(previous.url, blob.url);

  revalidateSite();
  return done({ flash: "CV uploaded." });
}

export async function DELETE() {
  const auth = await authorizeAdmin();
  if (auth instanceof Response) return auth;

  const cv = await getSetting<CvDocument>("cv");
  await deleteBlob(cv.url);
  await storeSetting("cv", { downloads: Number(cv.downloads ?? 0) });

  revalidateSite();
  return done({ flash: "CV removed." });
}
