import "server-only";

import { and, asc, count, desc, eq, gte, isNull } from "drizzle-orm";

import type { SessionUser } from "@/server/auth";
import { BLOCK_TYPES, CATEGORIES, CATEGORY_LABELS, COVERS, EMPLOYMENT_TYPES, PROJECT_STATUSES } from "@/server/content";
import { db } from "@/server/db";
import { experiences, posts, projects, subscribers, type ExperienceRow, type PostRow, type ProjectRow } from "@/server/db/schema";
import { orderedExperiences } from "@/server/queries";
import { cvExists, downloadName, photoUrl, type CvDocument } from "@/server/resume";
import { getSetting } from "@/server/settings";

// Props for the dashboard pages. Shapes match what the Laravel controllers sent to the Inertia pages.

/** The Inertia-style shared props: the signed-in user, the site name and the public site link. */
export async function sharedProps(user: SessionUser | null) {
  const site = await getSetting<{ name?: { en?: string } }>("site");
  return {
    auth: {
      user: user
        ? { id: user.id, name: user.name, email: user.email, email_verified_at: user.emailVerifiedAt }
        : null,
    },
    publicSiteUrl: "/en",
    siteName: site.name?.en || "Dashboard",
  };
}

export async function siteName(): Promise<string> {
  const site = await getSetting<{ name?: { en?: string } }>("site");
  return site.name?.en || "Dashboard";
}

const toYmd = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// --- Pagination (Laravel's LengthAwarePaginator shape: data + links) -------------------------------

