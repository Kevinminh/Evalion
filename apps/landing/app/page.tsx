"use client"

import { Button } from "@workspace/ui/components/button"
import { Play } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-svh bg-white text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <img src="/logo.png" alt="Evalion" className="h-10" />
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              render={<a href="https://play.evalion.no" />}
            >
              <Play className="size-3.5" />
              Bli med i spill
            </Button>
            <Button
              variant="outline"
              size="sm"
              render={<a href="https://dashboard.evalion.no" />}
            >
              Logg inn
            </Button>
            <Button size="sm">Registrer deg</Button>
          </div>
        </nav>
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </header>

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
              Følg opp hver elev med detaljerte rapporter etter hvert spill.
              Identifiser kunnskapshull og veiled elevene mot mestring.
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
              Hold elevene engasjerte med et stadig voksende bibliotek av
              spillmoduser. Vi jobber alltid med nye måter å gjøre læring morsomt
              på!
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
            Bli med tusenvis av lærere som allerede har oppdaget kraften i
            Evalion!
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
              <p className="text-lg font-semibold text-gray-600">
                Lag et spørsmålssett
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-20 items-center justify-center rounded-2xl bg-muted text-4xl">
                🎮
              </div>
              <p className="text-lg font-semibold text-gray-600">
                Velg en spillmodus
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-20 items-center justify-center rounded-2xl bg-muted text-4xl">
                📊
              </div>
              <p className="text-lg font-semibold text-gray-600">
                Spill, lær og analyser
              </p>
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
              Evalion er designet for elever fra barneskolen til videregående og
              videre!
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="h-64 w-80 rounded-2xl bg-muted" />
          </div>
        </div>
      </section>

      {/* Wave + Footer */}
      <footer className="relative mt-20">
        {/* Wave SVG */}
        <div className="relative -mb-1">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60V120H0V60Z"
              fill="#2196F3"
            />
            <path
              d="M0 80C240 40 480 120 720 80C960 40 1200 120 1440 80V120H0V80Z"
              fill="#1E88E5"
            />
            <path
              d="M0 95C240 75 480 115 720 95C960 75 1200 115 1440 95V120H0V95Z"
              fill="#1976D2"
            />
          </svg>
        </div>

        {/* Footer Content */}
        <div className="bg-[#1976D2] px-6 pb-8 pt-12 text-white">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-extrabold">Produkt</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <a href="#" className="hover:text-white">
                    Oppgrader
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Gruppeplaner
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-extrabold">Kontakt</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <a href="#" className="hover:text-white">
                    Hjelpesenter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    kontakt@evalion.no
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-extrabold">Mer</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <a href="#" className="hover:text-white">
                    Personvern
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Vilkår
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-extrabold">Følg oss</h3>
              <div className="flex gap-4 text-white/80">
                <a href="#" className="hover:text-white" aria-label="Facebook">
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-white" aria-label="Instagram">
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-white" aria-label="YouTube">
                  <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl border-t border-white/20 pt-6 text-center text-sm text-white/60">
            Copyright &copy; 2026 Evalion. Alle rettigheter reservert.
          </div>
        </div>
      </footer>
    </div>
  )
}
