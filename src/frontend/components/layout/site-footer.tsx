import Link from "next/link";

import { SocialLinks } from "@frontend/components/layout/social-links";
import { Container } from "@frontend/components/ui/container";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { localePath, localeTag, type Lang } from "@frontend/lib/i18n/config";
import { initials, navItems, type Site } from "@frontend/lib/site";
import type { Cv } from "@frontend/lib/types";

export function SiteFooter({ lang, site, cv }: { lang: Lang; site: Site; cv: Cv | null }) {
  const t = getDictionary(lang);
  const linkClass = "transition-colors hover:text-foreground";

  return (
    <footer className="relative mt-24 border-t border-border bg-surface/60">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      <Container className="grid grid-cols-1 gap-10 py-14 text-sm text-muted sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-lg bg-gradient-accent font-mono text-xs font-bold text-accent-foreground">
              {initials(site.name.en)}
            </span>
            <span className="text-base font-semibold text-foreground">{site.name[lang]}</span>
          </div>
          <p className="mt-4 max-w-xs leading-6">{t.footer.tagline}</p>
          <SocialLinks site={site} className="mt-5" />
        </div>

        <nav aria-label={t.footer.pages}>
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-foreground">{t.footer.pages}</p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link href={localePath(lang, item.path)} className={linkClass}>
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
            <li>
              <Link href={localePath(lang, "/archive")} className={linkClass}>
                {t.footer.archive}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-foreground">{t.footer.connect}</p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {site.email && (
              <li>
                <a href={`mailto:${site.email}`} className={linkClass}>
                  {site.email}
                </a>
              </li>
            )}
            {cv && (
              <li>
                <a href={cv.url} download className={linkClass}>
                  {t.cv.download}
                </a>
              </li>
            )}
            <li>
              <a href="/feed.xml" className={linkClass}>
                {t.footer.rss}
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-border py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {site.year.toLocaleString(localeTag[lang], { useGrouping: false })} {site.name[lang]}. {t.footer.rights}
        </p>
        <p className="font-mono">{t.footer.builtWith}</p>
      </Container>
    </footer>
  );
}
