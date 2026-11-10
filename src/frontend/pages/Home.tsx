
import { ExperienceTimeline } from "@frontend/components/experience/experience-timeline";
import { FeaturedPost } from "@frontend/components/blog/featured-post";
import { PostList } from "@frontend/components/blog/post-list";
import { ContactCta } from "@frontend/components/home/contact-cta";
import { FocusGrid } from "@frontend/components/home/focus-grid";
import { Hero } from "@frontend/components/home/hero";
import { NewsletterForm } from "@frontend/components/home/newsletter-form";
import { TechMarquee } from "@frontend/components/home/tech-marquee";
import { PageShell } from "@frontend/components/layout/page-shell";
import { ProjectCard } from "@frontend/components/projects/project-card";
import { SectionHeading } from "@frontend/components/ui/section-heading";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { localePath } from "@frontend/lib/i18n/config";
import type { SitePageProps } from "@frontend/lib/page-props";

export default function Home(props: SitePageProps) {
  const { lang, site, profile, projects, posts, experiences, cv } = props;
  const t = getDictionary(lang);
  const h = t.home;
  const [latest, ...rest] = posts;
  const featured = projects.filter((project) => project.featured);
  const showcase = (featured.length > 0 ? featured : projects).slice(0, 3);

  return (
    <PageShell lang={lang} site={site} cv={cv} className="pt-6 sm:pt-10">
      <div className="flex flex-col gap-24 sm:gap-28">
        <Hero lang={lang} site={site} profile={profile} projects={projects} experiences={experiences} posts={posts} cv={cv} />

        {profile.skills.length > 0 && (
          <section aria-labelledby="stack-title" className="-mt-8">
            <h2 id="stack-title" className="sr-only">{h.stackTitle}</h2>
            <TechMarquee groups={profile.skills} label={h.stackTitle} />
          </section>
        )}

        {site.interests[lang].length > 0 && (
          <section aria-labelledby="focus-title">
            <SectionHeading id="focus-title" eyebrow={h.focusEyebrow} title={h.focusTitle} />
            <FocusGrid items={site.interests[lang]} />
          </section>
        )}

        {experiences.length > 0 && (
          <section aria-labelledby="experience-title" className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                id="experience-title"
                eyebrow={h.experienceEyebrow}
                title={h.experienceTitle}
                href={localePath(lang, "/experience")}
                linkLabel={h.fullExperience}
              />
              <p className="reveal -mt-4 max-w-sm leading-7 text-muted">{t.experience.subtitle}</p>
            </div>
            <ExperienceTimeline items={experiences.slice(0, 3)} lang={lang} compact />
          </section>
        )}

        {showcase.length > 0 && (
          <section aria-labelledby="projects-title">
            <SectionHeading
              id="projects-title"
              eyebrow={h.projectsEyebrow}
              title={h.projectsTitle}
              href={localePath(lang, "/projects")}
              linkLabel={h.allProjects}
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {showcase.map((project) => (
                <div key={project.slug} className="reveal">
                  <ProjectCard project={project} lang={lang} />
                </div>
              ))}
            </div>
          </section>
        )}

        {latest && (
          <section aria-labelledby="writing-title">
            <SectionHeading
              id="writing-title"
              eyebrow={h.writingEyebrow}
              title={h.writingTitle}
              href={localePath(lang, "/blog")}
              linkLabel={h.allPosts}
            />
            <div className="reveal">
              <FeaturedPost post={latest} lang={lang} />
            </div>
            {rest.length > 0 && (
              <div className="mt-6">
                <PostList posts={rest.slice(0, 3)} lang={lang} />
              </div>
            )}
          </section>
        )}

        <div className="flex flex-col gap-6">
          <ContactCta lang={lang} site={site} cv={cv} />
          <NewsletterForm lang={lang} copy={t.newsletter} />
        </div>
      </div>
    </PageShell>
  );
}
