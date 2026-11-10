import type { Lang } from "@frontend/lib/i18n/config";

export type SubscribeState = {
  status: "idle" | "success" | "error";
  message: string;
};

// Posts the signup to the /api/newsletter route. The API stores it and can forward it to a provider.
// Returns a message in the visitor's language. Errors are mapped to the dictionary text.
export async function subscribeEmail(
  email: string,
  lang: Lang,
  honeypot: string,
  messages: { success: string; invalid: string; failed: string },
): Promise<SubscribeState> {
  try {
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), lang, website: honeypot }),
    });

    if (response.status === 422) return { status: "error", message: messages.invalid };
    if (!response.ok) throw new Error(`Newsletter API responded ${response.status}`);
  } catch {
    return { status: "error", message: messages.failed };
  }

  return { status: "success", message: messages.success };
}
