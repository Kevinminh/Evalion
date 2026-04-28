"use node";

import Anthropic from "@anthropic-ai/sdk";
import { v } from "convex/values";
import OpenAI from "openai";

import { internal } from "./_generated/api";
import { action } from "./_generated/server";
import { requireAdmin } from "./helpers";

interface GeneratedStatement {
  text: string;
  fasit: "sant" | "usant" | "delvis";
  explanation: string;
}

interface RawItem {
  claim?: unknown;
  text?: unknown;
  answer?: unknown;
  fasit?: unknown;
  explanation?: unknown;
  forklaring?: unknown;
}

const FASIT_VALUES = ["sant", "usant", "delvis"] as const;
type Fasit = (typeof FASIT_VALUES)[number];

function findItemsArray(raw: unknown): RawItem[] | null {
  if (Array.isArray(raw)) return raw as RawItem[];
  if (!raw || typeof raw !== "object") return null;

  const obj = raw as Record<string, unknown>;
  for (const key of ["statements", "påstander", "pastander", "data", "items", "result"]) {
    const v = obj[key];
    if (Array.isArray(v)) return v as RawItem[];
  }

  for (const v of Object.values(obj)) {
    if (Array.isArray(v) && v.length > 0 && v[0] && typeof v[0] === "object") {
      return v as RawItem[];
    }
  }

  if (
    Array.isArray(obj.sant) ||
    Array.isArray(obj.usant) ||
    Array.isArray(obj.delvis)
  ) {
    const merged: RawItem[] = [];
    for (const fasit of FASIT_VALUES) {
      const arr = obj[fasit];
      if (!Array.isArray(arr)) continue;
      for (const entry of arr) {
        if (typeof entry === "string") {
          merged.push({ claim: entry, answer: fasit });
        } else if (entry && typeof entry === "object") {
          merged.push({ ...(entry as RawItem), answer: fasit });
        }
      }
    }
    if (merged.length > 0) return merged;
  }

  return null;
}

function flatten(raw: unknown): GeneratedStatement[] {
  const list = findItemsArray(raw);
  if (!list) {
    console.warn("REDDI: unexpected AI response shape", JSON.stringify(raw)?.slice(0, 500));
    throw new Error("Uventet respons fra AI. Prøv igjen.");
  }

  const out: GeneratedStatement[] = [];
  for (const item of list) {
    const claimRaw = typeof item?.claim === "string" ? item.claim : item?.text;
    const claim = typeof claimRaw === "string" ? claimRaw.trim() : "";
    const answerRaw = typeof item?.answer === "string" ? item.answer : item?.fasit;
    const answer =
      typeof answerRaw === "string" ? answerRaw.trim().toLowerCase() : "";
    const explanationRaw =
      typeof item?.explanation === "string" ? item.explanation : item?.forklaring;
    const explanation =
      typeof explanationRaw === "string" ? explanationRaw.trim() : "";
    if (!claim) continue;
    if (!FASIT_VALUES.includes(answer as Fasit)) continue;
    out.push({ text: claim, fasit: answer as Fasit, explanation });
  }
  if (out.length === 0) {
    console.warn(
      "REDDI: no valid statements after parsing",
      JSON.stringify(raw)?.slice(0, 500),
    );
    throw new Error("Uventet respons fra AI. Prøv igjen.");
  }
  return out;
}

const DEFAULT_MODEL = "gpt-4o" as const;

const modelValidator = v.union(
  v.literal("gpt-4o"),
  v.literal("gpt-4o-mini"),
  v.literal("claude-opus-4-7"),
  v.literal("claude-sonnet-4-6"),
  v.literal("claude-haiku-4-5"),
);

type Model =
  | typeof DEFAULT_MODEL
  | "gpt-4o-mini"
  | "claude-opus-4-7"
  | "claude-sonnet-4-6"
  | "claude-haiku-4-5";

