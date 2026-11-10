import "server-only";

import { cache } from "react";

import { experienceResource, postResource, projectResource } from "@/server/resources";
import { orderedExperiences, orderedProjects, publishedPosts } from "@/server/queries";
import { photoUrl, publicCv } from "@/server/resume";
import { getSetting } from "@/server/settings";
import { appUrl } from "@/server/content";
import type { Lang } from "@frontend/lib/i18n/config";
import type { SitePageProps } from "@frontend/lib/page-props";
import type { Profile } from "@frontend/lib/profile";
import type { Site } from "@frontend/lib/site";

/**
 * Content shared by every public page: the site identity, About page, posts, projects,
 * work experience, and the CV and photo links. Only published posts are included.
 * Cached per request, so generateMetadata and the page share one set of queries.
 */
export const getSiteContent = cache(async () => {
  const [site, profile, postRows, projectRows, experienceRows, cv, photo] = await Promise.all([
    getSetting("site"),
    getSetting("profile"),
    publishedPosts(),
    orderedProjects(),
    orderedExperiences(),
    publicCv(),
    photoUrl(),
  ]);

  return {
    siteUrl: appUrl(),
    site: withSiteDefaults(site),
    profile: withProfileDefaults(profile),
    posts: postRows.map(postResource),
    projects: projectRows.map(projectResource),
    experiences: experienceRows.map(experienceResource),
    cv,
    photoUrl: photo,
  };
});

export async function getSitePageProps(lang: Lang): Promise<SitePageProps> {
  return { lang, ...(await getSiteContent()) };
}

// A fresh database has no settings yet. Fill the shapes the pages expect, so they render instead of crashing.
const blank = { en: "", bn: "" };

function withSiteDefaults(site: Record<string, unknown>): Site {
  const s = site as Partial<Site>;
  return {
    name: s.name ?? blank,
    title: s.title ?? blank,
    description: s.description ?? blank,
    intro: s.intro ?? blank,
    about: s.about ?? blank,
    interests: s.interests ?? { en: [], bn: [] },
    availability: s.availability,
    email: s.email ?? "",
    social: { github: s.social?.github ?? "", linkedin: s.social?.linkedin ?? "", x: s.social?.x ?? "" },
    year: s.year ?? new Date().getFullYear(),
  };
}

function withProfileDefaults(profile: Record<string, unknown>): Profile {
  const p = profile as Partial<Profile>;
  return {
    role: p.role ?? blank,
    location: p.location ?? blank,
    languages: p.languages ?? blank,
    yearsInSoftware: p.yearsInSoftware ?? 0,
    story: p.story ?? { en: [], bn: [] },
    skills: p.skills ?? [],
    principles: p.principles ?? [],
    education: p.education ?? [],
  };
}
