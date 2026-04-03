import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { RegisterForm } from "@workspace/ui/components/register-form";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/register")({
  beforeLoad: ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error: authError } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (authError) {
        setError(authError.message ?? "Registrering feilet");
      } else {
        navigate({ to: "/" });
      }
    } catch {
      setError("Registrering feilet. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    authClient.signIn.social({ provider: "google", callbackURL: window.location.origin + "/" });
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6">
      <RegisterForm
        logo={<img src="/logo.png" alt="Evalion" className="mx-auto h-10" />}
        description="Opprett en konto for å komme i gang"
        onSubmit={handleSubmit}
        onGoogleSignIn={handleGoogleSignIn}
        error={error}
        loading={loading}
        footer={
          <span className="text-sm text-muted-foreground">
            Har du allerede en konto?{" "}
            <Link to="/login" className="text-primary underline-offset-4 hover:underline">
              Logg inn
            </Link>
          </span>
        }
      />
    </div>
  );
}
