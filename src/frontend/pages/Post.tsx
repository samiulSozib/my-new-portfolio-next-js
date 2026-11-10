import Link from "next/link";

import { ContentBlocks } from "@frontend/components/blog/content-blocks";
import { PostMeta } from "@frontend/components/blog/post-meta";
import { PostNavigation } from "@frontend/components/blog/post-navigation";
import { ReadingProgress } from "@frontend/components/blog/reading-progress";
import { RelatedPosts } from "@frontend/components/blog/related-posts";
import { ShareButtons } from "@frontend/components/blog/share-buttons";
import { TagLink } from "@frontend/components/blog/tag-link";
import { PageShell } from "@frontend/components/layout/page-shell";
import { CategoryBadge } from "@frontend/components/ui/category-badge";
import { Cover } from "@frontend/components/ui/cover";
import { getAdjacentPosts, getRelatedPosts } from "@frontend/lib/blog";
import { readingTime } from "@frontend/lib/format";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { localeTag, localePath, pick } from "@frontend/lib/i18n/config";
import type { Post as PostType } from "@frontend/lib/types";
import type { SitePageProps } from "@frontend/lib/page-props";

export default function Post({ lang, site, siteUrl, posts, cv, post }: SitePageProps & { post: PostType }) {
  const t = getDictionary(lang);
  const { newer, older } = getAdjacentPosts(posts, post.slug);
  const related = getRelatedPosts(posts, post);
  const content = post.content[lang];
  const title = pick(post.title, lang);
  const excerpt = pick(post.excerpt, lang);
  const backHref = localePath(lang, "/blog");
  const url = `${siteUrl}${localePath(lang, `/blog/${post.slug}`)}`;

  // Structured data helps search engines show the article correctly.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    datePublished: post.date,
    inLanguage: localeTag[lang],
    keywords: post.tags.join(", "),
    mainEntityOfPage: url,
  };

  return (
    <PageShell lang={lang} site={site} cv={cv}>
      <ReadingProgress />
      <div className="mx-auto w-full max-w-3xl">
      <Link href={backHref} className="text-sm font-semibold text-muted transition-colors hover:text-foreground">
        ← {t.post.back}
      </Link>

      <div className="anim-rise mt-8 overflow-hidden rounded-2xl border border-border">
        <Cover variant={post.cover ?? "code"} aspect="aspect-[21/9]" className="rounded-none" />
      </div>

      <article className="anim-rise mt-10" style={{ animationDelay: "120ms" }}>
        <div className="flex flex-wrap items-center gap-3">
          <CategoryBadge category={post.category} lang={lang} />
          <PostMeta date={post.date} readTime={readingTime(content, lang)} lang={lang} />
        </div>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-muted">{excerpt}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <TagLink key={tag} label={tag} lang={lang} />
          ))}
        </div>
        <div className="mt-10" lang={lang}>
          <ContentBlocks blocks={content} />
        </div>
      </article>

      <div className="mt-12 border-t border-border pt-8">
        <ShareButtons
          url={url}
          title={title}
          labels={{
            share: t.post.share,
            copy: t.post.copyLink,
            copied: t.post.copied,
            x: t.post.xShare,
            linkedIn: t.post.linkedIn,
          }}
        />
      </div>

      <PostNavigation newer={newer} older={older} lang={lang} />
      <RelatedPosts posts={related} lang={lang} />

      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </PageShell>
  );
}
