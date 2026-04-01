import { Link, useMatchRoute } from "@tanstack/react-router";
import { Search, FolderOpen, Plus } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

const navItems = [
  { label: "Utforsk", path: "/" as const, icon: Search },
  { label: "Min samling", path: "/min-samling" as const, icon: FolderOpen },
];

export function AppSidebar() {
  const matchRoute = useMatchRoute();
  const isActive = (path: string) => {
    if (path === "/") return matchRoute({ to: "/", fuzzy: false });
    return matchRoute({ to: path, fuzzy: true });
  };

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-[220px] flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex items-center justify-center px-4 pt-4 pb-2">
        <img src="/logo.png" alt="Evalion" className="h-16 object-contain" />
      </div>

      {/* CTA Button */}
      <div className="px-4 py-2">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_oklch(0.4_0.15_15)] transition-transform hover:-translate-y-px">
          <Plus className="size-5" />
          Lag en FagPrat
        </button>
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

      {/* User profile */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-muted">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
            MF
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Markus Furseth</span>
            <span className="text-xs text-muted-foreground">markus@evalion.no</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