export type Paginated<T> = {
  data: T[];
  links: { url: string | null; label: string; active: boolean }[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
};

export function pageNumber(value: string | string[] | undefined): number {
  const page = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function paginate<T>(data: T[], total: number, page: number, perPage: number, path: string): Paginated<T> {
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const url = (n: number) => `${path}?page=${n}`;

  // Same window as Laravel: every page when there are few, otherwise the ends plus three either side.
  const numbers: (number | "...")[] = [];
  if (lastPage <= 10) {
    for (let n = 1; n <= lastPage; n++) numbers.push(n);
  } else {
    const start = Math.max(3, page - 3);
    const end = Math.min(lastPage - 2, page + 3);
    numbers.push(1, 2);
    if (start > 3) numbers.push("...");
    for (let n = start; n <= end; n++) numbers.push(n);
    if (end < lastPage - 2) numbers.push("...");
    numbers.push(lastPage - 1, lastPage);
  }

  const links = [
    { url: page > 1 ? url(page - 1) : null, label: "&laquo; Previous", active: false },
    ...numbers.map((n) => (n === "..." ? { url: null, label: "...", active: false } : { url: url(n), label: String(n), active: n === page })),
    { url: page < lastPage ? url(page + 1) : null, label: "Next &raquo;", active: false },
  ];

  const from = total === 0 ? null : (page - 1) * perPage + 1;
  return {
    data,
    links,
    current_page: page,
    last_page: lastPage,
    per_page: perPage,
    total,
    from,
    to: from === null ? null : from + data.length - 1,
  };
}

// --- Dashboard ------------------------------------------------------------------------------------

export async function dashboardProps() {
  const [site, profile, cv, photo] = await Promise.all([
    getSetting<{ email?: string | null; social?: Record<string, string | null> }>("site"),
    getSetting<{ yearsInSoftware?: number; skills?: unknown[] }>("profile"),
    getSetting<CvDocument>("cv"),
    photoUrl(),
  ]);
  const hasCv = cvExists(cv);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const chartStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const total = async (query: Promise<{ value: number }[]>) => Number((await query)[0]?.value ?? 0);

  const [
    postCount,
    publishedCount,
    draftCount,
    postsThisMonth,
    projectCount,
    liveProjects,
    featuredProjects,
    roleCount,
    subscriberCount,
    subscribersThisMonth,
    recentPostRows,
    recentSubscriberRows,
    currentRows,
    chartDates,
    categoryRows,
  ] = await Promise.all([
    total(db.select({ value: count() }).from(posts)),
    total(db.select({ value: count() }).from(posts).where(eq(posts.published, true))),
    total(db.select({ value: count() }).from(posts).where(eq(posts.published, false))),
    total(db.select({ value: count() }).from(posts).where(and(eq(posts.published, true), gte(posts.date, toYmd(monthStart))))),
    total(db.select({ value: count() }).from(projects)),
    total(db.select({ value: count() }).from(projects).where(eq(projects.status, "live"))),
    total(db.select({ value: count() }).from(projects).where(eq(projects.featured, true))),
    total(db.select({ value: count() }).from(experiences)),
    total(db.select({ value: count() }).from(subscribers)),
    total(db.select({ value: count() }).from(subscribers).where(gte(subscribers.createdAt, monthStart))),
    db.select().from(posts).orderBy(desc(posts.updatedAt)).limit(6),
    db.select().from(subscribers).orderBy(desc(subscribers.createdAt)).limit(5),
    db.select().from(experiences).where(isNull(experiences.endDate)).orderBy(desc(experiences.startDate)).limit(1),
    db.select({ date: posts.date }).from(posts).where(and(eq(posts.published, true), gte(posts.date, toYmd(chartStart)))),
    db.select({ category: posts.category, value: count() }).from(posts).where(eq(posts.published, true)).groupBy(posts.category),
  ]);

  const monthCounts = new Map<string, number>();
  for (const { date } of chartDates) monthCounts.set(date.slice(0, 7), (monthCounts.get(date.slice(0, 7)) ?? 0) + 1);
  const postsByMonth = Array.from({ length: 12 }, (_, offset) => {
    const month = new Date(chartStart.getFullYear(), chartStart.getMonth() + offset, 1);
    const key = toYmd(month).slice(0, 7);
    return { month: key, label: monthLabels[month.getMonth()], count: monthCounts.get(key) ?? 0 };
  });

  const categoryCounts = new Map(categoryRows.map((row) => [row.category, Number(row.value)]));
  const current = currentRows[0];
  const social = Object.values(site.social ?? {}).filter(Boolean);

  return {
    stats: {
      posts: postCount,
      publishedPosts: publishedCount,
      drafts: draftCount,
      postsThisMonth,
      projects: projectCount,
      liveProjects,
      featuredProjects,
      roles: roleCount,
      yearsExperience: Number(profile.yearsInSoftware ?? 0),
      subscribers: subscriberCount,
      subscribersThisMonth,
      cvDownloads: Number(cv.downloads ?? 0),
    },
    postsByMonth,
    postsByCategory: CATEGORIES.map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      count: categoryCounts.get(category) ?? 0,
    })),
    recentPosts: recentPostRows.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title?.en ?? "",
      category: post.category,
      published: post.published,
      date: post.date,
    })),
    recentSubscribers: recentSubscriberRows.map((subscriber) => ({
      id: subscriber.id,
      email: subscriber.email,
      lang: subscriber.lang,
      created_at: subscriber.createdAt.toISOString(),
    })),
    currentRole: current
      ? { id: current.id, role: current.role?.en ?? "", company: current.company, start_date: current.startDate }
      : null,
    cv: hasCv ? { name: cv.name ?? "cv.pdf", uploaded_at: cv.uploaded_at ?? null, downloads: Number(cv.downloads ?? 0) } : null,
    photoUrl: photo,
    checklist: [
      { label: "Upload your CV", done: hasCv, route: "admin.resume.edit" },
      { label: "Add a profile photo", done: photo !== null, route: "admin.resume.edit" },
      { label: "Add a contact email", done: Boolean(site.email), route: "admin.site.edit" },
      { label: "Link GitHub or LinkedIn", done: social.length > 0, route: "admin.site.edit" },
      { label: "Add work experience", done: roleCount > 0, route: "admin.experience.index" },
      { label: "List your skills", done: Array.isArray(profile.skills) && profile.skills.length > 0, route: "admin.about.edit" },
      { label: "Feature a project", done: featuredProjects > 0, route: "admin.projects.index" },
      { label: "Publish a post", done: publishedCount > 0, route: "admin.posts.create" },
    ],
  };
}

// --- Lists ------------------------------------------------------------------------------------------

export async function postsIndexProps(page: number) {
  const perPage = 20;
  const [rows, [{ value }]] = await Promise.all([
    db.select().from(posts).orderBy(desc(posts.date), desc(posts.id)).limit(perPage).offset((page - 1) * perPage),
    db.select({ value: count() }).from(posts),
  ]);
  const data = rows.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title?.en ?? "",
    category: post.category,
    date: post.date,
    published: post.published,
    cover: post.cover,
  }));
  return { posts: paginate(data, Number(value), page, perPage, "/admin/posts") };
}

