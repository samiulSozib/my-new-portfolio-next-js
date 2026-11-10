import { boolean, date, index, integer, jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

import type { ContentBlock } from "@frontend/lib/types";

// Bilingual values are stored as {"en": ..., "bn": ...}. See src/server/localized.ts.
export type LocalizedJson<T> = { en?: T; bn?: T };

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  password: varchar("password", { length: 255 }).notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  ...timestamps,
});

// One pending reset per email. The token is stored hashed (SHA-256), never in plain text.
export const passwordResetTokens = pgTable("password_reset_tokens", {
  email: varchar("email", { length: 255 }).primaryKey(),
  token: varchar("token", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: jsonb("title").$type<LocalizedJson<string>>().notNull(),
    excerpt: jsonb("excerpt").$type<LocalizedJson<string>>().notNull(),
    // Plain calendar date, read back as "YYYY-MM-DD".
    date: date("date", { mode: "string" }).notNull(),
    category: varchar("category", { length: 255 }).notNull(),
    tags: jsonb("tags").$type<string[]>().notNull(),
    cover: varchar("cover", { length: 255 }),
    published: boolean("published").notNull().default(false),
    content: jsonb("content").$type<LocalizedJson<ContentBlock[]>>().notNull(),
    ...timestamps,
  },
  (table) => [index("posts_published_date_index").on(table.published, table.date)],
);

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: jsonb("name").$type<LocalizedJson<string>>().notNull(),
  summary: jsonb("summary").$type<LocalizedJson<string>>().notNull(),
  // Detail page fields. All optional.
  role: jsonb("role").$type<LocalizedJson<string>>(),
  period: jsonb("period").$type<LocalizedJson<string>>(),
  highlights: jsonb("highlights").$type<LocalizedJson<string[]>>(),
  content: jsonb("content").$type<LocalizedJson<ContentBlock[]>>(),
  stack: jsonb("stack").$type<string[]>().notNull(),
  status: varchar("status", { length: 255 }).notNull(),
  cover: varchar("cover", { length: 255 }),
  url: varchar("url", { length: 255 }),
  repo: varchar("repo", { length: 255 }),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

// One role in the work history. A null end_date means the role is current.
export const experiences = pgTable(
  "experiences",
  {
    id: serial("id").primaryKey(),
    company: varchar("company", { length: 255 }).notNull(),
    companyUrl: varchar("company_url", { length: 255 }),
    role: jsonb("role").$type<LocalizedJson<string>>().notNull(),
    employmentType: varchar("employment_type", { length: 255 }).notNull(),
    location: jsonb("location").$type<LocalizedJson<string>>(),
    startDate: date("start_date", { mode: "string" }).notNull(),
    endDate: date("end_date", { mode: "string" }),
    summary: jsonb("summary").$type<LocalizedJson<string>>().notNull(),
    highlights: jsonb("highlights").$type<LocalizedJson<string[]>>().notNull(),
    stack: jsonb("stack").$type<string[]>().notNull(),
    ...timestamps,
  },
  (table) => [index("experiences_start_date_index").on(table.startDate)],
);

/**
 * Single-document settings: "site" (name, intro, links), "profile" (the About page),
 * "cv" (the uploaded CV file and its download count) and "photo" (the profile photo).
 */
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: jsonb("value").$type<Record<string, unknown>>().notNull(),
  ...timestamps,
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  lang: varchar("lang", { length: 5 }).notNull().default("en"),
  source: varchar("source", { length: 255 }),
  ...timestamps,
});

export type UserRow = typeof users.$inferSelect;
export type PostRow = typeof posts.$inferSelect;
export type ProjectRow = typeof projects.$inferSelect;
export type ExperienceRow = typeof experiences.$inferSelect;
export type SubscriberRow = typeof subscribers.$inferSelect;
