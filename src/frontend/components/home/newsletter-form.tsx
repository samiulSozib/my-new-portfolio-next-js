"use client";

import { useState, type FormEvent } from "react";

import { subscribeEmail, type SubscribeState } from "@frontend/lib/newsletter";
import type { Lang } from "@frontend/lib/i18n/config";

const initialState: SubscribeState = { status: "idle", message: "" };

type NewsletterCopy = {
  title: string;
  body: string;
  placeholder: string;
  emailLabel: string;
  subscribe: string;
  subscribing: string;
  success: string;
  invalid: string;
  failed: string;
};

type NewsletterFormProps = {
  lang: Lang;
  copy: NewsletterCopy;
};

export function NewsletterForm({ lang, copy }: NewsletterFormProps) {
  const [state, setState] = useState<SubscribeState>(initialState);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setPending(true);
    const result = await subscribeEmail(
      String(data.get("email") ?? ""),
      lang,
      String(data.get("website") ?? ""),
      { success: copy.success, invalid: copy.invalid, failed: copy.failed },
    );
    setState(result);
    setPending(false);
    if (result.status === "success") form.reset();
  }

  return (
    <section
      id="subscribe"
      className="reveal relative grid scroll-mt-24 gap-8 overflow-hidden rounded-2xl border border-border bg-surface p-7 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:items-center"
    >
      <div className="relative">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{copy.title}</h2>
        <p className="mt-3 leading-7 text-muted">{copy.body}</p>
      </div>
      <form onSubmit={submit} className="relative flex flex-col gap-3 sm:flex-row">
        <label htmlFor="email" className="sr-only">
          {copy.emailLabel}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={copy.placeholder}
          disabled={pending}
          className="h-12 flex-1 rounded-full border border-border-strong bg-background px-5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
        />
        {/* Hidden from people, filled in by simple bots. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button
          type="submit"
          disabled={pending}
          className="h-12 rounded-full bg-gradient-accent px-7 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? copy.subscribing : copy.subscribe}
        </button>
      </form>
      {state.message && (
        <p role="status" className="relative text-sm font-medium lg:col-start-2">
          {state.message}
        </p>
      )}
    </section>
  );
}
