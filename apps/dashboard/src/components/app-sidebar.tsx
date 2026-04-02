import { Link, useMatchRoute, useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { cn } from "@workspace/ui/lib/utils";
import { Search, FolderOpen, Clock, Plus, LogOut, Settings, HelpCircle } from "lucide-react";

import { authClient } from "@/lib/auth-client";

const navItems = [
  { label: "Utforsk", path: "/" as const, icon: Search },
  { label: "Min samling", path: "/min-samling" as const, icon: FolderOpen },
  { label: "Historikk", path: "/historikk" as const, icon: Clock },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AppSidebar() {
  const matchRoute = useMatchRoute();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const isActive = (path: string) => {
    if (path === "/") return matchRoute({ to: "/", fuzzy: false });
    return matchRoute({ to: path, fuzzy: true });
  };

  const handleLogout = async () => {
    await authClient.signOut();
    await navigate({ to: "/login" });
  };

  const userName = session?.user?.name ?? "Bruker";
  const userEmail = session?.user?.email ?? "";
  const initials = getInitials(userName);

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[220px] flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex items-center justify-center px-4 pt-4 pb-2">
        <img src="/logo.png" alt="Evalion" className="h-16 object-contain" />
      </div>

      {/* CTA Button */}
      <div className="px-4 py-2">
        <Link
          to="/lag-fagprat"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_oklch(0.4_0.15_15)] transition-transform hover:-translate-y-px"
        >
          <Plus className="size-5" />
          Lag en FagPrat
        </Link>
      </div>

      {/* Nav items */}
      <nav className="mt-2 flex flex-col gap-1 px-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              isActive(item.path)
                ? "bg-primary/10 font-medium text-primary"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User profile with dropdown */}
      <div className="px-3 pb-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-muted">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
              {initials}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold">{userName}</span>
              {userEmail && <span className="text-xs text-muted-foreground">{userEmail}</span>}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" sideOffset={8} align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{userName}</span>
                  {userEmail && (
                    <span className="text-xs font-normal text-muted-foreground">{userEmail}</span>
                  )}
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled>
                <Settings className="size-4" />
                Innstillinger
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <HelpCircle className="size-4" />
                Hjelp
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                <LogOut className="size-4" />
                Logg ut
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
