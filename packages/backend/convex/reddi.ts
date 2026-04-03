"use node";

import { v } from "convex/values";
import OpenAI from "openai";

import { action } from "./_generated/server";

interface GeneratedStatement {
  text: string;
  fasit: "sant" | "usant" | "delvis";
  explanation: string;
}

const SYSTEM_PROMPT = `Du er REDDI, en norsk pedagogisk AI-assistent som lager påstander for undervisningsverktøyet FagPrat. FagPrat brukes i norske klasserom der elever vurderer påstander som sanne, usanne eller delvis sanne.

Du skal generere nøyaktig 9 påstander om et gitt tema:
- 3 påstander som er SANNE (fasit: "sant")
- 3 påstander som er USANNE (fasit: "usant")
- 3 påstander som er DELVIS SANNE (fasit: "delvis")

Regler:
- Alle påstander skal være faglig korrekte og tilpasset elevens nivå
- "Delvis sant"-påstander MÅ inneholde både sanne og usanne elementer — de skal ikke bare være vage
- Usanne påstander skal være troverdige nok til å utfordre elevene, men tydelig feil faglig sett
- Forklaringer skal være korte (1-3 setninger), skrevet for læreren, og forklare HVORFOR svaret er det det er
- Skriv på norsk bokmål
- Påstandene skal være varierte og dekke ulike aspekter av temaet

Svar i JSON-format:
{
  "statements": [
    { "text": "...", "fasit": "sant", "explanation": "..." },
    ...
  ]
}`;

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

  return `Generer 9 påstander om: ${args.topic}

Fag: ${args.subject}
Trinn: ${args.level}
Type: ${typeDescription}`;
}

export const generateStatements = action({
  args: {
    topic: v.string(),
    subject: v.string(),
    level: v.string(),
    type: v.union(v.literal("intro"), v.literal("oppsummering")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Du må være logget inn for å bruke REDDI.");
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API-nøkkel er ikke konfigurert.");
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      temperature: 0.8,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(args) },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Fikk ingen respons fra AI. Prøv igjen.");
    }

    const parsed = JSON.parse(content) as { statements?: GeneratedStatement[] };
    if (!parsed.statements || !Array.isArray(parsed.statements)) {
      throw new Error("Uventet respons fra AI. Prøv igjen.");
    }

    const prefixes: Record<string, string> = { sant: "s", usant: "u", delvis: "d" };
    const counters: Record<string, number> = { sant: 0, usant: 0, delvis: 0 };

    return parsed.statements.map((s) => {
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
