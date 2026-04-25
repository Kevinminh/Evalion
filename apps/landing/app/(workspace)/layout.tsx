import { WorkspaceShell } from "@workspace/ui/components/workspace-shell";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/auth-server";
import { WorkspaceTopNav } from "./workspace-top-nav";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) {
    redirect("/logg-inn");
  }
  return (
    <WorkspaceShell>
      <WorkspaceTopNav />
      {children}
    </WorkspaceShell>
  );
}
