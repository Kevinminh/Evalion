"use client";

import { cn } from "@workspace/ui/lib/utils";
import { ChevronDown, LogOut } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserAvatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground",
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}

interface UserMenuProps {
  name: string;
  email?: string;
  /** "compact" = pill button with avatar + name + chevron. "expanded" = full block with name + email stacked. */
  variant?: "compact" | "expanded";
  triggerClassName?: string;
  onLogout?: () => void;
  /** Extra menu items rendered between the name label and the logout item */
  children?: ReactNode;
  contentProps?: Partial<ComponentProps<typeof DropdownMenuContent>>;
  logoutLabel?: string;
  disabled?: boolean;
}

export function UserMenu({
  name,
  email,
  variant = "compact",
  triggerClassName,
  onLogout,
  children,
  contentProps,
  logoutLabel = "Logg ut",
  disabled,
}: UserMenuProps) {
  const isCompact = variant === "compact";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        className={cn(
          isCompact
            ? "flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card py-1 pr-3 pl-1 text-sm transition-colors hover:bg-muted disabled:opacity-50"
            : "flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-sidebar-accent disabled:opacity-50",
          triggerClassName,
        )}
      >
        <UserAvatar name={name} className={isCompact ? "size-7" : undefined} />
        {isCompact ? (
          <>
            <span className="hidden font-medium sm:inline">{name}</span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </>
        ) : (
          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold">{name}</span>
            {email && <span className="text-xs text-muted-foreground">{email}</span>}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isCompact ? "end" : "start"}
        side={isCompact ? "bottom" : "top"}
        sideOffset={8}
        className="min-w-56"
        {...contentProps}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">{name}</span>
              {email && (
                <span className="text-xs font-normal text-muted-foreground">{email}</span>
              )}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        {children ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>{children}</DropdownMenuGroup>
          </>
        ) : null}
        {onLogout ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onClick={onLogout}
                disabled={disabled}
              >
                <LogOut className="size-4" />
                {logoutLabel}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
