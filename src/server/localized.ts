import type { LocalizedJson } from "@/server/db/schema";

/**
 * Bilingual values are stored as {"en": ..., "bn": ...}. Bangla is optional for posts and
 * projects, so the public site falls back to English when it is empty.
 */
export function localizedText(value: LocalizedJson<string> | null | undefined): { en: string; bn: string } {
  const en = String(value?.en ?? "");
  const bn = String(value?.bn ?? "");
  return { en, bn: bn !== "" ? bn : en };
}

export function localizedList<T>(value: LocalizedJson<T[]> | null | undefined): { en: T[]; bn: T[] } {
  const en = Array.isArray(value?.en) ? [...value.en] : [];
  const bn = Array.isArray(value?.bn) ? [...value.bn] : [];
  return { en, bn: bn.length > 0 ? bn : en };
}
