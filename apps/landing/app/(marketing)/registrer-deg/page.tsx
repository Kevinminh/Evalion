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
    <div className="flex min-h-[100svh] items-start justify-center px-4 pt-12 pb-10 sm:px-6 sm:pt-16 sm:pb-12 md:pt-20">
      <RegisterPanel />
    </div>
  );
}
