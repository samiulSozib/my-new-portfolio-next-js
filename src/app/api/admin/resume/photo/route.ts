import { done } from "@/server/admin-api";
import { blobMissing, deleteBlob, verifyBlob } from "@/server/admin-blob";
import { authorizeAdmin } from "@/server/auth";
import type { PhotoDocument } from "@/server/resume";
import { revalidateSite } from "@/server/revalidate";
import { getSetting, storeSetting } from "@/server/settings";
import { readJson, validationError } from "@/server/validation";

/** Records a profile photo the browser has uploaded to Vercel Blob, replacing the previous one. */
export async function POST(request: Request) {
  const auth = await authorizeAdmin();
  if (auth instanceof Response) return auth;
  const missing = blobMissing();
  if (missing) return missing;

  const input = (await readJson(request)) as { url?: unknown };
  const blob = await verifyBlob("photo", input.url);
  if (typeof blob === "string") return validationError({ photo: blob });

  const previous = await getSetting<PhotoDocument>("photo");
  await storeSetting("photo", { url: blob.url, pathname: blob.pathname, uploaded_at: new Date().toISOString() });
  await deleteBlob(previous.url, blob.url);

  revalidateSite();
  return done({ flash: "Photo updated." });
}

export async function DELETE() {
  const auth = await authorizeAdmin();
  if (auth instanceof Response) return auth;

  const photo = await getSetting<PhotoDocument>("photo");
  await deleteBlob(photo.url);
  await storeSetting("photo", {});

  revalidateSite();
  return done({ flash: "Photo removed." });
}
