import Link from "next/link";

import { tagSlug } from "@frontend/lib/format";
import { localePath, type Lang } from "@frontend/lib/i18n/config";

type TagLinkProps = {
  label: string;
  lang: Lang;
};

// A tag that links to its archive page.
export function TagLink({ label, lang }: TagLinkProps) {
  return (
    <Link
      href={localePath(lang, `/tags/${tagSlug(label)}`)}
      className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent-text"
    >
      {label}
    </Link>
  );
}
