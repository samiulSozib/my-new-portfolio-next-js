import { type ContentBlock } from "@frontend/lib/types";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { formatNumber, localeTag, type Lang } from "@frontend/lib/i18n/config";

// Dates are stored as ISO strings and formatted in UTC so the output does not
// shift between the server and the visitor's time zone.
export function formatDate(iso: string, lang: Lang) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(localeTag[lang], {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function getYear(iso: string) {
  return iso.slice(0, 4);
}

// Average adult reading speed, in words per minute. Bangla is read a little slower.
const WORDS_PER_MINUTE: Record<Lang, number> = { en: 220, bn: 180 };

function blockText(block: ContentBlock): string {
  if (block.type === "list") return block.items.join(" ");
  // Code is skimmed rather than read, so it is not counted.
  if (block.type === "code") return "";
  return block.text;
}

export function readingMinutes(content: ContentBlock[], lang: Lang) {
  const words = content
    .map(blockText)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE[lang]));
}

export function readingTime(content: ContentBlock[], lang: Lang) {
  const minutes = readingMinutes(content, lang);
  return getDictionary(lang).post.minutes(formatNumber(minutes, lang));
}

// "Mar 2024", in the page's language.
export function formatMonth(iso: string, lang: Lang) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(localeTag[lang], {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

// Whole months between two ISO dates, counting both the first and the last month.
export function monthsBetween(start: string, end: string) {
  const s = new Date(`${start}T00:00:00Z`);
  const e = new Date(`${end}T00:00:00Z`);
  return Math.max(1, (e.getUTCFullYear() - s.getUTCFullYear()) * 12 + e.getUTCMonth() - s.getUTCMonth() + 1);
}

// "2 yrs 3 mos", in the page's language and digits.
export function formatDuration(months: number, lang: Lang) {
  const t = getDictionary(lang).experience;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [];
  if (years > 0) parts.push(t.years(formatNumber(years, lang), years));
  if (rest > 0) parts.push(t.months(formatNumber(rest, lang), rest));
  return parts.join(" ");
}

// Today as YYYY-MM-DD. Used as the end of current roles.
export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function formatFileSize(bytes: number, lang: Lang) {
  if (bytes < 1024 * 1024) return `${formatNumber(Math.max(1, Math.round(bytes / 1024)), lang)} KB`;
  return `${(bytes / (1024 * 1024)).toLocaleString(localeTag[lang], { maximumFractionDigits: 1 })} MB`;
}

// URL-safe key for a tag: "Next.js" -> "next-js", "Road trip" -> "road-trip".
export function tagSlug(tag: string) {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
