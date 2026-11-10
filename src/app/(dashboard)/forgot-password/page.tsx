import type { Metadata } from "next";

import ForgotPassword from "@dashboard/pages/Auth/ForgotPassword";
import { redirectIfAuthenticated } from "@/server/auth";

import { renderPage } from "../render";

export const metadata: Metadata = { title: "Forgot Password" };

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await redirectIfAuthenticated();
  const { status } = await searchParams;
  return renderPage(null, ForgotPassword, { status: status === "sent" ? "We have emailed your password reset link." : null });
}
