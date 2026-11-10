"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { locales, switchLangPath, type Lang } from "@frontend/lib/i18n/config";

type LanguageSwitchProps = {
  current: Lang;
  label: string;
  names: Record<Lang, string>;
};

// Keeps the visitor on the same page and swaps only the language segment of the URL.
export function LanguageSwitch({ current, label, names }: LanguageSwitchProps) {
  const pathname = usePathname() ?? `/${current}`;

  return (
    <nav aria-label={label}>
      <ul className="flex items-center rounded-full border border-border-strong p-0.5 text-xs font-semibold">
        {locales.map((lang) => {
          const active = lang === current;
          return (
            <li key={lang}>
              <Link
                href={switchLangPath(pathname, lang)}
                lang={lang}
                hrefLang={lang}
                aria-current={active ? "true" : undefined}
                className={`inline-flex h-7 items-center rounded-full px-3 transition-colors ${
                  active ? "bg-accent text-accent-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {names[lang]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
