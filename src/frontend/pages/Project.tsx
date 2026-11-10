import Link from "next/link";
import type { CSSProperties } from "react";

import { ContentBlocks } from "@frontend/components/blog/content-blocks";
import { PostList } from "@frontend/components/blog/post-list";
import { PageShell } from "@frontend/components/layout/page-shell";
import { ProjectCard } from "@frontend/components/projects/project-card";
import { Cover } from "@frontend/components/ui/cover";
import { ArrowUpRightIcon, BriefcaseIcon, CalendarIcon, CodeIcon, GithubIcon, SparkIcon, StarIcon } from "@frontend/components/ui/icons";
import { SectionHeading } from "@frontend/components/ui/section-heading";
import { tagSlug } from "@frontend/lib/format";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { localePath, pick } from "@frontend/lib/i18n/config";
import type { SitePageProps } from "@frontend/lib/page-props";
import type { Post, Project as ProjectType } from "@frontend/lib/types";

const statusStyles: Record<ProjectType["status"], string> = {
  live: "bg-success-soft text-success",
  "in progress": "bg-accent-soft text-accent-text",
  archived: "bg-surface-strong text-muted",
};

// Articles whose tags mention one of the project's technologies.
function relatedPosts(posts: Post[], project: ProjectType): Post[] {
  const stack = new Set(project.stack.map(tagSlug));
  return posts.filter((post) => post.tags.some((tag) => stack.has(tagSlug(tag)))).slice(0, 3);
}

export default function Project({ lang, site, siteUrl, posts, projects, cv, project }: SitePageProps & { project: ProjectType }) {
  const t = getDictionary(lang).projects;
  const name = pick(project.name, lang);
  const summary = pick(project.summary, lang);
  const role = pick(project.role, lang);
  const period = pick(project.period, lang);
  const highlights = pick(project.highlights, lang);
  const content = pick(project.content, lang);
  const others = projects.filter((other) => other.slug !== project.slug).slice(0, 3);
  const related = relatedPosts(posts, project);
  const url = `${siteUrl}${localePath(lang, `/projects/${project.slug}`)}`;

  const facts = [
    role && { label: t.role, value: role, Icon: BriefcaseIcon },
    period && { label: t.period, value: period, Icon: CalendarIcon },
  ].filter(Boolean) as { label: string; value: string; Icon: typeof BriefcaseIcon }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description: summary,
    url,
    keywords: project.stack.join(", "),
    author: { "@type": "Person", name: site.name.en },
    ...(project.url ? { sameAs: project.url } : {}),
  };

  return (
    <PageShell lang={lang} site={site} cv={cv}>

      <Link href={localePath(lang, "/projects")} className="text-sm font-semibold text-muted transition-colors hover:text-foreground">
        ← {t.back}
      </Link>

      {/* Header */}
      <header className="anim-rise mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-text">
              <span aria-hidden="true" className="h-px w-6 bg-accent" />
              {t.label}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[project.status]}`}>
              {project.status === "live" && <span aria-hidden="true" className="me-1.5 inline-block size-1.5 -translate-y-px rounded-full bg-success" />}
              {t.status[project.status]}
            </span>
            {project.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                <StarIcon size={12} />
                {t.featured}
              </span>
            )}
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            <span className="text-gradient">{name}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted">{summary}</p>
          {(project.url || project.repo) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-accent px-5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25"
                >
                  {t.visit}
                  <ArrowUpRightIcon size={16} />
                </a>
              )}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-border-strong px-5 text-sm font-semibold transition-colors hover:bg-surface-strong"
                >
                  <GithubIcon size={16} />
                  {t.source}
                </a>
              )}
            </div>
          )}
        </div>
        <div className="relative">
          <div aria-hidden="true" className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-accent opacity-20 blur-3xl" />
          <div className="overflow-hidden rounded-2xl border border-border shadow-2xl shadow-accent/10">
            <Cover variant={project.cover ?? "code"} aspect="aspect-[16/10]" className="rounded-none" />
          </div>
        </div>
      </header>

      {/* Body and facts */}
      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          {highlights.length > 0 && (
            <section aria-labelledby="highlights-title" className="reveal">
              <h2 id="highlights-title" className="text-sm font-semibold uppercase tracking-wider text-accent-text">
                {t.highlights}
              </h2>
              <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {highlights.map((item, index) => (
                  <li
                    key={item}
                    className="glow-card flex gap-3 rounded-2xl border border-border bg-surface p-4"
                    style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
                      <SparkIcon size={16} />
                    </span>
                    <span className="text-sm leading-6">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {content.length > 0 && (
            <section aria-labelledby="overview-title" className={`reveal ${highlights.length > 0 ? "mt-14" : ""}`}>
              <h2 id="overview-title" className="mb-6 text-sm font-semibold uppercase tracking-wider text-accent-text">
                {t.overview}
              </h2>
              <div lang={lang}>
                <ContentBlocks blocks={content} />
              </div>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="reveal rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-text">{t.facts}</h2>
            <dl className="mt-5 flex flex-col gap-5">
              {facts.map(({ label, value, Icon }) => (
                <div key={label} className="flex gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
                    <Icon size={16} />
                  </span>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted">{label}</dt>
                    <dd className="mt-0.5 font-semibold">{value}</dd>
                  </div>
                </div>
              ))}
              {project.stack.length > 0 && (
                <div className="flex gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
                    <CodeIcon size={16} />
                  </span>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted">{t.stack}</dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <span key={tech} className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[11px]">
                          {tech}
                        </span>
                      ))}
                    </dd>
                  </div>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mt-24">
          <SectionHeading id="related-title" eyebrow={getDictionary(lang).nav.blog} title={t.related} />
          <PostList posts={related} lang={lang} />
        </section>
      )}

      {others.length > 0 && (
        <section aria-labelledby="more-title" className="mt-24">
          <SectionHeading id="more-title" eyebrow={t.eyebrow} title={t.more} href={localePath(lang, "/projects")} linkLabel={t.back} />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other) => (
              <div key={other.slug} className="reveal">
                <ProjectCard project={other} lang={lang} />
              </div>
            ))}
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </PageShell>
  );
}
