"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { ChevronDown, LogOut, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { authClient } from "../lib/auth-client";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserMenu() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [pending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await authClient.signOut();
      router.refresh();
      router.push("/");
    });
  }

  const userName = session?.user?.name ?? "Bruker";
  const userEmail = session?.user?.email ?? "";
  const initials = getInitials(userName);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-cl-border)] bg-white py-1 pr-3 pl-1 text-sm transition-colors hover:bg-[var(--color-cl-surface-soft)] disabled:opacity-50"
        disabled={pending}
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-cl-purple)] text-xs font-bold text-white">
          {initials}
        </span>
        <span className="hidden font-medium sm:inline">{userName}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">{userName}</span>
              {userEmail && (
                <span className="text-xs font-normal text-muted-foreground">{userEmail}</span>
              )}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/lag-pastander" />}>
            <Sparkles className="size-4" />
            Lag påstander
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={handleLogout} disabled={pending}>
            <LogOut className="size-4" />
            Logg ut
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
