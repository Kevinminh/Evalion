import type { Metadata } from "next";

import { CONTACT_EMAIL } from "../lib/constants";

export const metadata: Metadata = {
  title: "Informasjonskapsler",
  description: "Informasjon om hvordan Evalion bruker informasjonskapsler.",
};

export default function CookiesPage() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-700 sm:text-5xl">
          Informasjonskapsler
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">Sist oppdatert: 28. mars 2026</p>

        <div className="mt-12 flex flex-col gap-10 text-gray-600">
          <div>
            <h2 className="text-2xl font-bold text-gray-700">1. Hva er informasjonskapsler?</h2>
            <p className="mt-3 leading-relaxed">
              Informasjonskapsler (cookies) er små tekstfiler som lagres på enheten din når du
              besøker et nettsted. De brukes til å huske innstillinger, forbedre brukeropplevelsen og
              samle inn anonymisert statistikk.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700">
              2. Hvordan vi bruker informasjonskapsler
            </h2>
            <p className="mt-3 leading-relaxed">
              Evalion bruker informasjonskapsler til følgende formål:
            </p>

            <div className="mt-6 flex flex-col gap-6">
              <div className="rounded-lg border p-4">
                <h3 className="font-bold text-gray-700">Nødvendige informasjonskapsler</h3>
                <p className="mt-2 text-sm leading-relaxed">
                  Disse er påkrevd for at tjenesten skal fungere. De brukes til autentisering,
                  øktstyring og sikkerhet. Du kan ikke deaktivere disse.
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-bold text-gray-700">Funksjonelle informasjonskapsler</h3>
                <p className="mt-2 text-sm leading-relaxed">
                  Disse husker dine preferanser, som språk og visningsinnstillinger, slik at du får
                  en bedre opplevelse når du kommer tilbake.
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-bold text-gray-700">Analytiske informasjonskapsler</h3>
                <p className="mt-2 text-sm leading-relaxed">
                  Disse hjelper oss å forstå hvordan besøkende bruker nettstedet vårt. Informasjonen
                  er anonymisert og brukes kun til å forbedre tjenesten.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700">3. Tredjepartsinformasjonskapsler</h2>
            <p className="mt-3 leading-relaxed">
              Vi kan bruke tjenester fra tredjeparter (som analyseverktøy) som setter egne
              informasjonskapsler. Disse tredjepartene har egne personvernerklæringer som vi
              oppfordrer deg til å lese.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700">
              4. Administrere informasjonskapsler
            </h2>
            <p className="mt-3 leading-relaxed">
              Du kan administrere og slette informasjonskapsler gjennom nettleserens innstillinger.
              Vær oppmerksom på at deaktivering av nødvendige informasjonskapsler kan påvirke
              tjenestens funksjonalitet.
            </p>
            <p className="mt-3 leading-relaxed">De fleste nettlesere lar deg:</p>
            <ul className="mt-3 flex flex-col gap-2 pl-6 leading-relaxed">
              <li className="list-disc">Se hvilke informasjonskapsler som er lagret.</li>
              <li className="list-disc">Slette enkeltvis eller alle informasjonskapsler.</li>
              <li className="list-disc">Blokkere informasjonskapsler fra bestemte nettsteder.</li>
              <li className="list-disc">Blokkere alle informasjonskapsler.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700">5. Endringer</h2>
            <p className="mt-3 leading-relaxed">
              Vi kan oppdatere denne siden for å gjenspeile endringer i vår bruk av
              informasjonskapsler. Siste oppdateringsdato vises øverst på siden.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700">6. Kontakt</h2>
            <p className="mt-3 leading-relaxed">
              Har du spørsmål om vår bruk av informasjonskapsler? Kontakt oss på{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-primary underline hover:no-underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
