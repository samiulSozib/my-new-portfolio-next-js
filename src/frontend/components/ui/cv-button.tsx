import { DownloadIcon } from "@frontend/components/ui/icons";
import { getDictionary } from "@frontend/lib/i18n/dictionaries";
import type { Lang } from "@frontend/lib/i18n/config";
import type { Cv } from "@frontend/lib/types";

const variants = {
  primary: "bg-gradient-accent text-accent-foreground shadow-lg shadow-accent/25 hover:shadow-accent/40",
  secondary: "border border-border-strong bg-background/60 text-foreground backdrop-blur hover:bg-surface-strong",
  inverse: "bg-background text-foreground shadow-sm hover:bg-surface",
  compact: "h-9 border border-border-strong px-3.5 text-foreground hover:border-accent hover:text-accent-text",
};

// A plain link (not a client-side navigation), so the browser downloads the PDF. Renders nothing without a CV.
export function CvButton({
  cv,
  lang,
  variant = "primary",
  label,
  className = "",
}: {
  cv: Cv | null;
  lang: Lang;
  variant?: keyof typeof variants;
  label?: string;
  className?: string;
}) {
  if (!cv) return null;
  const t = getDictionary(lang).cv;
  const size = variant === "compact" ? "" : "h-11 px-5";

  return (
    <a
      href={cv.url}
      download
      className={`inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${size} ${variants[variant]} ${className}`}
    >
      <DownloadIcon size={16} />
      {label ?? t.download}
    </a>
  );
}
