import "server-only";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LANGUAGES } from "@/server/content";
import { isLang, type Lang } from "@frontend/lib/i18n/config";

/** Reads the [lang] route param. Anything other than en/bn is a 404. */
export async function langParam(params: Promise<{ lang: string }>): Promise<Lang> {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return lang;
}

/**
 * Metadata for a public page: the title and description, plus links to the page in the other language
 * (hreflang), as the sitemap does. `path` is the page path after the language, for example "/blog".
 */
export function pageMetadata(
  path: string,
  { title, description, openGraph, twitter }: Pick<Metadata, "openGraph" | "twitter"> & { title: string; description?: string },
): Metadata {
  return {
    title,
    description: description || undefined,
    alternates: {
      languages: Object.fromEntries(LANGUAGES.map((lang) => [lang, `/${lang}${path}`])),
    },
    openGraph,
    twitter,
  };
}

/** Escapes text for XML (feed and sitemap). */
export function xml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
