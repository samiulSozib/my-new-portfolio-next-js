import type { ExperienceRow, PostRow, ProjectRow } from "@/server/db/schema";
import { localizedList, localizedText } from "@/server/localized";
import type { Category, CoverVariant, EmploymentType, Experience, Post, Project, ProjectStatus } from "@frontend/lib/types";

// The shapes the public site and the public JSON API return. Bangla falls back to English.

export function postResource(post: PostRow): Post {
  return {
    slug: post.slug,
    title: localizedText(post.title),
    excerpt: localizedText(post.excerpt),
    date: post.date,
    category: post.category as Category,
    tags: post.tags ?? [],
    cover: (post.cover ?? undefined) as CoverVariant | undefined,
    content: localizedList(post.content),
  };
}

export function projectResource(project: ProjectRow): Project {
  return {
    slug: project.slug,
    name: localizedText(project.name),
    summary: localizedText(project.summary),
    role: localizedText(project.role),
    period: localizedText(project.period),
    highlights: localizedList(project.highlights),
    content: localizedList(project.content),
    stack: project.stack ?? [],
    status: project.status as ProjectStatus,
    cover: (project.cover ?? undefined) as CoverVariant | undefined,
    url: project.url ?? undefined,
    repo: project.repo ?? undefined,
    featured: project.featured,
  };
}

export function experienceResource(experience: ExperienceRow): Experience {
  const location = experience.location ? localizedText(experience.location) : null;
  return {
    id: experience.id,
    company: experience.company,
    companyUrl: experience.companyUrl,
    role: localizedText(experience.role),
    employmentType: experience.employmentType as EmploymentType,
    location: location && location.en !== "" ? location : null,
    startDate: experience.startDate,
    endDate: experience.endDate,
    current: experience.endDate === null,
    summary: localizedText(experience.summary),
    highlights: localizedList(experience.highlights),
    stack: experience.stack ?? [],
  };
}
