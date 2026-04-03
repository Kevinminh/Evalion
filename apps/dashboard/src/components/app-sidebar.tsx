import { Link, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { Search, FolderOpen, Clock, Plus, LogOut, Settings, HelpCircle } from "lucide-react";
import * as React from "react";

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
    <Sidebar {...props}>
      <SidebarHeader className="items-center justify-center px-4 pt-4 pb-2">
        <img src="/logo.png" alt="Evalion" className="h-16 object-contain" />
      </SidebarHeader>

      <SidebarGroup className="px-4 py-2">
        <Button
          variant="accent"
          className="w-full rounded-lg"
          render={<Link to="/lag-fagprat" search={{ draft: "" }} />}
        >
          <Plus className="size-5" />
          Lag en FagPrat
        </Button>
      </SidebarGroup>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={!!isActive(item.path)}
                    tooltip={item.label}
                    render={<Link to={item.path} />}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-sidebar-accent">
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
      </SidebarFooter>
    </Sidebar>
  );
}
