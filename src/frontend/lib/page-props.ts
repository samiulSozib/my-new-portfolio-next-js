import type { Lang } from "@frontend/lib/i18n/config";
import type { Profile } from "@frontend/lib/profile";
import type { Site } from "@frontend/lib/site";
import type { Cv, Experience, Post, Project } from "@frontend/lib/types";

// Props every public page receives (loaded by src/server/site-data.ts).
export type SitePageProps = {
  lang: Lang;
  siteUrl: string;
  site: Site;
  profile: Profile;
  posts: Post[];
  projects: Project[];
  experiences: Experience[];
  cv: Cv | null;
  photoUrl: string | null;
};
