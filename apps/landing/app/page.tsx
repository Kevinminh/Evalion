import { Button } from "@workspace/ui/components/button";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="flex min-h-[70vh] items-center justify-center px-6 py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-700 sm:text-6xl">
            Morsomme, gratis
            <br />
            læringsspill for alle!
          </h1>

          <Button size="lg" className="px-16 text-lg">
            Registrer deg
          </Button>
        </div>
      </section>

      {/* Feature: Instant Feedback */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
          <div className="flex items-center justify-center">
            <div className="h-64 w-80 rounded-2xl bg-muted" />
          </div>
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-700">
              Umiddelbar tilbakemelding
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Følg opp hver elev med detaljerte rapporter etter hvert spill. Identifiser
              kunnskapshull og veiled elevene mot mestring.
            </p>
          </div>
        </div>
      </section>

      {/* Feature: Free, Fresh, and Fun */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-700">
              Ferskt, fritt og gøy
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Hold elevene engasjerte med et stadig voksende bibliotek av spillmoduser. Vi jobber
              alltid med nye måter å gjøre læring morsomt på!
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="h-64 w-80 rounded-2xl bg-muted" />
          </div>
        </div>
      </section>

      {/* Purple CTA Banner */}
      <section className="relative overflow-hidden bg-purple-600 px-6 py-28">
        <div className="purple-pattern absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-5xl font-extrabold italic text-white drop-shadow-lg sm:text-6xl">
            Seriøs læring.
            <br />
            Seriøs moro.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-white/90">
            Bli med tusenvis av lærere som allerede har oppdaget kraften i Evalion!
          </p>
          <Button
            size="lg"
            className="mt-8 border-2 border-white bg-white px-12 text-lg font-extrabold text-gray-700 hover:bg-gray-50"
          >
            Kom i gang
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-16 text-center text-4xl font-extrabold tracking-tight text-gray-700">
            Slik fungerer det
          </h2>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-20 items-center justify-center rounded-2xl bg-muted text-4xl">
                📝
              </div>
              <p className="text-lg font-semibold text-gray-600">Lag et spørsmålssett</p>
            </div>

            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-20 items-center justify-center rounded-2xl bg-muted text-4xl">
                🎮
              </div>
              <p className="text-lg font-semibold text-gray-600">Velg en spillmodus</p>
            </div>

            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-20 items-center justify-center rounded-2xl bg-muted text-4xl">
                📊
              </div>
              <p className="text-lg font-semibold text-gray-600">Spill, lær og analyser</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature: Engagement for Everyone */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-700">
              Engasjement for alle
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Evalion er designet for elever fra barneskolen til videregående og videre!
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="h-64 w-80 rounded-2xl bg-muted" />
          </div>
        </div>
      </section>
    </>
  );
}
