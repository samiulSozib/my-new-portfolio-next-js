"use client";

import { useEffect, useState } from "react";

import type { Lang } from "@frontend/lib/i18n/config";

// Splits text into user-perceived characters, so Bangla conjuncts are typed as one unit.
function graphemes(text: string, lang: Lang): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(lang, { granularity: "grapheme" });
    return [...segmenter.segment(text)].map((part) => part.segment);
  }
  return [...text];
}

/*
 * Types each phrase, pauses, deletes it, and moves to the next. The server renders the first phrase
 * in full, and screen readers get the whole list once instead of the animation.
 */
export function Typewriter({ phrases, lang, className = "" }: { phrases: string[]; lang: Lang; className?: string }) {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(phrases[0] ?? "");
  const [phase, setPhase] = useState<"hold" | "delete" | "type">("hold");

  useEffect(() => {
    if (phrases.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = graphemes(phrases[index], lang);
    const current = graphemes(shown, lang);
    let timer: number;

    if (phase === "hold") {
      timer = window.setTimeout(() => setPhase("delete"), 2200);
    } else if (phase === "delete") {
      if (current.length === 0) {
        setIndex((i) => (i + 1) % phrases.length);
        setPhase("type");
        return;
      }
      timer = window.setTimeout(() => setShown(current.slice(0, -1).join("")), 28);
    } else {
      if (current.length === target.length) {
        setPhase("hold");
        return;
      }
      timer = window.setTimeout(() => setShown(target.slice(0, current.length + 1).join("")), 55 + Math.random() * 45);
    }

    return () => window.clearTimeout(timer);
  }, [phrases, index, shown, phase, lang]);

  return (
    <span className={className}>
      <span className="sr-only">{phrases.join(", ")}</span>
      <span aria-hidden="true">
        <span className="text-gradient">{shown}</span>
        <span className="term-cursor ms-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-accent" />
      </span>
    </span>
  );
}
