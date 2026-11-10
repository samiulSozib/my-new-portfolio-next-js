import type { CSSProperties } from "react";

import { PageShell, PageTitle } from "@frontend/components/layout/page-shell";
import { ProjectCard } from "@frontend/components/projects/project-card";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { formatNumber } from "@frontend/lib/i18n/config";
import type { SitePageProps } from "@frontend/lib/page-props";

export default function Projects({ lang, site, projects, cv }: SitePageProps) {
  const t = getDictionary(lang).projects;
  const stats = [
    { label: t.stats.total, value: projects.length },
    { label: t.stats.live, value: projects.filter((p) => p.status === "live").length },
    { label: t.stats.building, value: projects.filter((p) => p.status === "in progress").length },
  ];

  return (
    <PageShell lang={lang} site={site} cv={cv}>
      <PageTitle eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse">
              <dt className="text-xs font-medium uppercase tracking-wider text-muted">{stat.label}</dt>
              <dd className="text-3xl font-semibold tracking-tight">
                <span className="text-gradient">{formatNumber(stat.value, lang)}</span>
              </dd>
            </div>
          ))}
        </dl>
      </PageTitle>
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <div key={project.slug} className="reveal" style={{ "--reveal-delay": `${(index % 3) * 90}ms` } as CSSProperties}>
            <ProjectCard project={project} lang={lang} />
          </div>
        ))}
      </div>
    </PageShell>
  );
}
