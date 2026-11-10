import "server-only";

import { revalidatePath } from "next/cache";

/** Call after any admin change, so cached public pages (/en, /bn, feed, sitemap) show it right away. */
export function revalidateSite(): void {
  revalidatePath("/", "layout");
}
