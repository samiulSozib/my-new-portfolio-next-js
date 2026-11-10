/**
 * Allowed values for the content types. The public site and the admin forms both read these,
 * so a new cover or block type only needs to be added here and in the renderer.
 */
export const CATEGORIES = ["ai", "coding", "engineering"] as const;

export const CATEGORY_LABELS: Record<(typeof CATEGORIES)[number], string> = {
  ai: "AI & ML",
  coding: "Coding",
  engineering: "Engineering",
};

export const COVERS = ["neural", "circuit", "code", "data", "terminal", "orbit"] as const;

export const PROJECT_STATUSES = ["live", "in progress", "archived"] as const;

export const EMPLOYMENT_TYPES = ["full-time", "part-time", "contract", "freelance", "internship"] as const;

export const BLOCK_TYPES = ["paragraph", "heading", "quote", "list", "code", "callout"] as const;

export const LANGUAGES = ["en", "bn"] as const;

/** Same rule as the site's tagSlug(): "Next.js" and "next.js" both become "next-js". */
export function tagSlugOf(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The public base URL, without a trailing slash. */
export function appUrl(): string {
  const configured =
    process.env.APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
    "http://localhost:3000";
  return configured.replace(/\/+$/, "");
}
