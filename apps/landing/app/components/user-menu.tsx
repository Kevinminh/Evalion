"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@workspace/ui/components/button";

import { authClient } from "../lib/auth-client";

export function UserMenu() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await authClient.signOut();
      router.refresh();
      router.push("/");
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-full"
      disabled={pending}
      onClick={handleLogout}
    >
      Logg ut
    </Button>
  );
}
