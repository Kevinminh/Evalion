import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { DevToolsPopover } from "@/components/liveokt/dev-tools-popover";

export const Route = createFileRoute("/liveokt/$sessionId")({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: LiveSessionLayout,
});

function LiveSessionLayout() {
  return (
    <>
      <Outlet />
      <DevToolsPopover />
    </>
  );
}
