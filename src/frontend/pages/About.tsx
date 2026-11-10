import type { CSSProperties } from "react";

import { NeuralCanvas } from "@frontend/components/ai/neural-canvas";
import { SocialLinks } from "@frontend/components/layout/social-links";
import { PageShell } from "@frontend/components/layout/page-shell";
import { Avatar } from "@frontend/components/ui/avatar";
import { Button } from "@frontend/components/ui/button";
import { CvButton } from "@frontend/components/ui/cv-button";
import { ArrowRightIcon, BriefcaseIcon, GraduationIcon, MailIcon, MapPinIcon, SparkIcon } from "@frontend/components/ui/icons";
import { SectionHeading } from "@frontend/components/ui/section-heading";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { formatNumber, localePath, pick } from "@frontend/lib/i18n/config";
import type { SitePageProps } from "@frontend/lib/page-props";

export default function About({ lang, site, profile, experiences, cv, photoUrl }: SitePageProps) {
  const t = getDictionary(lang);
  const a = t.about;
  const current = experiences.find((item) => item.current);

  const facts = [
    { label: a.factsLocation, value: pick(profile.location, lang), Icon: MapPinIcon },
    { label: a.factsExperience, value: a.years(formatNumber(profile.yearsInSoftware, lang)), Icon: SparkIcon },
    ...(current ? [{ label: a.factsRole, value: `${pick(current.role, lang)} · ${current.company}`, Icon: BriefcaseIcon }] : []),
    { label: a.factsLanguages, value: pick(profile.languages, lang), Icon: GraduationIcon },
  ];

  return (
    <PageShell lang={lang} site={site} cv={cv}>
      <div className="flex flex-col gap-24">
        {/* Profile card: photo, name, role, intro, and quick facts */}
        <section className="relative isolate overflow-hidden rounded-[2rem] border border-border p-6 sm:p-12">
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <div className="aurora absolute -inset-20 opacity-70" />
            <NeuralCanvas className="absolute inset-0 opacity-40" />
          </div>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
            <div className="anim-rise">
              <div className="flex flex-wrap items-center gap-5">
                <Avatar name={site.name[lang]} photoUrl={photoUrl} size={112} />
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-text">{a.eyebrow}</p>
                  <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                    <span className="text-gradient">{site.name[lang]}</span>
                  </h1>
                  <p className="mt-2 text-lg font-medium">{pick(profile.role, lang)}</p>
                </div>
              </div>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">{site.intro[lang]}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <CvButton cv={cv} lang={lang} />
                <Button href={localePath(lang, "/experience")} variant={cv ? "secondary" : "primary"}>
                  {a.viewExperience}
                  <ArrowRightIcon size={16} />
                </Button>
              </div>
              <SocialLinks site={site} withEmail className="mt-6" />
            </div>

            <dl className="anim-rise grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1" style={{ animationDelay: "120ms" }}>
              {facts.map(({ label, value, Icon }) => (
                <div key={label} className="flex items-start gap-4 rounded-2xl border border-border bg-background/70 p-4 backdrop-blur">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted">{label}</dt>
                    <dd className="mt-0.5 font-semibold leading-snug">{value}</dd>
                  </div>
                </div>
              ))}
              {site.email && (
                <div className="flex items-start gap-4 rounded-2xl border border-border bg-background/70 p-4 backdrop-blur">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text">
                    <MailIcon size={18} />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted">{a.email}</dt>
                    <dd className="mt-0.5 truncate font-semibold">
                      <a href={`mailto:${site.email}`} className="hover:text-accent-text">
                        {site.email}
                      </a>
                    </dd>
                  </div>
                </div>
              )}
            </dl>
          </div>
        </section>

        {/* Story and focus areas */}
        <section aria-labelledby="story-title" className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div>
            <SectionHeading id="story-title" eyebrow={a.eyebrow} title={a.storyTitle} />
            <div className="reveal flex flex-col gap-5 text-lg leading-8 text-muted">
              {profile.story[lang].map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="reveal rounded-2xl border border-border bg-surface p-7 lg:mt-24">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-text">{a.interests}</h2>
            <ul className="mt-5 flex flex-col gap-4">
              {site.interests[lang].map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-accent" />
                  <span className="leading-7">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Skills */}
        {profile.skills.length > 0 && (
          <section aria-labelledby="skills-title">
            <SectionHeading id="skills-title" eyebrow={t.home.stackEyebrow} title={a.skillsTitle} />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {profile.skills.map((group, index) => (
                <div
                  key={group.name.en}
                  className="reveal glow-card rounded-2xl border border-border bg-surface p-7"
                  style={{ "--reveal-delay": `${(index % 2) * 90}ms` } as CSSProperties}
                >
                  <h3 className="font-mono text-sm font-semibold text-accent-text">
                    <span className="text-muted">0{index + 1}.</span> {pick(group.name, lang)}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={item} className="rounded-full border border-border bg-background px-3 py-1 text-sm font-medium">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Principles */}
        {profile.principles.length > 0 && (
          <section aria-labelledby="principles-title">
            <SectionHeading id="principles-title" eyebrow={a.eyebrow} title={a.principlesTitle} />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {profile.principles.map((principle, index) => (
                <article
                  key={index}
                  className="reveal glow-card rounded-2xl border border-border bg-surface p-7"
                  style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
                >
                  <p className="font-mono text-3xl font-semibold">
                    <span className="text-gradient">0{index + 1}</span>
                  </p>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">{pick(principle.title, lang)}</h3>
                  <p className="mt-3 leading-7 text-muted">{pick(principle.body, lang)}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {profile.education.length > 0 && (
          <section aria-labelledby="education-title">
            <SectionHeading id="education-title" eyebrow={a.educationTitle} title={a.educationTitle} />
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {profile.education.map((item, index) => (
                <li key={index} className="reveal flex gap-5 rounded-2xl border border-border bg-surface p-6">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text">
                    <GraduationIcon size={22} />
                  </span>
                  <div>
                    <p className="font-mono text-xs text-muted">{pick(item.period, lang)}</p>
                    <p className="mt-1 text-lg font-semibold leading-snug">{pick(item.degree, lang)}</p>
                    <p className="mt-1 text-muted">{pick(item.school, lang)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Call to action */}
        <section className="reveal relative overflow-hidden rounded-[2rem] bg-gradient-accent p-8 text-accent-foreground sm:p-12">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">{a.ctaTitle}</h2>
          <p className="mt-3 max-w-xl leading-7 opacity-90">{a.ctaBody}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CvButton cv={cv} lang={lang} variant="inverse" />
            <Button href={localePath(lang, "/blog")} variant={cv ? "secondary" : "inverse"} className={cv ? "border-white/40 bg-transparent text-accent-foreground hover:bg-white/10" : ""}>
              {a.ctaBlog}
            </Button>
            {site.email && (
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 px-2 text-sm font-semibold opacity-90 hover:opacity-100 hover:underline">
                <MailIcon size={16} />
                {a.contact}
              </a>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
