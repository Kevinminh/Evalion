import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

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
    <div className="min-h-svh bg-background">
      <AppSidebar />
      <main className="min-h-svh py-8 pr-10 pl-[260px]">
        <Outlet />
      </main>
    </div>
  );
}
