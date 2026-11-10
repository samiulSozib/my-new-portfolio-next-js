import Link from "next/link";

import { SiteFooter } from "@frontend/components/layout/site-footer";
import { SiteHeader } from "@frontend/components/layout/site-header";
import { Button } from "@frontend/components/ui/button";
import { Container } from "@frontend/components/ui/container";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { localePath } from "@frontend/lib/i18n/config";
import type { Site } from "@frontend/lib/site";
import type { Cv } from "@frontend/lib/types";

// Shown for unknown pages. Both languages are shown, since the URL language is not known here.
export default function NotFound({ site, cv }: { site: Site; cv: Cv | null }) {
  const en = getDictionary("en").notFound;
  const bn = getDictionary("bn").notFound;

  return (
    <div className="flex flex-1 flex-col bg-background font-sans text-foreground">
      <SiteHeader lang="en" site={site} cv={cv} />
      <main className="flex-1">
        <Container className="flex flex-col items-start gap-5 py-24 sm:py-32">
          <p className="font-mono text-7xl font-semibold tracking-tight sm:text-8xl">
            <span className="text-gradient">{en.code}</span>
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{en.title}</h1>
          <p className="max-w-xl text-lg leading-8 text-muted">{en.body}</p>
          <p lang="bn" className="max-w-xl text-lg leading-8 text-muted">{bn.title} {bn.body}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button href={localePath("en")}>{en.home}</Button>
            <Button href={localePath("bn")} variant="secondary">
              {bn.home}
            </Button>
            <Link href={localePath("en", "/blog")} className="inline-flex h-11 items-center px-3 text-sm font-semibold text-accent-text">
              {en.browse}
            </Link>
          </div>
        </Container>
      </main>
      <SiteFooter lang="en" site={site} cv={cv} />
    </div>
  );
}
