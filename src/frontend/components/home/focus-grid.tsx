import type { CSSProperties } from "react";

import { BrainIcon, CodeIcon, CpuIcon, LayersIcon, NetworkIcon, SparkIcon } from "@frontend/components/ui/icons";

const icons = [BrainIcon, LayersIcon, NetworkIcon, CpuIcon, CodeIcon, SparkIcon];

// The focus areas from the site settings, as a grid of cards with an icon each.
export function FocusGrid({ items }: { items: string[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {items.map((item, index) => {
        const Icon = icons[index % icons.length];
        return (
          <li
            key={item}
            className="reveal glow-card group rounded-2xl border border-border bg-surface p-4 transition-colors hover:bg-surface-strong/60 sm:p-6"
            style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties}
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent-text transition-transform group-hover:-rotate-6 group-hover:scale-110 sm:size-11">
              <Icon size={22} />
            </span>
            <p className="mt-4 font-mono text-xs text-muted sm:mt-5">0{index + 1}</p>
            <h3 className="mt-1 text-sm font-semibold leading-snug tracking-tight sm:text-base">{item}</h3>
          </li>
        );
      })}
    </ul>
  );
}
