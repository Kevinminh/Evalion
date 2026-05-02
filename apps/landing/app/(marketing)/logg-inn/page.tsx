import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/auth-server";
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
    <div className="flex min-h-[100svh] items-center justify-center px-4 py-10 sm:px-6 sm:py-12 md:items-start md:pt-20">
      <LoginPanel />
    </div>
  );
}
