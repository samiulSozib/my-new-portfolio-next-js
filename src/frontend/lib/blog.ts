import { tagSlug } from "@frontend/lib/format";
import type { Lang } from "@frontend/lib/i18n/config";
import type { Category, ContentBlock, Post } from "@frontend/lib/types";

// All helpers below work on the published posts list that the server passes to each page.
// The list is already newest first and contains only published posts.

export function getPostBySlug(posts: Post[], slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getPostsByCategory(posts: Post[], category: Category): Post[] {
  return posts.filter((post) => post.category === category);
}

export function getPostsByTag(posts: Post[], slug: string): Post[] {
  return posts.filter((post) => post.tags.some((tag) => tagSlug(tag) === slug));
}

// Tags are grouped by slug, so "Next.js" and "next.js" count as one tag.
export function getAllTags(posts: Post[]): { label: string; slug: string; count: number }[] {
  const map = new Map<string, { label: string; slug: string; count: number }>();
  for (const post of posts) {
    for (const tag of post.tags) {
      const slug = tagSlug(tag);
      const entry = map.get(slug);
      if (entry) entry.count += 1;
      else map.set(slug, { label: tag, slug, count: 1 });
    }
  }
  return [...map.values()].sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label),
  );
}

export function findTagLabel(posts: Post[], slug: string): string | undefined {
  return getAllTags(posts).find((tag) => tag.slug === slug)?.label;
}

function blockText(block: ContentBlock): string {
  if (block.type === "list") return block.items.join(" ");
  if (block.type === "code") return "";
  return block.text;
}

// Case-insensitive match on title, excerpt, tags, and body text in one language.
export function searchPosts(posts: Post[], query: string, lang: Lang, category?: Category): Post[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return posts.filter((post) => {
    if (category && post.category !== category) return false;
    if (terms.length === 0) return true;
    const haystack = [
      post.title[lang],
      post.excerpt[lang],
      post.tags.join(" "),
      post.content[lang].map(blockText).join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

// The posts before and after the given one in date order.
export function getAdjacentPosts(posts: Post[], slug: string): { newer?: Post; older?: Post } {
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return {};
  return {
    newer: index > 0 ? posts[index - 1] : undefined,
    older: index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

// Posts that share a tag or category with the given one, most relevant first.
export function getRelatedPosts(posts: Post[], post: Post, limit = 3): Post[] {
  return posts
    .filter((other) => other.slug !== post.slug)
    .map((other) => {
      const shared = other.tags.filter((tag) =>
        post.tags.some((t) => tagSlug(t) === tagSlug(tag)),
      ).length;
      const score = shared * 2 + (other.category === post.category ? 1 : 0);
      return { other, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ other }) => other);
}

export function groupPostsByYear(list: Post[]): Map<string, Post[]> {
  const groups = new Map<string, Post[]>();
  for (const post of list) {
    const year = post.date.slice(0, 4);
    const bucket = groups.get(year);
    if (bucket) bucket.push(post);
    else groups.set(year, [post]);
  }
  return groups;
}
