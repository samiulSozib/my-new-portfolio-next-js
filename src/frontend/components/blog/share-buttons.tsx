"use client";

import { useState } from "react";

type ShareButtonsProps = {
  url: string;
  title: string;
  labels: { share: string; copy: string; copied: string; x: string; linkedIn: string };
};

const buttonClass =
  "rounded-full border border-border-strong px-4 py-1.5 text-sm font-medium transition-colors hover:bg-surface-strong";

export function ShareButtons({ url, title, labels }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; the URL is still visible in the address bar.
    }
  }

  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm text-muted">{labels.share}</span>
      <button type="button" onClick={copyLink} className={buttonClass}>
        {copied ? labels.copied : labels.copy}
      </button>
      <a href={xHref} target="_blank" rel="noopener noreferrer" className={buttonClass}>
        {labels.x}
      </a>
      <a href={linkedInHref} target="_blank" rel="noopener noreferrer" className={buttonClass}>
        {labels.linkedIn}
      </a>
    </div>
  );
}
