import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/auth-server";
import { RegisterPanel } from "./register-panel";

export const metadata: Metadata = {
  title: "Registrer deg",
  description: "Opprett en konto for å bruke påstandsgeneratoren.",
};

export default async function RegistrerDegPage() {
  if (await isAuthenticated()) {
    redirect("/lag-pastander");
  }
  return (
    <div className="flex min-h-[calc(100svh-200px)] items-center justify-center px-6 py-12">
      <RegisterPanel />
    </div>
  );
}
