import { NeuralCanvas } from "@frontend/components/ai/neural-canvas";
import { TerminalCard } from "@frontend/components/ai/terminal-card";
import { Typewriter } from "@frontend/components/ai/typewriter";
import { SocialLinks } from "@frontend/components/layout/social-links";
import { Button } from "@frontend/components/ui/button";
import { CvButton } from "@frontend/components/ui/cv-button";
import { ArrowRightIcon, MailIcon } from "@frontend/components/ui/icons";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { formatNumber, localePath, pick, type Lang } from "@frontend/lib/i18n/config";
import type { SitePageProps } from "@frontend/lib/page-props";

type HeroProps = Pick<SitePageProps, "site" | "profile" | "projects" | "experiences" | "posts" | "cv"> & { lang: Lang };

export function Hero({ lang, site, profile, projects, experiences, posts, cv }: HeroProps) {
  const t = getDictionary(lang).hero;
  const name = site.name[lang];
  const role = pick(profile.role, lang);
  const focus = site.interests[lang];
  const availability = site.availability?.[lang];
  const current = experiences.find((item) => item.current);

  const stats = [
    { label: t.stats.years, value: `${formatNumber(profile.yearsInSoftware, lang)}+` },
    { label: t.stats.projects, value: formatNumber(projects.length, lang) },
    { label: t.stats.roles, value: formatNumber(experiences.length, lang) },
    { label: t.stats.articles, value: formatNumber(posts.length, lang) },
  ];

  const terminal = [
    { kind: "command" as const, text: "whoami" },
    { kind: "accent" as const, text: name },
    { kind: "output" as const, text: role },
    { kind: "command" as const, text: "cat focus.txt" },
    ...focus.slice(0, 3).map((item) => ({ kind: "output" as const, text: item, prefix: "▹" })),
    ...(current
      ? [
          { kind: "command" as const, text: "status --now" },
          { kind: "accent" as const, text: `${t.now}: ${pick(current.role, lang)} ${t.at} ${current.company}` },
        ]
      : []),
  ];

  return (
    <section className="relative isolate -mx-4 overflow-hidden px-4 pb-14 pt-10 sm:mx-0 sm:rounded-[2rem] sm:border sm:border-border sm:px-10 sm:pb-16 sm:pt-16 lg:px-14">
      {/* Background: aurora light, a faint grid, and the live neural network. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="aurora absolute -inset-20" />
        <div className="bg-grid absolute inset-0" />
        <NeuralCanvas className="absolute inset-0 opacity-70 dark:opacity-90" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="anim-rise">
          {availability && (
            <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success-soft/70 px-3 py-1 text-xs font-semibold text-success backdrop-blur">
              <span aria-hidden="true" className="anim-pulse-ring size-2 rounded-full bg-success" />
              {availability}
            </span>
          )}
          <p className="mt-6 font-mono text-sm text-muted">{t.greeting}</p>
          <h1 className="mt-2 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
            <span className="text-gradient">{name}</span>
          </h1>
          <p className="mt-4 text-xl font-medium text-foreground/90 sm:text-2xl">{role}</p>
          {focus.length > 0 && (
            <p className="mt-3 min-h-[1.75em] text-lg text-muted">
              {t.focusPrefix} <Typewriter phrases={focus} lang={lang} className="font-medium" />
            </p>
          )}
          <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">{site.intro[lang]}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <CvButton cv={cv} lang={lang} />
            <Button href={localePath(lang, "/projects")} variant={cv ? "secondary" : "primary"}>
              {t.viewProjects}
              <ArrowRightIcon size={16} />
            </Button>
            {site.email && (
              <a href={`mailto:${site.email}`} className="inline-flex h-11 items-center gap-2 px-3 text-sm font-semibold text-muted transition-colors hover:text-foreground">
                <MailIcon size={16} />
                {t.contact}
              </a>
            )}
          </div>
          <SocialLinks site={site} className="mt-7" />
        </div>

        <div className="anim-rise relative" style={{ animationDelay: "150ms" }}>
          <div aria-hidden="true" className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-accent opacity-25 blur-3xl" />
          <TerminalCard title={t.terminalTitle} lines={terminal} />
        </div>
      </div>

      <dl className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="anim-rise flex flex-col-reverse rounded-2xl border border-border bg-background/60 p-5 backdrop-blur"
            style={{ animationDelay: `${300 + index * 90}ms` }}
          >
            <dt className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">{stat.label}</dt>
            <dd className="text-3xl font-semibold tracking-tight sm:text-4xl">
              <span className="text-gradient">{stat.value}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
