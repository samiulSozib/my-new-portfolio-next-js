import type { Metadata } from "next";

import Login from "@dashboard/pages/Auth/Login";
import { redirectIfAuthenticated } from "@/server/auth";

import { renderPage } from "../render";

export const metadata: Metadata = { title: "Log in" };

const statuses: Record<string, string> = { reset: "Your password has been reset." };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await redirectIfAuthenticated();
  const { status } = await searchParams;
  return renderPage(null, Login, { status: (status && statuses[status]) || null, canResetPassword: true });
}
