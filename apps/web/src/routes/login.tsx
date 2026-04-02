import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { LoginForm } from "@workspace/ui/components/login-form";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error: authError } = await authClient.signIn.email({
      email,
      password,
    });

    if (authError) {
      setError(authError.message ?? "Innlogging feilet");
      setLoading(false);
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6">
      <LoginForm
        logo={<img src="/logo.png" alt="Evalion" className="mx-auto h-10" />}
        description="Logg inn på din FagPrat-konto"
        onSubmit={handleSubmit}
        error={error}
        loading={loading}
      />
    </div>
  );
}
