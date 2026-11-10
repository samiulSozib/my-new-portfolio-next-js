import Link from "next/link";

import { formatDate, readingTime } from "@frontend/lib/format";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { localePath, pick, type Lang } from "@frontend/lib/i18n/config";
import type { Post } from "@frontend/lib/types";

type RelatedPostsProps = {
  posts: Post[];
  lang: Lang;
};

export function RelatedPosts({ posts, lang }: RelatedPostsProps) {
  if (posts.length === 0) return null;
  const t = getDictionary(lang).post;

  return (
    <section aria-labelledby="related-title" className="mt-16">
      <h2 id="related-title" className="mb-6 text-xl font-semibold tracking-tight">
        {t.keepReading}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={localePath(lang, `/blog/${post.slug}`)}
              className="block h-full rounded-2xl border border-border p-5 transition-all hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface"
            >
              <span className="text-xs text-muted">
                {formatDate(post.date, lang)} · {readingTime(post.content[lang], lang)}
              </span>
              <span className="mt-2 block font-semibold tracking-tight">{pick(post.title, lang)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
