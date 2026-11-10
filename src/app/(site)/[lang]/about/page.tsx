import type { Metadata } from "next";

import { langParam, pageMetadata } from "@/server/seo";
import { getSitePageProps } from "@/server/site-data";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import About from "@frontend/pages/About";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const props = await getSitePageProps(await langParam(params));
  const t = getDictionary(props.lang);
  return pageMetadata("/about", { title: t.about.eyebrow, description: props.site.about[props.lang] });
}

export default async function AboutPage({ params }: Props) {
  return <About {...await getSitePageProps(await langParam(params))} />;
}