const SYSTEM_PROMPT = `Du er en erfaren faglærer som lager diskusjonsutløsende påstander til bruk i FagPrat.

Målet er å fremme refleksjon og faglig resonnering, ikke definisjoner eller pugging.

Du mottar:

Tema for FagPraten
Fag
Trinn
Elevenes forkunnskaper

=== KRITISK: JSON-RESPONSE ===

DU MÅ ALLTID RETURNERE AKKURAT DENNE JSON-STRUKTUREN OG INGENTING ANNET:

{
  "statements": [
    {
      "claim": "Generert påstand",
      "answer": "sant" | "usant" | "delvis",
      "explanation": "Generert forklaring"
    }
  ]
}

"answer" må være nøyaktig én av disse tre verdiene: "sant", "usant", "delvis".

Returner BARE JSON-objektet – ingenting annet.

=== KRAV ===

Lag nøyaktig 15 påstander:

5 faglig korrekte
5 faglig feil
5 faglig delvis korrekte

Alle påstander skal være én kort setning.

=== GENERELLE REGLER ===

Påstandene skal:

Bruk et tilgjengelig språk, unngå unødvendig kompleksitet og lange setninger.
Tilpass begrepsbruk og abstraksjonsnivå til fag + trinn + forkunnskaper.
Velg den enkleste formuleringen som bevarer faglig mening.
Påstanden skal være umiddelbart forståelig for eleven og invitere til refleksjon eller diskusjon
Maks én setning per påstand.
Unngå unødvendige leddsetninger, omstendelige formuleringer og oppramsinger.
Unngå metaforer og billedspråk som kan skape uklarhet.
Unngå rene definisjoner og trivielle fakta.
Ordvalg skal ikke gjøre fasit forutsigbar.

=== NATURLIG SPRÅK OG TROVERDIGHET ===

Unngå språklig avslørende formuleringer.
Ikke bruk absolutte ord (f.eks. «alltid», «aldri», «alle», «bare») som hovedmekanisme for å gjøre påstander usanne eller delvis sanne.
Feil og nyanser skal oppstå fra faglig innhold.
Variér formuleringer naturlig.

=== VARIASJON I PÅSTANDSTYPER ===

Bruk en naturlig blanding av:

hverdagslige situasjoner
intuitive elevforestillinger
faglige sammenhenger eller regler

Flere påstander skal være forankret i situasjoner elever kan kjenne igjen.

=== DELVIS SANT ===

Delvis sanne påstander skal være plausible og faglig relevante.
De skal fremstå som rimelige ved første lesning, men kreve nyansering eller presisering.
En faglig sterk elev skal kunne argumentere for at påstanden virker riktig ved første vurdering.
Delvis sant skal skyldes faglig innhold, ikke formuleringsteknikk.
Eksempel på ønsket kvalitet (ikke kopier formulering):
En påstand mange elever intuitivt vil være enige i, men som faglig sett krever nyansering.

=== TILPASNING ===

Tilpass språk og nivå til trinn og forkunnskaper.

Prioriter klarhet fremfor kompleksitet.

=== VERIFIKASJON ===

Påstander under "sant" må være faglig korrekte.
Påstander under "usant" må være faglig feil.
Påstander under "delvis" må være faglig delvis korrekte.


=== REGLER FOR FORKLARING ===

Maks to setninger per forklaring.
Forklaringen skal være klar, direkte og tilpasset trinnet og faget.
Unngå faste forklaringsmønstre.
Unngå metaforer og akademisk stil.
Forklaringen må være logisk konsistent med påstanden og fasiten.

For «Delvis sant»: forklar hva som stemmer og hva som ikke stemmer.
For «Sant»: bekreft kort hva som er korrekt.
For «Usant»: forklar hva som faktisk er riktig.
`;

