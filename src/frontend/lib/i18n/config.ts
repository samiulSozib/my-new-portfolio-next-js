export const locales = ["en", "bn"] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = "en";

// A piece of text (or any value) stored once per language.
export type Localized<T> = Record<Lang, T>;

export function isLang(value: string): value is Lang {
  return (locales as readonly string[]).includes(value);
}

// BCP 47 tags used for Intl formatting (dates, numbers).
export const localeTag: Record<Lang, string> = {
  en: "en-US",
  bn: "bn-BD",
};

// Formats an integer in the language's digits: 12 -> "১২" for Bangla.
export function formatNumber(value: number, lang: Lang) {
  return value.toLocaleString(localeTag[lang]);
}

// Builds a language-prefixed path: localePath("bn", "/blog") -> "/bn/blog".
export function localePath(lang: Lang, path = "") {
  return `/${lang}${path}`;
}

// Replaces the language segment of the current path, keeping the rest.
export function switchLangPath(pathname: string, to: Lang) {
  const parts = pathname.split("/");
  if (parts.length > 1 && isLang(parts[1])) parts[1] = to;
  else parts.splice(1, 0, to);
  return parts.join("/") || `/${to}`;
}

export function pick<T>(value: Localized<T>, lang: Lang): T {
  return value[lang];
}