export async function projectsIndexProps() {
  const rows = await db.select().from(projects).orderBy(asc(projects.sortOrder), asc(projects.id));
  return {
    projects: rows.map((project) => ({
      id: project.id,
      slug: project.slug,
      name: project.name?.en ?? "",
      status: project.status,
      sort_order: project.sortOrder,
      stack: project.stack,
      featured: project.featured,
      cover: project.cover,
    })),
  };
}

export async function experienceIndexProps() {
  const rows = await orderedExperiences();
  return {
    experiences: rows.map((experience) => ({
      id: experience.id,
      company: experience.company,
      role: experience.role?.en ?? "",
      employment_type: experience.employmentType,
      location: experience.location?.en ?? "",
      start_date: experience.startDate,
      end_date: experience.endDate,
      stack: experience.stack ?? [],
    })),
  };
}

export async function subscribersIndexProps(page: number) {
  const perPage = 25;
  const [rows, [{ value }]] = await Promise.all([
    db.select().from(subscribers).orderBy(desc(subscribers.createdAt), desc(subscribers.id)).limit(perPage).offset((page - 1) * perPage),
    db.select({ value: count() }).from(subscribers),
  ]);
  const data = rows.map((subscriber) => ({
    id: subscriber.id,
    email: subscriber.email,
    lang: subscriber.lang,
    source: subscriber.source,
    created_at: toYmd(subscriber.createdAt),
  }));
  return { subscribers: paginate(data, Number(value), page, perPage, "/admin/subscribers") };
}

// --- Forms ------------------------------------------------------------------------------------------

const blankText = { en: "", bn: "" };
const blankList = { en: [], bn: [] };

export function postFormProps(post: PostRow | null) {
  return {
    post: post
      ? {
          id: post.id,
          slug: post.slug,
          title: post.title ?? blankText,
          excerpt: post.excerpt ?? blankText,
          date: post.date,
          category: post.category,
          tags: post.tags ?? [],
          cover: post.cover,
          published: post.published,
          content: post.content ?? blankList,
        }
      : {
          id: null,
          slug: null,
          title: blankText,
          excerpt: blankText,
          date: toYmd(new Date()),
          category: "ai",
          tags: [],
          cover: null,
          published: false,
          content: blankList,
        },
    options: { categories: CATEGORIES, categoryLabels: CATEGORY_LABELS, covers: COVERS, blockTypes: BLOCK_TYPES },
  };
}

export function projectFormProps(project: ProjectRow | null) {
  return {
    project: {
      id: project?.id ?? null,
      slug: project?.slug ?? null,
      name: project?.name ?? blankText,
      summary: project?.summary ?? blankText,
      role: project?.role ?? blankText,
      period: project?.period ?? blankText,
      highlights: project?.highlights ?? blankList,
      content: project?.content ?? blankList,
      stack: project?.stack ?? [],
      status: project?.status ?? "in progress",
      cover: project?.cover ?? null,
      url: project?.url ?? null,
      repo: project?.repo ?? null,
      featured: project?.featured ?? false,
      sort_order: project?.sortOrder ?? 0,
    },
    options: { statuses: PROJECT_STATUSES, covers: COVERS, blockTypes: BLOCK_TYPES },
  };
}

export function experienceFormProps(experience: ExperienceRow | null) {
  const now = new Date();
  return {
    experience: {
      id: experience?.id ?? null,
      company: experience?.company ?? "",
      company_url: experience?.companyUrl ?? "",
      role: experience?.role ?? blankText,
      employment_type: experience?.employmentType ?? "full-time",
      location: experience?.location ?? blankText,
      start_date: experience?.startDate ?? toYmd(new Date(now.getFullYear(), now.getMonth(), 1)),
      end_date: experience?.endDate ?? "",
      current: experience ? experience.endDate === null : true,
      summary: experience?.summary ?? blankText,
      highlights: experience?.highlights ?? blankList,
      stack: experience?.stack ?? [],
    },
    options: { employmentTypes: EMPLOYMENT_TYPES },
  };
}

export async function resumeProps() {
  const [cv, photo, name] = await Promise.all([getSetting<CvDocument>("cv"), photoUrl(), downloadName()]);
  return {
    cv: cvExists(cv)
      ? {
          name: cv.name ?? "cv.pdf",
          size: Number(cv.size ?? 0),
          uploaded_at: cv.uploaded_at ?? null,
          downloads: Number(cv.downloads ?? 0),
          url: "/cv",
        }
      : null,
    photoUrl: photo,
    downloadName: name,
  };
}
