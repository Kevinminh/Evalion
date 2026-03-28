import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Check } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Priser og planer",
  description: "Se Evalions gratis- og premiumplaner for lærere, skoler og organisasjoner.",
};

const plans = [
  {
    name: "Gratis",
    price: "0 kr",
    period: "for alltid",
    description: "Perfekt for å komme i gang med Evalion.",
    features: [
      "Opptil 5 spørsmålssett",
      "Opptil 30 elever per spill",
      "Grunnleggende spillmoduser",
      "Rapporter etter hvert spill",
      "E-poststøtte",
    ],
    cta: "Kom i gang gratis",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Premium",
    price: "99 kr",
    period: "per måned",
    description: "For lærere som ønsker full tilgang til alle funksjoner.",
    features: [
      "Ubegrenset antall spørsmålssett",
      "Ubegrenset antall elever",
      "Alle spillmoduser",
      "Avanserte rapporter og analyser",
      "Prioritert e-poststøtte",
      "Egendefinerte temaer",
      "Eksporter resultater",
    ],
    cta: "Start gratis prøveperiode",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Skole",
    price: "Kontakt oss",
    period: "tilpasset pris",
    description: "For skoler og organisasjoner med flere lærere.",
    features: [
      "Alt i Premium",
      "Flerbrukeradministrasjon",
      "Sentralisert fakturaering",
      "Dedikert kontaktperson",
      "Prioritert støtte",
      "Tilpasset onboarding",
      "SSO-integrasjon",
    ],
    cta: "Kontakt salg",
    variant: "outline" as const,
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-700 sm:text-5xl">
            Priser og planer
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Velg planen som passer best for deg. Oppgrader, nedgrader eller avbryt når som helst.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? "relative ring-2 ring-primary" : ""}>
              {plan.popular && (
                <div className="flex justify-center px-4 pt-2">
                  <Badge>Mest populær</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div>
                  <span className="text-4xl font-extrabold text-gray-700">{plan.price}</span>
                  <span className="ml-2 text-muted-foreground">{plan.period}</span>
                </div>
                <Separator />
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant={plan.variant} className="w-full">
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
