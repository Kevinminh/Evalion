import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { LogoutCard } from "@workspace/ui/components/logout-card";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/logout")({ component: LogoutPage });

function LogoutPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authClient.signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6">
      <LogoutCard
        logo={<img src="/logo.png" alt="Evalion" className="mx-auto h-10" />}
        onLogout={handleLogout}
        onCancel={() => navigate({ to: "/" })}
      />
    </div>
  );
}
