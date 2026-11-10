import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import type { Lang } from "@frontend/lib/i18n/config";
import type { Category } from "@frontend/lib/types";

const styles: Record<Category, string> = {
  ai: "bg-accent-soft text-accent-text ring-accent/20",
  coding: "bg-cyan-500/10 text-cyan-700 ring-cyan-500/20 dark:text-cyan-300",
  engineering: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300",
};

export function CategoryBadge({ category, lang }: { category: Category; lang: Lang }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${styles[category] ?? styles.coding}`}>
      {getDictionary(lang).categories[category] ?? category}
    </span>
  );
}
