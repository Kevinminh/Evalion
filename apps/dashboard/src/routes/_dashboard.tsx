import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@workspace/ui/components/sidebar";

import { AppSidebar } from "@/components/app-sidebar";

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 px-4 md:hidden">
          <SidebarTrigger />
        </header>
        <div className="px-4 py-6 sm:px-6 md:px-10 md:py-8">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
