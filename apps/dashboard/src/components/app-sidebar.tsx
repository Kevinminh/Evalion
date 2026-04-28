import { Link, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { UserMenu } from "@workspace/evalion/components/auth/user-menu";
import { Button } from "@workspace/ui/components/button";
import { DropdownMenuItem } from "@workspace/ui/components/dropdown-menu";
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
import { Search, FolderOpen, Clock, Plus, Settings, HelpCircle } from "lucide-react";
import type { ComponentProps } from "react";

import { authClient } from "@/lib/auth-client";

const navItems = [
  { label: "Utforsk", path: "/" as const, icon: Search },
  { label: "Min samling", path: "/min-samling" as const, icon: FolderOpen },
  { label: "Historikk", path: "/historikk" as const, icon: Clock },
];

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
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
        <UserMenu
          name={session?.user?.name ?? "Bruker"}
          email={session?.user?.email ?? ""}
          variant="expanded"
          onLogout={handleLogout}
        >
          <DropdownMenuItem render={<Link to="/profile" />}>
            <Settings className="size-4" />
            Innstillinger
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <HelpCircle className="size-4" />
            Hjelp
          </DropdownMenuItem>
        </UserMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
