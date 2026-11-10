import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/styles/dashboard.css";

import { DashboardProvider } from "@dashboard/lib/inertia";
import { siteName } from "@/server/admin-data";

// Root layout for the dashboard, login and account pages. The public site has its own root layout in (site).
export async function generateMetadata(): Promise<Metadata> {
  const name = await siteName();
  return {
    title: { template: `%s - ${name}`, default: name },
    robots: { index: false, follow: false },
  };
}

export default function DashboardRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-50 font-sans text-slate-900 antialiased">
        <DashboardProvider>{children}</DashboardProvider>
      </body>
    </html>
  );
}
