import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@workspace/ui/components/card";
import { BookOpen, Gamepad2, Settings, LifeBuoy, Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CONTACT_EMAIL } from "../lib/constants";

export const metadata: Metadata = {
  title: "Hjelpesenter",
  description: "Få hjelp med Evalion. Veiledninger, tips og kontaktinformasjon.",
};

const categories = [
  {
    icon: BookOpen,
    title: "Kom i gang",
    description:
      "Lær grunnleggende om å opprette konto, lage spørsmålssett og starte ditt første spill.",
    topics: [
      "Opprett en konto",
      "Lag ditt første spørsmålssett",
      "Start et spill med elevene",
      "Del spillkode med klassen",
    ],
  },
  {
    icon: Gamepad2,
    title: "Spillmoduser",
    description: "Utforsk de ulike spillmodusene og finn den som passer best for din undervisning.",
    topics: ["Klassisk quiz", "Lagkonkurranse", "Individuell øving", "Tilpasse spillinnstillinger"],
  },
  {
    icon: Settings,
    title: "Kontoadministrasjon",
    description: "Administrer kontoen din, abonnement og innstillinger.",
    topics: [
      "Endre passord",
      "Oppgrader til Premium",
      "Administrer elever",
      "Eksporter resultater",
    ],
  },
  {
    icon: LifeBuoy,
    title: "Teknisk hjelp",
    description: "Løs vanlige tekniske problemer og få hjelp med feilmeldinger.",
    topics: [
      "Nettleserkompatibilitet",
      "Tilkobling og ytelse",
      "Feilsøking av spill",
      "Rapportere en feil",
    ],
  },
];

export default function HelpCenterPage() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-700 sm:text-5xl">
            Hjelpesenter
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Finn veiledninger, tips og svar på vanlige spørsmål. Trenger du mer hjelp? Ta kontakt
            med oss.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {categories.map((category) => (
            <Card key={category.title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <category.icon className="size-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-2">
                  {category.topics.map((topic) => (
                    <li key={topic} className="text-sm text-muted-foreground hover:text-foreground">
                      {topic}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-20 text-center">
          <div className="mx-auto max-w-lg">
            <Mail className="mx-auto size-10 text-muted-foreground" />
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-gray-700">
              Fant du ikke det du lette etter?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Kontakt oss direkte, så hjelper vi deg så raskt vi kan.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button render={<a href={`mailto:${CONTACT_EMAIL}`} />}>Send e-post</Button>
              <Button variant="outline" render={<Link href="/faq" />}>
                Se FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
