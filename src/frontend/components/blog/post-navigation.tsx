import Link from "next/link";

import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { localePath, pick, type Lang } from "@frontend/lib/i18n/config";
import type { Post } from "@frontend/lib/types";

type PostNavigationProps = {
  newer?: Post;
  older?: Post;
  lang: Lang;
};

// Links to the neighbouring posts in date order.
export function PostNavigation({ newer, older, lang }: PostNavigationProps) {
  if (!newer && !older) return null;
  const t = getDictionary(lang).post;

  return (
    <nav aria-label={t.keepReading} className="mt-16 grid gap-4 border-t border-border pt-10 sm:grid-cols-2">
      {older ? (
        <Link
          href={localePath(lang, `/blog/${older.slug}`)}
          className="rounded-2xl border border-border p-5 transition-colors hover:bg-surface-strong"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-muted">← {t.older}</span>
          <span className="mt-2 block font-semibold tracking-tight">{pick(older.title, lang)}</span>
        </Link>
      ) : (
        <span />
      )}
      {newer && (
        <Link
          href={localePath(lang, `/blog/${newer.slug}`)}
          className="rounded-2xl border border-border p-5 text-start transition-colors hover:bg-surface-strong sm:text-end"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-muted">{t.newer} →</span>
          <span className="mt-2 block font-semibold tracking-tight">{pick(newer.title, lang)}</span>
        </Link>
      )}
    </nav>
  );
}
