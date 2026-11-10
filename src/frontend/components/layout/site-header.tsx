"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LanguageSwitch } from "@frontend/components/layout/language-switch";
import { ThemeToggle } from "@frontend/components/theme/theme-toggle";
import { Container } from "@frontend/components/ui/container";
import { CvButton } from "@frontend/components/ui/cv-button";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { localePath, type Lang } from "@frontend/lib/i18n/config";
import { initials, navItems, type Site } from "@frontend/lib/site";
import type { Cv } from "@frontend/lib/types";

export function SiteHeader({ lang, site, cv }: { lang: Lang; site: Site; cv: Cv | null }) {
  const t = getDictionary(lang);
  const url = usePathname() ?? "";
  const isActive = (path: string) => url.startsWith(localePath(lang, path));

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/75 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href={localePath(lang)} className="group flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-lg bg-gradient-accent font-mono text-xs font-bold text-accent-foreground shadow-md shadow-accent/30 transition-transform group-hover:rotate-6"
          >
            {initials(site.name.en)}
          </span>
          <span className="hidden text-base font-semibold tracking-tight min-[420px]:inline">{site.name[lang]}</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1 text-sm font-medium">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.key}>
                    <Link
                      href={localePath(lang, item.path)}
                      aria-current={active ? "page" : undefined}
                      className={`relative rounded-full px-3 py-1.5 transition-colors ${
                        active ? "bg-accent-soft text-accent-text" : "text-muted hover:text-foreground"
                      }`}
                    >
                      {t.nav[item.key]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <LanguageSwitch current={lang} label={t.language.label} names={{ en: t.language.en, bn: t.language.bn }} />
          <ThemeToggle toLight={t.theme.toLight} toDark={t.theme.toDark} />
          <CvButton cv={cv} lang={lang} variant="compact" label={t.cv.short} className="hidden sm:inline-flex" />

          {/* Mobile navigation: a native disclosure, so it works without JavaScript. */}
          <details className="group relative md:hidden">
            <summary
              aria-label={t.theme.menu}
              className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-border-strong [&::-webkit-details-marker]:hidden"
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path className="group-open:hidden" d="M3 6h18M3 12h18M3 18h18" />
                <path className="hidden group-open:block" d="M6 6l12 12M6 18L18 6" />
              </svg>
            </summary>
            <nav aria-label={t.theme.menu} className="absolute end-0 mt-3 w-56 rounded-2xl border border-border bg-background p-2 shadow-xl">
              <ul className="flex flex-col text-sm font-medium">
                {navItems.map((item) => (
                  <li key={item.key}>
                    <Link href={localePath(lang, item.path)} className="block rounded-xl px-3 py-2.5 hover:bg-surface-strong">
                      {t.nav[item.key]}
                    </Link>
                  </li>
                ))}
                {cv && (
                  <li className="mt-1 border-t border-border pt-2">
                    <a href={cv.url} download className="block rounded-xl px-3 py-2.5 font-semibold text-accent-text hover:bg-surface-strong">
                      {t.cv.download}
                    </a>
                  </li>
                )}
              </ul>
            </nav>
          </details>
        </div>
      </Container>
    </header>
  );
}
