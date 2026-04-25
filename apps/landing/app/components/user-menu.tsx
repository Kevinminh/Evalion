"use client";

import { DropdownMenuItem } from "@workspace/ui/components/dropdown-menu";
import { UserMenu as SharedUserMenu } from "@workspace/ui/components/user-menu";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

import { authClient } from "../lib/auth-client";

export function UserMenu() {
  const { data: session } = authClient.useSession();
  const [pending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await authClient.signOut();
      window.location.href = "/";
    });
  }

  return (
    <SharedUserMenu
      name={session?.user?.name ?? "Bruker"}
      email={session?.user?.email ?? ""}
      variant="compact"
      disabled={pending}
      onLogout={handleLogout}
    >
      <DropdownMenuItem render={<Link href="/lag-pastander" />}>
        <Sparkles className="size-4" />
        Lag påstander
      </DropdownMenuItem>
    </SharedUserMenu>
  );
}
