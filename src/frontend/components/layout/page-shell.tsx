import { Suspense, type ReactNode } from "react";

import { SiteFooter } from "@frontend/components/layout/site-footer";
import { ScrollReveal } from "@frontend/components/layout/scroll-reveal";
import { SiteHeader } from "@frontend/components/layout/site-header";
import { Container } from "@frontend/components/ui/container";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import type { Lang } from "@frontend/lib/i18n/config";
import type { Site } from "@frontend/lib/site";
import type { Cv } from "@frontend/lib/types";

type PageShellProps = {
  lang: Lang;
  site: Site;
  cv: Cv | null;
  children: ReactNode;
  className?: string;
};

// Header, footer, and a padded main column shared by every page.
export function PageShell({ lang, site, cv, children, className = "" }: PageShellProps) {
  const t = getDictionary(lang);

  return (
    <div className="relative flex flex-1 flex-col bg-background font-sans text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
      >
        {t.misc.skip}
      </a>
      <div aria-hidden="true" className="page-glow pointer-events-none absolute inset-x-0 top-0 -z-0 h-[36rem]" />
      <SiteHeader lang={lang} site={site} cv={cv} />
      <main id="main" className="relative flex-1">
        <Container className={`py-12 sm:py-16 ${className}`}>{children}</Container>
      </main>
      <SiteFooter lang={lang} site={site} cv={cv} />
      <Suspense fallback={null}>
        <ScrollReveal />
      </Suspense>
    </div>
  );
}

// Eyebrow label and title used at the top of inner pages.
export function PageTitle({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <header className="anim-rise">
      <p className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-text">
        <span aria-hidden="true" className="h-px w-6 bg-accent" />
        {eyebrow}
      </p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        <span className="text-gradient">{title}</span>
      </h1>
      {subtitle && <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{subtitle}</p>}
      {children}
    </header>
  );
}
