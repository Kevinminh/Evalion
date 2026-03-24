"use client"

import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Vote,
  Zap,
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <img src="/logo.png" alt="Evalion" className="h-8" />
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              Funksjoner
            </Button>
            <Button variant="ghost" size="sm">
              Slik fungerer det
            </Button>
            <Button variant="ghost" size="sm" render={<a href="https://play.evalion.no" />}>
              Spill
            </Button>
            <Button variant="ghost" size="sm" render={<a href="https://dashboard.evalion.no" />}>
              Lærer
            </Button>
            <Button size="sm">Kom i gang</Button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
          <Badge variant="secondary">
            <Sparkles data-icon="inline-start" />
            For lærere, av lærere
          </Badge>

          <div className="flex flex-col gap-4">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              Skap engasjement
              <br />
              og faglig dybde.
            </h1>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground">
              Evalion er et digitalt verktøy for lærere som ønsker strukturerte
              diskusjonsøkter i klasserommet. Med FagPrat får elevene stemme,
              diskutere og reflektere over faglige påstander.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg">
              Kom i gang
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button variant="outline" size="lg">
              Se hvordan det fungerer
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4" />
              <span>Alle fag og trinn</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="size-4" />
              <span>Klar på under ett minutt</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="size-4" />
              <span>I tråd med LK20</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Slik fungerer FagPrat</h2>
            <p className="mt-3 text-muted-foreground">
              Fire steg som skaper refleksjon og faglig dybde i klasserommet.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {[
              {
                step: "1",
                title: "Stem",
                description:
                  "Elevene stemmer individuelt på om en påstand er sant, delvis sant eller usant — og oppgir hvor sikre de er.",
              },
              {
                step: "2",
                title: "Diskuter",
                description:
                  "Elevene diskuterer påstanden med hverandre og utveksler argumenter og perspektiver.",
              },
              {
                step: "3",
                title: "Stem igjen",
                description:
                  "Etter diskusjonen stemmer elevene på nytt. Læreren avslører fasiten.",
              },
              {
                step: "4",
                title: "Reflekter",
                description:
                  "Elevene forklarer og vurderer egen forståelse. Læreren får innsikt i hvem som har lært hva.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center gap-3 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Kraftige verktøy for læreren</h2>
            <p className="mt-3 text-muted-foreground">
              Alt du trenger for å tilpasse undervisningen i sanntid og dokumentere elevenes
              kompetanse.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Vote className="size-5" />
                </div>
                <CardTitle>Live-statistikk</CardTitle>
                <CardDescription>
                  Se stemmefordeling, sikkerhetsnivå og endringer i sanntid. Løft fram elever med
                  gode forklaringer eller undersøk misoppfatninger mens diskusjonen pågår.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BarChart3 className="size-5" />
                </div>
                <CardTitle>Detaljerte rapporter</CardTitle>
                <CardDescription>
                  Etter hver økt får du analyse av hver påstand — hvem som endret standpunkt,
                  gjennomsnittlig forståelse og elevenes egne skriftlige forklaringer.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="size-5" />
                </div>
                <CardTitle>Påstandsgenerator</CardTitle>
                <CardDescription>
                  Lag gode faglige påstander på under ett minutt med den innebygde generatoren.
                  Velg fag, tema og vanskelighetsgrad.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Bygget for norske klasserom</h2>
          <p className="mt-3 mb-10 text-muted-foreground">
            Evalion passer på alle trinn og i alle fag.
          </p>
          <div className="grid grid-cols-1 gap-6 text-left sm:grid-cols-2">
            {[
              {
                icon: CheckCircle,
                title: "I tråd med LK20",
                description:
                  "Dokumenter elevenes kompetanse over tid med rapporter som støtter fagfornyelsen.",
              },
              {
                icon: BookOpen,
                title: "Alle fag og trinn",
                description:
                  "Fra naturfag på barneskolen til samfunnsfag på videregående.",
              },
              {
                icon: Zap,
                title: "Raskt å komme i gang",
                description:
                  "Generer påstander og start en FagPrat-økt på under ett minutt.",
              },
              {
                icon: MessageSquare,
                title: "Fire organiseringsmåter",
                description:
                  "Tilpass aktiviteten til klassen og situasjonen med ulike oppsett.",
              },
            ].map((benefit) => (
              <div key={benefit.title} className="flex gap-3">
                <benefit.icon className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Klar til å prøve?</h2>
          <p className="mt-3 mb-8 text-muted-foreground">
            Kom i gang med Evalion og skap mer engasjement i klasserommet.
          </p>
          <Button size="lg">
            Kom i gang gratis
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-8">
        <div className="mx-auto max-w-6xl">
          <Separator className="mb-6" />
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">&copy; 2026 Evalion</p>
            <div className="flex items-center gap-1">
              <Button variant="link" size="sm">
                Personvern
              </Button>
              <Button variant="link" size="sm">
                Vilkår
              </Button>
              <Button variant="link" size="sm">
                Kontakt
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
