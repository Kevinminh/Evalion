"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { LoginForm } from "@workspace/ui/components/login-form";

import { authClient, signInWithGoogle } from "@/lib/auth-client";

export function LoginPanel() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const email = (data.get("email") as string)?.trim();
    const password = data.get("password") as string;
    try {
      const { error: authError } = await authClient.signIn.email({ email, password });
      if (authError) {
        setError(authError.message ?? "Innlogging feilet. Sjekk e-post og passord.");
      } else {
        router.refresh();
        router.push("/lag-pastander");
      }
    } catch {
      setError("Innlogging feilet. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginForm
      logo={
        <img
          src="/assets/CO-LAB (Hoved) - uten skygge.png"
          alt="CO-LAB"
          className="mx-auto mb-2 h-8"
        />
      }
      description="Logg inn for å lage påstander med Reddi"
      onSubmit={handleSubmit}
      onGoogleSignIn={() => signInWithGoogle("/lag-pastander")}
      error={error}
      loading={loading}
      footer={
        <span className="text-sm text-[var(--color-ink-secondary)]">
          Ingen konto?{" "}
          <Link
            href="/registrer-deg"
            className="font-bold text-[var(--color-cl-purple)] hover:underline"
          >
            Registrer deg
          </Link>
        </span>
      }
    />
  );
}
