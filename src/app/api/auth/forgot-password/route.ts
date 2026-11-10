import { eq } from "drizzle-orm";

import { createResetToken, RESET_TOKEN_MINUTES } from "@/server/admin-passwords";
import { appUrl } from "@/server/content";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { sendMail } from "@/server/mail";
import { hit } from "@/server/rate-limit";
import { readJson, validationError } from "@/server/validation";

export async function POST(request: Request) {
  const input = (await readJson(request)) as { email?: unknown };
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (email === "") return validationError({ email: "The email field is required." });
  if (!/^[^\s@]+@[^\s@]+$/.test(email)) return validationError({ email: "The email field must be a valid email address." });

  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (!user) return validationError({ email: "We can't find a user with that email address." });

  // One link per minute per email, like Laravel's reset throttle.
  if (!hit(`password-reset:${email}`, 1, 60).allowed) {
    return validationError({ email: "Please wait before retrying." });
  }

  const token = await createResetToken(email);
  const link = `${appUrl()}/reset-password/${token}?email=${encodeURIComponent(email)}`;

  try {
    await sendMail({
      to: email,
      subject: "Reset Password Notification",
      text: [
        "You are receiving this email because we received a password reset request for your account.",
        "",
        `Reset your password: ${link}`,
        "",
        `This password reset link will expire in ${RESET_TOKEN_MINUTES} minutes.`,
        "",
        "If you did not request a password reset, no further action is required.",
      ].join("\n"),
    });
  } catch (error) {
    console.error("Password reset email failed", error);
    return Response.json({ message: "The reset email could not be sent. Please try again later." }, { status: 500 });
  }

  return Response.json({ redirect: "/forgot-password?status=sent" });
}
