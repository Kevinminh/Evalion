"use client";

import { useMutation } from "convex/react";
import { useState } from "react";

import { api } from "@workspace/backend/convex/_generated/api";

export function EmailSignupForm({ source }: { source?: string }) {
  const subscribe = useMutation(api.emailSubscribers.subscribeToLaunch);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    const email = (data.get("email") as string)?.trim();
    if (!email) return;
    setSubmitting(true);
    try {
      await subscribe({ email, source });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noe gikk galt. Prøv igjen.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <p className="rounded-[var(--co-lab-radius-full)] bg-sage-100 px-5 py-3 text-center text-sm font-semibold text-sage-600">
        ✅ Takk! Vi gir deg beskjed når CO-LAB er klart.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="email"
        name="email"
        required
        disabled={submitting}
        placeholder="din@epost.no"
        aria-label="E-postadresse"
        className="flex-1 rounded-full border border-cl-border bg-white px-5 py-3 text-sm text-ink outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-purple-500 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-sage-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sender …" : "Meld interesse →"}
      </button>
      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
