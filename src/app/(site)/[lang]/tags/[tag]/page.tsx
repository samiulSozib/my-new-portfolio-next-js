import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { langParam, pageMetadata } from "@/server/seo";
import { getSitePageProps } from "@/server/site-data";
import { findTagLabel } from "@frontend/lib/blog";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import Tag from "@frontend/pages/Tag";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; tag: string }> };

// Unknown tags (no published post uses them) are a 404.
async function load({ params }: Props) {
  const props = await getSitePageProps(await langParam(params));
  const { tag } = await params;
  const label = findTagLabel(props.posts, tag);
  if (label === undefined) notFound();
  return { props, tag, label };
}

export async function generateMetadata(input: Props): Promise<Metadata> {
  const { props, tag, label } = await load(input);
  return pageMetadata(`/tags/${tag}`, { title: getDictionary(props.lang).tags.heading(label) });
}

export default async function TagPage(input: Props) {
  const { props, tag } = await load(input);
  return <Tag {...props} slug={tag} />;
}
