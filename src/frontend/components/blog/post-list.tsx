import type { CSSProperties } from "react";

import { PostCard } from "@frontend/components/blog/post-card";
import { EmptyState } from "@frontend/components/ui/empty-state";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import type { Lang } from "@frontend/lib/i18n/config";
import type { Post } from "@frontend/lib/types";

type PostListProps = {
  posts: Post[];
  lang: Lang;
  emptyMessage?: string;
};

// A responsive grid of post cards that fade in as they scroll into view.
export function PostList({ posts, lang, emptyMessage }: PostListProps) {
  const t = getDictionary(lang).blog;

  if (posts.length === 0) {
    return <EmptyState title={t.emptyTitle} message={emptyMessage ?? t.emptyHint} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <div key={post.slug} className="reveal" style={{ "--reveal-delay": `${(index % 3) * 90}ms` } as CSSProperties}>
          <PostCard post={post} lang={lang} />
        </div>
      ))}
    </div>
  );
}
