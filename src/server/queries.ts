import "server-only";

import { asc, desc, eq, sql } from "drizzle-orm";

import { db } from "@/server/db";
import { experiences, posts, projects } from "@/server/db/schema";

// Shared orderings, so the site, the API and the admin list content the same way.

/** Published posts, newest first. Drafts never leave the server. */
export function publishedPosts() {
  return db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.date), desc(posts.id));
}

/** Featured projects first, then by the admin's sort order. */
export function orderedProjects() {
  return db.select().from(projects).orderBy(desc(projects.featured), asc(projects.sortOrder), asc(projects.id));
}

/** Current roles first, then by start date, newest first. */
export function orderedExperiences() {
  return db
    .select()
    .from(experiences)
    .orderBy(sql`${experiences.endDate} is not null`, desc(experiences.startDate), desc(experiences.id));
}
