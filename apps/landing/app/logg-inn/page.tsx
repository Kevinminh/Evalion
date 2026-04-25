import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { isAuthenticated } from "../lib/auth-server";
import { LoginPanel } from "./login-panel";

export const metadata: Metadata = {
  title: "Logg inn",
  description: "Logg inn for å bruke påstandsgeneratoren.",
};

export default async function LoggInnPage() {
  if (await isAuthenticated()) {
    redirect("/lag-pastander");
  }
  return (
    <div className="flex min-h-[calc(100svh-200px)] items-center justify-center px-6 py-12">
      <LoginPanel />
    </div>
  );
}
