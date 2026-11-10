import type { CSSProperties } from "react";

import { Tag } from "@frontend/components/ui/tag";
import { ArrowUpRightIcon, BriefcaseIcon, CalendarIcon, MapPinIcon } from "@frontend/components/ui/icons";
import { formatDuration, formatMonth, monthsBetween, todayIso } from "@frontend/lib/format";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import { pick, type Lang } from "@frontend/lib/i18n/config";
import type { Experience } from "@frontend/lib/types";

export function experiencePeriod(item: Experience, lang: Lang) {
  const t = getDictionary(lang).experience;
  const end = item.endDate ? formatMonth(item.endDate, lang) : t.present;
  return `${formatMonth(item.startDate, lang)} – ${end}`;
}

export function experienceDuration(item: Experience, lang: Lang) {
  return formatDuration(monthsBetween(item.startDate, item.endDate ?? todayIso()), lang);
}

/*
 * The work history as a vertical timeline. `compact` hides the highlights and stack (home page preview).
 * Current roles get a pulsing marker.
 */
export function ExperienceTimeline({ items, lang, compact = false }: { items: Experience[]; lang: Lang; compact?: boolean }) {
  const t = getDictionary(lang).experience;

  return (
    <ol className="relative">
      {/* The rail, fading out at the bottom. */}
      <span aria-hidden="true" className="absolute start-[11px] top-2 bottom-0 w-px bg-gradient-to-b from-accent via-border-strong to-transparent sm:start-[15px]" />
      {items.map((item, index) => {
        const highlights = pick(item.highlights, lang);
        const location = item.location ? pick(item.location, lang) : null;

        return (
          <li
            key={item.id}
            className="reveal relative ps-10 pb-10 last:pb-0 sm:ps-14"
            style={{ "--reveal-delay": `${Math.min(index, 4) * 80}ms` } as CSSProperties}
          >
            <span aria-hidden="true" className="absolute start-0 top-1 flex size-6 items-center justify-center rounded-full border border-border-strong bg-background sm:size-8">
              <span className={`size-2.5 rounded-full ${item.current ? "anim-pulse-ring bg-success" : "bg-gradient-accent"}`} />
            </span>

            <article className="glow-card rounded-2xl border border-border bg-surface/70 p-5 backdrop-blur transition-colors hover:bg-surface sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{pick(item.role, lang)}</h3>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm font-medium text-accent-text">
                    <BriefcaseIcon size={15} />
                    {item.companyUrl ? (
                      <a href={item.companyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 hover:underline">
                        {item.company}
                        <ArrowUpRightIcon size={13} />
                      </a>
                    ) : (
                      item.company
                    )}
                    <span className="text-muted">· {t.types[item.employmentType] ?? item.employmentType}</span>
                  </p>
                </div>
                {item.current && (
                  <span className="rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-semibold text-success">{t.current}</span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarIcon size={14} />
                  {experiencePeriod(item, lang)}
                  <span className="text-border-strong">•</span>
                  {experienceDuration(item, lang)}
                </span>
                {location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPinIcon size={14} />
                    {location}
                  </span>
                )}
              </div>

              <p className="mt-4 leading-7 text-muted">{pick(item.summary, lang)}</p>

              {!compact && highlights.length > 0 && (
                <ul className="mt-4 flex flex-col gap-2">
                  {highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3 text-sm leading-6">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rotate-45 bg-accent" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}

              {!compact && item.stack.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {item.stack.map((tech) => (
                    <Tag key={tech} label={tech} />
                  ))}
                </div>
              )}
            </article>
          </li>
        );
      })}
    </ol>
  );
}
