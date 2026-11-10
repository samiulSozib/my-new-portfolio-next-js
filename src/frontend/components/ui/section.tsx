import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, title, children, className = "" }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={id && title ? `${id}-title` : undefined}
      className={`scroll-mt-20 border-t border-border py-16 ${className}`}
    >
      {title && (
        <h2
          id={id ? `${id}-title` : undefined}
          className="mb-8 text-2xl font-semibold tracking-tight"
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
