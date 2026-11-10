import "@/styles/frontend.css";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { appUrl, LANGUAGES } from "@/server/content";
import { ThemeScript } from "@frontend/components/theme/theme-script";
import { isLang } from "@frontend/lib/i18n/config";

// The public, bilingual site. The language is the first URL segment; only /en and /bn exist.
export const dynamicParams = false;

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(appUrl()),
  icons: { icon: "/favicon.ico" },
  alternates: { types: { "application/rss+xml": [{ url: "/feed.xml", title: "RSS" }] } },
};

export default async function SiteLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400..700&family=Geist+Mono:wght@400..600&family=Noto+Sans+Bengali:wght@400..700&display=swap"
        />
        {/* Applies the saved theme before the first paint, so there is no flash. */}
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
