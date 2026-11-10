import type { CSSProperties } from "react";

import { ExperienceTimeline } from "@frontend/components/experience/experience-timeline";
import { PageShell, PageTitle } from "@frontend/components/layout/page-shell";
import { CvButton } from "@frontend/components/ui/cv-button";
import { DownloadIcon, GraduationIcon, MailIcon } from "@frontend/components/ui/icons";
import { EmptyState } from "@frontend/components/ui/empty-state";
import { formatDate, formatFileSize } from "@frontend/lib/format";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { formatNumber, pick } from "@frontend/lib/i18n/config";
import type { SitePageProps } from "@frontend/lib/page-props";

export default function Experience({ lang, site, profile, experiences, cv }: SitePageProps) {
  const t = getDictionary(lang);
  const e = t.experience;
  const companies = new Set(experiences.map((item) => item.company)).size;
  const technologies = new Set(experiences.flatMap((item) => item.stack)).size;

  const stats = [
    { label: e.stats.years, value: `${formatNumber(profile.yearsInSoftware, lang)}+` },
    { label: e.stats.roles, value: formatNumber(experiences.length, lang) },
    { label: e.stats.companies, value: formatNumber(companies, lang) },
    { label: e.stats.tech, value: formatNumber(technologies, lang) },
  ];

  return (
    <PageShell lang={lang} site={site} cv={cv}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
        <PageTitle eyebrow={e.eyebrow} title={e.title} subtitle={e.subtitle} />
        <dl className="anim-rise grid grid-cols-2 gap-3" style={{ animationDelay: "120ms" }}>
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse rounded-2xl border border-border bg-surface p-4">
              <dt className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">{stat.label}</dt>
              <dd className="text-2xl font-semibold tracking-tight sm:text-3xl">
                <span className="text-gradient">{stat.value}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section aria-label={e.title}>
          {experiences.length > 0 ? (
            <ExperienceTimeline items={experiences} lang={lang} />
          ) : (
            <EmptyState title={e.empty} message="" />
          )}
        </section>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          {/* CV download card */}
          <div className="reveal relative overflow-hidden rounded-2xl border border-border bg-surface p-6">
            <div aria-hidden="true" className="absolute -end-10 -top-10 size-32 rounded-full bg-gradient-accent opacity-20 blur-2xl" />
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent-text">
              <DownloadIcon size={20} />
            </span>
            <h2 className="mt-4 text-lg font-semibold tracking-tight">{e.cvTitle}</h2>
            {cv ? (
              <>
                <p className="mt-2 text-sm leading-6 text-muted">{e.cvBody}</p>
                <CvButton cv={cv} lang={lang} className="mt-5 w-full" />
                <p className="mt-3 text-center text-xs text-muted">
                  {t.cv.pdf(formatFileSize(cv.size, lang))}
                  {cv.updatedAt && <> · {t.cv.updated(formatDate(cv.updatedAt.slice(0, 10), lang))}</>}
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm leading-6 text-muted">{e.noCv}</p>
                {site.email && (
                  <a href={`mailto:${site.email}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-text hover:underline">
                    <MailIcon size={16} />
                    {site.email}
                  </a>
                )}
              </>
            )}
          </div>

          {/* Education */}
          {profile.education.length > 0 && (
            <div className="reveal rounded-2xl border border-border bg-surface p-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent-text">
                <GraduationIcon size={18} />
                {e.educationTitle}
              </h2>
              <ul className="mt-4 flex flex-col gap-5">
                {profile.education.map((item, index) => (
                  <li key={index}>
                    <p className="font-semibold leading-snug">{pick(item.degree, lang)}</p>
                    <p className="mt-1 text-sm text-muted">{pick(item.school, lang)}</p>
                    <p className="mt-1 font-mono text-xs text-muted">{pick(item.period, lang)}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {profile.skills.length > 0 && (
            <div className="reveal rounded-2xl border border-border bg-surface p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-text">{e.skillsTitle}</h2>
              <div className="mt-4 flex flex-col gap-4">
                {profile.skills.map((group, index) => (
                  <div key={index} style={{ "--reveal-delay": `${index * 60}ms` } as CSSProperties}>
                    <p className="text-xs font-medium text-muted">{pick(group.name, lang)}</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <li key={item} className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[11px]">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </PageShell>
  );
}
