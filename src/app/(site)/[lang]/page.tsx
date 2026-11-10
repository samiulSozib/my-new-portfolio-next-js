import type { Metadata } from "next";

import { langParam, pageMetadata } from "@/server/seo";
import { getSitePageProps } from "@/server/site-data";
import Home from "@frontend/pages/Home";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const props = await getSitePageProps(await langParam(params));
  return pageMetadata("", { title: props.site.title[props.lang], description: props.site.description[props.lang] });
}

export default async function HomePage({ params }: Props) {
  return <Home {...await getSitePageProps(await langParam(params))} />;
}
