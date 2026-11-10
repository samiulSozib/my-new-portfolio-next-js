import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { langParam, pageMetadata } from "@/server/seo";
import { getSitePageProps } from "@/server/site-data";
import { getPostBySlug } from "@frontend/lib/blog";
import { pick } from "@frontend/lib/i18n/config";
import Post from "@frontend/pages/Post";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; slug: string }> };

async function load({ params }: Props) {
  const props = await getSitePageProps(await langParam(params));
  const post = getPostBySlug(props.posts, (await params).slug);
  if (!post) notFound();
  return { props, post };
}

export async function generateMetadata(input: Props): Promise<Metadata> {
  const { props, post } = await load(input);
  const title = pick(post.title, props.lang);
  const description = pick(post.excerpt, props.lang);
  return pageMetadata(`/blog/${post.slug}`, {
    title,
    description,
    // The og:image comes from the opengraph-image route next to this page.
    openGraph: { type: "article", title, description, url: `/${props.lang}/blog/${post.slug}` },
    twitter: { card: "summary_large_image" },
  });
}

export default async function PostPage(input: Props) {
  const { props, post } = await load(input);
  return <Post {...props} post={post} />;
}
