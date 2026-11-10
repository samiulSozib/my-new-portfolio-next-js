import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary" | "inverse";
  type?: "button" | "submit";
  className?: string;
  children: ReactNode;
};

const base =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants = {
  primary: "bg-gradient-accent text-accent-foreground shadow-lg shadow-accent/25 hover:shadow-accent/40",
  secondary: "border border-border-strong bg-background/60 text-foreground backdrop-blur hover:bg-surface-strong",
  inverse: "bg-background text-foreground shadow-sm hover:bg-surface",
};

// Renders a Next.js Link when `href` is given, otherwise a native button.
export function Button({
  href,
  variant = "primary",
  type = "button",
  className = "",
  children,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
}
