import Link from "next/link";

import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { localePath, type Lang } from "@frontend/lib/i18n/config";

type SearchFormProps = {
  query: string;
  lang: Lang;
  category?: string;
};

// A plain GET form, so search works without JavaScript and the URL can be shared.
export function SearchForm({ query, lang, category }: SearchFormProps) {
  const t = getDictionary(lang).blog;
  const action = localePath(lang, "/blog");
  const hasFilters = query.length > 0;

  return (
    <form action={action} role="search" className="flex flex-col gap-3 sm:flex-row">
      <label htmlFor="blog-search" className="sr-only">
        {t.searchLabel}
      </label>
      {category && <input type="hidden" name="category" value={category} />}
      <input
        id="blog-search"
        name="q"
        type="search"
        defaultValue={query}
        placeholder={t.searchPlaceholder}
        className="h-11 flex-1 rounded-full border border-border-strong bg-background px-5 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex h-11 flex-1 items-center justify-center rounded-full bg-gradient-accent px-6 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 sm:flex-none"
        >
          {t.search}
        </button>
        {hasFilters && (
          <Link
            href={category ? `${action}?category=${category}` : action}
            className="flex h-11 items-center justify-center rounded-full border border-border-strong px-5 text-sm font-medium transition-colors hover:bg-surface-strong"
          >
            {t.clear}
          </Link>
        )}
      </div>
    </form>
  );
}
