import Link from "next/link";

import { PageShell, PageTitle } from "@frontend/components/layout/page-shell";
import { groupPostsByYear } from "@frontend/lib/blog";
import { formatDate } from "@frontend/lib/format";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { formatNumber, localePath, pick } from "@frontend/lib/i18n/config";
import type { SitePageProps } from "@frontend/lib/page-props";

export default function Archive({ lang, site, posts, cv }: SitePageProps) {
  const t = getDictionary(lang);
  const groups = groupPostsByYear(posts);

  return (
    <PageShell lang={lang} site={site} cv={cv}>
      <PageTitle eyebrow={t.archive.eyebrow} title={t.archive.title} />
      <div className="mt-12 flex flex-col gap-12">
        {[...groups.entries()].map(([year, list]) => (
          <section key={year} aria-labelledby={`year-${year}`}>
            <h2 id={`year-${year}`} className="mb-4 flex items-baseline gap-3 border-b border-border pb-3 text-2xl font-semibold tracking-tight">
              {formatNumber(Number(year), lang)}
              <span className="text-sm font-normal text-muted">{formatNumber(list.length, lang)}</span>
            </h2>
            <ul className="flex flex-col divide-y divide-border">
              {list.map((post) => (
                <li key={post.slug} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <Link href={localePath(lang, `/blog/${post.slug}`)} className="font-medium transition-colors hover:text-accent-text">
                    {pick(post.title, lang)}
                  </Link>
                  <time dateTime={post.date} className="shrink-0 text-sm text-muted">
                    {formatDate(post.date, lang)}
                  </time>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
