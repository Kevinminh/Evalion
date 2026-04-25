import Link from "next/link";

import { DemoSection } from "./components/demo-section";
import { EmailSignupForm } from "./components/email-signup-form";
import { GeneratorVideo } from "./components/generator-video";
import { RevealOnScroll } from "./components/reveal-on-scroll";
import { TypewriterHeadline } from "./components/typewriter-headline";

const valueCards = [
  {
    image: "/assets/Inkluderende undervisning.PNG",
    title: "Inkluderende undervisning",
    text: "Alle får muligheten til å delta – ikke bare de som rekker opp hånda. Påstander og spillelementer senker terskelen og skaper engasjement hos alle i klassen.",
  },
  {
    image: "/assets/Strukturert utforskning.PNG",
    title: "Strukturert utforskning",
    text: "En solid didaktisk modell får elevene til å utforske, begrunne og argumentere på et nytt nivå. Opplev en trygg struktur som gir høyere elevaktivitet og dypere faglige samtaler.",
  },
  {
    image: "/assets/Innsikt og vurdering.jpg",
    title: "Innsikt og vurdering",
    text: "Se hva elevene stemmer, hvor sikre de er, begrunnelsene deres og hvordan det endrer seg underveis. Fang opp verdifull kompetanse som elevene vanligvis ikke får vist.",
  },
];

const processSteps = [
  {
    title: "Første stemmerunde",
    desc: "Elevene tenker individuelt og tar stilling til om påstanden er sant, delvis sant eller usant.",
  },
  {
    title: "Diskusjon",
    desc: "Elevene diskuterer påstanden med hverandre før læreren leder en utforskende samtale i plenum.",
  },
  {
    title: "Andre stemmerunde",
    desc: "Etter deling i plenum, tar elevene på nytt stilling til om påstanden er sant, delvis sant eller usant.",
  },
  {
    title: "Vise fasit",
    desc: "Fasiten blir avslørt, og elevene forklarer til hverandre og i plenum hvorfor fasiten er slik.",
  },
  {
    title: "Forklaring",
    desc: "Elevene får en forklaring fra professoren for å sikre en viss forankret forståelse for påstanden.",
  },
  {
    title: "Egenvurdering",
    desc: "Elevene vurderer selv individuelt hvor godt de forstår påstanden fra 1–5 etter endt diskusjon.",
  },
];

const generatorCriteria = [
  { icon: "💬", label: "Inviterer til diskusjon" },
  { icon: "🎯", label: "Har høy faglig presisjon" },
  { icon: "🧠", label: "Vekker nysgjerrighet" },
];

