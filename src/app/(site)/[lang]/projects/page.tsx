import type { Metadata } from "next";

import { langParam, pageMetadata } from "@/server/seo";
import { getSitePageProps } from "@/server/site-data";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import Projects from "@frontend/pages/Projects";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const props = await getSitePageProps(await langParam(params));
  const t = getDictionary(props.lang);
  return pageMetadata("/projects", { title: t.projects.title, description: t.projects.subtitle });
}

export default async function ProjectsPage({ params }: Props) {
  return <Projects {...await getSitePageProps(await langParam(params))} />;
}
