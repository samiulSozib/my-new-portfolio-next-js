import Link from "next/link";

import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { localePath, type Lang } from "@frontend/lib/i18n/config";
import { categories, type Category } from "@frontend/lib/types";

type CategoryTabsProps = {
  active?: Category;
  query?: string;
  lang: Lang;
};

// Filter links keep the search query so filters and search can be combined.
export function CategoryTabs({ active, query, lang }: CategoryTabsProps) {
  const dict = getDictionary(lang);
  const t = dict.blog;
  const tabs: { label: string; value?: Category }[] = [
    { label: t.all },
    ...categories.map((value) => ({ label: dict.categories[value], value })),
  ];

  return (
    <nav aria-label={t.filterLabel}>
      <ul className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = tab.value === active;
          const params = new URLSearchParams();
          if (tab.value) params.set("category", tab.value);
          if (query) params.set("q", query);
          const qs = params.toString();
          const base = localePath(lang, "/blog");

          return (
            <li key={tab.label}>
              <Link
                href={qs ? `${base}?${qs}` : base}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-gradient-accent text-accent-foreground shadow-md shadow-accent/20"
                    : "border border-border-strong text-muted hover:bg-surface-strong hover:text-foreground"
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
