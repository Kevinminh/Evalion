"use client";

import { DropdownMenuItem } from "@workspace/ui/components/dropdown-menu";
import { UserMenu as SharedUserMenu } from "@workspace/evalion/components/auth/user-menu";
import { Sparkles, UserRound } from "lucide-react";
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
      triggerClassName="gap-3 pl-1.5 pr-4"
      contentProps={{ className: "min-w-56" }}
    >
      <DropdownMenuItem render={<Link href="/lag-pastander" />}>
        <Sparkles className="size-4" />
        Lag påstander
      </DropdownMenuItem>
      <DropdownMenuItem render={<Link href="/profile" />}>
        <UserRound className="size-4" />
        Min profil
      </DropdownMenuItem>
    </SharedUserMenu>
  );
}
