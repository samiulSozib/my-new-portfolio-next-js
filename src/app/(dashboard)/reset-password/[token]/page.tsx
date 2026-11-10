import type { Metadata } from "next";

import ResetPassword from "@dashboard/pages/Auth/ResetPassword";
import { redirectIfAuthenticated } from "@/server/auth";

import { renderPage } from "../../render";

export const metadata: Metadata = { title: "Reset Password" };

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  await redirectIfAuthenticated();
  const [{ token }, { email }] = await Promise.all([params, searchParams]);
  return renderPage(null, ResetPassword, { token, email: email ?? "" });
}
