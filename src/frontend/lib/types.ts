import type { Localized } from "@frontend/lib/i18n/config";

export type Category = "ai" | "coding" | "engineering";

export const categories: Category[] = ["ai", "coding", "engineering"];

// Illustrated cover scenes. Each one is an animated SVG drawn in components/ui/cover.tsx.
export type CoverVariant = "neural" | "circuit" | "code" | "data" | "terminal" | "orbit";

// A block of article content. Posts are plain data, so each block is a small
// object the renderer understands instead of raw HTML or MDX.
export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "quote"; text: string; source?: string }
  | { type: "list"; items: string[] }
  | { type: "code"; language: string; code: string }
  | { type: "callout"; text: string };

export type Post = {
  slug: string;
  title: Localized<string>;
  excerpt: Localized<string>;
  // ISO date (YYYY-MM-DD). Used for sorting, display, RSS and the sitemap.
  date: string;
  category: Category;
  tags: string[];
  cover?: CoverVariant;
  content: Localized<ContentBlock[]>;
};

export type ProjectStatus = "live" | "in progress" | "archived";

export type Project = {
  slug: string;
  name: Localized<string>;
  summary: Localized<string>;
  // Detail page fields. Empty strings and lists are hidden.
  role: Localized<string>;
  period: Localized<string>;
  highlights: Localized<string[]>;
  content: Localized<ContentBlock[]>;
  stack: string[];
  status: ProjectStatus;
  cover?: CoverVariant;
  url?: string;
  repo?: string;
  featured: boolean;
};

export type EmploymentType = "full-time" | "part-time" | "contract" | "freelance" | "internship";

// One role in the work history. Current roles have no end date.
export type Experience = {
  id: number;
  company: string;
  companyUrl: string | null;
  role: Localized<string>;
  employmentType: EmploymentType;
  location: Localized<string> | null;
  // ISO dates (YYYY-MM-DD).
  startDate: string;
  endDate: string | null;
  current: boolean;
  summary: Localized<string>;
  highlights: Localized<string[]>;
  stack: string[];
};

// The uploaded CV. Null when none is uploaded, which hides every download button.
export type Cv = {
  url: string;
  size: number;
  updatedAt: string;
};