export default function Home() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section
        id="hero"
        className="relative overflow-hidden bg-cl-light pt-12 pb-24 sm:pt-20 sm:pb-32"
      >
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-12 px-6 lg:grid-cols-[1fr_1.15fr]">
          <div className="pt-10 lg:pt-32">
            <TypewriterHeadline />
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-7 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--color-sage-dark)]"
              >
                Prøv demo →
              </a>
              <span className="text-sm text-[var(--color-ink-tertiary)]">
                Ingen innlogging kreves
              </span>
            </div>
            <p className="mt-24 text-sm font-semibold text-[var(--color-ink-secondary)]">
              Lanseres 18. mai 2026
            </p>
          </div>
          <div className="relative flex items-start justify-center lg:justify-end">
            <img
              src="/assets/Digitale enheter.png"
              alt="FagPrat på laptop, mobil og nettbrett"
              className="h-auto w-full max-w-[640px]"
            />
            <img
              src="/assets/Professoren (med skygge).png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 -bottom-12 hidden h-[280px] w-auto md:block"
            />
          </div>
        </div>
      </section>

      {/* ─── VALUE CARDS ─── */}
      <section
        id="om-co-lab"
        className="relative bg-cl-dark py-20 px-6 text-white"
      >
        <Link
          href="/teamet"
          className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur-md transition hover:border-white/50 hover:text-white"
        >
          Møt teamet
          <span aria-hidden="true">›</span>
        </Link>
        <RevealOnScroll className="mx-auto max-w-[820px] text-center">
          <span className="section-label !text-white/60">Om CO-LAB</span>
          <h2 className="font-display mt-3 text-[clamp(28px,3.5vw,42px)] leading-tight text-white">
            En samtale der{" "}
            <em className="font-display-italic text-[var(--color-cl-purple)]">alle</em> får plass
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] text-base text-white/70">
            CO-LAB er et lærerstyrt verktøy som gjennom sin første aktivitet – FagPrat – skal gjøre
            klassesamtalen engasjerende og tilgjengelig for alle elevene, samtidig som læreren
            fanger opp verdifull innsikt.
          </p>
        </RevealOnScroll>
        <div className="mx-auto mt-14 grid max-w-[1180px] grid-cols-1 gap-6 md:grid-cols-3">
          {valueCards.map((card, i) => (
            <RevealOnScroll
              key={card.title}
              delay={i * 100}
              as="article"
              className="rounded-[24px] bg-white/5 p-6 backdrop-blur-md ring-1 ring-white/10 transition hover:-translate-y-1 hover:bg-white/10"
            >
              <div className="mb-5 aspect-[4/3] overflow-hidden rounded-[16px] bg-white/5">
                <img src={card.image} alt="" className="h-full w-full object-cover" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-sm text-white/70">{card.text}</p>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section
        id="slik-fungerer"
        className="bg-cl-light py-20 px-6 text-[var(--color-ink)]"
      >
        <RevealOnScroll className="mx-auto max-w-[820px] text-center">
          <span className="section-label">Slik fungerer FagPrat</span>
          <h2 className="font-display mt-3 text-[clamp(28px,3.5vw,42px)] leading-tight">
            Fra <em className="font-display-italic text-[var(--color-cl-purple)]">påstand</em> til{" "}
            <em className="font-display-italic text-[var(--color-cl-purple)]">forståelse</em> på 6
            steg
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] text-base text-[var(--color-ink-secondary)]">
            FagPrat er en muntlig aktivitet hvor elevene tar stilling til påstander – sant, delvis
            sant eller usant – før de diskuterer med hverandre og reflekterer over egen forståelse.
            Læreren styrer samtalen og fremdriften gjennom seks strukturerte steg.
          </p>
        </RevealOnScroll>
        <div className="mx-auto mt-12 grid max-w-[1180px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step, i) => (
            <RevealOnScroll
              key={step.title}
              delay={(i % 3) * 100}
              as="article"
              className="relative rounded-[20px] border border-[var(--color-cl-border)] bg-white p-6 shadow-sm"
            >
              <div className="absolute -top-3 -right-3 flex size-9 items-center justify-center rounded-full bg-[var(--color-cl-purple)] text-sm font-bold text-white shadow-lg">
                {i + 1}
              </div>
              <h3 className="font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-ink-secondary)]">{step.desc}</p>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ─── DEMO IFRAME ─── */}
      <DemoSection />

      {/* ─── PÅSTANDSGENERATOR ─── */}
      <section
        id="generator"
        className="relative bg-[var(--color-section-light)] px-6 py-20"
      >
        <div className="absolute right-6 top-6 rounded-full bg-[var(--color-cl-purple)] px-4 py-1.5 text-xs font-bold text-white shadow-lg">
          Få tilgang nå!
        </div>
        <div className="mx-auto max-w-[1180px]">
          <RevealOnScroll className="text-center">
            <span className="section-label">Vår påstandsgenerator</span>
            <h2 className="font-display mt-3 text-[clamp(28px,3.5vw,42px)] leading-tight">
              La <em className="font-display-italic text-[var(--color-cl-purple)]">Reddi</em> lage
              påstandene for deg
            </h2>
          </RevealOnScroll>
          <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <RevealOnScroll>
              <p className="text-lg text-[var(--color-ink-secondary)]">
                Med hjelp fra Reddi kan du enkelt lage gode påstander som virkelig setter i gang
                diskusjonen i klassen. Gi Reddi tema, fag og trinn – så lager han 9 påstander, tre
                i hver fasitkategori, som du kan velge fritt mellom og redigere til ditt behov.
              </p>
              <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--color-ink-tertiary)]">
                Reddi sine påstander:
              </p>
              <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {generatorCriteria.map((c) => (
                  <li
                    key={c.label}
                    className="flex flex-col items-center gap-2 rounded-[16px] border border-[var(--color-cl-border)] bg-white p-4 text-center text-sm font-semibold text-[var(--color-ink-secondary)]"
                  >
                    <span className="text-2xl" aria-hidden="true">
                      {c.icon}
                    </span>
                    <span>{c.label}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col items-start gap-2">
                <Link
                  href="/logg-inn"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-cl-purple)] px-7 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--color-sage-dark)]"
                >
                  Logg inn / Registrer deg
                </Link>
                <p className="text-sm text-[var(--color-ink-tertiary)]">
                  Gratis tilgang fram til sommeren
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <GeneratorVideo />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ─── EMAIL SIGNUP ─── */}
      <section id="signup" className="bg-cl-light px-6 py-20">
        <RevealOnScroll className="mx-auto max-w-[820px]">
          <div className="relative overflow-hidden rounded-[24px] border border-[var(--color-cl-border)] bg-white p-10 shadow-xl sm:p-12">
            <img
              src="/assets/Professoren (med skygge).png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 -bottom-6 hidden h-[180px] w-auto opacity-90 md:block"
            />
            <div className="relative max-w-[480px]">
              <h2 className="font-display text-[clamp(24px,2.6vw,32px)] leading-tight">
                Få beskjed når vi lanserer
              </h2>
              <p className="mt-3 text-sm text-[var(--color-ink-secondary)]">
                Legg igjen e-posten din, så hører du fra oss!
              </p>
              <div className="mt-6">
                <EmailSignupForm source="landing-hero" />
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}
