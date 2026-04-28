import Link from "next/link";

import { DemoSection } from "@/components/demo-section";
import { GeneratorVideo } from "@/components/generator-video";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { TypewriterHeadline } from "@/components/typewriter-headline";

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
  { icon: "💬", label: "Inviterer til diskusjon", iconBg: "#DCE9F5" },
  { icon: "🎯", label: "Har høy faglig presisjon", iconBg: "#FDEBE0" },
  { icon: "🧠", label: "Vekker nysgjerrighet", iconBg: "#F5EDFF" },
];

export default function Home() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section
        id="hero"
        className="relative flex flex-col overflow-hidden bg-cl-light lg:min-h-[640px]"
      >
        <div className="flex flex-1 items-center px-4 pt-8 pb-16 sm:px-6 sm:pt-10 sm:pb-20 lg:py-12">
          <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 items-start gap-8 sm:gap-10 lg:grid-cols-[595px_1fr] lg:gap-12">
            <div className="order-1 pt-2 lg:pt-[60px]">
              <TypewriterHeadline />
              <div className="mt-6 inline-flex flex-col items-center gap-2">
                <a href="#demo" className="cl-cta">
                  Prøv demo →
                </a>
                <span className="text-xs text-ink-tertiary">
                  Ingen innlogging kreves
                </span>
              </div>
              <div className="mt-24 hidden lg:block">
                <span className="cl-launch-pill">Lanseres 18. mai 2026</span>
              </div>
            </div>
            <div className="relative order-2 mt-2 min-h-[260px] sm:mt-6 sm:min-h-[360px] lg:mt-[30px] lg:min-h-[440px]">
              <img
                src="/assets/Digitale enheter.png"
                alt="FagPrat på laptop, mobil og nettbrett"
                className="mt-6 block h-auto w-full max-w-none drop-shadow-[0_8px_32px_rgba(28,26,23,0.10)] sm:mt-10 lg:w-[104.5%]"
              />
              <img
                src="/assets/Professoren (med skygge).png"
                alt=""
                aria-hidden="true"
                className="cl-professor-float pointer-events-none absolute bottom-[8%] left-[2%] z-[3] h-auto w-[30%] max-w-[160px] drop-shadow-[0_4px_12px_rgba(28,26,23,0.12)] sm:bottom-[calc(8%+30px)] sm:left-[calc(-2%+40px)] sm:w-[28%] sm:max-w-none lg:bottom-[calc(8%+58px)] lg:left-[calc(-6%+86px)] lg:w-[26%]"
              />
            </div>
            <div className="order-3 mt-4 flex justify-center sm:mt-6 lg:hidden">
              <span className="cl-launch-pill">Lanseres 18. mai 2026</span>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[50px] left-1/2 z-[2] hidden -translate-x-1/2 flex-col items-center gap-2 opacity-55 lg:flex"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-secondary">
            Bla videre
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 stroke-ink-secondary"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ─── VALUE CARDS ─── */}
      <section
        id="om-co-lab"
        className="relative bg-cl-dark py-16 px-4 text-white sm:py-20 sm:px-6"
      >
        <Link
          href="/teamet"
          className="group/team absolute top-7 right-[max(24px,calc((100vw-1180px)/2+24px))] z-[3] hidden items-center gap-2 rounded-full border-[1.5px] border-white/30 bg-white/[0.08] px-4 py-[9px] text-[13px] font-bold text-white/90 backdrop-blur-[4px] transition hover:-translate-y-0.5 hover:border-white/55 hover:bg-white/15 hover:text-white sm:inline-flex"
        >
          Møt teamet
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-3 w-3 transition-transform group-hover/team:translate-x-[3px]"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
        <RevealOnScroll className="mx-auto max-w-[820px] text-center">
          <span className="section-label !text-white/60">Om CO-LAB</span>
          <h2 className="mt-3 text-[clamp(28px,3.5vw,42px)] leading-tight text-white">
            En samtale der{" "}
            <em className="text-[#b6a8ff]">alle</em> får plass
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] text-base text-white/70">
            CO-LAB er et lærerstyrt verktøy som gjennom sin første aktivitet – FagPrat – skal gjøre
            klassesamtalen engasjerende og tilgjengelig for alle elevene, samtidig som læreren
            fanger opp verdifull innsikt.
          </p>
        </RevealOnScroll>
        <div className="mx-auto mt-12 grid max-w-[1180px] grid-cols-1 gap-6 sm:grid-cols-2 sm:px-3 md:grid-cols-3">
          {valueCards.map((card, i) => (
            <RevealOnScroll
              key={card.title}
              delay={i * 100}
              as="article"
              className="group/card text-center"
            >
              <div className="mb-[22px] aspect-[4/3] overflow-hidden rounded-[20px] bg-cl-light shadow-[0_10px_28px_rgba(0,0,0,0.2)] transition group-hover/card:-translate-y-1 group-hover/card:shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
                <img src={card.image} alt="" className="block h-full w-full object-cover" />
              </div>
              <h3 className="text-[22px] font-medium text-white">{card.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.65] text-white/75">{card.text}</p>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section
        id="slik-fungerer"
        className="bg-cl-light py-16 px-4 text-ink sm:py-20 sm:px-6"
      >
        <RevealOnScroll className="mx-auto max-w-[820px] text-center">
          <span className="section-label">Slik fungerer FagPrat</span>
          <h2 className="mt-3 text-[clamp(28px,3.5vw,42px)] leading-tight">
            Fra <em className="text-purple-500">påstand</em> til{" "}
            <em className="text-purple-500">forståelse</em> på 6
            steg
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] text-base text-ink-secondary">
            FagPrat er en muntlig aktivitet hvor elevene tar stilling til påstander – sant, delvis
            sant eller usant – før de diskuterer med hverandre og reflekterer over egen forståelse.
            Læreren styrer samtalen og fremdriften gjennom seks strukturerte steg, og kan velge
            mellom flere måter å organisere samtalene på.
          </p>
        </RevealOnScroll>
        <div className="relative mx-auto mt-12 grid max-w-[1180px] grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 lg:grid-cols-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-9 right-[6%] left-[6%] hidden border-t-2 border-dashed border-coral opacity-55 lg:block"
          />
          {processSteps.map((step, i) => (
            <RevealOnScroll
              key={step.title}
              delay={(i % 3) * 100}
              as="div"
              className="relative flex flex-col items-center text-center"
            >
              <div className="z-[2] mb-[18px] flex h-[56px] w-[56px] items-center justify-center rounded-full border-[1.5px] border-[rgba(11,56,64,0.18)] bg-white text-[22px] italic text-ink shadow-[0_6px_16px_rgba(11,56,64,0.12)] sm:h-[64px] sm:w-[64px] sm:text-[24px] lg:h-[72px] lg:w-[72px] lg:text-[28px]">
                {i + 1}
              </div>
              <h3 className="mb-[10px] text-[17px] font-medium text-ink">
                {step.title}
              </h3>
              <p className="text-[13px] leading-[1.55] text-ink-secondary">
                {step.desc}
              </p>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ─── DEMO IFRAME ─── */}
      <DemoSection />

      {/* ─── PÅSTANDSGENERATOR ─── */}
      <section id="generator" className="relative bg-cl-light py-12 sm:py-16">
        <span
          aria-label="Få tilgang nå!"
          className="absolute top-[60px] right-[130px] z-[5] hidden rotate-[24deg] rounded-[6px] border-2 border-[#3E2E88] px-4 py-3 text-[15px] font-extrabold uppercase tracking-[0.09em] whitespace-nowrap text-[#3E2E88] outline-2 outline-offset-[5px] outline-[#3E2E88] transition-transform hover:rotate-[18deg] hover:scale-[1.03] lg:inline-block"
        >
          Få tilgang nå!
        </span>
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <RevealOnScroll className="mb-10 text-center sm:mb-12">
            <span className="section-label">Vår påstandsgenerator</span>
            <h2 className="mt-3 text-[clamp(28px,3.5vw,42px)] leading-tight">
              La <em className="text-purple-500">Reddi</em> lage
              påstandene for deg
            </h2>
          </RevealOnScroll>
          <div className="grid grid-cols-1 items-stretch gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12">
            <RevealOnScroll className="flex flex-col">
              <p className="text-[16px] leading-[1.55] text-ink">
                Med hjelp fra Reddi kan du enkelt lage gode påstander som virkelig setter i gang
                diskusjonen i klassen. Gi Reddi tema, fag og trinn – så lager han 9 påstander, tre
                i hver fasitkategori, som du kan velge fritt mellom og redigere til ditt behov.
              </p>
              <p className="mt-5 mb-3 text-[16px] leading-[1.55] text-ink">
                Reddi sine påstander:
              </p>
              <ul className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {generatorCriteria.map((c) => (
                  <li
                    key={c.label}
                    className="flex items-center gap-3 rounded-xl border border-cl-border bg-white p-3 shadow-[0_6px_16px_rgba(0,0,0,0.1)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.14)]"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full text-[17px]"
                      style={{ background: c.iconBg }}
                    >
                      {c.icon}
                    </span>
                    <span className="text-[14px] leading-[1.25] font-semibold text-ink">
                      {c.label}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="inline-flex flex-col items-center gap-3 self-start">
                <Link href="/logg-inn" className="cl-cta cl-cta--md">
                  Logg inn / Registrer deg
                </Link>
                <p className="text-[13px] text-ink-tertiary">
                  Gratis tilgang fram til 1.juli
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={100} className="flex min-h-full flex-col">
              <GeneratorVideo />
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </>
  );
}
