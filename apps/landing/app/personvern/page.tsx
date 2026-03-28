import type { Metadata } from "next";

import { CONTACT_EMAIL } from "../lib/constants";

export const metadata: Metadata = {
  title: "Personvernerklæring",
  description: "Les Evalions personvernerklæring og hvordan vi beskytter dine data.",
};

export default function PrivacyPage() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-700 sm:text-5xl">
          Personvernerklæring
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">Sist oppdatert: 28. mars 2026</p>

        <div className="mt-12 flex flex-col gap-10 text-gray-600">
          <div>
            <h2 className="text-2xl font-bold text-gray-700">1. Innledning</h2>
            <p className="mt-3 leading-relaxed">
              Evalion AS («vi», «oss», «vår») er behandlingsansvarlig for personopplysninger som
              samles inn gjennom våre tjenester på evalion.no og tilhørende applikasjoner. Vi er
              forpliktet til å beskytte personvernet ditt og behandle personopplysninger i samsvar med
              gjeldende personvernlovgivning, inkludert EUs personvernforordning (GDPR) og den norske
              personopplysningsloven.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700">
              2. Hvilke opplysninger vi samler inn
            </h2>
            <p className="mt-3 leading-relaxed">Vi samler inn følgende typer opplysninger:</p>
            <ul className="mt-3 flex flex-col gap-2 pl-6 leading-relaxed">
              <li className="list-disc">
                <strong>Kontoinformasjon:</strong> Navn, e-postadresse og passord når du oppretter en
                konto.
              </li>
              <li className="list-disc">
                <strong>Bruksdata:</strong> Informasjon om hvordan du bruker tjenesten, inkludert
                spillresultater, spørsmålssett og rapporter.
              </li>
              <li className="list-disc">
                <strong>Teknisk informasjon:</strong> IP-adresse, nettlesertype, operativsystem og
                enhetsinformasjon for å sikre at tjenesten fungerer optimalt.
              </li>
              <li className="list-disc">
                <strong>Elevdata:</strong> Kallenavn eller navn som brukes under spill. Vi samler ikke
                inn personopplysninger direkte fra elever under 13 år uten samtykke fra foresatte.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700">3. Hvordan vi bruker opplysningene</h2>
            <p className="mt-3 leading-relaxed">Vi bruker personopplysninger til å:</p>
            <ul className="mt-3 flex flex-col gap-2 pl-6 leading-relaxed">
              <li className="list-disc">Levere og forbedre våre tjenester.</li>
              <li className="list-disc">Administrere kontoen din og abonnement.</li>
              <li className="list-disc">Sende viktige oppdateringer om tjenesten.</li>
              <li className="list-disc">Generere rapporter og analyser for lærere.</li>
              <li className="list-disc">Overholde juridiske forpliktelser og forebygge misbruk.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700">4. Lagring og sikkerhet</h2>
            <p className="mt-3 leading-relaxed">
              Personopplysninger lagres på sikre servere innenfor EU/EØS. Vi bruker
              bransjestandarder for kryptering og tilgangskontroll for å beskytte dine data.
              Opplysninger lagres så lenge kontoen din er aktiv, eller så lenge det er nødvendig for å
              oppfylle formålet med behandlingen.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700">5. Deling med tredjeparter</h2>
            <p className="mt-3 leading-relaxed">
              Vi selger aldri personopplysningene dine. Vi kan dele opplysninger med pålitelige
              tredjepartsleverandører som hjelper oss å drifte tjenesten (f.eks. hosting, e-post), og
              kun i den grad det er nødvendig. Alle tredjeparter er forpliktet til å beskytte
              opplysningene i henhold til gjeldende lovgivning.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700">6. Dine rettigheter</h2>
            <p className="mt-3 leading-relaxed">Du har rett til å:</p>
            <ul className="mt-3 flex flex-col gap-2 pl-6 leading-relaxed">
              <li className="list-disc">Få innsyn i hvilke opplysninger vi har om deg.</li>
              <li className="list-disc">Be om retting av uriktige opplysninger.</li>
              <li className="list-disc">Be om sletting av dine opplysninger.</li>
              <li className="list-disc">Protestere mot behandling av dine data.</li>
              <li className="list-disc">Be om dataportabilitet.</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              For å utøve dine rettigheter, kontakt oss på{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-primary underline hover:no-underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700">7. Kontakt oss</h2>
            <p className="mt-3 leading-relaxed">
              Har du spørsmål om personvern? Kontakt oss på{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-primary underline hover:no-underline"
              >
                {CONTACT_EMAIL}
              </a>
              . Du kan også klage til Datatilsynet dersom du mener at vi ikke behandler
              personopplysningene dine i samsvar med loven.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