function buildUserPrompt(args: {
  topic: string;
  subject: string;
  level: string;
  type: "intro" | "oppsummering";
}): string {
  const typeDescription =
    args.type === "intro"
      ? "Introduksjon — elevene har lite forkunnskap om temaet"
      : "Oppsummering — elevene har grunnleggende kunnskap om temaet";

  return `Generer 15 påstander om: ${args.topic}

Fag: ${args.subject}
Trinn: ${args.level}
Type: ${typeDescription}`;
}

async function generateWithOpenAI(
  model: Model,
  systemPrompt: string,
  userPrompt: string,
): Promise<GeneratedStatement[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API-nøkkel er ikke konfigurert.");
  }

  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model,
    response_format: { type: "json_object" },
    temperature: 0.8,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Fikk ingen respons fra AI. Prøv igjen.");
  }

  return flatten(JSON.parse(content));
}

async function generateWithAnthropic(
  model: Model,
  systemPrompt: string,
  userPrompt: string,
): Promise<GeneratedStatement[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Anthropic API-nøkkel er ikke konfigurert.");
  }

  const anthropic = new Anthropic({ apiKey });
  const response = await anthropic.messages.create({
    model,
    max_tokens: 4096,
    temperature: 0.8,
    system: `${systemPrompt}\n\nVIKTIG: Svar KUN med rå JSON, ingen prosa, ingen markdown, ingen kodeblokker.`,
    messages: [{ role: "user", content: userPrompt }],
  });

  const block = response.content.find((b) => b.type === "text");
  const text = block && block.type === "text" ? block.text : "";
  if (!text) {
    throw new Error("Fikk ingen respons fra AI. Prøv igjen.");
  }

  const objStart = text.indexOf("{");
  const objEnd = text.lastIndexOf("}");
  const arrStart = text.indexOf("[");
  const arrEnd = text.lastIndexOf("]");

  let slice: string | null = null;
  if (objStart !== -1 && objEnd !== -1 && (arrStart === -1 || objStart < arrStart)) {
    slice = text.slice(objStart, objEnd + 1);
  } else if (arrStart !== -1 && arrEnd !== -1) {
    slice = text.slice(arrStart, arrEnd + 1);
  }
  if (!slice) {
    throw new Error("Uventet respons fra AI. Prøv igjen.");
  }
  return flatten(JSON.parse(slice));
}

export const generateStatements = action({
  args: {
    topic: v.string(),
    subject: v.string(),
    level: v.string(),
    type: v.union(v.literal("intro"), v.literal("oppsummering")),
    model: v.optional(modelValidator),
  },
  handler: async (
    ctx,
    args,
  ): Promise<
    Array<{
      id: string;
      text: string;
      fasit: "sant" | "usant" | "delvis";
      explanation: string;
    }>
  > => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Du må være logget inn for å bruke REDDI.");
    }

    if (args.model && args.model !== DEFAULT_MODEL) {
      await requireAdmin(ctx);
    }

    const model: Model = args.model ?? DEFAULT_MODEL;
    const userPrompt = buildUserPrompt(args);

    const storedPrompt: string | null = await ctx.runQuery(
      internal.aiPrompts.getReddiSystemPromptInternal,
    );
    const systemPrompt = storedPrompt ?? SYSTEM_PROMPT;

    const statements = model.startsWith("gpt-")
      ? await generateWithOpenAI(model, systemPrompt, userPrompt)
      : await generateWithAnthropic(model, systemPrompt, userPrompt);

    const prefixes: Record<string, string> = { sant: "s", usant: "u", delvis: "d" };
    const counters: Record<string, number> = { sant: 0, usant: 0, delvis: 0 };

    return statements.map((s) => {
      const fasit = s.fasit as "sant" | "usant" | "delvis";
      counters[fasit] = (counters[fasit] ?? 0) + 1;
      return {
        id: `${prefixes[fasit]}${counters[fasit]}`,
        text: s.text,
        fasit,
        explanation: s.explanation,
      };
    });
  },
});
