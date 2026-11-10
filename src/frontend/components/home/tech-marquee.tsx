import type { SkillGroup } from "@frontend/lib/profile";

// Every skill from the profile, scrolling sideways in a loop. The list is rendered twice so the loop is seamless.
export function TechMarquee({ groups, label }: { groups: SkillGroup[]; label: string }) {
  const items = [...new Set(groups.flatMap((group) => group.items))];
  if (items.length === 0) return null;

  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 gap-3 pe-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-surface px-4 py-2 font-mono text-sm text-muted"
        >
          <span aria-hidden="true" className="size-1.5 rounded-full bg-gradient-accent" />
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div aria-label={label} role="region" className="mask-fade-x group overflow-hidden">
      <div className="anim-marquee flex w-max group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
