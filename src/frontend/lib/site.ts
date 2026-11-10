import type { Localized } from "@frontend/lib/i18n/config";

// The site identity, edited in the admin. Passed to every public page as the `site` prop.
export type Site = {
  name: Localized<string>;
  title: Localized<string>;
  description: Localized<string>;
  intro: Localized<string>;
  about: Localized<string>;
  // Focus areas. Cycled by the typewriter in the hero and listed on the About page.
  interests: Localized<string[]>;
  // For example "Open to new opportunities". Empty hides the badge.
  availability?: Localized<string>;
  // Empty strings hide that link everywhere.
  email: string;
  social: { github: string; linkedin: string; x: string };
  year: number;
};

// Primary navigation. Labels come from the dictionary, keyed by these names.
export const navItems = [
  { key: "about", path: "/about" },
  { key: "experience", path: "/experience" },
  { key: "projects", path: "/projects" },
  { key: "blog", path: "/blog" },
] as const;

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
