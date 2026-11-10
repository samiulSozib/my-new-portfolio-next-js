"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/*
 * Fades in elements with the "reveal" class as they scroll into view. Elements already on screen
 * are shown immediately, so nothing that the server rendered flickers. Runs again after every
 * navigation, so content added by a search or filter is picked up too.
 */
export function ScrollReveal() {
  const pathname = usePathname();
  const search = useSearchParams()?.toString();

  useEffect(() => {
    const pending = document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      pending.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    pending.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) el.classList.add("is-visible");
      else observer.observe(el);
    });
    document.documentElement.classList.add("reveal-ready");

    return () => observer.disconnect();
  }, [pathname, search]);

  return null;
}
