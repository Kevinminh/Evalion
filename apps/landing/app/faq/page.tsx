import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@workspace/ui/components/accordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ofte stilte spørsmål",
  description: "Finn svar på vanlige spørsmål om Evalion, kontooppsett, spillmoduser og mer.",
};

const faqItems = [
  {
    question: "Hva er Evalion?",
    answer:
      "Evalion er en gratis plattform for læringsbaserte spill. Lærere kan lage spørsmålssett, velge spillmoduser og spille med elevene sine i sanntid. Etter hvert spill får du detaljerte rapporter.",
  },
  {
    question: "Er Evalion virkelig gratis?",
    answer:
      "Ja! Gratisplanen gir deg tilgang til grunnleggende funksjoner, inkludert opptil 5 spørsmålssett og 30 elever per spill. For flere funksjoner kan du oppgradere til Premium.",
  },
  {
    question: "Hvordan oppretter jeg en konto?",
    answer:
      "Klikk på «Registrer deg» på forsiden og følg instruksjonene. Du kan registrere deg med e-post eller Google-konto. Det tar under ett minutt.",
  },
  {
    question: "Hvilke spillmoduser finnes?",
    answer:
      "Vi tilbyr flere spillmoduser, inkludert klassisk quiz, lagkonkurranse og individuell øving. Premiumbrukere får tilgang til alle moduser, inkludert nye som lanseres jevnlig.",
  },
  {
    question: "Kan jeg bruke Evalion på mobil?",
    answer:
      "Ja, Evalion fungerer på alle enheter med en nettleser – PC, nettbrett og mobil. Elevene trenger bare å åpne en lenke for å bli med i spillet.",
  },
  {
    question: "Hvordan fungerer rapportene?",
    answer:
      "Etter hvert spill får du en detaljert rapport som viser hver elevs svar, poengsum og tidsbruk. Du kan identifisere kunnskapshull og tilpasse undervisningen.",
  },
  {
    question: "Hva er forskjellen mellom Premium og Skole-planen?",
    answer:
      "Premium er for enkeltlærere og gir ubegrenset tilgang til alle funksjoner. Skole-planen er for organisasjoner med flere lærere og inkluderer sentralisert administrasjon, SSO og dedikert støtte.",
  },
  {
    question: "Hvordan kontakter jeg support?",
    answer:
      "Du kan nå oss via e-post på kontakt@evalion.no. Premium- og Skole-kunder får prioritert støtte med raskere svartid.",
  },
  {
    question: "Kan jeg avbryte abonnementet når som helst?",
    answer:
      "Ja, du kan oppgradere, nedgradere eller avbryte abonnementet ditt når som helst. Det er ingen bindingstid.",
  },
  {
    question: "Er elevdata trygge?",
    answer:
      "Absolutt. Vi følger strenge retningslinjer for personvern og datasikkerhet. Les vår personvernerklæring for mer informasjon om hvordan vi beskytter data.",
  },
];

export default function FaqPage() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-700 sm:text-5xl">
            Ofte stilte spørsmål
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Finn svar på de vanligste spørsmålene om Evalion.
          </p>
        </div>

        <Accordion>
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={String(index)}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                <p>{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
