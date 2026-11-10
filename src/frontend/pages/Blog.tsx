
import { CategoryTabs } from "@frontend/components/blog/category-tabs";
import { PostList } from "@frontend/components/blog/post-list";
import { SearchForm } from "@frontend/components/blog/search-form";
import { TagLink } from "@frontend/components/blog/tag-link";
import { PageShell, PageTitle } from "@frontend/components/layout/page-shell";
import { getAllTags, searchPosts } from "@frontend/lib/blog";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { formatNumber } from "@frontend/lib/i18n/config";
import { categories } from "@frontend/lib/types";
import type { SitePageProps } from "@frontend/lib/page-props";

// The search query and category come from the URL, so the results are rendered on the server.
export default function Blog({
  lang,
  site,
  posts,
  cv,
  q,
  category: requested,
}: SitePageProps & { q: string; category: string | null }) {
  const dict = getDictionary(lang);
  const t = dict.blog;
  const tags = getAllTags(posts);
  const query = q.trim();
  const category = categories.find((c) => c === requested);
  const results = searchPosts(posts, query, lang, category);
  const count = formatNumber(results.length, lang);

  return (
    <PageShell lang={lang} site={site} cv={cv}>
      <PageTitle eyebrow={t.eyebrow} title={t.heading} subtitle={t.subtitle} />

      <div className="anim-rise mt-10 flex flex-col gap-5 rounded-2xl border border-border bg-surface/70 p-4 backdrop-blur sm:p-5" style={{ animationDelay: "100ms" }}>
        <SearchForm query={query} lang={lang} category={category} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CategoryTabs active={category} query={query} lang={lang} />
          <p className="text-sm text-muted">
            {t.count(count)}
            {query && <> {t.matching(query)}</>}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <PostList posts={results} lang={lang} />
      </div>

      {tags.length > 0 && (
        <section aria-labelledby="topics-title" className="mt-16 border-t border-border pt-10">
          <h2 id="topics-title" className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-muted">
            {dict.post.topics}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag.slug}>
                <TagLink label={tag.label} lang={lang} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  );
}
