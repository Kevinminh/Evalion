import { useQuery } from "@tanstack/react-query";
import { Link, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { usersQueries } from "@workspace/api/users";
import { authClient } from "@workspace/features/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { HelpCircle, LogOut, Settings, ShieldCheck } from "lucide-react";

const navItems = [
  { label: "Utforsk", path: "/" as const, icon: "🔍" },
  { label: "Min samling", path: "/min-samling" as const, icon: "📁" },
  { label: "Historikk", path: "/historikk" as const, icon: "🕐" },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return (parts[0]?.[0] ?? "?").toUpperCase();
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return (first + last).toUpperCase();
}

export function AppSidebar() {
  const matchRoute = useMatchRoute();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const { data: me } = useQuery(usersQueries.me());
  const isAdmin = me?.role === "admin";

  const isActive = (path: string) => {
    if (path === "/") return !!matchRoute({ to: "/", fuzzy: false });
    return !!matchRoute({ to: path, fuzzy: true });
  };

  const handleLogout = async () => {
    await authClient.signOut();
    await navigate({ to: "/login" });
  };

  const name = session?.user?.name ?? "Bruker";
  const email = session?.user?.email ?? "";

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.png" alt="Evalion" />
      </div>

      <div className="sidebar-cta">
        <Link to="/lag-fagprat" className="sidebar-cta-btn">
          <span className="sidebar-cta-icon">+</span>
          <span>Lag en FagPrat</span>
        </Link>
      </div>

      <div className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item${isActive(item.path) ? " active" : ""}`}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            <span className="sidebar-item-label">{item.label}</span>
          </Link>
        ))}
        {isAdmin && (
          <Link
            to="/admin"
            className={`sidebar-item${isActive("/admin") ? " active" : ""}`}
          >
            <span className="sidebar-item-icon">
              <ShieldCheck className="size-4" />
            </span>
            <span className="sidebar-item-label">Admin</span>
          </Link>
        )}
      </div>

      <div className="sidebar-spacer" />

      <DropdownMenu>
        <DropdownMenuTrigger className="sidebar-user">
          <div className="sidebar-user-avatar">{getInitials(name)}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{name}</span>
            <span className="sidebar-user-email">{email}</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="top"
          sideOffset={8}
          className="card-menu-content"
        >
          <DropdownMenuItem className="card-menu-item" render={<Link to="/profile" />}>
            <Settings />
            Innstillinger
          </DropdownMenuItem>
          <DropdownMenuItem className="card-menu-item" disabled>
            <HelpCircle />
            Hjelp
          </DropdownMenuItem>
          <DropdownMenuSeparator className="card-menu-separator" />
          <DropdownMenuItem className="card-menu-item" onClick={handleLogout}>
            <LogOut />
            Logg ut
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
