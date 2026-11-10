import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { langParam, pageMetadata } from "@/server/seo";
import { getSitePageProps } from "@/server/site-data";
import { pick } from "@frontend/lib/i18n/config";
import Project from "@frontend/pages/Project";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; slug: string }> };

async function load({ params }: Props) {
  const props = await getSitePageProps(await langParam(params));
  const { slug } = await params;
  const project = props.projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return { props, project };
}

export async function generateMetadata(input: Props): Promise<Metadata> {
  const { props, project } = await load(input);
  const title = pick(project.name, props.lang);
  const description = pick(project.summary, props.lang);
  return pageMetadata(`/projects/${project.slug}`, {
    title,
    description,
    openGraph: { type: "website", title, description, url: `/${props.lang}/projects/${project.slug}` },
  });
}

export default async function ProjectPage(input: Props) {
  const { props, project } = await load(input);
  return <Project {...props} project={project} />;
}
