"use node";

import { v } from "convex/values";
import OpenAI from "openai";

import { action } from "./_generated/server";

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
      throw new Error("Not authenticated");
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const typeDescription =
      args.type === "intro"
        ? "Introduksjon — elevene har lite eller ingen forkunnskaper om temaet. Bruk enkle, grunnleggende påstander."
        : "Oppsummering — elevene har allerede jobbet med temaet. Bruk mer avanserte og nyanserte påstander.";

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Du er REDDI, en pedagogisk AI-assistent for norsk skole. Du lager påstander til FagPrat — et interaktivt læringsverktøy der elever stemmer på om påstander er sanne, usanne eller delvis sanne.

Generer nøyaktig 5 "sant"-påstander, 5 "usant"-påstander og 5 "delvis sant"-påstander.

Regler:
- Tilpass språk og vanskelighetsgrad til ${args.level} i ${args.subject}
- ${typeDescription}
- "sant"-påstander skal være faktisk korrekte
- "usant"-påstander skal inneholde vanlige misoppfatninger eller feil som elever ofte tror på
- "delvis sant"-påstander skal være genuint nyanserte — delvis korrekte, men krever presisering
- Hver påstand skal ha en pedagogisk forklaring som hjelper læreren
- Skriv på norsk bokmål
- Påstandene skal være korte og konsise (maks 1-2 setninger)
- Forklaringene skal være informative men kortfattede (2-3 setninger)

Svar med JSON i dette formatet:
{
  "statements": [
    { "id": "s1", "text": "...", "fasit": "sant", "explanation": "..." },
    { "id": "s2", "text": "...", "fasit": "sant", "explanation": "..." },
    ...
    { "id": "u1", "text": "...", "fasit": "usant", "explanation": "..." },
    ...
    { "id": "d1", "text": "...", "fasit": "delvis", "explanation": "..." },
    ...
  ]
}`,
        },
        {
          role: "user",
          content: `Lag påstander om: ${args.topic}\n\nFag: ${args.subject}\nTrinn: ${args.level}\nType: ${args.type}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Ingen respons fra AI");
    }

    const parsed = JSON.parse(content) as {
      statements: { id: string; text: string; fasit: string; explanation: string }[];
    };

    if (!parsed.statements || !Array.isArray(parsed.statements)) {
      throw new Error("Ugyldig respons fra AI");
    }

    return parsed.statements.map((s, i) => ({
      id: s.id || `gen-${i}`,
      text: s.text,
      fasit: s.fasit as "sant" | "usant" | "delvis",
      explanation: s.explanation,
    }));
  },
});
