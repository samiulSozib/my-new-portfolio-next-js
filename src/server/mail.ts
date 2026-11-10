import "server-only";

/**
 * Sends an email through Resend's REST API when RESEND_API_KEY is set.
 * Without it (local development), the message is printed to the server log instead.
 */
export async function sendMail({ to, subject, text }: { to: string; subject: string; text: string }): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[mail] To: ${to}\n[mail] Subject: ${subject}\n${text}`);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.MAIL_FROM || "Site <onboarding@resend.dev>", to: [to], subject, text }),
  });

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  }
}
