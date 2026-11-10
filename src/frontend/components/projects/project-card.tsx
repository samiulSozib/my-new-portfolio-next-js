import Link from "next/link";

import { Cover } from "@frontend/components/ui/cover";
import { ArrowRightIcon, ArrowUpRightIcon, GithubIcon, StarIcon } from "@frontend/components/ui/icons";
import { Tag } from "@frontend/components/ui/tag";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { localePath, pick, type Lang } from "@frontend/lib/i18n/config";
import type { Project } from "@frontend/lib/types";

type ProjectCardProps = {
  project: Project;
  lang: Lang;
};

const statusStyles: Record<Project["status"], string> = {
  live: "bg-success-soft text-success",
  "in progress": "bg-accent-soft text-accent-text",
  archived: "bg-surface-strong text-muted",
};

// The whole card links to the project page; the external links sit above that link.
export function ProjectCard({ project, lang }: ProjectCardProps) {
  const t = getDictionary(lang).projects;
  const href = localePath(lang, `/projects/${project.slug}`);

  return (
    <article className="glow-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/10">
      <div className="relative">
        <Cover variant={project.cover ?? "code"} aspect="aspect-[16/9]" className="rounded-none" />
        <div className="absolute inset-x-3 top-3 flex justify-between gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur ${statusStyles[project.status]}`}>
            {project.status === "live" && <span aria-hidden="true" className="me-1.5 inline-block size-1.5 -translate-y-px rounded-full bg-success" />}
            {t.status[project.status]}
          </span>
          {project.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-0.5 text-xs font-semibold text-amber-200 backdrop-blur">
              <StarIcon size={12} />
              {t.featured}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-accent-text">
          <Link href={href} className="after:absolute after:inset-0">
            {pick(project.name, lang)}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-muted">{pick(project.summary, lang)}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((item) => (
            <Tag key={item} label={item} />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-sm font-semibold">
          <span className="me-auto inline-flex items-center gap-1.5 text-accent-text">
            {t.details}
            <ArrowRightIcon size={15} className="transition-transform group-hover:translate-x-1" />
          </span>
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="relative z-10 inline-flex items-center gap-1 text-muted hover:text-foreground">
              {t.visit}
              <ArrowUpRightIcon size={14} />
            </a>
          )}
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noopener noreferrer" className="relative z-10 inline-flex items-center gap-1.5 text-muted hover:text-foreground">
              <GithubIcon size={14} />
              {t.source}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
