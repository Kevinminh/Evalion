import { WorkspaceShell } from "@workspace/evalion/components/workspace-shell";
import { redirect } from "next/navigation";

import { Header } from "@/components/header";
import { isAuthenticated } from "@/lib/auth-server";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) {
    redirect("/logg-inn");
  }
  return (
    <WorkspaceShell>
      <Header />
      {children}
    </WorkspaceShell>
  );
}
