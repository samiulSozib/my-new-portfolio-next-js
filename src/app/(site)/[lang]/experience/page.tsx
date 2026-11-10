import type { Metadata } from "next";

import { langParam, pageMetadata } from "@/server/seo";
import { getSitePageProps } from "@/server/site-data";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import Experience from "@frontend/pages/Experience";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const props = await getSitePageProps(await langParam(params));
  const t = getDictionary(props.lang);
  return pageMetadata("/experience", { title: t.experience.eyebrow, description: t.experience.subtitle });
}

export default async function ExperiencePage({ params }: Props) {
  return <Experience {...await getSitePageProps(await langParam(params))} />;
}
