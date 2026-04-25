import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/auth-server";
import { WorkspaceTopNav } from "./workspace-top-nav";

import "./styles.css";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) {
    redirect("/logg-inn");
  }
  return (
    <div className="workspace-shell">
      <WorkspaceTopNav />
      {children}
    </div>
  );
}
