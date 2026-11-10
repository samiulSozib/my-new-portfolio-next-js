import Link from "next/link";

import { PostMeta } from "@frontend/components/blog/post-meta";
import { Button } from "@frontend/components/ui/button";
import { CategoryBadge } from "@frontend/components/ui/category-badge";
import { Cover } from "@frontend/components/ui/cover";
import { ArrowRightIcon } from "@frontend/components/ui/icons";
import { readingTime } from "@frontend/lib/format";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { localePath, pick, type Lang } from "@frontend/lib/i18n/config";
import type { Post } from "@frontend/lib/types";

type FeaturedPostProps = {
  post: Post;
  lang: Lang;
};

// The most recent post, shown as a wide card: cover on one side, text on the other.
export function FeaturedPost({ post, lang }: FeaturedPostProps) {
  const t = getDictionary(lang);
  const href = localePath(lang, `/blog/${post.slug}`);

  return (
    <article className="glow-card group grid overflow-hidden rounded-2xl border border-border bg-surface lg:grid-cols-[1.1fr_1fr]">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block lg:h-full">
        <Cover variant={post.cover ?? "code"} aspect="aspect-[16/9] lg:aspect-auto lg:h-full" className="rounded-none" />
      </Link>
      <div className="flex flex-col justify-center p-7 sm:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <CategoryBadge category={post.category} lang={lang} />
          <PostMeta date={post.date} readTime={readingTime(post.content[lang], lang)} lang={lang} />
        </div>
        <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
          <Link href={href} className="transition-colors group-hover:text-accent-text">
            {pick(post.title, lang)}
          </Link>
        </h3>
        <p className="mt-4 leading-7 text-muted">{pick(post.excerpt, lang)}</p>
        <div className="mt-7">
          <Button href={href}>
            {t.post.readFull}
            <ArrowRightIcon size={16} />
          </Button>
        </div>
      </div>
    </article>
  );
}
