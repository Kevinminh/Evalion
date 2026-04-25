import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teamet",
  description: "Møt teamet bak CO-LAB.",
};

const team = [
  {
    name: "Markus Furseth",
    role: "Gründer & daglig leder",
    bio: "Siviløkonom og lektor med over ti års undervisningserfaring i matematikk og naturfag.",
    image: "/assets/Markus (team).png",
    style: { objectPosition: "60% 25%", transform: "translateY(7px)" },
  },
  {
    name: "Erai Selvakumaran",
    role: "Teknisk lead",
    bio: "Fullstack-utvikler og grunnlegger av Matte.no. Solid erfaring fra digitale læringsverktøy i utdanningssektoren.",
    image: "/assets/Erai (teamet).png",
    style: { objectPosition: "center 15%", transform: "translateY(20px) scale(1.5)" },
  },
  {
    name: "Asbjørn Lerø Kongsnes",
    role: "Pedagogisk rådgiver",
    bio: "Medforfatter av læreverket Matemagisk 5–10 og kjent fra podkasten «SnakkeMatte». Bringer unik didaktisk og pedagogisk kompetanse.",
    image: "/assets/Asbjørn (teamet).png",
    style: { objectPosition: "center top", transform: "scale(0.995) translateY(-3px)" },
  },
  {
    name: "Martin Sørdal",
    role: "Pedagogisk rådgiver",
    bio: "Medforfatter av læreverket Matemagisk 5–7. Kombinerer pedagogikk, økonomi og teknisk innsikt i sin arbeidshverdag.",
    image: "/assets/Martin (teamet).png",
    style: { objectPosition: "center top", transform: "translateY(15px) scale(1.4)" },
  },
  {
    name: "Per Erlend Mathisen",
    role: "Strategisk rådgiver",
    bio: "Siviløkonom og en del av gründerteamet bak Qtime. Bred erfaring med oppstart og skalering av teknologibedrifter.",
    image: "/assets/Per Erlend (teamet).png",
    style: { transform: "translateY(-5px) scale(1.3)" },
  },
  {
    name: "Kevin Minh",
    role: "Teknisk rådgiver",
    bio: "Fullstack-utvikler fra Gyldendal med verdifull kjennskap til både tekniske og pedagogiske krav innen utdanning.",
    image: "/assets/Kevin (teamet).png",
    style: { objectPosition: "center 15%", transform: "translateY(20px) scale(1.5)" },
  },
];

export default function TeametPage() {
  return (
    <section className="px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
      <div className="mx-auto max-w-[1180px]">
        <div className="text-center">
          <span className="section-label">Møt teamet</span>
          <h1 className="font-display mt-3 text-[clamp(28px,3.5vw,42px)] leading-tight">
            Tverrfaglighet med{" "}
            <em className="font-display-italic text-purple-500">pedagogisk</em>{" "}
            tyngde
          </h1>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <article
              key={member.name}
              className="rounded-[24px] border border-cl-border bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mx-auto mb-4 size-28 overflow-hidden rounded-full border-4 border-sage-50 bg-gradient-to-b from-[#9d988f] to-[#5a554e]">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover"
                  style={member.style}
                />
              </div>
              <h2 className="font-display text-xl font-semibold">{member.name}</h2>
              <span className="mt-1 inline-block rounded-full bg-sage-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-purple-500">
                {member.role}
              </span>
              <p className="mt-4 text-sm leading-relaxed text-ink-secondary">
                {member.bio}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
