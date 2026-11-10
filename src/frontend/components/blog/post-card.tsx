import Link from "next/link";

import { PostMeta } from "@frontend/components/blog/post-meta";
import { CategoryBadge } from "@frontend/components/ui/category-badge";
import { Cover } from "@frontend/components/ui/cover";
import { ArrowRightIcon } from "@frontend/components/ui/icons";
import { readingTime } from "@frontend/lib/format";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { localePath, pick, type Lang } from "@frontend/lib/i18n/config";
import type { Post } from "@frontend/lib/types";

type PostCardProps = {
  post: Post;
  lang: Lang;
};

// A grid card: cover, category, metadata, title, excerpt.
export function PostCard({ post, lang }: PostCardProps) {
  const t = getDictionary(lang).post;
  const href = localePath(lang, `/blog/${post.slug}`);

  return (
    <article className="glow-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10">
      <Cover variant={post.cover ?? "code"} aspect="aspect-[16/9]" className="rounded-none" />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-3">
          <CategoryBadge category={post.category} lang={lang} />
          <PostMeta date={post.date} readTime={readingTime(post.content[lang], lang)} lang={lang} />
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight">
          {/* The link covers the whole card. */}
          <Link href={href} className="transition-colors after:absolute after:inset-0 group-hover:text-accent-text">
            {pick(post.title, lang)}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-muted">{pick(post.excerpt, lang)}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-text">
          {t.readMore}
          <ArrowRightIcon size={15} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
