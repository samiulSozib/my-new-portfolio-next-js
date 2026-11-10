import "server-only";

import { del, head } from "@vercel/blob";

/** Uploads need a Vercel Blob store. Returns an error response when it is not configured. */
export function blobMissing(): Response | null {
  if (process.env.BLOB_READ_WRITE_TOKEN) return null;
  return Response.json({ message: "File uploads need a Vercel Blob store: set BLOB_READ_WRITE_TOKEN." }, { status: 500 });
}

export const UPLOAD_RULES = {
  cv: { folder: "cv/", contentTypes: ["application/pdf"], maxBytes: 10 * 1024 * 1024 },
  photo: { folder: "profile/", contentTypes: ["image/jpeg", "image/png", "image/webp"], maxBytes: 4 * 1024 * 1024 },
} as const;

export type UploadKind = keyof typeof UPLOAD_RULES;

/**
 * Confirms that the URL the browser reports is a blob in our store, in the right folder, of an allowed type and size.
 * Returns the blob's metadata, or an error message.
 */
export async function verifyBlob(kind: UploadKind, url: unknown): Promise<{ url: string; pathname: string; size: number } | string> {
  if (typeof url !== "string" || url === "") return "The upload is missing.";
  const rules = UPLOAD_RULES[kind];
  try {
    const blob = await head(url);
    if (!blob.pathname.startsWith(rules.folder)) return "The upload is not in the expected folder.";
    if (!(rules.contentTypes as readonly string[]).includes(blob.contentType)) {
      return kind === "cv" ? "The CV must be a PDF file." : "The photo must be a JPG, PNG or WebP image.";
    }
    if (blob.size > rules.maxBytes) return kind === "cv" ? "The CV may not be larger than 10 MB." : "The photo may not be larger than 4 MB.";
    return { url: blob.url, pathname: blob.pathname, size: blob.size };
  } catch {
    return "The uploaded file could not be found. Please upload it again.";
  }
}

/** Deletes a blob, ignoring failures (the file may already be gone). */
export async function deleteBlob(url: unknown, keep?: string): Promise<void> {
  if (typeof url !== "string" || url === "" || url === keep) return;
  try {
    await del(url);
  } catch (error) {
    console.warn("Could not delete blob", url, error);
  }
}
