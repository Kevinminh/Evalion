import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { isAuthenticated } from "../lib/auth-server";

export const metadata: Metadata = {
  title: "Lag påstander",
  description: "AI-drevet påstandsgenerator for klasseromssamtaler.",
  robots: { index: false, follow: false },
};

export default async function LagPastanderPage() {
  if (!(await isAuthenticated())) {
    redirect("/logg-inn");
  }

  return (
    <section className="px-6 pt-16 pb-24">
      <div className="mx-auto max-w-[720px] text-center">
        <span className="section-label">Påstandsgeneratoren</span>
        <h1 className="font-display mt-3 text-[clamp(28px,3.5vw,42px)] leading-tight">
          Lag <em className="font-display-italic text-[var(--color-cl-purple)]">påstander</em> med
          Reddi
        </h1>
        <div className="mt-10 rounded-[24px] border border-[var(--color-cl-border)] bg-white p-10 shadow-sm">
          <img
            src="/assets/Reddi.png"
            alt="Reddi"
            className="mx-auto h-32 w-auto"
          />
          <h2 className="font-display mt-6 text-2xl font-semibold">
            Reddi finpusser påstandene sine 🤖
          </h2>
          <p className="mt-3 text-[var(--color-ink-secondary)]">
            Påstandsgeneratoren er rett rundt hjørnet. Vi gir deg beskjed så snart Reddi er klar.
          </p>
        </div>
      </div>
    </section>
  );
}
