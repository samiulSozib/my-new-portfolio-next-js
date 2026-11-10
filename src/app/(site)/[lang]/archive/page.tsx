import type { Metadata } from "next";

import { langParam, pageMetadata } from "@/server/seo";
import { getSitePageProps } from "@/server/site-data";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import Archive from "@frontend/pages/Archive";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const props = await getSitePageProps(await langParam(params));
  const t = getDictionary(props.lang);
  return pageMetadata("/archive", { title: t.archive.title, description: undefined });
}

export default async function ArchivePage({ params }: Props) {
  return <Archive {...await getSitePageProps(await langParam(params))} />;
}
