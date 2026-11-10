import type { Metadata } from "next";

import { langParam, pageMetadata } from "@/server/seo";
import { getSitePageProps } from "@/server/site-data";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { categories } from "@frontend/lib/types";
import Blog from "@frontend/pages/Blog";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const lang = await langParam(params);
  const dict = getDictionary(lang);
  const requested = first((await searchParams).category);
  const category = categories.find((c) => c === requested);
  return pageMetadata("/blog", { title: category ? dict.categories[category] : dict.blog.eyebrow, description: dict.blog.subtitle });
}

// The search query and category come from the URL, so the results are rendered on the server.
export default async function BlogPage({ params, searchParams }: Props) {
  const props = await getSitePageProps(await langParam(params));
  const query = await searchParams;
  return <Blog {...props} q={first(query.q) ?? ""} category={first(query.category) ?? null} />;
}
