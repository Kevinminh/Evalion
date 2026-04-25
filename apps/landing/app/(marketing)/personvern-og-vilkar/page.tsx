import type { Metadata } from "next";

import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Personvern og brukervilkår",
  description: "Personvernerklæring og brukervilkår for CO-LAB (pre-launch).",
};

const tldr = [
  "Vi samler minimalt med data: e-post for varsling og innlogging for påstandsgeneratoren.",
  "Input og genererte påstander lagres på profilen din så du finner dem igjen – du kan slette dem når som helst.",
  "Vi trener ingen AI-modeller på din data. Det krever et eget, separat samtykke.",
  "Azure OpenAI (EU-region) genererer påstander og trener ikke på det du sender inn.",
  "All data håndteres etter personopplysningsloven og GDPR, lagret i EU/EØS.",
  "Du har rett til innsyn, retting, sletting og klage til Datatilsynet.",
];

export default function PersonvernOgVilkarPage() {
  return (
    <div className="px-4 pt-8 pb-16 sm:px-6 sm:pt-12 sm:pb-24">
      <div className="mx-auto max-w-[820px]">
        {/* HERO */}
        <section className="text-center">
          <span className="section-label">Personvern og vilkår</span>
          <h1 className="font-display mt-3 text-[clamp(32px,4.5vw,52px)] leading-tight">
            Hvordan vi tar vare på{" "}
            <em className="font-display-italic text-[var(--color-cl-purple)]">dataen din</em>
          </h1>
          <p className="mx-auto mt-3 max-w-[560px] text-base text-[var(--color-ink-secondary)]">
            En ærlig og enkel forklaring av hva vi samler inn, hvorfor, og hva vi aldri gjør.
          </p>
          <p className="mt-5 text-sm text-[var(--color-ink-tertiary)]">
            Sist oppdatert: 25. april 2026
          </p>
        </section>

        {/* TL;DR */}
        <section className="mt-10 rounded-[20px] border border-[var(--color-cl-border)] bg-white p-5 shadow-sm sm:p-7">
          <h2 className="font-display text-xl font-semibold">Kort fortalt</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {tldr.map((item) => (
              <li
                key={item}
                className="relative pl-7 text-[var(--color-ink-secondary)] before:absolute before:left-0 before:top-0.5 before:font-bold before:text-[var(--color-sage)] before:content-['✓']"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* JUMP NAV */}
        <nav className="mt-10 flex flex-wrap gap-2" aria-label="Hopp til seksjon">
          {[
            { id: "personvern", label: "Personvernerklæring" },
            { id: "brukervilkar", label: "Brukervilkår" },
            { id: "kontakt", label: "Kontakt" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="inline-flex items-center rounded-full border border-[var(--color-cl-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition hover:-translate-y-0.5 hover:border-[var(--color-cl-purple)] hover:text-[var(--color-cl-purple)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* PERSONVERN */}
        <section id="personvern" className="mt-12 scroll-mt-24">
          <h2 className="font-display border-b-2 border-[var(--color-cl-border)] pb-4 text-[clamp(26px,3vw,34px)] font-semibold">
            Personvernerklæring
          </h2>

          <Heading>1. Behandlingsansvarlig</Heading>
          <P>
            <strong>CO-LAB AS</strong>
            <br />
            Org.nr. [sett inn]
            <br />
            Kontakt:{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold text-[var(--color-cl-purple)] hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </P>

          <Heading>2. Hvilke personopplysninger vi samler inn</Heading>
          <P>
            <strong>Ved påmelding til lanseringsvarsel:</strong>
          </P>
          <UL>
            <li>E-postadresse</li>
            <li>(Valgfritt) navn og skole</li>
          </UL>
          <P>
            <strong>Ved opprettelse av konto for påstandsgeneratoren:</strong>
          </P>
          <UL>
            <li>E-postadresse</li>
            <li>Passord (lagret som kryptert hash – vi ser aldri passordet ditt)</li>
            <li>(Valgfritt) navn og skole</li>
            <li>Innloggingslogger (tidspunkt, IP) for sikkerhet</li>
          </UL>
          <P>
            <strong>Ved bruk av påstandsgeneratoren:</strong>
          </P>
          <UL>
            <li>Tekstinput (fag, tema, trinn)</li>
            <li>Genererte påstander (lagres på din profil så du kan gjenbruke og eksportere)</li>
          </UL>

          <Heading>3. Hva som lagres, og hvor lenge</Heading>
          <Table
            head={["Type data", "Lagres?", "Varighet"]}
            rows={[
              ["E-postadresse", "Ja", "Til du melder deg av eller sletter kontoen"],
              ["Passord-hash", "Ja", "Til du sletter kontoen"],
              ["Innloggingslogger", "Ja", "90 dager"],
              [
                "Input til påstandsgeneratoren",
                "Ja",
                "Koblet til profilen din, til du sletter",
              ],
              ["Genererte påstander", "Ja", "Koblet til profilen din, til du sletter"],
              ["Anonymisert og aggregert statistikk", "Ja", "Ubestemt (uten personidentifisering)"],
            ]}
          />

          <Heading>4. Formål og rettslig grunnlag</Heading>
          <Table
            head={["Formål", "Rettslig grunnlag (GDPR art. 6)"]}
            rows={[
              ["Varsle om lansering", "Samtykke (a)"],
              ["Drift av innlogging og påstandsgenerator", "Avtaleoppfyllelse (b)"],
              ["Sikkerhetslogger, misbrukshindring", "Berettiget interesse (f)"],
              ["Produktforbedring via anonymisert statistikk", "Berettiget interesse (f)"],
            ]}
          />

          <Heading>5. AI og maskinlæring</Heading>
          <P>
            Vi bruker <strong>Azure OpenAI</strong> (Microsofts hosting av OpenAI-modeller i
            EU-region) til å generere påstander fra inputen din.
          </P>
          <div className="legal-callout legal-callout--ai">
            <P>
              <strong>Hva vi gjør:</strong>
            </P>
            <UL>
              <li>Lagrer input og genererte påstander på din konto så du finner dem igjen.</li>
              <li>
                Bruker anonymiserte, aggregerte data for å forstå bruksmønstre og forbedre
                generatoren.
              </li>
              <li>Retter feil og forbedrer prompter når vi ser at generatoren gir dårlige resultater.</li>
            </UL>
            <P className="mt-3">
              <strong>Hva vi IKKE gjør:</strong>
            </P>
            <UL>
              <li>
                Vi trener ingen egne AI-modeller på din data – dette krever et separat,
                uttrykkelig samtykke vi eventuelt ber om senere.
              </li>
              <li>
                Azure OpenAI trener ikke modellene sine på det du sender inn (Microsofts
                «no-training»-garanti for Azure OpenAI-tjenesten).
              </li>
              <li>Vi deler aldri dine påstander offentlig uten ditt uttrykkelige samtykke.</li>
            </UL>
          </div>

          <Heading>6. Deling med tredjeparter</Heading>
          <P>
            Vi deler kun data med disse leverandørene, og kun der det er nødvendig for å levere
            tjenesten:
          </P>
          <Table
            head={["Leverandør", "Formål", "Lokasjon"]}
            rows={[
              ["Azure OpenAI (Microsoft)", "AI-generering", "EU-region"],
              ["Brevo (e-postutsendinger)", "Lanseringsvarsel", "EU"],
              ["Convex / Hetzner / AWS EU", "Drift av nettside og database", "EU"],
            ]}
          />
          <div className="legal-callout">
            <P>
              <strong>Vi selger aldri data. Vi deler aldri med annonsører.</strong>
            </P>
          </div>

          <Heading>7. Overføring utenfor EØS</Heading>
          <P>
            Vi holder data i EU/EØS der det er mulig. Ved eventuell overføring utenfor EØS bruker
            vi EUs standardkontrakter (Standard Contractual Clauses).
          </P>

          <Heading>8. Dine rettigheter</Heading>
          <UL>
            <li>
              <strong>Innsyn</strong> i personopplysningene vi har om deg
            </li>
            <li>
              <strong>Retting</strong> av feil i opplysningene
            </li>
            <li>
              <strong>Sletting</strong> av opplysningene dine («retten til å bli glemt»)
            </li>
            <li>
              <strong>Dataportabilitet</strong> – få utlevert dataen din i et maskinlesbart format
            </li>
            <li>
              <strong>Trekke samtykke</strong> tilbake når som helst
            </li>
            <li>
              <strong>Klage til Datatilsynet</strong> (
              <a
                href="https://www.datatilsynet.no"
                target="_blank"
                rel="noopener"
                className="font-semibold text-[var(--color-cl-purple)] hover:underline"
              >
                www.datatilsynet.no
              </a>
              )
            </li>
          </UL>

          <Heading>9. Informasjonskapsler</Heading>
          <P>
            Vi bruker kun nødvendige cookies (innlogging og sikkerhet). Eventuelle analyse-cookies
            vil kreve samtykke via en banner.
          </P>

          <Heading>10. Sikkerhet</Heading>
          <UL>
            <li>Alle forbindelser krypteres med TLS (HTTPS).</li>
            <li>Passord lagres som sikre hasher (bcrypt/argon2).</li>
            <li>Tilgangskontroll begrenser hvem som kan se dataen.</li>
          </UL>

          <Heading>11. Endringer i personvernerklæringen</Heading>
          <P>
            Vesentlige endringer varsles via e-post til registrerte brukere, minst 14 dager før de
            trer i kraft.
          </P>
        </section>

        {/* DIVIDER */}
        <div className="my-20 text-center">
          <span
            aria-hidden="true"
            className="mx-auto mb-5 block h-0.5 w-20 rounded bg-[var(--color-cl-purple)]"
          />
          <span className="font-display-italic text-sm text-[var(--color-ink-tertiary)]">
            Del 2 · Brukervilkår
          </span>
        </div>

        {/* BRUKERVILKÅR */}
        <section id="brukervilkar" className="scroll-mt-24">
          <h2 className="font-display border-b-2 border-[var(--color-cl-border)] pb-4 text-[clamp(26px,3vw,34px)] font-semibold">
            Brukervilkår
          </h2>

          <Heading>1. Hva er CO-LAB?</Heading>
          <P>
            CO-LAB er et lærerstyrt digitalt verktøy for klasseromssamtaler. I pre-launch-perioden
            tilbyr vi:
          </P>
          <UL>
            <li>Påmelding til lanseringsvarsel</li>
            <li>Tilgang til påstandsgeneratoren (med innlogging)</li>
          </UL>

          <Heading>2. Hvem kan bruke tjenesten</Heading>
          <P>
            Tjenesten er rettet mot <strong>lærere og pedagogisk personale over 18 år</strong> i
            norske skoler. Elever kan ikke opprette konto i pre-launch-perioden.
          </P>

          <Heading>3. Konto og sikkerhet</Heading>
          <UL>
            <li>Du er ansvarlig for å holde passordet ditt hemmelig.</li>
            <li>Ikke del kontoen din med andre.</li>
            <li>
              Mistanke om uautorisert bruk? Kontakt{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-semibold text-[var(--color-cl-purple)] hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </li>
          </UL>

          <Heading>4. Bruk av påstandsgeneratoren</Heading>
          <P>
            <strong>Hva du kan gjøre:</strong>
          </P>
          <UL>
            <li>Generere påstander til egen undervisning</li>
            <li>Finne igjen tidligere genereringer i «Min historikk»</li>
            <li>Eksportere påstander som PDF</li>
            <li>Bruke påstandene fritt i din egen undervisning</li>
          </UL>
          <P>
            <strong>Hva du ikke kan gjøre:</strong>
          </P>
          <UL>
            <li>Bruke tjenesten til ulovlig, trakasserende eller skadelig innhold</li>
            <li>Legge inn personidentifiserende elev-informasjon i input</li>
            <li>Forsøke å reversere, «hacke» eller overbelaste tjenesten</li>
            <li>Videreselge eller distribuere påstander som om de var CO-LAB-produkter</li>
          </UL>

          <Heading>5. Innhold og eierskap</Heading>
          <UL>
            <li>Påstandene du genererer er dine å bruke fritt i undervisning.</li>
            <li>CO-LAB har ingen rettighetskrav på påstandene du lager.</li>
            <li>
              <strong>AI-generert innhold kan være unøyaktig</strong> – du har ansvar for å
              kvalitetssjekke før bruk i klasserommet.
            </li>
          </UL>

          <Heading>6. Gratis i pre-launch</Heading>
          <P>
            Pre-launch-tilgangen er gratis fram til offisiell lansering. Vi forbeholder oss retten
            til å innføre betaling eller endre tilgangsnivåer etter lansering, med rimelig varsel
            på forhånd.
          </P>

          <Heading>7. Ansvarsfraskrivelse</Heading>
          <UL>
            <li>Tjenesten leveres «som den er» i pre-launch-fasen.</li>
            <li>
              Vi gir ingen garanti for oppetid, nøyaktighet av AI-generert innhold eller
              tilgjengelighet.
            </li>
            <li>CO-LAB er ikke ansvarlig for hvordan påstandene brukes i klasserommet.</li>
          </UL>

          <Heading>8. Oppsigelse</Heading>
          <UL>
            <li>Du kan slette kontoen din når som helst via innstillinger eller ved å kontakte oss.</li>
            <li>Vi forbeholder oss retten til å suspendere kontoer som bryter vilkårene.</li>
          </UL>

          <Heading>9. Endringer i vilkårene</Heading>
          <P>Vi kan oppdatere vilkårene. Vesentlige endringer varsles 14 dager før de trer i kraft.</P>

          <Heading>10. Lovvalg og verneting</Heading>
          <P>
            Disse vilkårene reguleres av <strong>norsk rett</strong>. Eventuelle tvister løses i{" "}
            <strong>Oslo tingrett</strong> som verneting.
          </P>
        </section>

        {/* KONTAKT */}
        <section id="kontakt" className="mt-12 scroll-mt-24">
          <h2 className="font-display border-b-2 border-[var(--color-cl-border)] pb-4 text-[clamp(26px,3vw,34px)] font-semibold">
            Kontakt oss
          </h2>
          <P>Har du spørsmål om personvern, vilkår, eller vil utøve rettighetene dine?</P>
          <div className="legal-callout">
            <P>
              <strong>E-post:</strong>{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-semibold text-[var(--color-cl-purple)] hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </P>
            <P className="mt-2">
              <strong>Datatilsynet:</strong>{" "}
              <a
                href="https://www.datatilsynet.no"
                target="_blank"
                rel="noopener"
                className="font-semibold text-[var(--color-cl-purple)] hover:underline"
              >
                www.datatilsynet.no
              </a>
            </P>
          </div>
        </section>
      </div>
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display mt-8 mb-3 text-xl font-semibold text-[var(--color-ink)]">
      {children}
    </h3>
  );
}

function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={`mb-4 text-[var(--color-ink-secondary)] ${className ?? ""}`}>{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mb-5 ml-5 flex list-disc flex-col gap-2 pl-4 text-[var(--color-ink-secondary)] marker:text-[var(--color-sage)]">
      {children}
    </ul>
  );
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="my-4 overflow-x-auto rounded-[12px] border border-[var(--color-cl-border)]">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                className="bg-[var(--color-sage-light)] px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-ink)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border-t border-[var(--color-cl-border)] px-4 py-3 align-top text-[var(--color-ink-secondary)]"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
