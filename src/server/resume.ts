import "server-only";

import { getSetting } from "@/server/settings";

/**
 * The uploaded CV and profile photo. Both files live in Vercel Blob; the settings documents
 * hold their URLs. The CV is always downloaded through the /cv route, so every download is counted.
 *
 * settings.cv    = { url, pathname, name, size, uploaded_at, downloads }
 * settings.photo = { url, pathname, uploaded_at }
 */
export type CvDocument = {
  url?: string;
  pathname?: string;
  name?: string;
  size?: number;
  uploaded_at?: string;
  downloads?: number;
};

export type PhotoDocument = { url?: string; pathname?: string; uploaded_at?: string };

export function cvExists(cv: CvDocument): boolean {
  return typeof cv.url === "string" && cv.url !== "";
}

/** What the public site needs to show a download button, or null when no CV is uploaded. */
export async function publicCv(): Promise<{ url: string; size: number; updatedAt: string } | null> {
  const cv = await getSetting<CvDocument>("cv");
  if (!cvExists(cv)) return null;
  return { url: "/cv", size: Number(cv.size ?? 0), updatedAt: String(cv.uploaded_at ?? "") };
}

export async function photoUrl(): Promise<string | null> {
  const photo = await getSetting<PhotoDocument>("photo");
  return typeof photo.url === "string" && photo.url !== "" ? photo.url : null;
}

/** The file name visitors get, for example "Samiul-Bashar-CV.pdf". */
export async function downloadName(): Promise<string> {
  const site = await getSetting<{ name?: { en?: string } }>("site");
  const name = String(site.name?.en ?? "");
  const slug = name.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${slug !== "" ? slug : "CV"}-CV.pdf`;
}
