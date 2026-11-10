import Link from "next/link";

import { PostList } from "@frontend/components/blog/post-list";
import { PageShell, PageTitle } from "@frontend/components/layout/page-shell";
import { findTagLabel, getPostsByTag } from "@frontend/lib/blog";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { formatNumber, localePath } from "@frontend/lib/i18n/config";
import type { SitePageProps } from "@frontend/lib/page-props";

export default function Tag({ lang, site, posts, cv, slug }: SitePageProps & { slug: string }) {
  const label = findTagLabel(posts, slug) ?? slug;
  const tagPosts = getPostsByTag(posts, slug);
  const t = getDictionary(lang);

  return (
    <PageShell lang={lang} site={site} cv={cv}>
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex items-center gap-2">
          <li>
            <Link href={localePath(lang, "/blog")} className="hover:text-foreground">
              {t.tags.breadcrumb}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{label}</li>
        </ol>
      </nav>
      <PageTitle eyebrow={t.blog.eyebrow} title={t.tags.heading(label)} subtitle={t.tags.count(formatNumber(tagPosts.length, lang))} />
      <div className="mt-10">
        <PostList posts={tagPosts} lang={lang} />
      </div>
    </PageShell>
  );
}
