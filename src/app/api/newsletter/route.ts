import { z } from "zod";

import { LANGUAGES } from "@/server/content";
import { db } from "@/server/db";
import { subscribers } from "@/server/db/schema";
import { throttle } from "@/server/rate-limit";
import { readJson, validationError, zodErrors } from "@/server/validation";

const Signup = z.object({
  email: z
    .string({ error: "The email field is required." })
    .trim()
    .toLowerCase()
    .min(1, "The email field is required.")
    .max(254, "The email may not be greater than 254 characters.")
    .pipe(z.email("The email must be a valid email address.")),
  lang: z.enum(LANGUAGES, { error: "The selected lang is invalid." }).nullish(),
});

export async function POST(request: Request) {
  const limited = await throttle("newsletter", 10, 60);
  if (limited) return limited;

  const input = ((await readJson(request)) ?? {}) as Record<string, unknown>;

  // Honeypot: real visitors never fill this hidden field, so pretend success and store nothing.
  const honeypot = input.website;
  if (typeof honeypot === "string" ? honeypot.trim() !== "" : Boolean(honeypot)) {
    return Response.json({ message: "Subscribed." }, { status: 201 });
  }

  const parsed = Signup.safeParse(input);
  if (!parsed.success) return validationError(zodErrors(parsed.error));

  const subscriber = { email: parsed.data.email, lang: parsed.data.lang ?? "en", source: "blog" };
  const created = await db
    .insert(subscribers)
    .values(subscriber)
    .onConflictDoNothing({ target: subscribers.email })
    .returning({ id: subscribers.id });

  if (created.length > 0) await forwardToProvider(subscriber);

  return Response.json({ message: "Subscribed." }, { status: 201 });
}

/**
 * Optional: copy each new signup to an external list (Buttondown, Mailchimp, a Zapier hook).
 * A failed forward is logged but never fails the visitor's signup.
 */
async function forwardToProvider(subscriber: { email: string; lang: string; source: string }) {
  const webhook = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!webhook) return;

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(subscriber),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
  } catch (error) {
    console.warn("Newsletter webhook failed", { message: error instanceof Error ? error.message : String(error) });
  }
}
