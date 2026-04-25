"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { RegisterForm } from "@workspace/ui/components/register-form";

import { authClient, signInWithGoogle } from "../lib/auth-client";

export function RegisterPanel() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const name = (data.get("name") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const password = data.get("password") as string;
    try {
      const { error: authError } = await authClient.signUp.email({ name, email, password });
      if (authError) {
        setError(authError.message ?? "Registrering feilet. Prøv igjen.");
      } else {
        router.refresh();
        router.push("/lag-pastander");
      }
    } catch {
      setError("Registrering feilet. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <RegisterForm
      logo={
        <img
          src="/assets/CO-LAB (Hoved) - uten skygge.png"
          alt="CO-LAB"
          className="mx-auto mb-2 h-8"
        />
      }
      description="Opprett en konto for å lage påstander med Reddi"
      onSubmit={handleSubmit}
      onGoogleSignIn={() => signInWithGoogle("/lag-pastander")}
      error={error}
      loading={loading}
      footer={
        <span className="text-sm text-[var(--color-ink-secondary)]">
          Har du allerede en konto?{" "}
          <Link
            href="/logg-inn"
            className="font-bold text-[var(--color-cl-purple)] hover:underline"
          >
            Logg inn
          </Link>
        </span>
      }
    />
  );
}
