import Link from "next/link";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
  id?: string;
};

// Shared heading for home page sections: a small eyebrow, a title, and an optional link.
export function SectionHeading({ eyebrow, title, href, linkLabel, id }: SectionHeadingProps) {
  return (
    <div className="reveal mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent-text">
            <span aria-hidden="true" className="h-px w-6 bg-accent" />
            {eyebrow}
          </p>
        )}
        <h2 id={id} className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="text-sm font-semibold text-accent-text transition-opacity hover:opacity-75"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
