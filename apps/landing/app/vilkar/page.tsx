import type { Metadata } from "next";

import { CONTACT_EMAIL } from "../lib/constants";

export const metadata: Metadata = {
  title: "Vilkår for bruk",
  description: "Les Evalions vilkår for bruk av tjenesten.",
};

export default function TermsPage() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-700 sm:text-5xl">
          Vilkår for bruk
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">Sist oppdatert: 28. mars 2026</p>

        <div className="mt-12 flex flex-col gap-10 text-gray-600">
          <div>
            <h2 className="text-2xl font-bold text-gray-700">1. Aksept av vilkår</h2>
            <p className="mt-3 leading-relaxed">
              Ved å opprette en konto eller bruke Evalion («tjenesten») godtar du disse vilkårene for
              bruk. Hvis du ikke godtar vilkårene, må du ikke bruke tjenesten. Evalion AS forbeholder
              seg retten til å endre disse vilkårene når som helst. Endringer trår i kraft når de
              publiseres på denne siden.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700">2. Konto</h2>
            <p className="mt-3 leading-relaxed">
              For å bruke visse funksjoner må du opprette en konto. Du er ansvarlig for å holde
              kontoinformasjonen din konfidensiell og for all aktivitet som skjer på kontoen din. Du
              må være minst 18 år for å opprette en lærerkonto. Elever deltar gjennom spillkoder og
              trenger ikke egen konto.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700">3. Akseptabel bruk</h2>
            <p className="mt-3 leading-relaxed">Du godtar å ikke:</p>
            <ul className="mt-3 flex flex-col gap-2 pl-6 leading-relaxed">
              <li className="list-disc">Bruke tjenesten til ulovlige eller skadelige formål.</li>
              <li className="list-disc">
                Laste opp støtende, diskriminerende eller upassende innhold.
              </li>
              <li className="list-disc">
                Forsøke å få uautorisert tilgang til andre kontoer eller systemer.
              </li>
              <li className="list-disc">
                Bruke automatiserte verktøy for å samle inn data fra tjenesten.
              </li>
              <li className="list-disc">Forstyrre eller overbelaste tjenestens infrastruktur.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700">
              4. Innhold og immaterielle rettigheter
            </h2>
            <p className="mt-3 leading-relaxed">
              Spørsmålssett og innhold du oppretter tilhører deg. Du gir Evalion en begrenset lisens
              til å vise og distribuere innholdet ditt innenfor tjenesten. Evalions varemerker, logo,
              design og programvare er beskyttet av lov om opphavsrett og tilhører Evalion AS.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700">5. Abonnement og betaling</h2>
            <p className="mt-3 leading-relaxed">
              Premiumfunksjoner krever et betalt abonnement. Priser er oppgitt inkludert mva.
              Abonnementet fornyes automatisk med mindre du avbryter før fornyelsesdatoen. Refusjoner
              gis i henhold til norsk forbrukerkjøpslov og angrerettloven.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700">6. Ansvarsbegrensning</h2>
            <p className="mt-3 leading-relaxed">
              Evalion leveres «som den er». Vi gjør vårt beste for å sikre tilgjengelighet og
              kvalitet, men garanterer ikke uavbrutt drift. Evalion AS er ikke ansvarlig for indirekte
              tap, tapte data eller driftsavbrudd utover det som følger av ufravikelig norsk lov.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700">7. Oppsigelse</h2>
            <p className="mt-3 leading-relaxed">
              Vi kan suspendere eller avslutte kontoen din dersom du bryter disse vilkårene. Du kan
              når som helst slette kontoen din via kontoinnstillingene eller ved å kontakte oss.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700">8. Lovvalg og tvisteløsning</h2>
            <p className="mt-3 leading-relaxed">
              Disse vilkårene er underlagt norsk lov. Eventuelle tvister skal forsøkes løst i
              minnelighet. Dersom det ikke lykkes, avgjøres tvisten av norske domstoler med Oslo
              tingrett som verneting.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700">9. Kontakt</h2>
            <p className="mt-3 leading-relaxed">
              Spørsmål om vilkårene? Kontakt oss på{" "}
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
