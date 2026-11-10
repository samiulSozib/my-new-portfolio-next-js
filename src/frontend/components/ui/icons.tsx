import type { SVGProps } from "react";

// Small stroke icons, drawn on a 24×24 grid. Decorative by default; pass a `title`-bearing wrapper when they carry meaning.
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 18, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export const DownloadIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></svg>
);
export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
);
export const ArrowUpRightIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const MailIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6.5 8.5 6 8.5-6" /></svg>
);
export const MapPinIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const BriefcaseIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" /></svg>
);
export const CalendarIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4m8-4v4M3 10h18" /></svg>
);
export const SparkIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M6 18l2.5-2.5m7-7L18 6" /></svg>
);
export const BrainIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h0a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm6 0a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3 2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /></svg>
);
export const CodeIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m8 8-4 4 4 4m8-8 4 4-4 4M14 5l-4 14" /></svg>
);
export const LayersIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></svg>
);
export const NetworkIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" /><path d="M12 7v5m0 0-5.5 5.5M12 12l5.5 5.5" /></svg>
);
export const CpuIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4" /></svg>
);
export const StarIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" /></svg>
);
export const GraduationIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6" /></svg>
);
export const GithubIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></svg>
);
export const LinkedinIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4m-4-7v7" /></svg>
);
export const XIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 4l16 16M20 4 4 20" /></svg>
);
