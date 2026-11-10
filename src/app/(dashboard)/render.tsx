import type { ComponentType } from "react";

import { SharedProps } from "@dashboard/lib/inertia";
import { sharedProps } from "@/server/admin-data";
import type { SessionUser } from "@/server/auth";

/**
 * Renders a dashboard page component with the Inertia-style shared props around it.
 * The page components are plain JSX, so their props are loosely typed.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function renderPage(user: SessionUser | null, Page: ComponentType<any>, props: Record<string, unknown>) {
  return (
    <SharedProps value={await sharedProps(user)}>
      <Page {...props} />
    </SharedProps>
  );
}
