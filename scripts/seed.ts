import { readFile } from "node:fs/promises";

import bcrypt from "bcryptjs";
import { and, eq, sql } from "drizzle-orm";

import { experiences, posts, projects, settings, users } from "../src/server/db/schema";
import { connect } from "./db";

/**
 * Creates the admin login and loads the starter posts, projects, work experience,
 * and site/About content from data/seed-data.
 *
 * Set ADMIN_EMAIL and ADMIN_PASSWORD before seeding production. Re-running is safe:
 * records are matched (by slug, or by company and start date for experience) and updated in place.
 */
const { db, kind, close } = await connect();

const read = async <T>(name: string): Promise<T> =>
  JSON.parse(await readFile(new URL(`../data/seed-data/${name}.json`, import.meta.url), "utf8")) as T;

const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || "password", 12);
await db
  .insert(users)
  .values({ name: "Site Admin", email, password, isAdmin: true })
  .onConflictDoUpdate({ target: users.email, set: { password, isAdmin: true, updatedAt: sql`now()` } });

type Json = Record<string, any>;

for (const post of await read<Json[]>("posts")) {
  const values = {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    category: post.category,
    tags: post.tags,
    cover: post.cover ?? null,
    published: post.published,
    content: post.content,
  };
  await db.insert(posts).values(values).onConflictDoUpdate({ target: posts.slug, set: { ...values, updatedAt: sql`now()` } });
}

const projectList = await read<Json[]>("projects");
for (const [index, project] of projectList.entries()) {
  const values = {
    slug: project.slug,
    name: project.name,
    summary: project.summary,
    role: project.role ?? null,
    period: project.period ?? null,
    highlights: project.highlights ?? null,
    content: project.content ?? null,
    stack: project.stack,
    status: project.status,
    cover: project.cover ?? null,
    url: project.url ?? null,
    repo: project.repo ?? null,
    featured: project.featured ?? false,
    sortOrder: index,
  };
  await db.insert(projects).values(values).onConflictDoUpdate({ target: projects.slug, set: { ...values, updatedAt: sql`now()` } });
}

for (const experience of await read<Json[]>("experiences")) {
  const values = {
    company: experience.company,
    companyUrl: experience.company_url ?? null,
    role: experience.role,
    employmentType: experience.employment_type,
    location: experience.location ?? null,
    startDate: experience.start_date,
    endDate: experience.end_date ?? null,
    summary: experience.summary,
    highlights: experience.highlights,
    stack: experience.stack,
  };
  const match = and(eq(experiences.company, values.company), eq(experiences.startDate, values.startDate));
  const [existing] = await db.select({ id: experiences.id }).from(experiences).where(match).limit(1);
  if (existing) await db.update(experiences).set(values).where(eq(experiences.id, existing.id));
  else await db.insert(experiences).values(values);
}

for (const key of ["site", "profile"] as const) {
  const value = await read<Json>(key);
  await db.insert(settings).values({ key, value }).onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: sql`now()` } });
}

await close();
console.log(`Seeded the admin login (${email}) and starter content (${kind}).`);
